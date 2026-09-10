"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ListingCard from "@/components/home/ListingCard";
import type { FeaturedListing } from "@/lib/types";

type FeaturedListingsProps = {
  listings: FeaturedListing[];
};

export default function FeaturedListings({ listings }: FeaturedListingsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  function scrollByCard(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 360);
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  if (!listings.length) return null;

  return (
    <section ref={sectionRef} className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-teal-700">
              Featured
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Premium & featured businesses
            </h2>
            <p className="mt-2 max-w-lg text-[14px] text-slate-600">
              Listing terverifikasi dengan eksposur prioritas di direktori.
            </p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollByCard(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollByCard(1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <Link
              href="/directory?featured=1"
              className="ml-2 text-[13px] font-medium text-slate-700 transition hover:text-teal-700"
            >
              View all
            </Link>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-none sm:gap-5"
        >
          {listings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.4,
                delay: Math.min(index * 0.06, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-[min(100%,300px)] shrink-0 snap-start sm:w-[320px]"
            >
              <ListingCard listing={listing} />
            </motion.div>
          ))}
        </div>

        {/* Desktop grid alternative for larger sets — show as grid from md when few cards */}
        <div className="mt-4 sm:hidden">
          <Link
            href="/directory?featured=1"
            className="text-[13px] font-medium text-teal-700"
          >
            View all featured →
          </Link>
        </div>
      </div>
    </section>
  );
}
