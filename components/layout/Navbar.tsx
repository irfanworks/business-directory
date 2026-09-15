"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Plus, X } from "lucide-react";
import OptisioLogo from "@/components/brand/OptisioLogo";

const BLOG_URL = "https://optisio.com/blog/";

const NAV_LINKS = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  {
    href: "/submit",
    label: "Submit",
    match: (p: string) => p.startsWith("/submit"),
  },
  {
    href: BLOG_URL,
    label: "Blog",
    external: true,
    match: () => false,
  },
  {
    href: "/kontak",
    label: "Kontak",
    match: (p: string) => p.startsWith("/kontak"),
  },
] as const;

const LAYANAN_LINKS = [
  {
    href: "https://optisio.com/",
    label: "AI Development & Implementation",
  },
  {
    href: "https://optisio.com/service/seo/",
    label: "Jasa SEO",
  },
  {
    href: "https://optisio.com/service/jasa-pembuatan-website/",
    label: "Jasa Pembuatan Website",
  },
] as const;

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function navLinkClass(active: boolean) {
  return [
    "relative inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold tracking-wide transition-all duration-200",
    focusRing,
    active
      ? "text-black after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-amber-500"
      : "text-black/80 hover:bg-black/[0.04] hover:text-black",
  ].join(" ");
}

export default function Navbar({ adminBar = false }: { adminBar?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [layananOpen, setLayananOpen] = useState(false);
  const [mobileLayananOpen, setMobileLayananOpen] = useState(false);
  const layananRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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

  useEffect(() => {
    setMobileOpen(false);
    setLayananOpen(false);
    setMobileLayananOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (
        layananRef.current &&
        !layananRef.current.contains(e.target as Node)
      ) {
        setLayananOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLayananOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      className={[
        "pointer-events-none fixed inset-x-0 z-50 px-4 animate-[navFadeIn_0.5s_ease-out_forwards]",
        adminBar ? "top-[calc(2.25rem+1rem)]" : "top-4",
      ].join(" ")}
    >
      <div className="pointer-events-auto mx-auto max-w-7xl">
        <header
          className={[
            "relative overflow-hidden rounded-3xl border border-red-200/40",
            "bg-white/80 backdrop-blur-xl saturate-150",
            "shadow-[0_8px_32px_rgba(127,29,29,0.12),0_0_40px_rgba(220,38,38,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]",
            "transition-all duration-300",
            scrolled ? "bg-white/95 shadow-lg shadow-red-950/10" : "",
          ].join(" ")}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/90 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-white/40"
          />

          <div className="relative z-10 grid h-16 grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr]">
            <OptisioLogo
              height={28}
              onClick={() => setMobileOpen(false)}
              className="shrink-0 justify-self-start"
            />

            <nav
              className="hidden items-center justify-center gap-1 lg:flex"
              aria-label="Navigasi utama"
            >
              {NAV_LINKS.map((link) => {
                const active = link.match(pathname);
                const external = "external" in link && link.external;
                if (external) {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className={navLinkClass(false)}
                    >
                      {link.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={navLinkClass(active)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div ref={layananRef} className="relative">
                <button
                  type="button"
                  aria-expanded={layananOpen}
                  aria-haspopup="menu"
                  onClick={() => setLayananOpen((v) => !v)}
                  className={navLinkClass(layananOpen)}
                >
                  Layanan
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition ${
                      layananOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>

                {layananOpen ? (
                  <div
                    role="menu"
                    aria-label="Layanan Optisio"
                    className="absolute left-1/2 top-full z-20 mt-2 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-black/8 bg-white py-2 shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
                  >
                    {LAYANAN_LINKS.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        className={[
                          "block px-4 py-2.5 text-sm font-semibold tracking-wide text-black/80 transition",
                          "hover:bg-black/[0.04] hover:text-black",
                          focusRing,
                        ].join(" ")}
                        onClick={() => setLayananOpen(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </nav>

            <div className="flex items-center justify-end gap-2 justify-self-end sm:gap-3">
              <Link
                href="/submit"
                onClick={() => setMobileOpen(false)}
                className={[
                  "hidden h-10 items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 text-sm font-semibold text-red-950",
                  "transition-all duration-200 hover:from-amber-400 hover:to-amber-500 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]",
                  "sm:inline-flex",
                  focusRing,
                ].join(" ")}
              >
                <Plus className="h-4 w-4 text-red-900" strokeWidth={2.5} />
                Daftarkan Bisnis
              </Link>

              <button
                type="button"
                aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-panel"
                className={[
                  "inline-flex h-10 w-10 items-center justify-center rounded-full text-black/80 transition duration-200 hover:bg-black/[0.04] hover:text-black lg:hidden",
                  focusRing,
                ].join(" ")}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div
            id="mobile-nav-panel"
            className={[
              "relative z-10 overflow-hidden border-t border-black/5 bg-white/95 backdrop-blur-xl lg:hidden",
              "transition-all duration-300 ease-in-out",
              mobileOpen
                ? "max-h-[36rem] opacity-100"
                : "max-h-0 border-t-0 opacity-0",
            ].join(" ")}
          >
            <nav
              className="flex flex-col gap-1 px-4 py-4"
              aria-label="Menu mobile"
            >
              {NAV_LINKS.map((link) => {
                const active = link.match(pathname);
                const external = "external" in link && link.external;
                if (external) {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className={[
                        "rounded-xl px-3 py-3 text-sm font-semibold tracking-wide text-black/80 transition hover:bg-black/[0.04] hover:text-black",
                        focusRing,
                      ].join(" ")}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "rounded-xl px-3 py-3 text-sm font-semibold tracking-wide transition",
                      focusRing,
                      active
                        ? "bg-black/[0.04] text-black"
                        : "text-black/80 hover:bg-black/[0.04] hover:text-black",
                    ].join(" ")}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="rounded-xl">
                <button
                  type="button"
                  aria-expanded={mobileLayananOpen}
                  onClick={() => setMobileLayananOpen((v) => !v)}
                  className={[
                    "flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold tracking-wide text-black/80 transition hover:bg-black/[0.04] hover:text-black",
                    focusRing,
                  ].join(" ")}
                >
                  Layanan
                  <ChevronDown
                    className={`h-4 w-4 transition ${
                      mobileLayananOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                {mobileLayananOpen ? (
                  <div className="mb-1 ml-2 space-y-0.5 border-l border-black/10 pl-3">
                    {LAYANAN_LINKS.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className={[
                          "block rounded-lg px-3 py-2.5 text-[13px] font-semibold tracking-wide text-black/70 transition hover:bg-black/[0.04] hover:text-black",
                          focusRing,
                        ].join(" ")}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>

              <Link
                href="/submit"
                className={[
                  "mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-sm font-semibold text-red-950",
                  "hover:from-amber-400 hover:to-amber-500 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]",
                  focusRing,
                ].join(" ")}
                onClick={() => setMobileOpen(false)}
              >
                <Plus className="h-4 w-4 text-red-900" strokeWidth={2.5} />
                Daftarkan Bisnis
              </Link>
            </nav>
          </div>
        </header>
      </div>
    </div>
  );
}
