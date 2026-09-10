import HeroSection from "@/components/home/HeroSection";
import FeaturedListings from "@/components/home/FeaturedListings";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import CtaBanner from "@/components/home/CtaBanner";
import {
  getFeaturedListings,
  getHomepageCategories,
  getSearchCategories,
} from "@/lib/data/homepage";

export const revalidate = 60;

export default async function HomePage() {
  const [categories, featured, searchCategories] = await Promise.all([
    getHomepageCategories(),
    getFeaturedListings(),
    getSearchCategories(),
  ]);

  return (
    <>
      <HeroSection categories={searchCategories} />
      <FeaturedListings listings={featured} />
      <CategoriesGrid categories={categories} />
      <CtaBanner />
    </>
  );
}
