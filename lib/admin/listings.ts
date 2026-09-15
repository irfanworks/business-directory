export type ListingStatus = "draft" | "pending" | "published";
export type ListingTier = "free" | "premium";

export type ListingFormValues = {
  title: string;
  slug: string;
  short_tagline: string;
  content: string;
  logo_url: string;
  category_id: string;
  subcategory_id: string;
  status: ListingStatus;
  tier: ListingTier;
  is_featured: boolean;
  verified_badge: boolean;
  address: string;
  city: string;
  maps_url: string;
  map_iframe_url: string;
  phone: string;
  whatsapp: string;
  email: string;
  website_url: string;
  instagram: string;
  linkedin: string;
  facebook: string;
  youtube: string;
  twitter: string;
  tiktok: string;
};

export type AdminListingTableRow = {
  id: string;
  title: string;
  slug: string;
  logo_url: string | null;
  status: ListingStatus;
  tier: ListingTier;
  is_featured: boolean;
  verified_badge: boolean;
  city: string | null;
  category_name: string | null;
  subcategory_name: string | null;
};

export type CategoryOption = {
  id: string;
  name: string;
  slug: string;
  subcategories: { id: string; name: string; slug: string }[];
};

export const emptyListingForm = (): ListingFormValues => ({
  title: "",
  slug: "",
  short_tagline: "",
  content: "",
  logo_url: "",
  category_id: "",
  subcategory_id: "",
  status: "draft",
  tier: "free",
  is_featured: false,
  verified_badge: false,
  address: "",
  city: "",
  maps_url: "",
  map_iframe_url: "",
  phone: "",
  whatsapp: "",
  email: "",
  website_url: "",
  instagram: "",
  linkedin: "",
  facebook: "",
  youtube: "",
  twitter: "",
  tiktok: "",
});

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function nullIfEmpty(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
