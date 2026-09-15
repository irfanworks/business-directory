import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  sortListingsByPriority,
  type Category,
  type DirectoryListing,
  type Subcategory,
} from "@/lib/types";

const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "a1000000-0000-4000-8000-000000000001",
    name: "Teknologi & IT",
    slug: "teknologi-it",
    description:
      "Perusahaan dan layanan di bidang teknologi informasi, software, dan digital.",
    icon_name: "cpu",
  },
  {
    id: "demo-finansial",
    name: "Finansial",
    slug: "finansial",
    description: "Perbankan, asuransi, dan layanan keuangan.",
    icon_name: "landmark",
  },
  {
    id: "demo-kesehatan",
    name: "Kesehatan",
    slug: "kesehatan",
    description: "Klinik, apotek, dan wellness.",
    icon_name: "heartpulse",
  },
  {
    id: "demo-pendidikan",
    name: "Pendidikan",
    slug: "pendidikan",
    description: "Sekolah, kursus, dan edtech.",
    icon_name: "graduationcap",
  },
  {
    id: "demo-retail",
    name: "Retail & E-commerce",
    slug: "retail",
    description: "Toko, brand, dan marketplace seller.",
    icon_name: "shoppingbag",
  },
  {
    id: "demo-jasa",
    name: "Jasa Profesional",
    slug: "jasa-profesional",
    description: "Legal, konsultasi, dan layanan B2B.",
    icon_name: "briefcase",
  },
];

const FALLBACK_CATEGORY = FALLBACK_CATEGORIES[0];

const FALLBACK_SUBCATEGORIES: Subcategory[] = [
  {
    id: "b1000000-0000-4000-8000-000000000001",
    category_id: FALLBACK_CATEGORY.id,
    name: "Software Development",
    slug: "software-development",
    description: "Pengembangan aplikasi web, mobile, dan enterprise software.",
  },
  {
    id: "b1000000-0000-4000-8000-000000000002",
    category_id: FALLBACK_CATEGORY.id,
    name: "IT Consulting",
    slug: "it-consulting",
    description: "Konsultan IT, transformasi digital, dan solusi infrastruktur.",
  },
];

const FALLBACK_LISTINGS: DirectoryListing[] = [
  {
    id: "c1000000-0000-4000-8000-000000000001",
    title: "Optisio Digital Solutions",
    slug: "optisio-digital-solutions",
    logo_url: "https://placehold.co/200x200/0f766e/ffffff?text=Optisio",
    short_tagline: "Solusi digital profesional untuk bisnis Indonesia",
    city: "Jakarta Selatan",
    verified_badge: true,
    is_featured: true,
    tier: "premium",
    category_name: "Teknologi & IT",
    category_slug: "teknologi-it",
    subcategory_name: "Software Development",
    subcategory_slug: "software-development",
  },
  {
    id: "c1000000-0000-4000-8000-000000000002",
    title: "Nusantara Code Studio",
    slug: "nusantara-code-studio",
    logo_url: "https://placehold.co/200x200/1e3a5f/ffffff?text=NCS",
    short_tagline: "Tim developer lokal untuk website & aplikasi UMKM",
    city: "Yogyakarta",
    verified_badge: false,
    is_featured: false,
    tier: "free",
    category_name: "Teknologi & IT",
    category_slug: "teknologi-it",
    subcategory_name: "IT Consulting",
    subcategory_slug: "it-consulting",
  },
  {
    id: "demo-cloud-works",
    title: "Merapi Cloud Works",
    slug: "merapi-cloud-works",
    logo_url: "https://placehold.co/200x200/0f172a/ffffff?text=MCW",
    short_tagline: "Infrastruktur cloud & DevOps untuk skala nasional",
    city: "Jakarta Selatan",
    verified_badge: true,
    is_featured: false,
    tier: "premium",
    category_name: "Teknologi & IT",
    category_slug: "teknologi-it",
    subcategory_name: "IT Consulting",
    subcategory_slug: "it-consulting",
  },
];

function unwrapOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapListingRow(row: {
  id: string;
  title: string;
  slug: string;
  logo_url: string | null;
  short_tagline: string | null;
  city: string | null;
  verified_badge: boolean;
  is_featured: boolean;
  tier: DirectoryListing["tier"];
  view_count?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  subcategories:
    | {
        name: string;
        slug: string;
        categories: { name: string; slug: string } | { name: string; slug: string }[] | null;
      }
    | {
        name: string;
        slug: string;
        categories: { name: string; slug: string } | { name: string; slug: string }[] | null;
      }[]
    | null;
}): DirectoryListing {
  const subcategory = unwrapOne(row.subcategories);
  const category = unwrapOne(subcategory?.categories);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    logo_url: row.logo_url,
    short_tagline: row.short_tagline,
    city: row.city,
    verified_badge: row.verified_badge,
    is_featured: row.is_featured,
    tier: row.tier,
    category_name: category?.name ?? null,
    category_slug: category?.slug ?? null,
    subcategory_name: subcategory?.name ?? null,
    subcategory_slug: subcategory?.slug ?? null,
    view_count: row.view_count ?? undefined,
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null,
  };
}

