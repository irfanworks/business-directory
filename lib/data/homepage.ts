import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Category, FeaturedListing, LocationStat } from "@/lib/types";

const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "a1000000-0000-4000-8000-000000000001",
    name: "Teknologi & IT",
    slug: "teknologi-it",
    description:
      "Perusahaan dan layanan di bidang teknologi informasi, software, dan digital.",
    icon_name: "cpu",
    listing_count: 2,
    subcategories: [
      {
        id: "b1000000-0000-4000-8000-000000000001",
        name: "Software Development",
        slug: "software-development",
      },
      {
        id: "b1000000-0000-4000-8000-000000000002",
        name: "IT Consulting",
        slug: "it-consulting",
      },
    ],
  },
  {
    id: "demo-finansial",
    name: "Finansial",
    slug: "finansial",
    description: "Perbankan, asuransi, dan layanan keuangan.",
    icon_name: "landmark",
    listing_count: 0,
    subcategories: [
      { id: "demo-sub-bank", name: "Perbankan", slug: "perbankan" },
      { id: "demo-sub-asuransi", name: "Asuransi", slug: "asuransi" },
      { id: "demo-sub-fintech", name: "Fintech", slug: "fintech" },
    ],
  },
  {
    id: "demo-kesehatan",
    name: "Kesehatan",
    slug: "kesehatan",
    description: "Klinik, apotek, dan wellness.",
    icon_name: "heartpulse",
    listing_count: 0,
    subcategories: [
      { id: "demo-sub-klinik", name: "Klinik", slug: "klinik" },
      { id: "demo-sub-apotek", name: "Apotek", slug: "apotek" },
    ],
  },
  {
    id: "demo-pendidikan",
    name: "Pendidikan",
    slug: "pendidikan",
    description: "Sekolah, kursus, dan edtech.",
    icon_name: "graduationcap",
    listing_count: 0,
    subcategories: [
      { id: "demo-sub-kursus", name: "Kursus", slug: "kursus" },
      { id: "demo-sub-edtech", name: "Edtech", slug: "edtech" },
    ],
  },
  {
    id: "demo-retail",
    name: "Retail & E-commerce",
    slug: "retail",
    description: "Toko, brand, dan marketplace seller.",
    icon_name: "shoppingbag",
    listing_count: 0,
    subcategories: [
      { id: "demo-sub-toko", name: "Toko Offline", slug: "toko-offline" },
      { id: "demo-sub-online", name: "Toko Online", slug: "toko-online" },
    ],
  },
  {
    id: "demo-jasa",
    name: "Jasa Profesional",
    slug: "jasa-profesional",
    description: "Legal, konsultasi, dan layanan B2B.",
    icon_name: "briefcase",
    listing_count: 0,
    subcategories: [
      { id: "demo-sub-legal", name: "Legal", slug: "legal" },
      { id: "demo-sub-konsultan", name: "Konsultan", slug: "konsultan" },
    ],
  },
  {
    id: "demo-properti",
    name: "Properti",
    slug: "properti",
    description: "Developer, agen, dan manajemen aset.",
    icon_name: "building2",
    listing_count: 0,
    subcategories: [
      { id: "demo-sub-developer", name: "Developer", slug: "developer" },
      { id: "demo-sub-agen", name: "Agen Properti", slug: "agen-properti" },
    ],
  },
  {
    id: "demo-kreatif",
    name: "Kreatif & Media",
    slug: "kreatif-media",
    description: "Agency, studio, dan produksi konten.",
    icon_name: "sparkles",
    listing_count: 0,
    subcategories: [
      { id: "demo-sub-agency", name: "Digital Agency", slug: "digital-agency" },
      { id: "demo-sub-studio", name: "Studio", slug: "studio" },
    ],
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
    subcategory_name: "Software Development",
    view_count: 1280,
    updated_at: "2026-09-01T00:00:00.000Z",
    whatsapp: "+6281234567890",
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
    subcategory_name: "Legal",
    view_count: 640,
    updated_at: "2026-08-28T00:00:00.000Z",
    whatsapp: null,
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
    subcategory_name: "Kecantikan",
    view_count: 412,
    updated_at: "2026-08-20T00:00:00.000Z",
    whatsapp: "+6285678901234",
  },
];

