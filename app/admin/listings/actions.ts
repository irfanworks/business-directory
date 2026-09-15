"use server";

import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  nullIfEmpty,
  slugify,
  type ListingFormValues,
  type ListingStatus,
  type ListingTier,
} from "@/lib/admin/listings";
import { resolveListingMaps } from "@/lib/maps";

export type ListingActionResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; error: string };

type ParsedListingPayload =
  | { ok: false; error: string }
  | { ok: true; data: Record<string, unknown>; slug: string };

async function parsePayload(
  raw: ListingFormValues,
): Promise<ParsedListingPayload> {
  const title = raw.title.trim();
  const slug = (raw.slug.trim() || slugify(title)).trim();
  const subcategoryId = raw.subcategory_id.trim();

  if (!title) return { ok: false, error: "Nama bisnis wajib diisi." };
  if (!slug) return { ok: false, error: "Slug wajib diisi." };
  if (!subcategoryId) {
    return { ok: false, error: "Subkategori wajib dipilih." };
  }

  const status = raw.status as ListingStatus;
  const tier = raw.tier as ListingTier;

  const maps = await resolveListingMaps({
    mapsUrl: raw.maps_url,
    address: raw.address,
    city: raw.city,
  });

  return {
    ok: true,
    slug,
    data: {
      title,
      slug,
      short_tagline: nullIfEmpty(raw.short_tagline),
      content: nullIfEmpty(raw.content),
      logo_url: nullIfEmpty(raw.logo_url),
      subcategory_id: subcategoryId,
      status,
      tier,
      is_featured: Boolean(raw.is_featured),
      verified_badge: Boolean(raw.verified_badge),
      address: nullIfEmpty(raw.address),
      city: nullIfEmpty(raw.city),
      maps_url: maps.maps_url,
      map_iframe_url: maps.map_iframe_url,
      phone: nullIfEmpty(raw.phone),
      whatsapp: nullIfEmpty(raw.whatsapp),
      email: nullIfEmpty(raw.email),
      website_url: nullIfEmpty(raw.website_url),
      instagram: nullIfEmpty(raw.instagram),
      linkedin: nullIfEmpty(raw.linkedin),
      facebook: nullIfEmpty(raw.facebook),
      youtube: nullIfEmpty(raw.youtube),
      twitter: nullIfEmpty(raw.twitter),
      tiktok: nullIfEmpty(raw.tiktok),
    },
  };
}

function revalidateListingPaths(slug?: string) {
  revalidatePath("/admin/listings");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/cari");
  if (slug) revalidatePath(`/business/${slug}`);
}

export async function createListing(
  values: ListingFormValues,
): Promise<ListingActionResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.",
    };
  }

  const supabase = createClient();
  if (!supabase) {
    return { ok: false, error: "Gagal membuat Supabase client." };
  }

  const parsed = await parsePayload(values);
  if (!parsed.ok) return parsed;

  const { data, error } = await supabase
    .from("listings")
    .insert(parsed.data)
    .select("id, slug")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message || "Gagal menyimpan listing." };
  }

  revalidateListingPaths(data.slug);
  return { ok: true, id: data.id, slug: data.slug };
}

export async function updateListing(
  id: string,
  values: ListingFormValues,
): Promise<ListingActionResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.",
    };
  }

  const supabase = createClient();
  if (!supabase) {
    return { ok: false, error: "Gagal membuat Supabase client." };
  }

  const parsed = await parsePayload(values);
  if (!parsed.ok) return parsed;

  const { data, error } = await supabase
    .from("listings")
    .update(parsed.data)
    .eq("id", id)
    .select("id, slug")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message || "Gagal memperbarui listing." };
  }

  revalidateListingPaths(data.slug);
  return { ok: true, id: data.id, slug: data.slug };
}

export async function deleteListing(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.",
    };
  }

  const supabase = createClient();
  if (!supabase) {
    return { ok: false, error: "Gagal membuat Supabase client." };
  }

  const { data: existing } = await supabase
    .from("listings")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (error) {
    return { ok: false, error: error.message };
  }

  revalidateListingPaths(existing?.slug);
  return { ok: true };
}
