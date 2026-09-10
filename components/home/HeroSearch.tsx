"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

const POPULAR_SEARCHES = [
  "SaaS",
  "Digital Agency",
  "Legal",
  "Beauty",
] as const;

type HeroSearchProps = {
  categories: CategoryOption[];
};

export default function HeroSearch({ categories }: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    const qs = params.toString();
    router.push(qs ? `/directory?${qs}` : "/directory");
  }

  function onPopularClick(term: string) {
    router.push(`/directory?q=${encodeURIComponent(term)}`);
  }

  return (
    <div className="w-full max-w-2xl">
      <form
        onSubmit={onSubmit}
        className="group relative rounded-2xl border border-slate-200/80 bg-white/90 p-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_40px_-16px_rgba(15,23,42,0.18)] backdrop-blur-xl transition focus-within:border-teal-300/70 focus-within:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_48px_-12px_rgba(13,148,136,0.28)]"
      >
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search businesses</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search business name or service…"
              className="h-12 w-full rounded-xl bg-transparent pl-10 pr-3 text-[14px] text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          <label className="relative sm:w-44">
            <span className="sr-only">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 w-full appearance-none rounded-xl bg-transparent py-0 pl-3 pr-9 text-[13px] font-medium text-slate-700 outline-none"
            >
              <option value="">All categories</option>
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
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-[13px] font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        <span className="text-[12px] font-medium text-slate-500">
          Popular:
        </span>
        {POPULAR_SEARCHES.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => onPopularClick(term)}
            className="rounded-full border border-slate-200/90 bg-white/70 px-3 py-1 text-[12px] font-medium text-slate-600 transition hover:border-teal-300/80 hover:bg-teal-50 hover:text-teal-800"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