const FALLBACK_LOCATIONS: LocationStat[] = [
  { city: "Jakarta Selatan", listing_count: 2 },
  { city: "Jakarta Pusat", listing_count: 1 },
  { city: "Bandung", listing_count: 1 },
  { city: "Yogyakarta", listing_count: 1 },
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
        id,
        name,
        slug,
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
    const subsRaw = row.subcategories ?? [];
    const subs = (Array.isArray(subsRaw) ? subsRaw : [subsRaw]).filter(Boolean);

    const listing_count = subs.reduce((sum, sub) => {
      const listings = sub?.listings;
      const countEntry = Array.isArray(listings) ? listings[0] : listings;
      return sum + (countEntry?.count ?? 0);
    }, 0);

    const subcategories = [...subs]
      .map((sub) => ({
        id: sub.id as string,
        name: sub.name as string,
        slug: sub.slug as string,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "id"));

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      icon_name: row.icon_name,
      listing_count,
      subcategories,
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
      view_count,
      created_at,
      updated_at,
      whatsapp,
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

  return data.map(mapFeaturedRow);
}

function mapFeaturedRow(row: {
  id: string;
  title: string;
  slug: string;
  logo_url: string | null;
  short_tagline: string | null;
  city: string | null;
  verified_badge: boolean;
  is_featured: boolean;
  tier: FeaturedListing["tier"];
  view_count?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  whatsapp?: string | null;
  subcategories:
    | {
        name: string;
        categories: { name: string; slug: string } | { name: string; slug: string }[] | null;
      }
    | {
        name: string;
        categories: { name: string; slug: string } | { name: string; slug: string }[] | null;
      }[]
    | null;
}): FeaturedListing {
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
    view_count: row.view_count ?? undefined,
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null,
    whatsapp: row.whatsapp ?? null,
  };
}

export async function getRecentlyVerifiedListings(): Promise<FeaturedListing[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_FEATURED.filter((l) => l.verified_badge).slice(0, 6);
  }

  const supabase = createClient();
  if (!supabase) {
    return FALLBACK_FEATURED.filter((l) => l.verified_badge).slice(0, 6);
  }

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
      view_count,
      created_at,
      updated_at,
      subcategories (
        name,
        categories ( name, slug )
      )
    `,
    )
    .eq("status", "published")
    .eq("verified_badge", true)
    .order("updated_at", { ascending: false })
    .limit(6);

  if (error || !data?.length) {
    console.error("Failed to load recently verified:", error?.message);
    return FALLBACK_FEATURED.filter((l) => l.verified_badge).slice(0, 6);
  }

  return data.map(mapFeaturedRow);
}

export async function getLocationsWithCounts(): Promise<LocationStat[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_LOCATIONS;
  }

  const supabase = createClient();
  if (!supabase) return FALLBACK_LOCATIONS;

  const { data, error } = await supabase
    .from("listings")
    .select("city")
    .eq("status", "published")
    .not("city", "is", null);

  if (error || !data?.length) {
    console.error("Failed to load locations:", error?.message);
    return FALLBACK_LOCATIONS;
  }

  const counts = new Map<string, number>();
  for (const row of data) {
    const city = row.city?.trim();
    if (!city) continue;
    counts.set(city, (counts.get(city) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([city, listing_count]) => ({ city, listing_count }))
    .sort((a, b) => {
      if (b.listing_count !== a.listing_count) {
        return b.listing_count - a.listing_count;
      }
      return a.city.localeCompare(b.city, "id");
    });
}

export async function getSearchCategories(): Promise<
  Pick<Category, "id" | "name" | "slug">[]
> {
  const categories = await getHomepageCategories();
  return categories.map(({ id, name, slug }) => ({ id, name, slug }));
}
