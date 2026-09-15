"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, MapPin, Search } from "lucide-react";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
  listing_count?: number;
};

type HeroSearchProps = {
  categories: CategoryOption[];
  locations?: string[];
};

export default function HeroSearch({
  categories,
  locations = [],
}: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  function navigateSearch() {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location) params.set("city", location);
    const qs = params.toString();
    const base = category ? `/category/${category}` : "/cari";
    router.push(qs ? `${base}?${qs}` : base);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navigateSearch();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="hero-search-bar relative z-30 w-full max-w-3xl rounded-2xl border border-white/50 bg-white/95 p-2 shadow-2xl shadow-red-950/20 ring-1 ring-amber-200/20 backdrop-blur-md md:rounded-full md:p-1.5"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-1.5">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Cari bisnis</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 md:left-4" />
          <input
            id="directory-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari bisnis, layanan…  ⌘K"
            autoComplete="off"
            className="h-12 w-full rounded-xl bg-transparent pl-10 pr-3 text-[14px] text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0 md:rounded-full md:pl-11"
          />
        </label>

        <div className="hidden h-8 w-px bg-slate-200 md:block" />

        <label className="relative w-full md:w-40">
          <span className="sr-only">Lokasi</span>
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-12 w-full appearance-none rounded-xl bg-slate-50 py-0 pl-9 pr-8 text-[13px] font-medium text-slate-700 outline-none focus:ring-2 focus:ring-amber-400/50 md:rounded-full md:bg-transparent"
          >
            <option value="">Lokasi</option>
            {locations.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </label>

        <div className="hidden h-8 w-px bg-slate-200 md:block" />

        <label className="relative w-full md:w-44">
          <span className="sr-only">Kategori</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 w-full appearance-none rounded-xl bg-slate-50 py-0 pl-3 pr-8 text-[13px] font-medium text-slate-700 outline-none focus:ring-2 focus:ring-amber-400/50 md:rounded-full md:bg-transparent"
          >
            <option value="">Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </label>

        <button
          type="submit"
          className="inline-flex h-12 min-h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 text-[13px] font-semibold text-red-950 shadow-[0_0_30px_rgba(212,175,55,0.3)] transition hover:from-amber-300 hover:to-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 md:w-auto md:rounded-full"
        >
          <Search className="h-4 w-4" />
          Cari
        </button>
      </div>
    </form>
  );
}
