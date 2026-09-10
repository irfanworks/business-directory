import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Category, FeaturedListing } from "@/lib/types";

const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "a1000000-0000-4000-8000-000000000001",
    name: "Teknologi & IT",
    slug: "teknologi-it",
    description:
      "Perusahaan dan layanan di bidang teknologi informasi, software, dan digital.",
    icon_name: "cpu",
    listing_count: 2,
  },
  {
    id: "demo-finansial",
    name: "Finansial",
    slug: "finansial",
    description: "Perbankan, asuransi, dan layanan keuangan.",
    icon_name: "landmark",
    listing_count: 0,
  },
  {
    id: "demo-kesehatan",
    name: "Kesehatan",
    slug: "kesehatan",
    description: "Klinik, apotek, dan wellness.",
    icon_name: "heartpulse",
    listing_count: 0,
  },
  {
    id: "demo-pendidikan",
    name: "Pendidikan",
    slug: "pendidikan",
    description: "Sekolah, kursus, dan edtech.",
    icon_name: "graduationcap",
    listing_count: 0,
  },
  {
    id: "demo-retail",
    name: "Retail & E-commerce",
    slug: "retail",
    description: "Toko, brand, dan marketplace seller.",
    icon_name: "shoppingbag",
    listing_count: 0,
  },
  {
    id: "demo-jasa",
    name: "Jasa Profesional",
    slug: "jasa-profesional",
    description: "Legal, konsultasi, dan layanan B2B.",
    icon_name: "briefcase",
    listing_count: 0,
  },
  {
    id: "demo-properti",
    name: "Properti",
    slug: "properti",
    description: "Developer, agen, dan manajemen aset.",
    icon_name: "building2",
    listing_count: 0,
  },
  {
    id: "demo-kreatif",
    name: "Kreatif & Media",
    slug: "kreatif-media",
    description: "Agency, studio, dan produksi konten.",
    icon_name: "sparkles",
    listing_count: 0,
  },
];

const FALLBACK_FEATURED: FeaturedListing[] = [
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
  },
  {
    id: "demo-featured-2",
    title: "Aether Legal Partners",
    slug: "aether-legal-partners",
    logo_url: "https://placehold.co/200x200/1e293b/ffffff?text=ALP",
    short_tagline: "Corporate counsel untuk startup & scale-up",
    city: "Jakarta Pusat",
    verified_badge: true,
    is_featured: true,
    tier: "premium",
    category_name: "Jasa Profesional",
    category_slug: "jasa-profesional",
  },
  {
    id: "demo-featured-3",
    title: "Lumina Beauty Lab",
    slug: "lumina-beauty-lab",
    logo_url: "https://placehold.co/200x200/134e4a/ffffff?text=LBL",
    short_tagline: "Klinik kecantikan berbasis sains & hasil nyata",
    city: "Bandung",
    verified_badge: true,
    is_featured: true,
    tier: "premium",
    category_name: "Kesehatan",
    category_slug: "kesehatan",
  },
];

function unwrapOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getHomepageCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_CATEGORIES;
  }

  const supabase = createClient();
  if (!supabase) return FALLBACK_CATEGORIES;

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      name,
      slug,
      description,
      icon_name,
      subcategories (
        listings (count)
      )
    `,
    )
    .order("name", { ascending: true });

  if (error || !data?.length) {
    console.error("Failed to load categories:", error?.message);
    return FALLBACK_CATEGORIES;
  }

  return data.map((row) => {
    const subs = row.subcategories ?? [];
    const listing_count = (Array.isArray(subs) ? subs : [subs]).reduce(
      (sum, sub) => {
        const listings = sub?.listings;
        const countEntry = Array.isArray(listings) ? listings[0] : listings;
        return sum + (countEntry?.count ?? 0);
      },
      0,
    );

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      icon_name: row.icon_name,
      listing_count,
    };
  });
}

export async function getFeaturedListings(): Promise<FeaturedListing[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_FEATURED;
  }

  const supabase = createClient();
  if (!supabase) return FALLBACK_FEATURED;

  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      id,
      title,
      slug,
      logo_url,
      short_tagline,
      city,
      verified_badge,
      is_featured,
      tier,
      subcategories (
        name,
        categories ( name, slug )
      )
    `,
    )
    .eq("status", "published")
    .or("tier.eq.premium,is_featured.eq.true")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(8);

  if (error || !data?.length) {
    console.error("Failed to load featured listings:", error?.message);
    return FALLBACK_FEATURED;
  }

  return data.map((row) => {
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
      tier: row.tier as FeaturedListing["tier"],
      category_name: category?.name ?? null,
      category_slug: category?.slug ?? null,
    };
  });
}

export async function getSearchCategories(): Promise<
  Pick<Category, "id" | "name" | "slug">[]
> {
  const categories = await getHomepageCategories();
  return categories.map(({ id, name, slug }) => ({ id, name, slug }));
}
