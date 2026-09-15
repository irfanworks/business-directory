"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, Search, Store } from "lucide-react";
import CategoryCard, {
  CategoryCardSkeleton,
} from "@/components/home/CategoryCard";
import type { Category } from "@/lib/types";

type CategoriesGridProps = {
  categories: Category[];
  /** Category slugs or names that render as featured (col-span-2). */
  featuredCategories?: string[];
  isLoading?: boolean;
  title?: string;
  description?: string;
};

function matchesFeatured(category: Category, featured: string[]) {
  if (!featured.length) return false;
  const name = category.name.toLowerCase();
  const slug = category.slug.toLowerCase();
  return featured.some((token) => {
    const t = token.trim().toLowerCase();
    return !t
      ? false
      : slug === t || name === t || name.includes(t) || slug.includes(t);
  });
}

function CategoryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900/40">
      <div
        className="relative mb-5 flex h-20 w-20 items-center justify-center"
        aria-hidden
      >
        <span className="absolute inset-0 rounded-full bg-accent-soft/80 dark:bg-accent/10" />
        <span className="absolute inset-3 rounded-full border border-white/70 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950" />
        <Store className="relative h-8 w-8 text-slate-500" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-lg font-bold tracking-tight text-slate-950 dark:text-white">
        Kategori segera hadir di kotamu
      </h3>
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-slate-500">
        Belum ada kategori dengan listing aktif. Jadilah yang pertama membangun
        discovery di Optisio Directory.
      </p>
      <Link
        href="/submit"
        className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-ink-950 px-5 text-[13px] font-medium text-white transition hover:bg-ink-900 dark:bg-white dark:text-ink-950"
      >
        Jadi yang pertama daftar
      </Link>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div
      className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Memuat kategori"
    >
      <CategoryCardSkeleton featured />
      <CategoryCardSkeleton />
      <CategoryCardSkeleton />
      <CategoryCardSkeleton />
      <CategoryCardSkeleton />
      <CategoryCardSkeleton />
    </div>
  );
}

export default function CategoriesGrid({
  categories,
  featuredCategories = [],
  isLoading = false,
  title = "Jelajahi kategori",
  description = "Temukan bisnis berdasarkan industri yang relevan.",
}: CategoriesGridProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [nearLabel, setNearLabel] = useState("Di seluruh Indonesia");

  const activeCategories = useMemo(
    () => categories.filter((c) => (c.listing_count ?? 0) > 0),
    [categories],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return activeCategories;
    return activeCategories.filter((c) => {
      const hay = [
        c.name,
        c.slug,
        ...(c.subcategories ?? []).map((s) => s.name),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [activeCategories, query]);

  const ordered = useMemo(() => {
    const featured: Category[] = [];
    const rest: Category[] = [];
    for (const c of filtered) {
      if (matchesFeatured(c, featuredCategories)) featured.push(c);
      else rest.push(c);
    }
    return [...featured, ...rest];
  }, [filtered, featuredCategories]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            { headers: { Accept: "application/json" } },
          );
          if (!res.ok) return;
          const data = (await res.json()) as {
            address?: {
              city?: string;
              town?: string;
              suburb?: string;
              state?: string;
            };
          };
          const place =
            data.address?.suburb ||
            data.address?.city ||
            data.address?.town ||
            data.address?.state;
          if (place) setNearLabel(`Di dekat ${place}`);
        } catch {
          /* keep fallback */
        }
      },
      () => {
        /* permission denied — keep fallback */
      },
      { maximumAge: 600_000, timeout: 5000 },
    );
  }, []);

  const showEmpty = !isLoading && ordered.length === 0;

  return (
    <section className="section-y border-y border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Kategori
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
            {title}
          </h2>
          <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">
            {description}
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            {nearLabel}
          </p>
        </div>

        <div className="sticky top-24 z-20 mt-8 -mx-1 bg-white/90 px-1 py-3 backdrop-blur-md dark:bg-slate-950/90">
          <label className="relative block">
            <span className="sr-only">Cari kategori</span>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              strokeWidth={1.5}
            />
            <input
              ref={searchRef}
              id="category-grid-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari 'kopi', 'barber', 'bimbel'..."
              className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-16 text-[14px] text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-accent/40 focus:shadow-focus dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-400 sm:inline-flex dark:border-slate-700 dark:bg-slate-800">
              ⌘K
            </kbd>
          </label>
        </div>

        {isLoading ? (
          <SkeletonGrid />
        ) : showEmpty ? (
          <div className="mt-4">
            <CategoryEmptyState />
          </div>
        ) : (
          <>
            <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 scrollbar-none sm:hidden">
              {ordered.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  featured={matchesFeatured(category, featuredCategories)}
                  className="w-[280px] shrink-0 snap-start"
                />
              ))}
            </div>

            <div className="mt-4 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
              {ordered.map((category) => {
                const featured = matchesFeatured(category, featuredCategories);
                return (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    featured={featured}
                    className={featured ? "lg:col-span-2" : ""}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
