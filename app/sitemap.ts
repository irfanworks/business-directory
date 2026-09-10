import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { getSiteUrl } from "@/lib/seo/site";

const FALLBACK_CATEGORIES = [{ slug: "teknologi-it", updated_at: new Date() }];
const FALLBACK_SUBCATEGORIES = [
  {
    slug: "software-development",
    category_slug: "teknologi-it",
    updated_at: new Date(),
  },
  {
    slug: "it-consulting",
    category_slug: "teknologi-it",
    updated_at: new Date(),
  },
];
const FALLBACK_BUSINESSES = [
  { slug: "optisio-digital-solutions", updated_at: new Date() },
  { slug: "nusantara-code-studio", updated_at: new Date() },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/category/teknologi-it`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const supabase = createPublicClient();

  let categories = FALLBACK_CATEGORIES;
  let subcategories = FALLBACK_SUBCATEGORIES;
  let businesses = FALLBACK_BUSINESSES;

  if (supabase) {
    const [categoriesRes, subcategoriesRes, businessesRes] = await Promise.all([
      supabase
        .from("categories")
        .select("slug, updated_at")
        .order("name", { ascending: true }),
      supabase.from("subcategories").select(
        `
          slug,
          updated_at,
          categories ( slug )
        `,
      ),
      supabase
        .from("listings")
        .select("slug, updated_at")
        .eq("status", "published")
        .order("updated_at", { ascending: false }),
    ]);

    if (categoriesRes.data?.length) {
      categories = categoriesRes.data.map((row) => ({
        slug: row.slug,
        updated_at: row.updated_at ? new Date(row.updated_at) : now,
      }));
    }

    if (subcategoriesRes.data?.length) {
      subcategories = subcategoriesRes.data
        .map((row) => {
          const category = Array.isArray(row.categories)
            ? row.categories[0]
            : row.categories;
          if (!category?.slug) return null;
          return {
            slug: row.slug,
            category_slug: category.slug as string,
            updated_at: row.updated_at ? new Date(row.updated_at) : now,
          };
        })
        .filter(Boolean) as typeof FALLBACK_SUBCATEGORIES;
    }

    if (businessesRes.data?.length) {
      businesses = businessesRes.data.map((row) => ({
        slug: row.slug,
        updated_at: row.updated_at ? new Date(row.updated_at) : now,
      }));
    }
  }

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${base}/category/${category.slug}`,
    lastModified: category.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const subcategoryRoutes: MetadataRoute.Sitemap = subcategories.map(
    (sub) => ({
      url: `${base}/category/${sub.category_slug}/${sub.slug}`,
      lastModified: sub.updated_at,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  const businessRoutes: MetadataRoute.Sitemap = businesses.map((business) => ({
    url: `${base}/business/${business.slug}`,
    lastModified: business.updated_at,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Dedupe homepage category already listed in staticRoutes
  const seen = new Set<string>();
  const merged = [
    ...staticRoutes,
    ...categoryRoutes,
    ...subcategoryRoutes,
    ...businessRoutes,
  ].filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });

  return merged;
}
