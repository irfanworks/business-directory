"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  BadgeCheck,
  Lock,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import HeroSearch from "@/components/home/HeroSearch";
import HeroNeuralDecor from "@/components/home/HeroNeuralDecor";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
  listing_count?: number;
};

type HeroSectionProps = {
  categories: CategoryOption[];
  locations: string[];
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  subtitle?: string;
};

const FLOATING = [
  {
    title: "Kopi Nusantara",
    meta: "F&B · Jakarta",
    className: "parallax-left",
  },
  {
    title: "Studio Pixel",
    meta: "Kreatif · Bandung",
    className: "parallax-right-a",
  },
  {
    title: "Logistik Cepat",
    meta: "Logistik · Medan",
    className: "parallax-right-b",
  },
] as const;

const MAX_SHIFT = 20;
const SPEED = 0.02;

function GlassCard({
  title,
  meta,
}: {
  title: string;
  meta: string;
}) {
  return (
    <div className="parallax-card-inner hero-glass-card">
      <span className="hero-hud hero-hud--tl" aria-hidden />
      <span className="hero-hud hero-hud--tr" aria-hidden />
      <span className="hero-hud hero-hud--bl" aria-hidden />
      <span className="hero-hud hero-hud--br" aria-hidden />
      <div className="hero-glass-icon" />
      <p className="mt-2 text-[11px] font-semibold text-white sm:text-[12px]">
        {title}
      </p>
      <p className="text-[10px] text-white/85">{meta}</p>
    </div>
  );
}

export default function HeroSection({
  categories,
  locations,
  eyebrow = "Optisio Directory",
  title = "Temukan Bisnis",
  titleAccent = "Terpercaya",
  subtitle = "Where Search Engines Find You. Where AI Recommends You.",
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 50, damping: 28 });
  const springY = useSpring(my, { stiffness: 50, damping: 28 });
  const [parallaxOff, setParallaxOff] = useState(true);
  const [inInitialViewport, setInInitialViewport] = useState(true);

  useEffect(() => {
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqDesktop = window.matchMedia("(min-width: 768px)");

    function sync() {
      setParallaxOff(mqReduce.matches || !mqDesktop.matches);
    }
    sync();
    mqReduce.addEventListener("change", sync);
    mqDesktop.addEventListener("change", sync);
    return () => {
      mqReduce.removeEventListener("change", sync);
      mqDesktop.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    function onScroll() {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const active = rect.top > -24 && rect.bottom > window.innerHeight * 0.65;
      setInInitialViewport(active);
      if (!active) {
        mx.set(0);
        my.set(0);
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mx, my]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        e.preventDefault();
        document.getElementById("directory-search-input")?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function onMouseMove(e: MouseEvent<HTMLElement>) {
    if (parallaxOff || !inInitialViewport || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const x = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, px * 1000 * SPEED));
    const y = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, py * 1000 * SPEED));
    mx.set(x);
    my.set(y);
  }

  function resetParallax() {
    mx.set(0);
    my.set(0);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={resetParallax}
      className="relative isolate flex h-screen min-h-[100dvh] flex-col overflow-hidden supports-[height:100dvh]:h-[100dvh]"
    >
      {/* Brand red mesh — unchanged palette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-700 via-red-600 to-rose-900 md:bg-gradient-to-br md:from-red-800 md:via-[#C41E3A] md:to-rose-900"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/25 via-transparent to-black/35"
      />

      {/* AI neural constellation + glass orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <HeroNeuralDecor />
      </div>

      <div
        aria-hidden
        className="parallax-static-bg pointer-events-none absolute inset-0 z-0 md:hidden"
      />

      {/* Floating glass cards — safe zone */}
      <motion.div
        aria-hidden
        className="parallax-container hidden md:block motion-reduce:transform-none"
        style={
          parallaxOff || !inInitialViewport
            ? undefined
            : { x: springX, y: springY }
        }
      >
        {FLOATING.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 + i * 0.08, duration: 0.4 }}
            className={`parallax-card ${card.className}`}
          >
            <GlassCard title={card.title} meta={card.meta} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main content — typography sizes preserved */}
      <div className="container-site relative z-20 flex min-h-0 flex-1 flex-col justify-center px-4 pb-10 pt-28 text-center md:pb-16 md:pt-32 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[11px] font-semibold uppercase tracking-widest text-amber-200/90"
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-3 text-balance font-display text-4xl font-bold tracking-tight text-white drop-shadow-md md:mt-4 lg:text-6xl"
          >
            {title}{" "}
            {titleAccent ? (
              <span className="font-serif italic text-amber-300">
                {titleAccent}
              </span>
            ) : null}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mx-auto mt-3 max-w-md text-balance text-[13px] font-medium leading-snug tracking-wide text-white/90 drop-shadow-md md:mt-4 md:text-sm"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="hero-search-glow relative z-20 mx-auto mt-6 w-full max-w-3xl md:mt-10"
          >
            <HeroSearch categories={categories} locations={locations} />
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-4 -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 scrollbar-none md:mx-0 md:mt-6 md:flex-wrap md:justify-center md:gap-3 md:overflow-visible"
          >
            {[
              { icon: Lock, label: "Clean & Secure" },
              { icon: BadgeCheck, label: "Entity Trust Verified" },
              { icon: RefreshCw, label: "Fast Indexing" },
              { icon: ShieldCheck, label: "Quality Editorial Control" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="hero-trust-badge">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                {label}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
