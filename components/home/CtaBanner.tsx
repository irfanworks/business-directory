import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/40 bg-[#070A12] px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_85%_20%,rgba(13,148,136,0.28),transparent_55%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-teal-500/10 blur-3xl"
          />

          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-teal-300">
              <Sparkles className="h-3 w-3" />
              Grow your visibility
            </span>

            <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Daftarkan bisnis Anda. Tingkatkan SEO & eksposure nasional.
            </h2>
            <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-slate-400 sm:text-[15px]">
              Tampil di Business Directory Indonesia by Optisio — jangkau
              pelanggan baru, bangun kredibilitas dengan verified badge, dan
              kuatkan sinyal pencarian online bisnis Anda.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/submit"
                className="group relative inline-flex"
              >
                <span
                  aria-hidden
                  className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 opacity-90"
                />
                <span className="relative inline-flex h-11 items-center gap-1.5 rounded-full bg-white px-5 text-[13px] font-semibold text-slate-950 transition group-hover:bg-teal-50">
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                  Submit your business
                </span>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-11 items-center rounded-full px-4 text-[13px] font-medium text-slate-300 transition hover:text-white"
              >
                See pricing →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
