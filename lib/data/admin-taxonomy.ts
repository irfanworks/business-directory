import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_name: string | null;
  subcategories: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  }[];
};

const FALLBACK_CATEGORIES: AdminCategory[] = [
  {
    id: "a1000000-0000-4000-8000-000000000001",
    name: "Teknologi & IT",
    slug: "teknologi-it",
    description:
      "Perusahaan dan layanan di bidang teknologi informasi, software, dan digital.",
    icon_name: "cpu",
    subcategories: [
      {
        id: "b1000000-0000-4000-8000-000000000001",
        name: "Software Development",
        slug: "software-development",
        description: "Pengembangan aplikasi web, mobile, dan enterprise software.",
      },
      {
        id: "b1000000-0000-4000-8000-000000000002",
        name: "IT Consulting",
        slug: "it-consulting",
        description: "Konsultan IT, transformasi digital, dan solusi infrastruktur.",
      },
    ],
  },
];

export async function getAdminCategoriesTree(): Promise<AdminCategory[]> {
  if (!isSupabaseConfigured()) return FALLBACK_CATEGORIES;

  const supabase = createClient();
  if (!supabase) return FALLBACK_CATEGORIES;

  const PAGE_SIZE = 1000;

  const [catRes, subRes] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, description, icon_name")
      .order("name", { ascending: true }),
    supabase
      .from("subcategories")
      .select("id, category_id, name, slug, description")
      .order("name", { ascending: true })
      .range(0, PAGE_SIZE - 1),
  ]);

  if (catRes.error || !catRes.data) {
    console.error("Admin categories tree failed:", catRes.error?.message);
    return FALLBACK_CATEGORIES;
  }

  if (subRes.error) {
    console.error("Admin subcategories tree failed:", subRes.error.message);
  }

  const byCategory = new Map<
    string,
    AdminCategory["subcategories"]
  >();
  for (const sub of subRes.data ?? []) {
    const key = String(sub.category_id);
    const list = byCategory.get(key) ?? [];
    list.push({
      id: String(sub.id),
      name: sub.name,
      slug: sub.slug,
      description: sub.description,
    });
    byCategory.set(key, list);
  }

  return catRes.data.map((row) => ({
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon_name: row.icon_name,
    subcategories: (byCategory.get(String(row.id)) ?? []).sort((a, b) =>
      a.name.localeCompare(b.name, "id"),
    ),
  }));
}
