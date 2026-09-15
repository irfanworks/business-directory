"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/data/site-settings";

export type ContactActionResult =
  | { ok: true; emailSent: boolean; emailWarning?: string }
  | { ok: false; error: string };

const MIN_SUBMIT_MS = 2500;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

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

type NotifyResult =
  | { sent: true }
  | { sent: false; warning: string };

async function notifyEmail(input: {
  name: string;
  email: string;
  message: string;
}): Promise<NotifyResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      sent: false,
      warning:
        "Pesan tersimpan, tapi notifikasi email belum dikonfigurasi (RESEND_API_KEY).",
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
        "Pesan tersimpan, tapi alamat tujuan email belum diisi (CONTACT_TO_EMAIL).",
    };
  }

  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    "Optisio Directory <onboarding@resend.dev>";

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
        reply_to: input.email,
        subject: `[Kontak] Pesan dari ${input.name}`,
        text: `Nama: ${input.name}\nEmail: ${input.email}\n\n${input.message}`,
      }),
    });

    const raw = await res.text();
    let parsed: { message?: string; name?: string; id?: string } = {};
    try {
      parsed = JSON.parse(raw) as typeof parsed;
    } catch {
      // non-JSON body
    }

    if (!res.ok) {
      console.error("Resend error:", res.status, raw.slice(0, 500));
      const detail = parsed.message || `HTTP ${res.status}`;
      // Common Resend restriction on free / unverified domain
      if (/only send testing emails to your own/i.test(detail)) {
        return {
          sent: false,
          warning:
            "Pesan tersimpan. Resend menolak kirim: di mode testing, penerima harus sama dengan email akun Resend, atau verifikasi domain pengirim.",
        };
      }
      if (/domain is not verified|invalid.*from/i.test(detail)) {
        return {
          sent: false,
          warning:
            "Pesan tersimpan. Alamat FROM belum terverifikasi di Resend. Pakai onboarding@resend.dev atau domain yang sudah diverifikasi.",
        };
      }
      return {
        sent: false,
        warning: `Pesan tersimpan, tapi email gagal dikirim (${detail}).`,
      };
    }

    return { sent: true };
  } catch (err) {
    console.error("Resend fetch failed:", err);
    return {
      sent: false,
      warning:
        "Pesan tersimpan, tapi koneksi ke layanan email gagal. Coba lagi nanti.",
    };
  }
}

export async function submitContactForm(input: {
  name: string;
  email: string;
  message: string;
  /** Honeypot — must stay empty */
  companyWebsite?: string;
  /** Client-rendered timestamp (ms) */
  formStartedAt?: number;
}): Promise<ContactActionResult> {
  // Silent success for bots filling honeypot
  if (input.companyWebsite && input.companyWebsite.trim()) {
    return { ok: true, emailSent: true };
  }

  const name = (input.name || "").trim();
  const email = (input.email || "").trim().toLowerCase();
  const message = (input.message || "").trim();

  if (name.length < 2 || name.length > MAX_NAME) {
    return { ok: false, error: "Nama wajib diisi (2–120 karakter)." };
  }
  if (!isValidEmail(email) || email.length > MAX_EMAIL) {
    return { ok: false, error: "Email tidak valid." };
  }
  if (message.length < 10 || message.length > MAX_MESSAGE) {
    return { ok: false, error: "Pesan minimal 10 karakter." };
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
      error: "Layanan kontak belum dikonfigurasi. Hubungi support@optisio.id.",
    };
  }

  const supabase = createClient();
  if (!supabase) {
    return { ok: false, error: "Gagal menghubungi server. Coba lagi nanti." };
  }

  const h = headers();
  const ip = clientIp(h);
  const ipHash = hashIp(ip);
  const userAgent = h.get("user-agent")?.slice(0, 300) || null;

  const { data, error } = await supabase.rpc("submit_contact_message", {
    p_name: name,
    p_email: email,
    p_message: message,
    p_ip_hash: ipHash,
    p_user_agent: userAgent,
  });

  if (error) {
    console.error("Contact RPC failed:", error.message);
    return {
      ok: false,
      error: "Gagal mengirim pesan. Pastikan migrasi kontak sudah dijalankan.",
    };
  }

  const result = data as { ok?: boolean; error?: string } | null;
  if (!result?.ok) {
    if (result?.error === "rate_limited") {
      return {
        ok: false,
        error: "Terlalu banyak pesan. Coba lagi dalam 15 menit.",
      };
    }
    if (result?.error === "invalid_email") {
      return { ok: false, error: "Email tidak valid." };
    }
    if (result?.error === "invalid_message") {
      return { ok: false, error: "Pesan minimal 10 karakter." };
    }
    if (result?.error === "invalid_name") {
      return { ok: false, error: "Nama wajib diisi (2–120 karakter)." };
    }
    return { ok: false, error: "Gagal mengirim pesan. Coba lagi." };
  }

  // Await so serverless/runtime doesn't drop the email send
  const notify = await notifyEmail({ name, email, message });

  if (notify.sent) {
    return { ok: true, emailSent: true };
  }

  return {
    ok: true,
    emailSent: false,
    emailWarning: notify.warning,
  };
}
