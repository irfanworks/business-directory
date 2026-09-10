import type { BusinessListing } from "@/lib/types";
import { stripHtml } from "@/lib/data/business";

export function buildLocalBusinessJsonLd(
  business: BusinessListing,
  pageUrl: string,
) {
  const sameAs = [
    business.instagram,
    business.linkedin,
    business.facebook,
    business.youtube,
    business.twitter,
    business.tiktok,
    business.website_url,
  ].filter(Boolean) as string[];

  const description =
    business.short_tagline ||
    stripHtml(business.content).slice(0, 160) ||
    `${business.title} on Business Directory Indonesia`;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": pageUrl,
    name: business.title,
    description,
    url: pageUrl,
    image: business.logo_url || business.banner_url || undefined,
    telephone: business.phone || business.whatsapp || undefined,
    email: business.email || undefined,
    address: business.address
      ? {
          "@type": "PostalAddress",
          streetAddress: business.address,
          addressLocality: business.city || undefined,
          addressCountry: "ID",
        }
      : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };
}
