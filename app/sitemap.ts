import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/seo/sitemap-entries";

/**
 * Served at /sitemap.xml (e.g. https://directory.optisio.com/sitemap.xml).
 * Regenerates on a short ISR interval and immediately when admin
 * create/update/delete revalidates the path.
 */
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries();
}
