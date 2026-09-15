"use server";

import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { nullIfEmpty, slugify } from "@/lib/admin/listings";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

function requireSupabase() {
  if (!isSupabaseConfigured()) {
    return {
      ok: false as const,
      error: "Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.",
    };
  }
  const supabase = createClient();
  if (!supabase) {
    return { ok: false as const, error: "Gagal membuat Supabase client." };
  }
  return { ok: true as const, supabase };
}

function revalidateTaxonomy() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/listings");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/cari");
  revalidatePath("/category", "layout");
}

export async function createCategory(input: {
  name: string;
  slug?: string;
  description?: string;
  icon_name?: string;
}): Promise<ActionResult> {
  const client = requireSupabase();
  if (!client.ok) return client;

  const name = input.name.trim();
  const slug = (input.slug?.trim() || slugify(name)).trim();
  if (!name) return { ok: false, error: "Nama kategori wajib diisi." };
  if (!slug) return { ok: false, error: "Slug kategori wajib diisi." };

  const { data, error } = await client.supabase
    .from("categories")
    .insert({
      name,
      slug,
      description: nullIfEmpty(input.description || ""),
      icon_name: nullIfEmpty(input.icon_name || ""),
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message || "Gagal membuat kategori." };
  }

  revalidateTaxonomy();
  return { ok: true, id: data.id };
}

export async function updateCategory(input: {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  icon_name?: string;
}): Promise<ActionResult> {
  const client = requireSupabase();
  if (!client.ok) return client;

  const name = input.name.trim();
  const slug = (input.slug?.trim() || slugify(name)).trim();
  if (!name) return { ok: false, error: "Nama kategori wajib diisi." };
  if (!slug) return { ok: false, error: "Slug kategori wajib diisi." };

  const { error } = await client.supabase
    .from("categories")
    .update({
      name,
      slug,
      description: nullIfEmpty(input.description || ""),
      icon_name: nullIfEmpty(input.icon_name || ""),
    })
    .eq("id", input.id);

  if (error) return { ok: false, error: error.message };

  revalidateTaxonomy();
  return { ok: true, id: input.id };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const client = requireSupabase();
  if (!client.ok) return client;

  const { error } = await client.supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      ok: false,
      error:
        error.message.includes("foreign key") || error.code === "23503"
          ? "Kategori tidak bisa dihapus karena masih dipakai listing/subkategori."
          : error.message,
    };
  }

  revalidateTaxonomy();
  return { ok: true };
}

export async function createSubcategory(input: {
  category_id: string;
  name: string;
  slug?: string;
  description?: string;
}): Promise<ActionResult> {
  const client = requireSupabase();
  if (!client.ok) return client;

  const name = input.name.trim();
  const slug = (input.slug?.trim() || slugify(name)).trim();
  if (!input.category_id) {
    return { ok: false, error: "Kategori induk wajib dipilih." };
  }
  if (!name) return { ok: false, error: "Nama subkategori wajib diisi." };
  if (!slug) return { ok: false, error: "Slug subkategori wajib diisi." };

  const { data, error } = await client.supabase
    .from("subcategories")
    .insert({
      category_id: input.category_id,
      name,
      slug,
      description: nullIfEmpty(input.description || ""),
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message || "Gagal membuat subkategori." };
  }

  revalidateTaxonomy();
  return { ok: true, id: data.id };
}

export async function updateSubcategory(input: {
  id: string;
  name: string;
  slug?: string;
  description?: string;
}): Promise<ActionResult> {
  const client = requireSupabase();
  if (!client.ok) return client;

  const name = input.name.trim();
  const slug = (input.slug?.trim() || slugify(name)).trim();
  if (!name) return { ok: false, error: "Nama subkategori wajib diisi." };
  if (!slug) return { ok: false, error: "Slug subkategori wajib diisi." };

  const { error } = await client.supabase
    .from("subcategories")
    .update({
      name,
      slug,
      description: nullIfEmpty(input.description || ""),
    })
    .eq("id", input.id);

  if (error) return { ok: false, error: error.message };

  revalidateTaxonomy();
  return { ok: true, id: input.id };
}

export async function deleteSubcategory(id: string): Promise<ActionResult> {
  const client = requireSupabase();
  if (!client.ok) return client;

  const { error } = await client.supabase
    .from("subcategories")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      ok: false,
      error:
        error.message.includes("foreign key") || error.code === "23503"
          ? "Subkategori tidak bisa dihapus karena masih dipakai listing."
          : error.message,
    };
  }

  revalidateTaxonomy();
  return { ok: true };
}