const LISTING_SELECT = `
  id,
  title,
  slug,
  logo_url,
  short_tagline,
  city,
  verified_badge,
  is_featured,
  tier,
  view_count,
  created_at,
  updated_at,
  subcategories (
    name,
    slug,
    categories ( name, slug )
  )
`;

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }

  const supabase = createClient();
  if (!supabase) {
    return FALLBACK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, icon_name")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    console.error("Failed to load category:", error?.message);
    return FALLBACK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }

  return data;
}

export async function getSubcategoriesByCategoryId(
  categoryId: string,
): Promise<Subcategory[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_SUBCATEGORIES.filter((s) => s.category_id === categoryId);
  }

  const supabase = createClient();
  if (!supabase) {
    return FALLBACK_SUBCATEGORIES.filter((s) => s.category_id === categoryId);
  }

  const { data, error } = await supabase
    .from("subcategories")
    .select("id, category_id, name, slug, description")
    .eq("category_id", categoryId)
    .order("name", { ascending: true });

  if (error || !data) {
    console.error("Failed to load subcategories:", error?.message);
    return FALLBACK_SUBCATEGORIES.filter((s) => s.category_id === categoryId);
  }

  return data;
}

export async function getSubcategoryBySlug(
  categoryId: string,
  subcategorySlug: string,
): Promise<Subcategory | null> {
  const subs = await getSubcategoriesByCategoryId(categoryId);
  return subs.find((s) => s.slug === subcategorySlug) ?? null;
}

/**
 * Prefer filtering by subcategory IDs — more reliable than nested slug filters in PostgREST.
 */
export async function getPublishedListingsForSubcategoryIds(
  subcategoryIds: string[],
  categorySlug: string,
): Promise<DirectoryListing[]> {
  if (!isSupabaseConfigured()) {
    return sortListingsByPriority(
      FALLBACK_LISTINGS.filter((l) => l.category_slug === categorySlug),
    );
  }

  if (!subcategoryIds.length) return [];

  const supabase = createClient();
  if (!supabase) {
    return sortListingsByPriority(
      FALLBACK_LISTINGS.filter((l) => l.category_slug === categorySlug),
    );
  }

  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("status", "published")
    .in("subcategory_id", subcategoryIds);

  if (error || !data) {
    console.error("Failed to load listings by subcategory ids:", error?.message);
    return sortListingsByPriority(
      FALLBACK_LISTINGS.filter((l) => l.category_slug === categorySlug),
    );
  }

  return sortListingsByPriority(data.map(mapListingRow));
}

export async function getPublishedListingsForSubcategoryId(
  subcategoryId: string,
  categorySlug: string,
  subcategorySlug: string,
): Promise<DirectoryListing[]> {
  if (!isSupabaseConfigured()) {
    return sortListingsByPriority(
      FALLBACK_LISTINGS.filter(
        (l) =>
          l.category_slug === categorySlug &&
          l.subcategory_slug === subcategorySlug,
      ),
    );
  }

  const supabase = createClient();
  if (!supabase) {
    return sortListingsByPriority(
      FALLBACK_LISTINGS.filter(
        (l) =>
          l.category_slug === categorySlug &&
          l.subcategory_slug === subcategorySlug,
      ),
    );
  }

  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("status", "published")
    .eq("subcategory_id", subcategoryId);

  if (error || !data) {
    console.error("Failed to load subcategory listings:", error?.message);
    return sortListingsByPriority(
      FALLBACK_LISTINGS.filter(
        (l) =>
          l.category_slug === categorySlug &&
          l.subcategory_slug === subcategorySlug,
      ),
    );
  }

  return sortListingsByPriority(data.map(mapListingRow));
}

export async function getAllPublishedListings(): Promise<DirectoryListing[]> {
  if (!isSupabaseConfigured()) {
    return sortListingsByPriority(FALLBACK_LISTINGS);
  }

  const supabase = createClient();
  if (!supabase) {
    return sortListingsByPriority(FALLBACK_LISTINGS);
  }

  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("status", "published");

  if (error || !data) {
    console.error("Failed to load all listings:", error?.message);
    return sortListingsByPriority(FALLBACK_LISTINGS);
  }

  return sortListingsByPriority(data.map(mapListingRow));
}

export async function getRelatedBusinesses(
  categorySlug: string | null,
  excludeId: string,
  limit = 3,
): Promise<DirectoryListing[]> {
  if (!categorySlug) return [];

  const listings = await getAllPublishedListings();
  return listings
    .filter((l) => l.category_slug === categorySlug && l.id !== excludeId)
    .slice(0, limit);
}
