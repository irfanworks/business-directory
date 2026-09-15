import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  DEFAULT_SETTINGS,
  SETTINGS_FIELDS,
  type SettingsMap,
} from "@/lib/admin/settings";

const SETTINGS_KEYS = new Set(SETTINGS_FIELDS.map((f) => f.key));

export async function getSiteSettings(): Promise<SettingsMap> {
  const merged: SettingsMap = { ...DEFAULT_SETTINGS };

  if (!isSupabaseConfigured()) return merged;

  const supabase = createClient();
  if (!supabase) return merged;

  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");

  if (error || !data) {
    console.error("Site settings fetch failed:", error?.message);
    return merged;
  }

  for (const row of data) {
    if (SETTINGS_KEYS.has(row.key)) {
      merged[row.key] = row.value ?? "";
    }
  }

  return merged;
}

/** @deprecated Use getSiteSettings — same data source for admin & public */
export async function getAdminSiteSettings(): Promise<SettingsMap> {
  return getSiteSettings();
}
