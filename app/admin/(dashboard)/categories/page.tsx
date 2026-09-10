import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import CategoriesManager from "@/components/admin/categories/CategoriesManager";
import { getAdminCategoriesTree } from "@/lib/data/admin-taxonomy";

export const metadata: Metadata = {
  title: "Categories & Subcategories",
};

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategoriesTree();

  return (
    <AdminShell
      title="Categories & Subcategories"
      description="CRUD kategori utama dan subkategori untuk mapping listing."
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Categories" },
      ]}
    >
      <CategoriesManager categories={categories} />
    </AdminShell>
  );
}
