"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Plus, Search, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/directory", label: "Directory" },
  { href: "/category/teknologi-it", label: "Categories" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled || mobileOpen
          ? "border-b border-slate-200/70 bg-white/75 shadow-[0_1px_0_0_rgba(15,23,42,0.04)] backdrop-blur-xl"
          : "border-b border-transparent bg-white/55 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          onClick={() => setMobileOpen(false)}
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-[13px] font-semibold tracking-tight text-white shadow-[0_0_0_1px_rgba(15,23,42,0.08),0_8px_20px_-8px_rgba(13,148,136,0.55)] transition group-hover:shadow-[0_0_0_1px_rgba(15,23,42,0.08),0_10px_24px_-6px_rgba(13,148,136,0.7)]">
            <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-teal-400/30 via-transparent to-cyan-500/20" />
            O
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-semibold tracking-tight text-slate-950">
              Optisio
            </span>
            <span className="rounded-md border border-slate-200/80 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-slate-500">
              Directory
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-100/80 hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cmd+K visual trigger */}
          <button
            type="button"
            aria-label="Search (⌘K)"
            className="group hidden h-9 items-center gap-3 rounded-xl border border-slate-200/90 bg-white/80 px-3 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-slate-300 hover:bg-white sm:flex"
          >
            <Search className="h-3.5 w-3.5 text-slate-400 transition group-hover:text-slate-600" />
            <span className="min-w-[7.5rem] text-[13px] text-slate-400">
              Search…
            </span>
            <kbd className="inline-flex items-center gap-0.5 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-500">
              <span className="text-[11px] leading-none">⌘</span>K
            </kbd>
          </button>

          <button
            type="button"
            aria-label="Search"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 bg-white/80 text-slate-500 transition hover:border-slate-300 hover:text-slate-800 sm:hidden"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* CTA — gradient border + glow */}
          <Link
            href="/submit"
            className="group relative hidden sm:inline-flex"
            onClick={() => setMobileOpen(false)}
          >
            <span
              aria-hidden
              className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 opacity-90 blur-[0.5px] transition duration-300 group-hover:opacity-100 group-hover:blur-[1.5px]"
            />
            <span
              aria-hidden
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-400/40 via-cyan-400/30 to-emerald-400/40 opacity-0 blur-md transition duration-300 group-hover:opacity-100"
            />
            <span className="relative inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-950 px-3.5 text-[13px] font-medium text-white shadow-sm transition group-hover:bg-slate-900">
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              Submit Business
            </span>
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 bg-white/80 text-slate-700 transition hover:border-slate-300 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        className={`border-t border-slate-200/70 bg-white/90 backdrop-blur-xl md:hidden ${
          mobileOpen ? "block" : "hidden"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2.5 text-[14px] font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/submit"
            className="mt-2 inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-slate-950 text-[14px] font-medium text-white"
            onClick={() => setMobileOpen(false)}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Submit Business
          </Link>
        </nav>
      </div>
    </header>
  );
}
