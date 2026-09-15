import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import FeaturedListings from "@/components/home/FeaturedListings";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import LocationsExplore from "@/components/home/LocationsExplore";
import RecentlyVerified from "@/components/home/RecentlyVerified";
import TrustSection from "@/components/home/TrustSection";
import CtaBanner from "@/components/home/CtaBanner";
import {
  getFeaturedListings,
  getHomepageCategories,
  getLocationsWithCounts,
  getRecentlyVerifiedListings,
  getSearchCategories,
} from "@/lib/data/homepage";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getSiteUrl } from "@/lib/seo/site";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.seo_title || settings.site_name;
  const description = settings.seo_description;
  const keywords = settings.seo_keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  const ogImage = settings.seo_og_image.trim();

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: getSiteUrl() },
    openGraph: {
      type: "website",
      title,
      description,
      url: getSiteUrl(),
      siteName: settings.site_name,
      images: ogImage ? [{ url: ogImage, alt: settings.site_name }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function HomePage() {
  const [
    settings,
    categories,
    featured,
    searchCategories,
    locations,
    recentlyVerified,
  ] = await Promise.all([
    getSiteSettings(),
    getHomepageCategories(),
    getFeaturedListings(),
    getSearchCategories(),
    getLocationsWithCounts(),
    getRecentlyVerifiedListings(),
  ]);

  const searchCats = searchCategories.map((c) => {
    const full = categories.find((cat) => cat.id === c.id);
    return { ...c, listing_count: full?.listing_count };
  });

  return (
    <>
      <HeroSection
        categories={searchCats}
        locations={locations.map((l) => l.city)}
        eyebrow={settings.hero_eyebrow}
        title={settings.hero_title}
        titleAccent={settings.hero_title_accent}
        subtitle={settings.hero_subtitle}
      />
      <FeaturedListings
        listings={featured}
        title={settings.trending_title}
        description={settings.trending_description}
      />
      <CategoriesGrid
        categories={categories}
        title={settings.categories_title}
        description={settings.categories_description}
        featuredCategories={[
          "Makanan & Minuman",
          "Teknologi",
          "Teknologi & Digital",
          "Teknologi & IT",
        ]}
      />
      <LocationsExplore locations={locations} />
      <RecentlyVerified listings={recentlyVerified} />
      <TrustSection />
      <CtaBanner
        eyebrow={settings.cta_eyebrow}
        title={settings.cta_title}
        description={settings.cta_description}
        buttonLabel={settings.cta_button_label}
      />
    </>
  );
}
