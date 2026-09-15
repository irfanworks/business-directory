import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryDirectoryView from "@/components/directory/CategoryDirectoryView";
import {
  getCategoryBySlug,
  getPublishedListingsForSubcategoryId,
  getSubcategoriesByCategoryId,
  getSubcategoryBySlug,
} from "@/lib/data/directory";

type PageProps = {
  params: { category_slug: string; subcategory_slug: string };
  searchParams: { q?: string; city?: string; verified?: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category_slug);
  if (!category) return { title: "Category not found" };

  const subcategory = await getSubcategoryBySlug(
    category.id,
    params.subcategory_slug,
  );
  if (!subcategory) return { title: "Subcategory not found" };

  return {
    title: `${subcategory.name} · ${category.name} | Business Directory Indonesia`,
    description:
      subcategory.description ??
      `Bisnis di ${subcategory.name} dalam kategori ${category.name}.`,
  };
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: PageProps) {
  const category = await getCategoryBySlug(params.category_slug);
  if (!category) notFound();

  const subcategories = await getSubcategoriesByCategoryId(category.id);
  const subcategory = await getSubcategoryBySlug(
    category.id,
    params.subcategory_slug,
  );
  if (!subcategory) notFound();

  const listings = await getPublishedListingsForSubcategoryId(
    subcategory.id,
    category.slug,
    subcategory.slug,
  );

  return (
    <CategoryDirectoryView
      category={category}
      subcategory={subcategory}
      subcategories={subcategories}
      listings={listings}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: category.name, href: `/category/${category.slug}` },
        { label: subcategory.name },
      ]}
      initialQuery={searchParams.q?.trim() ?? ""}
      initialCity={searchParams.city?.trim() ?? ""}
      initialVerified={searchParams.verified === "1"}
    />
  );
}
