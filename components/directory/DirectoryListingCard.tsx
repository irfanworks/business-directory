import BusinessLogo from "@/components/ui/BusinessLogo";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
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
  const categoryLine = [
    listing.category_name,
    showSubcategory ? listing.subcategory_name : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="surface-card surface-card-hover group relative flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <BusinessLogo
          name={listing.title}
          logoUrl={listing.logo_url}
          size="md"
          className="rounded-control border border-border"
        />
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {listing.verified_badge && <VerifiedBadge />}
          {priority && (
            <span className="rounded-full border border-border bg-surface-soft px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-700">
              Featured
            </span>
          )}
        </div>
      </div>

      <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-ink-950">
        <Link
          href={`/business/${listing.slug}`}
          className="transition-colors duration-150 hover:text-accent"
        >
          {listing.title}
        </Link>
      </h3>

      {categoryLine && (
        <p className="mt-1 text-[13px] text-ink-500">{categoryLine}</p>
      )}

      {listing.city && (
        <p className="mt-3 inline-flex items-center gap-1 text-[12px] text-ink-500">
          <MapPin className="h-3 w-3" aria-hidden />
          {listing.city}, Indonesia
        </p>
      )}

      {listing.short_tagline && (
        <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-ink-500">
          {listing.short_tagline}
        </p>
      )}

      <div className="mt-auto pt-5">
        <Link
          href={`/business/${listing.slug}`}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-950 transition duration-150 group-hover:text-accent"
        >
          Lihat profil
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
