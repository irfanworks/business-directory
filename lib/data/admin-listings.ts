import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  AdminListingTableRow,
  CategoryOption,
  ListingFormValues,
} from "@/lib/admin/listings";
import { emptyListingForm } from "@/lib/admin/listings";

const FALLBACK_CATEGORIES: CategoryOption[] = [
  {
    id: "a1000000-0000-4000-8000-000000000001",
    name: "Teknologi & IT",
    slug: "teknologi-it",
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
];

const FALLBACK_ROWS: AdminListingTableRow[] = [
  {
    id: "c1000000-0000-4000-8000-000000000001",
    title: "Optisio Digital Solutions",
    slug: "optisio-digital-solutions",
    logo_url: "https://placehold.co/200x200/0f766e/ffffff?text=Optisio",
    status: "published",
    tier: "premium",
    is_featured: true,
    verified_badge: true,
    city: "Jakarta Selatan",
    category_name: "Teknologi & IT",
    subcategory_name: "Software Development",
  },
  {
    id: "c1000000-0000-4000-8000-000000000002",
    title: "Nusantara Code Studio",
    slug: "nusantara-code-studio",
    logo_url: "https://placehold.co/200x200/1e3a5f/ffffff?text=NCS",
    status: "published",
    tier: "free",
    is_featured: false,
    verified_badge: false,
    city: "Yogyakarta",
    category_name: "Teknologi & IT",
    subcategory_name: "IT Consulting",
  },
];

function unwrapOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getAdminListings(): Promise<AdminListingTableRow[]> {
  if (!isSupabaseConfigured()) return FALLBACK_ROWS;

  const supabase = createClient();
  if (!supabase) return FALLBACK_ROWS;

  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      id,
      title,
      slug,
      logo_url,
      status,
      tier,
      is_featured,
      verified_badge,
      city,
      subcategories (
        name,
        categories ( name )
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Admin listings fetch failed:", error?.message);
    return FALLBACK_ROWS;
  }

  return data.map((row) => {
    const subcategory = unwrapOne(row.subcategories);
    const category = unwrapOne(subcategory?.categories);
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      logo_url: row.logo_url,
      status: row.status,
      tier: row.tier,
      is_featured: row.is_featured,
      verified_badge: row.verified_badge,
      city: row.city,
      category_name: category?.name ?? null,
      subcategory_name: subcategory?.name ?? null,
    };
  });
}

export async function getAdminCategories(): Promise<CategoryOption[]> {
  if (!isSupabaseConfigured()) return FALLBACK_CATEGORIES;

  const supabase = createClient();
  if (!supabase) return FALLBACK_CATEGORIES;

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      name,
      slug,
      subcategories ( id, name, slug )
    `,
    )
    .order("name", { ascending: true });

  if (error || !data?.length) {
    console.error("Admin categories fetch failed:", error?.message);
    return FALLBACK_CATEGORIES;
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    subcategories: (row.subcategories ?? []).map(
      (sub: { id: string; name: string; slug: string }) => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
      }),
    ),
  }));
}

export async function getAdminListingForm(
  id: string,
): Promise<{ values: ListingFormValues; found: boolean }> {
  if (!isSupabaseConfigured()) {
    const fallback = FALLBACK_ROWS.find((r) => r.id === id);
    if (!fallback) return { values: emptyListingForm(), found: false };
    return {
      found: true,
      values: {
        ...emptyListingForm(),
        title: fallback.title,
        slug: fallback.slug,
        logo_url: fallback.logo_url || "",
        status: fallback.status,
        tier: fallback.tier,
        is_featured: fallback.is_featured,
        verified_badge: fallback.verified_badge,
        city: fallback.city || "",
        category_id: FALLBACK_CATEGORIES[0]?.id || "",
        subcategory_id:
          FALLBACK_CATEGORIES[0]?.subcategories.find(
            (s) => s.name === fallback.subcategory_name,
          )?.id || "",
      },
    };
  }

  const supabase = createClient();
  if (!supabase) return { values: emptyListingForm(), found: false };

  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      title,
      slug,
      short_tagline,
      content,
      logo_url,
      banner_url,
      status,
      tier,
      is_featured,
      verified_badge,
      address,
      city,
      map_iframe_url,
      phone,
      whatsapp,
      email,
      website_url,
      instagram,
      linkedin,
      facebook,
      youtube,
      twitter,
      tiktok,
      subcategory_id,
      subcategories ( category_id )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    console.error("Admin listing detail failed:", error?.message);
    return { values: emptyListingForm(), found: false };
  }

  const subcategory = unwrapOne(data.subcategories);

  return {
    found: true,
    values: {
      title: data.title || "",
      slug: data.slug || "",
      short_tagline: data.short_tagline || "",
      content: data.content || "",
      logo_url: data.logo_url || "",
      banner_url: data.banner_url || "",
      category_id: subcategory?.category_id || "",
      subcategory_id: data.subcategory_id || "",
      status: data.status,
      tier: data.tier,
      is_featured: data.is_featured,
      verified_badge: data.verified_badge,
      address: data.address || "",
      city: data.city || "",
      map_iframe_url: data.map_iframe_url || "",
      phone: data.phone || "",
      whatsapp: data.whatsapp || "",
      email: data.email || "",
      website_url: data.website_url || "",
      instagram: data.instagram || "",
      linkedin: data.linkedin || "",
      facebook: data.facebook || "",
      youtube: data.youtube || "",
      twitter: data.twitter || "",
      tiktok: data.tiktok || "",
    },
  };
}
