import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { BusinessListing } from "@/lib/types";

const FALLBACK_BUSINESSES: BusinessListing[] = [
  {
    id: "c1000000-0000-4000-8000-000000000001",
    title: "Optisio Digital Solutions",
    slug: "optisio-digital-solutions",
    logo_url: "https://placehold.co/200x200/0f766e/ffffff?text=Optisio",
    banner_url: "https://placehold.co/1600x480/134e4a/ffffff?text=Optisio+Banner",
    short_tagline: "Solusi digital profesional untuk bisnis Indonesia",
    content:
      "<h2>Tentang Optisio</h2><p>Optisio Digital Solutions adalah perusahaan teknologi yang membantu UMKM dan enterprise membangun kehadiran digital yang kuat.</p><h3>Sejarah</h3><p>Didirikan dengan visi menjadi mitra transformasi digital terpercaya di Indonesia.</p><h3>Layanan</h3><ul><li>Pengembangan web &amp; mobile</li><li>Product design &amp; UX</li><li>Digital strategy consulting</li></ul><h3>Keunggulan</h3><p>Tim berpengalaman, proses transparan, dan fokus pada hasil bisnis yang terukur.</p>",
    address: "Jl. Sudirman No. 123, Senayan",
    city: "Jakarta Selatan",
    map_iframe_url:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sid!4v1700000000000",
    phone: "+622112345678",
    whatsapp: "+6281234567890",
    email: "hello@optisio.id",
    website_url: "https://optisio.id",
    instagram: "https://instagram.com/optisio",
    linkedin: "https://linkedin.com/company/optisio",
    facebook: "https://facebook.com/optisio",
    youtube: "https://youtube.com/@optisio",
    twitter: "https://twitter.com/optisio",
    tiktok: "https://tiktok.com/@optisio",
    verified_badge: true,
    is_featured: true,
    tier: "premium",
    view_count: 1280,
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
    banner_url: null,
    short_tagline: "Tim developer lokal untuk website & aplikasi UMKM",
    content:
      "<p>Nusantara Code Studio fokus membantu UMKM membangun website dan aplikasi sederhana dengan harga terjangkau.</p>",
    address: "Jl. Malioboro No. 45",
    city: "Yogyakarta",
    map_iframe_url: null,
    phone: "+622745551234",
    whatsapp: "+6285678901234",
    email: "halo@nusantaracode.id",
    website_url: "https://nusantaracode.id",
    instagram: "https://instagram.com/nusantaracode",
    linkedin: null,
    facebook: null,
    youtube: null,
    twitter: null,
    tiktok: null,
    verified_badge: false,
    is_featured: false,
    tier: "free",
    view_count: 87,
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

function mapBusinessRow(row: {
  id: string;
  title: string;
  slug: string;
  logo_url: string | null;
  banner_url: string | null;
  short_tagline: string | null;
  content: string | null;
  address: string | null;
  city: string | null;
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
  verified_badge: boolean;
  is_featured: boolean;
  tier: BusinessListing["tier"];
  view_count: number;
  subcategories:
    | {
        name: string;
        slug: string;
        categories:
          | { name: string; slug: string }
          | { name: string; slug: string }[]
          | null;
      }
    | {
        name: string;
        slug: string;
        categories:
          | { name: string; slug: string }
          | { name: string; slug: string }[]
          | null;
      }[]
    | null;
}): BusinessListing {
  const subcategory = unwrapOne(row.subcategories);
  const category = unwrapOne(subcategory?.categories);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    logo_url: row.logo_url,
    banner_url: row.banner_url,
    short_tagline: row.short_tagline,
    content: row.content,
    address: row.address,
    city: row.city,
    map_iframe_url: row.map_iframe_url,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    website_url: row.website_url,
    instagram: row.instagram,
    linkedin: row.linkedin,
    facebook: row.facebook,
    youtube: row.youtube,
    twitter: row.twitter,
    tiktok: row.tiktok,
    verified_badge: row.verified_badge,
    is_featured: row.is_featured,
    tier: row.tier,
    view_count: row.view_count,
    category_name: category?.name ?? null,
    category_slug: category?.slug ?? null,
    subcategory_name: subcategory?.name ?? null,
    subcategory_slug: subcategory?.slug ?? null,
  };
}

export async function getBusinessBySlug(
  slug: string,
): Promise<BusinessListing | null> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_BUSINESSES.find((b) => b.slug === slug) ?? null;
  }

  const supabase = createClient();
  if (!supabase) {
    return FALLBACK_BUSINESSES.find((b) => b.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      id,
      title,
      slug,
      logo_url,
      banner_url,
      short_tagline,
      content,
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
      verified_badge,
      is_featured,
      tier,
      view_count,
      subcategories (
        name,
        slug,
        categories ( name, slug )
      )
    `,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Failed to load business:", error.message);
    return FALLBACK_BUSINESSES.find((b) => b.slug === slug) ?? null;
  }

  if (!data) return null;

  return mapBusinessRow(data);
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
