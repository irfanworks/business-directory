import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

const TOP_CATEGORIES = [
  { href: "/category/teknologi-it", label: "Teknologi & IT" },
  { href: "/category/finansial", label: "Finansial" },
  { href: "/category/kesehatan", label: "Kesehatan" },
  { href: "/category/pendidikan", label: "Pendidikan" },
  { href: "/category/retail", label: "Retail & E-commerce" },
] as const;

const QUICK_LINKS = [
  { href: "/directory", label: "Directory" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/submit", label: "Submit Business" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden bg-[#070A12] pb-[calc(5.25rem+env(safe-area-inset-bottom))] text-slate-300 md:pb-0">
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(13,148,136,0.18),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand & tagline */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[13px] font-semibold tracking-tight text-slate-950">
                O
              </span>
              <span className="flex items-baseline gap-1.5">
                <span className="text-[15px] font-semibold tracking-tight text-white">
                  Optisio
                </span>
                <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
                  Directory
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-slate-400">
              Business Directory Indonesia — direktori bisnis profesional untuk
              menemukan dan mempromosikan bisnis terbaik di Indonesia.
            </p>
          </div>

          {/* Top Categories */}
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Top Categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {TOP_CATEGORIES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[13px] text-slate-400 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[13px] text-slate-400 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Newsletter
            </h3>
            <p className="mt-4 text-[13px] leading-relaxed text-slate-400">
              Dapatkan update listing premium dan insight bisnis Indonesia.
            </p>
            <form className="mt-4 flex gap-2" action="#" method="post">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Email</span>
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="email@bisnis.id"
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-[13px] text-white placeholder:text-slate-500 outline-none transition focus:border-teal-400/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-teal-400/20"
                />
              </label>
              <button
                type="submit"
                aria-label="Subscribe"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-slate-950 transition hover:bg-teal-400"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-3 text-[12px] text-slate-500">
              Atau hubungi{" "}
              <a
                href="mailto:support@optisio.id"
                className="text-slate-300 underline decoration-slate-600 underline-offset-2 transition hover:text-white"
              >
                support@optisio.id
              </a>
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center">
          <p className="text-[12px] text-slate-500">
            © {year} Business Directory Indonesia by Optisio. All rights
            reserved.
          </p>
          <div className="flex gap-4 text-[12px] text-slate-500">
            <Link href="/privacy" className="transition hover:text-slate-300">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-slate-300">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
