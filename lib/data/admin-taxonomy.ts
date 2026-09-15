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

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      name,
      slug,
      description,
      icon_name,
      subcategories ( id, name, slug, description )
    `,
    )
    .order("name", { ascending: true });

  if (error || !data) {
    console.error("Admin categories tree failed:", error?.message);
    return FALLBACK_CATEGORIES;
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon_name: row.icon_name,
    subcategories: (row.subcategories ?? [])
      .map(
        (sub: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
        }) => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
        }),
      )
      .sort((a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name, "id"),
      ),
  }));
}
