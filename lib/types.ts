export type ListingStatus = "draft" | "pending" | "published";
export type ListingTier = "free" | "premium";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_name: string | null;
  listing_count?: number;
  /** Preview of subcategories for homepage / discovery cards */
  subcategories?: Pick<Subcategory, "id" | "name" | "slug">[];
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
  subcategory_name?: string | null;
  view_count?: number;
  created_at?: string | null;
  updated_at?: string | null;
  whatsapp?: string | null;
};

export type LocationStat = {
  city: string;
  listing_count: number;
};

export type Subcategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string;
};

export type DirectoryListing = FeaturedListing & {
  subcategory_name: string | null;
  subcategory_slug: string | null;
};

export type SortOption =
  | "recommended"
  | "relevant"
  | "newest"
  | "most_viewed";

export type BusinessListing = DirectoryListing & {
  content: string | null;
  address: string | null;
  maps_url: string | null;
  map_iframe_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website_url: string | null;
  instagram: string | null;
  linkedin: string | null;
  facebook: string | null;
  youtube: string | null;
  twitter: string | null;
  tiktok: string | null;
  view_count: number;
};

export function isPriorityListing(
  listing: Pick<FeaturedListing, "tier" | "is_featured">,
): boolean {
  return listing.tier === "premium" || listing.is_featured;
}

/** Premium / featured first, then free listings. */
export function sortListingsByPriority<
  T extends Pick<FeaturedListing, "tier" | "is_featured" | "title">,
>(listings: T[]): T[] {
  return [...listings].sort((a, b) => {
    const aPriority = isPriorityListing(a) ? 1 : 0;
    const bPriority = isPriorityListing(b) ? 1 : 0;
    if (bPriority !== aPriority) return bPriority - aPriority;

    if (a.is_featured !== b.is_featured) {
      return Number(b.is_featured) - Number(a.is_featured);
    }

    if (a.tier !== b.tier) {
      return a.tier === "premium" ? -1 : 1;
    }

    return a.title.localeCompare(b.title, "id");
  });
}
