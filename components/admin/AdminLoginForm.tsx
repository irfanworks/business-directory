"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isBrowserSupabaseConfigured } from "@/lib/supabase/browser";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isBrowserSupabaseConfigured()) {
      setError(
        "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.",
      );
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  const configError =
    urlError === "supabase_not_configured"
      ? "Supabase belum dikonfigurasi. Periksa .env.local Anda."
      : urlError === "forbidden"
        ? "Akun ini tidak punya akses admin. Tambahkan email ke ADMIN_EMAILS."
        : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070A12] px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500 text-sm font-semibold text-slate-950">
            O
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Admin Login
          </h1>
          <p className="mt-1 text-[13px] text-slate-400">
            Business Directory Indonesia by Optisio
          </p>
        </div>

        {(configError || error) && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[13px] text-rose-200">
            {error || configError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-slate-300">
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-[14px] text-white outline-none transition placeholder:text-slate-500 focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/20"
              placeholder="admin@optisio.id"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-slate-300">
              Password
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-[14px] text-white outline-none transition placeholder:text-slate-500 focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/20"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-teal-500 text-[14px] font-semibold text-slate-950 transition hover:bg-teal-400 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-[12px] text-slate-500">
          <Link href="/" className="text-slate-300 transition hover:text-white">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
