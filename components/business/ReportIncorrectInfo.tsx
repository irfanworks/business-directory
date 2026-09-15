"use client";

import { useEffect, useId, useState, useTransition, type FormEvent } from "react";
import {
  CheckCircle2,
  Flag,
  Loader2,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  submitListingCorrection,
  type CorrectionIssueType,
} from "@/app/(site)/business/actions";

const ISSUE_OPTIONS: { value: CorrectionIssueType; label: string }[] = [
  { value: "alamat", label: "Alamat / lokasi" },
  { value: "kontak", label: "Telepon / WhatsApp / email" },
  { value: "website_sosial", label: "Website / media sosial" },
  { value: "kategori", label: "Kategori bisnis" },
  { value: "nama_deskripsi", label: "Nama / deskripsi" },
  { value: "tutup_tidak_aktif", label: "Bisnis tutup / tidak aktif" },
  { value: "lainnya", label: "Lainnya" },
];

type ReportIncorrectInfoProps = {
  listingSlug: string;
  listingTitle: string;
};

export default function ReportIncorrectInfo({
  listingSlug,
  listingTitle,
}: ReportIncorrectInfoProps) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [issueType, setIssueType] = useState<CorrectionIssueType | "">("");
  const [message, setMessage] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [startedAt, setStartedAt] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open) setStartedAt(Date.now());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function resetForm() {
    setIssueType("");
    setMessage("");
    setReporterName("");
    setReporterEmail("");
    setHoneypot("");
    setError(null);
    setEmailWarning(null);
    setStartedAt(Date.now());
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setEmailWarning(null);

    if (!issueType) {
      setError("Pilih jenis kesalahan informasi.");
      return;
    }

    startTransition(async () => {
      const result = await submitListingCorrection({
        listingSlug,
        listingTitle,
        issueType,
        message,
        reporterName,
        reporterEmail,
        companyWebsite: honeypot,
        formStartedAt: startedAt,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setEmailWarning(result.emailWarning ?? null);
      setSuccess(true);
      resetForm();
    });
  }

  return (
    <section className="rounded-card border border-border bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <ShieldCheck className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[14px] font-semibold text-ink-950">
            Komitmen akurasi informasi
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
            Optisio Directory berkomitmen menyajikan data bisnis yang akurat dan
            terkini. Temukan kesalahan? Bantu kami perbaiki.
          </p>
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setOpen(true);
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent transition hover:text-accent/80"
          >
            <Flag className="h-3.5 w-3.5" aria-hidden />
            Laporkan kesalahan informasi
          </button>
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/40 p-4 sm:items-center"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isPending) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-white p-5 shadow-elevated sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3
                  id={titleId}
                  className="text-[16px] font-semibold text-ink-950"
                >
                  Laporkan kesalahan informasi
                </h3>
                <p className="mt-1 text-[13px] text-ink-500">
                  Untuk <span className="font-medium text-ink-800">{listingTitle}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => !isPending && setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition hover:bg-surface-soft hover:text-ink-900"
                aria-label="Tutup"
                disabled={isPending}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {success ? (
              <div
                className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4"
                role="status"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                    aria-hidden
                  />
                  <div>
                    <p className="text-[14px] font-semibold text-emerald-900">
                      Terima kasih atas laporannya
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-emerald-800/80">
                      Tim editorial Optisio akan meninjau saran Anda dan
                      memperbarui listing bila diperlukan.
                    </p>
                    {emailWarning ? (
                      <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-amber-900">
                        {emailWarning}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="mt-3 text-[13px] font-medium text-emerald-800 underline underline-offset-2"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
                <div
                  className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                  aria-hidden
                >
                  <label>
                    Website perusahaan
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-medium text-ink-700">
                    Jenis kesalahan
                  </span>
                  <select
                    required
                    value={issueType}
                    onChange={(e) =>
                      setIssueType(e.target.value as CorrectionIssueType | "")
                    }
                    className="input-control"
                    disabled={isPending}
                  >
                    <option value="">Pilih jenis…</option>
                    {ISSUE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-medium text-ink-700">
                    Saran perbaikan
                  </span>
                  <textarea
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="input-control h-auto py-2.5"
                    placeholder="Contoh: Alamat yang benar adalah Jl. … No. …"
                    disabled={isPending}
                  />
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[12px] font-medium text-ink-700">
                      Nama <span className="font-normal text-ink-500">(opsional)</span>
                    </span>
                    <input
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="input-control"
                      maxLength={120}
                      autoComplete="name"
                      disabled={isPending}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[12px] font-medium text-ink-700">
                      Email <span className="font-normal text-ink-500">(opsional)</span>
                    </span>
                    <input
                      type="email"
                      value={reporterEmail}
                      onChange={(e) => setReporterEmail(e.target.value)}
                      className="input-control"
                      maxLength={254}
                      autoComplete="email"
                      placeholder="agar kami bisa follow-up"
                      disabled={isPending}
                    />
                  </label>
                </div>

                {error ? (
                  <p
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-800"
                    role="alert"
                  >
                    {error}
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Mengirim…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Kirim laporan
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="btn-secondary"
                    disabled={isPending}
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
