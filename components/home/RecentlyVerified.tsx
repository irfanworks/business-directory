import Link from "next/link";
import { ArrowRight } from "lucide-react";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import BusinessLogo from "@/components/ui/BusinessLogo";
import SectionHeader from "@/components/ui/SectionHeader";
import type { FeaturedListing } from "@/lib/types";

type RecentlyVerifiedProps = {
  listings: FeaturedListing[];
};

export default function RecentlyVerified({ listings }: RecentlyVerifiedProps) {
  if (!listings.length) return null;

  return (
    <section className="section-y border-y border-border bg-white">
      <div className="container-site">
        <SectionHeader
          eyebrow="Aktif"
          title="Baru diverifikasi"
          description="Listing yang baru saja lolos verifikasi — membuat direktori terasa hidup."
          action={
            <Link
              href="/cari?verified=1"
              className="text-[13px] font-medium text-ink-700 transition hover:text-accent"
            >
              Lihat semua
            </Link>
          }
        />

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {listings.map((listing) => {
            const category =
              listing.category_name || listing.subcategory_name || null;

            return (
              <Link
                key={listing.id}
                href={`/business/${listing.slug}`}
                className="group flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <BusinessLogo
                    name={listing.title}
                    logoUrl={listing.logo_url}
                    size="sm"
                    className="rounded-full border border-gray-200 bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        {listing.title}
                      </h3>
                      {listing.verified_badge ? <VerifiedBadge /> : null}
                    </div>
                    {listing.city ? (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {listing.city}
                      </p>
                    ) : null}
                  </div>
                </div>

                <hr className="my-3 border-gray-100" />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2 text-xs text-gray-600">
                    {category ? (
                      <span className="truncate rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-700">
                        {category}
                      </span>
                    ) : (
                      <span className="text-gray-400">Listing terverifikasi</span>
                    )}
                  </div>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:text-gray-600"
                    aria-hidden
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
