import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryDirectoryView from "@/components/directory/CategoryDirectoryView";
import {
  getCategoryBySlug,
  getPublishedListingsForSubcategoryIds,
  getSubcategoriesByCategoryId,
} from "@/lib/data/directory";

type PageProps = {
  params: { category_slug: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category_slug);
  if (!category) return { title: "Category not found" };

  return {
    title: `${category.name} | Business Directory Indonesia`,
    description:
      category.description ??
      `Jelajahi bisnis terverifikasi di kategori ${category.name}.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await getCategoryBySlug(params.category_slug);
  if (!category) notFound();

  const subcategories = await getSubcategoriesByCategoryId(category.id);
  const listings = await getPublishedListingsForSubcategoryIds(
    subcategories.map((s) => s.id),
    category.slug,
  );

  return (
    <CategoryDirectoryView
      category={category}
      subcategories={subcategories}
      listings={listings}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: category.name },
      ]}
    />
  );
}
