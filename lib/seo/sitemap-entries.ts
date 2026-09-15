import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { getSiteUrl } from "@/lib/seo/site";

const PAGE_SIZE = 1000;

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

type SlugRow = { slug: string; updated_at: Date };
type SubcategoryRow = SlugRow & { category_slug: string };

async function fetchAllRows<T>(
  fetchPage: (from: number, to: number) => Promise<T[] | null>,
): Promise<T[]> {
  const rows: T[] = [];
  let from = 0;

  for (;;) {
    const page = await fetchPage(from, from + PAGE_SIZE - 1);
    if (!page?.length) break;
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

function toDate(value: string | null | undefined, fallback: Date) {
  return value ? new Date(value) : fallback;
}

/** All public indexable URLs for /sitemap.xml — regenerated from live DB. */
export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
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
      url: `${base}/cari`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${base}/submit`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/kontak`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const supabase = createPublicClient();

  let categories: SlugRow[] = FALLBACK_CATEGORIES;
  let subcategories: SubcategoryRow[] = FALLBACK_SUBCATEGORIES;
  let businesses: SlugRow[] = FALLBACK_BUSINESSES;

  if (supabase) {
    const [categoryRows, subcategoryRows, businessRows] = await Promise.all([
      fetchAllRows(async (from, to) => {
        const { data } = await supabase
          .from("categories")
          .select("slug, updated_at")
          .order("name", { ascending: true })
          .range(from, to);
        return data;
      }),
      fetchAllRows(async (from, to) => {
        const { data } = await supabase
          .from("subcategories")
          .select(
            `
              slug,
              updated_at,
              categories ( slug )
            `,
          )
          .order("name", { ascending: true })
          .range(from, to);
        return data;
      }),
      fetchAllRows(async (from, to) => {
        const { data } = await supabase
          .from("listings")
          .select("slug, updated_at")
          .eq("status", "published")
          .order("updated_at", { ascending: false })
          .range(from, to);
        return data;
      }),
    ]);

    if (categoryRows.length) {
      categories = categoryRows.map((row) => ({
        slug: row.slug,
        updated_at: toDate(row.updated_at, now),
      }));
    }

    if (subcategoryRows.length) {
      subcategories = subcategoryRows
        .map((row) => {
          const category = Array.isArray(row.categories)
            ? row.categories[0]
            : row.categories;
          if (!category?.slug) return null;
          return {
            slug: row.slug,
            category_slug: category.slug as string,
            updated_at: toDate(row.updated_at, now),
          };
        })
        .filter(Boolean) as SubcategoryRow[];
    }

    if (businessRows.length) {
      businesses = businessRows.map((row) => ({
        slug: row.slug,
        updated_at: toDate(row.updated_at, now),
      }));
    }
  }

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${base}/category/${category.slug}`,
    lastModified: category.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const subcategoryRoutes: MetadataRoute.Sitemap = subcategories.map((sub) => ({
    url: `${base}/category/${sub.category_slug}/${sub.slug}`,
    lastModified: sub.updated_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const businessRoutes: MetadataRoute.Sitemap = businesses.map((business) => ({
    url: `${base}/business/${business.slug}`,
    lastModified: business.updated_at,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const seen = new Set<string>();
  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...subcategoryRoutes,
    ...businessRoutes,
  ].filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
