import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import BusinessContent from "@/components/business/BusinessContent";
import BusinessHero from "@/components/business/BusinessHero";
import BusinessInfoSidebar from "@/components/business/BusinessInfoSidebar";
import BusinessWhatsAppBar from "@/components/business/BusinessWhatsAppBar";
import { getBusinessBySlug, stripHtml } from "@/lib/data/business";
import { buildLocalBusinessJsonLd } from "@/lib/seo/business";

type PageProps = {
  params: { slug: string };
};

function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const business = await getBusinessBySlug(params.slug);
  if (!business) {
    return { title: "Business not found" };
  }

  const description =
    business.short_tagline ||
    stripHtml(business.content).slice(0, 160) ||
    `${business.title} on Business Directory Indonesia by Optisio`;

  const pageUrl = `${siteOrigin()}/business/${business.slug}`;
  const image = business.banner_url || business.logo_url || undefined;

  return {
    title: `${business.title} | Business Directory Indonesia`,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "profile",
      title: business.title,
      description,
      url: pageUrl,
      siteName: "Business Directory Indonesia",
      images: image
        ? [{ url: image, alt: `${business.title} cover` }]
        : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: business.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BusinessDetailPage({ params }: PageProps) {
  const business = await getBusinessBySlug(params.slug);
  if (!business) notFound();

  const pageUrl = `${siteOrigin()}/business/${business.slug}`;
  const jsonLd = buildLocalBusinessJsonLd(business, pageUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        className={`mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10 ${
          business.whatsapp
            ? "pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:pb-8"
            : ""
        }`}
      >
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-slate-500">
            <li>
              <Link href="/" className="transition hover:text-slate-900">
                Home
              </Link>
            </li>
            {business.category_slug && business.category_name && (
              <>
                <li>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                </li>
                <li>
                  <Link
                    href={`/category/${business.category_slug}`}
                    className="transition hover:text-slate-900"
                  >
                    {business.category_name}
                  </Link>
                </li>
              </>
            )}
            {business.subcategory_slug &&
              business.category_slug &&
              business.subcategory_name && (
                <>
                  <li>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                  </li>
                  <li>
                    <Link
                      href={`/category/${business.category_slug}/${business.subcategory_slug}`}
                      className="transition hover:text-slate-900"
                    >
                      {business.subcategory_name}
                    </Link>
                  </li>
                </>
              )}
            <li>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            </li>
            <li className="font-medium text-slate-900" aria-current="page">
              {business.title}
            </li>
          </ol>
        </nav>

        <BusinessHero business={business} shareUrl={pageUrl} />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <BusinessContent business={business} />
          </div>
          <div className="lg:col-span-4">
            <BusinessInfoSidebar business={business} />
          </div>
        </div>
      </div>

      {business.whatsapp && (
        <BusinessWhatsAppBar
          businessName={business.title}
          whatsapp={business.whatsapp}
        />
      )}
    </>
  );
}
