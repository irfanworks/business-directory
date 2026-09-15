"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Breadcrumb, {
  type BreadcrumbItem,
} from "@/components/directory/Breadcrumb";
import DirectoryListingCard from "@/components/directory/DirectoryListingCard";
import EmptyState from "@/components/directory/EmptyState";
import FilterSidebar, {
  type DirectoryFilters,
  SORT_OPTIONS,
} from "@/components/directory/FilterSidebar";
import {
  isPriorityListing,
  type Category,
  type DirectoryListing,
  type SortOption,
  type Subcategory,
} from "@/lib/types";

type CategoryDirectoryViewProps = {
  category?: Category | null;
  subcategory?: Subcategory | null;
  subcategories?: Subcategory[];
  listings: DirectoryListing[];
  breadcrumb: BreadcrumbItem[];
  title?: string;
  description?: string | null;
  initialQuery?: string;
  initialCity?: string;
  initialVerified?: boolean;
};

function sortListings(
  listings: DirectoryListing[],
  sort: SortOption,
  query: string,
): DirectoryListing[] {
  const list = [...listings];
  const q = query.trim().toLowerCase();

  switch (sort) {
    case "relevant":
      if (!q) return list;
      return list.sort((a, b) => {
        const score = (l: DirectoryListing) => {
          const title = l.title.toLowerCase();
          const tag = (l.short_tagline ?? "").toLowerCase();
          if (title === q) return 3;
          if (title.includes(q)) return 2;
          if (tag.includes(q)) return 1;
          return 0;
        };
        return score(b) - score(a);
      });
    case "newest":
      return list.sort((a, b) => {
        const aT = a.created_at ? Date.parse(a.created_at) : 0;
        const bT = b.created_at ? Date.parse(b.created_at) : 0;
        return bT - aT;
      });
    case "most_viewed":
      return list.sort(
        (a, b) => (b.view_count ?? 0) - (a.view_count ?? 0),
      );
    case "recommended":
    default:
      return list.sort((a, b) => {
        const aP = isPriorityListing(a) ? 1 : 0;
        const bP = isPriorityListing(b) ? 1 : 0;
        if (bP !== aP) return bP - aP;
        if (Number(b.verified_badge) !== Number(a.verified_badge)) {
          return Number(b.verified_badge) - Number(a.verified_badge);
        }
        return a.title.localeCompare(b.title, "id");
      });
  }
}

export default function CategoryDirectoryView({
  category,
  subcategory,
  subcategories = [],
  listings,
  breadcrumb,
  title: titleOverride,
  description: descriptionOverride,
  initialQuery = "",
  initialCity = "",
  initialVerified = false,
}: CategoryDirectoryViewProps) {
  const [filters, setFilters] = useState<DirectoryFilters>({
    query: initialQuery,
    city: initialCity,
    verifiedOnly: initialVerified,
    sort: "recommended",
  });

  const cities = useMemo(() => {
    const set = new Set<string>();
    listings.forEach((l) => {
      if (l.city) set.add(l.city);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "id"));
  }, [listings]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const base = listings.filter((listing) => {
      if (filters.verifiedOnly && !listing.verified_badge) return false;
      if (filters.city && listing.city !== filters.city) return false;
      if (q) {
        const haystack = [
          listing.title,
          listing.short_tagline,
          listing.subcategory_name,
          listing.category_name,
          listing.city,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    return sortListings(base, filters.sort, filters.query);
  }, [listings, filters]);

  const title =
    titleOverride ?? subcategory?.name ?? category?.name ?? "Hasil pencarian";
  const description =
    descriptionOverride ?? subcategory?.description ?? category?.description;

  return (
    <div className="container-site pt-28 pb-8 lg:pt-32 lg:pb-10">
      <Breadcrumb items={breadcrumb} />

      <header className="mb-8 max-w-2xl">
        {category && (
          <p className="label-eyebrow">
            {subcategory ? "Subkategori" : "Kategori"}
          </p>
        )}
        <h1
          className={`text-h1 text-ink-950 ${category ? "mt-2" : ""}`}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
            {description}
          </p>
        )}
      </header>

      {!subcategory && subcategories.length > 0 && category && (
        <div className="mb-8 flex flex-wrap gap-2">
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/category/${category.slug}/${sub.slug}`}
              className="rounded-full border border-border bg-white px-3 py-1.5 text-[12px] font-medium text-ink-700 transition duration-150 hover:border-border-strong hover:text-ink-950"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {/* Mobile compact controls */}
      <div className="mb-4 flex gap-2 lg:hidden">
        <select
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className="input-control h-10 flex-1 text-[13px]"
          aria-label="Filter lokasi"
        >
          <option value="">Lokasi</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <select
          value={filters.sort}
          onChange={(e) =>
            setFilters({
              ...filters,
              sort: e.target.value as SortOption,
            })
          }
          className="input-control h-10 flex-1 text-[13px]"
          aria-label="Urutkan"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            cities={cities}
            onChange={setFilters}
            resultCount={filtered.length}
          />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <label className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-700">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    verifiedOnly: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-border text-accent"
              />
              Terverifikasi
            </label>
            <span className="text-[12px] text-ink-500">
              {filtered.length} hasil
            </span>
          </div>

          {listings.length === 0 ? (
            <EmptyState
              title={`Belum ada bisnis di ${title}`}
              description="Kategori ini masih kosong. Jadilah yang pertama mendaftarkan bisnis Anda di sini."
              categorySlug={subcategory && category ? category.slug : undefined}
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Tidak ada hasil"
              description="Tidak ada bisnis yang cocok dengan filter Anda. Coba reset filter atau ubah kata kunci."
              categorySlug={category?.slug}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filtered.map((listing) => (
                <DirectoryListingCard
                  key={listing.id}
                  listing={listing}
                  showSubcategory={!subcategory}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
