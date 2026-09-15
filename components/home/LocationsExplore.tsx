"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, MapPin, Search } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import type { LocationStat } from "@/lib/types";

type LocationsExploreProps = {
  locations: LocationStat[];
};

function CityCard({ loc }: { loc: LocationStat }) {
  return (
    <Link
      href={`/cari?city=${encodeURIComponent(loc.city)}`}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 transition duration-150 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
        <MapPin className="h-3.5 w-3.5" />
      </span>
      <span className="mt-3 text-sm font-semibold tracking-tight text-gray-900">
        {loc.city}
      </span>
      <span className="mt-1 text-xs text-gray-500">
        {loc.listing_count} bisnis
      </span>
    </Link>
  );
}

export default function LocationsExplore({ locations }: LocationsExploreProps) {
  const [showAllCities, setShowAllCities] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const sortedByCount = useMemo(
    () =>
      [...locations].sort((a, b) => {
        if (b.listing_count !== a.listing_count) {
          return b.listing_count - a.listing_count;
        }
        return a.city.localeCompare(b.city, "id");
      }),
    [locations],
  );

  const topCities = sortedByCount.slice(0, 6);
  const hasMore = sortedByCount.length > 6;

  const filteredCities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const source = q
      ? locations.filter((city) => city.city.toLowerCase().includes(q))
      : [...locations].sort((a, b) => a.city.localeCompare(b.city, "id"));
    return source;
  }, [locations, searchQuery]);

  const groupedCities = useMemo(() => {
    const groups = filteredCities.reduce<Record<string, LocationStat[]>>(
      (acc, city) => {
        const letter = (city.city.trim()[0] || "#").toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(city);
        return acc;
      },
      {},
    );

    for (const letter of Object.keys(groups)) {
      groups[letter].sort((a, b) => a.city.localeCompare(b.city, "id"));
    }

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, "id"));
  }, [filteredCities]);

  if (!locations.length) return null;

  return (
    <section className="section-y">
      <div className="container-site">
        <SectionHeader
          eyebrow="Lokasi"
          title="Jelajahi berdasarkan lokasi"
          description="Temukan bisnis terverifikasi di kota-kota yang sudah ada di direktori."
        />

        {/* Top cities grid — always visible */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {topCities.map((loc) => (
            <CityCard key={loc.city} loc={loc} />
          ))}
        </div>

        {hasMore && !showAllCities && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllCities(true)}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 text-[13px] font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Lihat Semua Kota
              <ChevronDown className="h-4 w-4" aria-hidden />
            </button>
          </div>
        )}

        {/* Expanded: search + alphabetical list */}
        {showAllCities && (
          <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 p-4 sm:p-5">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kota…"
                  className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-900/5"
                  aria-label="Cari kota"
                />
              </div>
            </div>

            <div className="max-h-[28rem] overflow-y-auto p-4 sm:p-5">
              {groupedCities.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500">
                  Tidak ada kota yang cocok.
                </p>
              ) : (
                <div className="space-y-6">
                  {groupedCities.map(([letter, cities]) => (
                    <div key={letter}>
                      <p className="sticky top-0 z-10 mb-2 bg-white/95 pb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 backdrop-blur-sm">
                        {letter}
                      </p>
                      <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100">
                        {cities.map((loc) => (
                          <li key={loc.city}>
                            <Link
                              href={`/cari?city=${encodeURIComponent(loc.city)}`}
                              className="flex items-center justify-between gap-3 px-3 py-2.5 transition hover:bg-gray-50 sm:px-4"
                            >
                              <span className="flex min-w-0 items-center gap-2.5">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                                <span className="truncate text-sm font-medium text-gray-900">
                                  {loc.city}
                                </span>
                              </span>
                              <span className="shrink-0 text-xs text-gray-500">
                                {loc.listing_count} bisnis
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center border-t border-gray-100 p-4">
              <button
                type="button"
                onClick={() => {
                  setShowAllCities(false);
                  setSearchQuery("");
                }}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 text-[13px] font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                Tutup
                <ChevronUp className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
