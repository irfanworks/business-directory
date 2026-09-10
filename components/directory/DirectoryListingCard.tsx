import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  MapPin,
  Pin,
} from "lucide-react";
import {
  isPriorityListing,
  type DirectoryListing,
} from "@/lib/types";

type DirectoryListingCardProps = {
  listing: DirectoryListing;
  showSubcategory?: boolean;
};

export default function DirectoryListingCard({
  listing,
  showSubcategory = true,
}: DirectoryListingCardProps) {
  const priority = isPriorityListing(listing);

  return (
    <article
      className={`group relative flex h-full flex-col rounded-2xl bg-white p-5 transition duration-300 hover:-translate-y-0.5 ${
        priority
          ? "border border-amber-300/80 shadow-[0_1px_2px_rgba(180,83,9,0.06),0_0_0_1px_rgba(251,191,36,0.15),0_12px_32px_-18px_rgba(180,83,9,0.25)]"
          : "border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:border-teal-200/80 hover:shadow-[0_12px_40px_-20px_rgba(15,23,42,0.18)]"
      }`}
    >
      {priority && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 ring-1 ring-amber-200/80">
            <Pin className="h-3 w-3" />
            Featured
          </span>
          {listing.tier === "premium" && (
            <span className="rounded-full border border-sky-200/90 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-800">
              Premium
            </span>
          )}
        </div>
      )}

      <div className="flex items-start gap-3.5">
        <div
          className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-50 ${
            priority ? "border border-amber-200/80" : "border border-slate-100"
          }`}
        >
          {listing.logo_url ? (
            <SafeImage
              src={listing.logo_url}
              alt={`Logo ${listing.title}`}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[13px] font-semibold text-slate-500">
              {listing.title.slice(0, 1)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate text-[15px] font-semibold tracking-tight text-slate-950">
              {listing.title}
            </h3>
            {listing.verified_badge && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-teal-50 px-1.5 py-0.5 text-[10px] font-medium text-teal-700">
                <BadgeCheck className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>
          {listing.short_tagline && (
            <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
              {listing.short_tagline}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!priority && listing.tier === "premium" && (
          <span className="rounded-full border border-amber-200/80 bg-amber-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-800">
            Premium
          </span>
        )}
        {showSubcategory && listing.subcategory_name && (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {listing.subcategory_name}
          </span>
        )}
        {listing.city && (
          <span className="inline-flex items-center gap-1 text-[12px] text-slate-500">
            <MapPin className="h-3 w-3" />
            {listing.city}
          </span>
        )}
      </div>

      <div className="mt-auto pt-5">
        <Link
          href={`/business/${listing.slug}`}
          className={`inline-flex items-center gap-1 text-[13px] font-medium transition ${
            priority
              ? "text-amber-900 group-hover:text-amber-700"
              : "text-slate-950 group-hover:text-teal-700"
          }`}
        >
          View Profile
          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
