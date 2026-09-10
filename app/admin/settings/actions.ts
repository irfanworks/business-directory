"use server";

import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  SETTINGS_FIELDS,
  type SettingsMap,
} from "@/lib/admin/settings";

export type SettingsActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function saveSiteSettings(
  values: SettingsMap,
): Promise<SettingsActionResult> {
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

  const rows = SETTINGS_FIELDS.map((field) => ({
    key: field.key,
    value: (values[field.key] ?? "").trim(),
  }));

  if (!rows.find((r) => r.key === "site_name")?.value) {
    return { ok: false, error: "Site Name wajib diisi." };
  }

  const { error } = await supabase.from("site_settings").upsert(rows, {
    onConflict: "key",
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { ok: true };
}
