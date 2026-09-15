"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getSiteUrl } from "@/lib/seo/site";

export type CorrectionIssueType =
  | "alamat"
  | "kontak"
  | "website_sosial"
  | "kategori"
  | "nama_deskripsi"
  | "tutup_tidak_aktif"
  | "lainnya";

export type CorrectionActionResult =
  | { ok: true; emailSent: boolean; emailWarning?: string }
  | { ok: false; error: string };

const MIN_SUBMIT_MS = 2500;
const MAX_MESSAGE = 5000;
const ISSUE_TYPES: CorrectionIssueType[] = [
  "alamat",
  "kontak",
  "website_sosial",
  "kategori",
  "nama_deskripsi",
  "tutup_tidak_aktif",
  "lainnya",
];

const ISSUE_LABELS: Record<CorrectionIssueType, string> = {
  alamat: "Alamat / lokasi",
  kontak: "Telepon / WhatsApp / email",
  website_sosial: "Website / media sosial",
  kategori: "Kategori bisnis",
  nama_deskripsi: "Nama / deskripsi",
  tutup_tidak_aktif: "Bisnis tutup / tidak aktif",
  lainnya: "Lainnya",
};

function hashIp(ip: string) {
  const salt = process.env.CONTACT_IP_SALT || "optisio-contact";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 40);
}

function clientIp(h: Headers) {
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return h.get("x-real-ip")?.trim() || h.get("cf-connecting-ip")?.trim() || "unknown";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function notifyEmail(input: {
  listingTitle: string;
  listingSlug: string;
  issueType: CorrectionIssueType;
  message: string;
  reporterName?: string | null;
  reporterEmail?: string | null;
}): Promise<{ sent: true } | { sent: false; warning: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      sent: false,
      warning:
        "Laporan tersimpan, tapi notifikasi email belum dikonfigurasi (RESEND_API_KEY).",
    };
  }

  const settings = await getSiteSettings();
  const to =
    process.env.CONTACT_TO_EMAIL?.trim() ||
    settings.contact_email?.trim() ||
    "";
  if (!to) {
    return {
      sent: false,
      warning:
        "Laporan tersimpan, tapi alamat tujuan email belum diisi (CONTACT_TO_EMAIL).",
    };
  }

  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    "Optisio Directory <onboarding@resend.dev>";

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/business/${input.listingSlug}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: input.reporterEmail || undefined,
        subject: `[Koreksi listing] ${input.listingTitle} — ${ISSUE_LABELS[input.issueType]}`,
        text: [
          `Listing: ${input.listingTitle}`,
          `URL: ${pageUrl}`,
          `Jenis: ${ISSUE_LABELS[input.issueType]}`,
          `Pelapor: ${input.reporterName || "—"}`,
          `Email: ${input.reporterEmail || "—"}`,
          "",
          input.message,
        ].join("\n"),
      }),
    });

    if (!res.ok) {
      const raw = await res.text();
      console.error("Resend correction notify error:", res.status, raw.slice(0, 400));
      return {
        sent: false,
        warning: `Laporan tersimpan, tapi email gagal dikirim (HTTP ${res.status}).`,
      };
    }

    return { sent: true };
  } catch (err) {
    console.error("Resend correction notify failed:", err);
    return {
      sent: false,
      warning: "Laporan tersimpan, tapi koneksi ke layanan email gagal.",
    };
  }
}

export async function submitListingCorrection(input: {
  listingSlug: string;
  listingTitle: string;
  issueType: string;
  message: string;
  reporterName?: string;
  reporterEmail?: string;
  /** Honeypot — must stay empty */
  companyWebsite?: string;
  formStartedAt?: number;
}): Promise<CorrectionActionResult> {
  if (input.companyWebsite && input.companyWebsite.trim()) {
    return { ok: true, emailSent: true };
  }

  const listingSlug = (input.listingSlug || "").trim().toLowerCase();
  const listingTitle = (input.listingTitle || "").trim();
  const issueType = (input.issueType || "").trim() as CorrectionIssueType;
  const message = (input.message || "").trim();
  const reporterName = (input.reporterName || "").trim() || null;
  const reporterEmail = (input.reporterEmail || "").trim().toLowerCase() || null;

  if (!listingSlug) {
    return { ok: false, error: "Listing tidak valid." };
  }
  if (!ISSUE_TYPES.includes(issueType)) {
    return { ok: false, error: "Pilih jenis kesalahan informasi." };
  }
  if (message.length < 10 || message.length > MAX_MESSAGE) {
    return { ok: false, error: "Jelaskan koreksi minimal 10 karakter." };
  }
  if (reporterName && (reporterName.length < 2 || reporterName.length > 120)) {
    return { ok: false, error: "Nama terlalu pendek atau terlalu panjang." };
  }
  if (reporterEmail && !isValidEmail(reporterEmail)) {
    return { ok: false, error: "Email tidak valid." };
  }

  const started = Number(input.formStartedAt);
  if (
    !Number.isFinite(started) ||
    Date.now() - started < MIN_SUBMIT_MS ||
    Date.now() - started > 1000 * 60 * 60 * 6
  ) {
    return {
      ok: false,
      error: "Pengiriman terlalu cepat. Coba lagi dalam beberapa detik.",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "Layanan laporan belum dikonfigurasi.",
    };
  }

  const supabase = createClient();
  if (!supabase) {
    return { ok: false, error: "Gagal menghubungi server. Coba lagi nanti." };
  }

  const h = headers();
  const ipHash = hashIp(clientIp(h));
  const userAgent = h.get("user-agent")?.slice(0, 300) || null;

  const { data, error } = await supabase.rpc(
    "submit_listing_correction_report",
    {
      p_listing_slug: listingSlug,
      p_issue_type: issueType,
      p_message: message,
      p_reporter_name: reporterName,
      p_reporter_email: reporterEmail,
      p_ip_hash: ipHash,
      p_user_agent: userAgent,
    },
  );

  if (error) {
    console.error("Correction RPC failed:", error.message);
    return {
      ok: false,
      error:
        "Gagal mengirim laporan. Pastikan migrasi 010_listing_correction_reports sudah dijalankan.",
    };
  }

  const result = data as { ok?: boolean; error?: string } | null;
  if (!result?.ok) {
    const map: Record<string, string> = {
      rate_limited: "Terlalu banyak laporan. Coba lagi dalam 15 menit.",
      invalid_message: "Jelaskan koreksi minimal 10 karakter.",
      invalid_email: "Email tidak valid.",
      invalid_name: "Nama tidak valid.",
      invalid_issue_type: "Pilih jenis kesalahan informasi.",
      listing_not_found: "Listing tidak ditemukan atau belum dipublikasikan.",
      invalid_listing: "Listing tidak valid.",
    };
    return {
      ok: false,
      error: map[result?.error || ""] || "Gagal mengirim laporan. Coba lagi.",
    };
  }

  const notify = await notifyEmail({
    listingTitle: listingTitle || listingSlug,
    listingSlug,
    issueType,
    message,
    reporterName,
    reporterEmail,
  });

  if (notify.sent) return { ok: true, emailSent: true };
  return { ok: true, emailSent: false, emailWarning: notify.warning };
}
