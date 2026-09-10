import type { Metadata } from "next";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ListingForm from "@/components/admin/listings/ListingForm";
import { emptyListingForm } from "@/lib/admin/listings";
import { getAdminCategories } from "@/lib/data/admin-listings";

export const metadata: Metadata = {
  title: "Add Listing",
};

export default async function AdminNewListingPage() {
  const categories = await getAdminCategories();
  const initial = emptyListingForm();
  if (categories[0]) {
    initial.category_id = categories[0].id;
    initial.subcategory_id = categories[0].subcategories[0]?.id || "";
  }

  return (
    <AdminShell
      title="Add Listing"
      description="Buat profil bisnis baru untuk direktori."
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Listings", href: "/admin/listings" },
        { label: "Add" },
      ]}
      actions={
        <Link
          href="/admin/listings"
          className="inline-flex h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-700 transition hover:border-slate-300"
        >
          Back to list
        </Link>
      }
    >
      <ListingForm
        mode="create"
        initialValues={initial}
        categories={categories}
      />
    </AdminShell>
  );
}
