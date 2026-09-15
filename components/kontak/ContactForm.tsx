"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitContactForm } from "@/app/(site)/kontak/actions";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [startedAt, setStartedAt] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setStartedAt(Date.now());
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setEmailWarning(null);

    startTransition(async () => {
      const result = await submitContactForm({
        name,
        email,
        message,
        companyWebsite: honeypot,
        formStartedAt: startedAt,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setEmailSent(result.emailSent);
      setEmailWarning(result.emailWarning ?? null);
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      setHoneypot("");
      setStartedAt(Date.now());
    });
  }

  if (success) {
    return (
      <div
        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-5 text-left"
        role="status"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
            aria-hidden
          />
          <div>
            <p className="text-[14px] font-semibold text-emerald-900">
              Pesan terkirim
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-emerald-800/80">
              Terima kasih. Tim Optisio biasanya membalas dalam 1×24 jam kerja.
              {emailSent
                ? " Notifikasi email sudah dikirim ke admin."
                : null}
            </p>
            {emailWarning ? (
              <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-amber-900">
                {emailWarning}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setEmailWarning(null);
                setEmailSent(true);
              }}
              className="mt-3 text-[13px] font-medium text-emerald-800 underline underline-offset-2 hover:text-emerald-950"
            >
              Kirim pesan lain
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
      {/* Honeypot — hidden from users, visible to naive bots */}
      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        aria-hidden
      >
        <label>
          Website perusahaan
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[12px] font-medium text-ink-700">
          Nama
        </span>
        <input
          name="name"
          required
          minLength={2}
          maxLength={120}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-control"
          placeholder="Nama Anda"
          autoComplete="name"
          disabled={isPending}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[12px] font-medium text-ink-700">
          Email
        </span>
        <input
          type="email"
          name="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-control"
          placeholder="nama@perusahaan.id"
          autoComplete="email"
          disabled={isPending}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[12px] font-medium text-ink-700">
          Pesan
        </span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input-control h-auto py-2.5"
          placeholder="Ceritakan kebutuhan Anda…"
          disabled={isPending}
        />
      </label>

      {error ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <button type="submit" className="btn-primary" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Mengirim…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Kirim pesan
          </>
        )}
      </button>
    </form>
  );
}
