import Link from "next/link";
import ListingCard from "@/components/home/ListingCard";
import type { DirectoryListing } from "@/lib/types";

type RelatedBusinessesProps = {
  listings: DirectoryListing[];
  categorySlug?: string | null;
};

export default function RelatedBusinesses({
  listings,
  categorySlug,
}: RelatedBusinessesProps) {
  if (!listings.length) return null;

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-h3 text-ink-950">Bisnis terkait</h2>
          <p className="mt-1 text-[14px] text-ink-500">
            Listing lain di kategori yang sama.
          </p>
        </div>
        {categorySlug && (
          <Link
            href={`/category/${categorySlug}`}
            className="text-[13px] font-medium text-ink-700 transition hover:text-accent"
          >
            Lihat kategori
          </Link>
        )}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
