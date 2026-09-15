"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ListingCard, {
  ListingCardSkeleton,
} from "@/components/home/ListingCard";
import type { FeaturedListing } from "@/lib/types";

type FeaturedListingsProps = {
  listings: FeaturedListing[];
  isLoading?: boolean;
  title?: string;
  description?: string;
};

type FilterId = "popular" | "verified" | "newest";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "popular", label: "Terpopuler" },
  { id: "verified", label: "Terverifikasi" },
  { id: "newest", label: "Baru Bergabung" },
];

function sortListings(listings: FeaturedListing[], filter: FilterId) {
  const list = [...listings];
  switch (filter) {
    case "verified":
      return list.sort(
        (a, b) => Number(b.verified_badge) - Number(a.verified_badge),
      );
    case "newest":
      return list.sort((a, b) => {
        const aT = a.created_at ? Date.parse(a.created_at) : 0;
        const bT = b.created_at ? Date.parse(b.created_at) : 0;
        return bT - aT;
      });
    case "popular":
    default:
      return list.sort(
        (a, b) => (b.view_count ?? 0) - (a.view_count ?? 0),
      );
  }
}

export default function FeaturedListings({
  listings,
  isLoading = false,
  title = "Sedang Trending",
  description = "Bisnis yang sedang banyak dijelajahi di Optisio Directory.",
}: FeaturedListingsProps) {
  const [filter, setFilter] = useState<FilterId>("popular");
  const sorted = useMemo(
    () => sortListings(listings, filter),
    [listings, filter],
  );

  if (!isLoading && !listings.length) return null;

  const showCarouselControls = listings.length >= 6;

  return (
    <section className="section-y bg-canvas">
      <div className="container-site">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Live
              </p>
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {title}
            </h2>
            <p className="mt-2 text-[15px] text-slate-500">
              {description}
            </p>
          </div>

          <Link
            href="/cari"
            className="text-[13px] font-semibold text-gray-700 transition hover:text-gray-900"
          >
            Lihat Semua →
          </Link>
        </div>

        <div
          className="mt-6 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter trending"
        >
          {FILTERS.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item.id)}
                className={`inline-flex min-h-[36px] items-center rounded-full px-3.5 text-[13px] font-medium transition ${
                  active
                    ? "bg-slate-950 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {sorted.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </motion.div>
        )}

        {!showCarouselControls ? null : (
          <p className="mt-6 text-center text-[13px] text-slate-500">
            Jelajahi lebih banyak di{" "}
            <Link href="/cari" className="font-medium text-gray-800 hover:text-gray-950">
              halaman pencarian
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
