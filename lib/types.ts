export type ListingStatus = "draft" | "pending" | "published";
export type ListingTier = "free" | "premium";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_name: string | null;
  listing_count?: number;
};

export type FeaturedListing = {
  id: string;
  title: string;
  slug: string;
  logo_url: string | null;
  short_tagline: string | null;
  city: string | null;
  verified_badge: boolean;
  is_featured: boolean;
  tier: ListingTier;
  category_name: string | null;
  category_slug: string | null;
};
