"use client";

import { Search, ShieldCheck } from "lucide-react";

export type DirectoryFilters = {
  query: string;
  city: string;
  verifiedOnly: boolean;
};

type FilterSidebarProps = {
  filters: DirectoryFilters;
  cities: string[];
  onChange: (next: DirectoryFilters) => void;
  resultCount: number;
};

export default function FilterSidebar({
  filters,
  cities,
  onChange,
  resultCount,
}: FilterSidebarProps) {
  return (
    <aside className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] lg:sticky lg:top-24">
      <div>
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Filters
        </h2>
        <p className="mt-1 text-[12px] text-slate-400">
          {resultCount} result{resultCount === 1 ? "" : "s"}
        </p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[12px] font-medium text-slate-700">
          Search
        </span>
        <span className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Name or service…"
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-3 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
          />
        </span>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[12px] font-medium text-slate-700">
          City
        </span>
        <select
          value={filters.city}
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-[13px] text-slate-800 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
        >
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 transition hover:border-slate-300">
        <span className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-700">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          Verified only
        </span>
        <input
          type="checkbox"
          checked={filters.verifiedOnly}
          onChange={(e) =>
            onChange({ ...filters, verifiedOnly: e.target.checked })
          }
          className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
        />
      </label>

      {(filters.query || filters.city || filters.verifiedOnly) && (
        <button
          type="button"
          onClick={() =>
            onChange({ query: "", city: "", verifiedOnly: false })
          }
          className="text-[12px] font-medium text-slate-500 transition hover:text-slate-900"
        >
          Reset filters
        </button>
      )}
    </aside>
  );
}
