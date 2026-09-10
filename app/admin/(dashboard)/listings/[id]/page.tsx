import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ListingForm from "@/components/admin/listings/ListingForm";
import {
  getAdminCategories,
  getAdminListingForm,
} from "@/lib/data/admin-listings";

type PageProps = {
  params: { id: string };
};

export const metadata: Metadata = {
  title: "Edit Listing",
};

export default async function AdminEditListingPage({ params }: PageProps) {
  const [categories, listing] = await Promise.all([
    getAdminCategories(),
    getAdminListingForm(params.id),
  ]);

  if (!listing.found) notFound();

  return (
    <AdminShell
      title="Edit Listing"
      description="Perbarui detail bisnis, status, tier, dan konten rich text."
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Listings", href: "/admin/listings" },
        { label: "Edit" },
      ]}
      actions={
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/business/${listing.values.slug}`}
            target="_blank"
            className="inline-flex h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-700 transition hover:border-slate-300"
          >
            View public
          </Link>
          <Link
            href="/admin/listings"
            className="inline-flex h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-700 transition hover:border-slate-300"
          >
            Back to list
          </Link>
        </div>
      }
    >
      <ListingForm
        mode="edit"
        listingId={params.id}
        initialValues={listing.values}
        categories={categories}
      />
    </AdminShell>
  );
}
