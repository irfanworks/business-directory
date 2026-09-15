"use client";

import { Search, ShieldCheck } from "lucide-react";
import type { SortOption } from "@/lib/types";

export type DirectoryFilters = {
  query: string;
  city: string;
  verifiedOnly: boolean;
  sort: SortOption;
};

type FilterSidebarProps = {
  filters: DirectoryFilters;
  cities: string[];
  onChange: (next: DirectoryFilters) => void;
  resultCount: number;
  showMobileBar?: boolean;
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Direkomendasikan" },
  { value: "relevant", label: "Paling relevan" },
  { value: "newest", label: "Terbaru" },
  { value: "most_viewed", label: "Paling dilihat" },
];

export default function FilterSidebar({
  filters,
  cities,
  onChange,
  resultCount,
}: FilterSidebarProps) {
  return (
    <aside className="space-y-5 rounded-card border border-border bg-white p-5 shadow-card lg:sticky lg:top-24">
      <div>
        <h2 className="text-small uppercase tracking-[0.12em] text-ink-500">
          Filter
        </h2>
        <p className="mt-1 text-[12px] text-ink-500">{resultCount} hasil</p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[12px] font-medium text-ink-700">
          Cari
        </span>
        <span className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-500" />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Nama atau layanan…"
            className="input-control h-10 pl-9 text-[13px]"
          />
        </span>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[12px] font-medium text-ink-700">
          Lokasi
        </span>
        <select
          value={filters.city}
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
          className="input-control h-10 text-[13px]"
        >
          <option value="">Semua lokasi</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[12px] font-medium text-ink-700">
          Urutkan
        </span>
        <select
          value={filters.sort}
          onChange={(e) =>
            onChange({ ...filters, sort: e.target.value as SortOption })
          }
          className="input-control h-10 text-[13px]"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-btn border border-border bg-surface-soft/70 px-3 py-2.5 transition duration-150 hover:border-border-strong">
        <span className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-700">
          <ShieldCheck className="h-4 w-4 text-accent" />
          Hanya terverifikasi
        </span>
        <input
          type="checkbox"
          checked={filters.verifiedOnly}
          onChange={(e) =>
            onChange({ ...filters, verifiedOnly: e.target.checked })
          }
          className="h-4 w-4 rounded border-border text-accent focus:ring-accent/30"
        />
      </label>

      {(filters.query ||
        filters.city ||
        filters.verifiedOnly ||
        filters.sort !== "recommended") && (
        <button
          type="button"
          onClick={() =>
            onChange({
              query: "",
              city: "",
              verifiedOnly: false,
              sort: "recommended",
            })
          }
          className="text-[12px] font-medium text-ink-500 transition hover:text-ink-950"
        >
          Reset filter
        </button>
      )}
    </aside>
  );
}

export { SORT_OPTIONS };
