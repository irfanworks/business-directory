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
} from "@/components/directory/FilterSidebar";
import type { Category, DirectoryListing, Subcategory } from "@/lib/types";

type CategoryDirectoryViewProps = {
  category: Category;
  subcategory?: Subcategory | null;
  subcategories: Subcategory[];
  listings: DirectoryListing[];
  breadcrumb: BreadcrumbItem[];
};

const INITIAL_FILTERS: DirectoryFilters = {
  query: "",
  city: "",
  verifiedOnly: false,
};

export default function CategoryDirectoryView({
  category,
  subcategory,
  subcategories,
  listings,
  breadcrumb,
}: CategoryDirectoryViewProps) {
  const [filters, setFilters] = useState<DirectoryFilters>(INITIAL_FILTERS);

  const cities = useMemo(() => {
    const set = new Set<string>();
    listings.forEach((l) => {
      if (l.city) set.add(l.city);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "id"));
  }, [listings]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return listings.filter((listing) => {
      if (filters.verifiedOnly && !listing.verified_badge) return false;
      if (filters.city && listing.city !== filters.city) return false;
      if (q) {
        const haystack = [
          listing.title,
          listing.short_tagline,
          listing.subcategory_name,
          listing.city,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [listings, filters]);

  const title = subcategory?.name ?? category.name;
  const description = subcategory?.description ?? category.description;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb items={breadcrumb} />

      <header className="mb-8 max-w-2xl">
        <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-teal-700">
          {subcategory ? "Subcategory" : "Category"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            {description}
          </p>
        )}
      </header>

      {!subcategory && subcategories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/category/${category.slug}/${sub.slug}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition hover:border-teal-300 hover:text-teal-800"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <FilterSidebar
          filters={filters}
          cities={cities}
          onChange={setFilters}
          resultCount={filtered.length}
        />

        <div>
          {listings.length === 0 ? (
            <EmptyState
              title={`Belum ada bisnis di ${title}`}
              description="Kategori ini masih kosong. Jadilah yang pertama mendaftarkan bisnis Anda di sini."
              categorySlug={subcategory ? category.slug : undefined}
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Tidak ada hasil"
              description="Tidak ada bisnis yang cocok dengan filter Anda. Coba reset filter atau ubah kata kunci."
              categorySlug={category.slug}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
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
