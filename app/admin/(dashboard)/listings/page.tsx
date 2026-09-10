import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ListingsTable from "@/components/admin/listings/ListingsTable";
import { getAdminListings } from "@/lib/data/admin-listings";

export const metadata: Metadata = {
  title: "Listings Management",
};

export default async function AdminListingsPage() {
  const listings = await getAdminListings();

  return (
    <AdminShell
      title="Listings Management"
      description="Kelola semua bisnis: cari, filter, edit, hapus, dan buka profil publik."
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Listings" },
      ]}
      actions={
        <Link
          href="/admin/listings/new"
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-slate-950 px-4 text-[13px] font-medium text-white transition hover:bg-slate-800"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          Add listing
        </Link>
      }
    >
      <ListingsTable listings={listings} />
    </AdminShell>
  );
}
