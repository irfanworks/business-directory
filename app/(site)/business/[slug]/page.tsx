import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import BusinessContent from "@/components/business/BusinessContent";
import BusinessHero from "@/components/business/BusinessHero";
import BusinessInfoSidebar from "@/components/business/BusinessInfoSidebar";
import BusinessVerification from "@/components/business/BusinessVerification";
import BusinessWhatsAppBar from "@/components/business/BusinessWhatsAppBar";
import RelatedBusinesses from "@/components/business/RelatedBusinesses";
import ReportIncorrectInfo from "@/components/business/ReportIncorrectInfo";
import { getBusinessBySlug } from "@/lib/data/business";
import { getRelatedBusinesses } from "@/lib/data/directory";
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
    return { title: "Bisnis tidak ditemukan" };
  }

  const tagline = business.short_tagline?.trim();
  const description = tagline
    ? `${tagline} Cari tahu lebih dalam tentang ${business.title}.`
    : `Cari tahu lebih dalam tentang ${business.title}.`;

  const pageUrl = `${siteOrigin()}/business/${business.slug}`;
  const image = business.logo_url || undefined;
  // Root layout already applies `%s | {siteName}` — pass business name only.
  const title = business.title;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "profile",
      title,
      description,
      url: pageUrl,
      siteName: "Business Directory Indonesia",
      images: image
        ? [{ url: image, alt: `${business.title} cover` }]
        : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
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
  const related = await getRelatedBusinesses(
    business.category_slug,
    business.id,
    3,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        className={`container-site pt-28 pb-8 lg:pt-32 lg:pb-10 ${
          business.whatsapp
            ? "pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:pb-10"
            : ""
        }`}
      >
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-500">
            <li>
              <Link href="/" className="transition hover:text-ink-950">
                Home
              </Link>
            </li>
            {business.category_slug && business.category_name && (
              <>
                <li>
                  <ChevronRight className="h-3.5 w-3.5 text-ink-500/40" />
                </li>
                <li>
                  <Link
                    href={`/category/${business.category_slug}`}
                    className="transition hover:text-ink-950"
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
                    <ChevronRight className="h-3.5 w-3.5 text-ink-500/40" />
                  </li>
                  <li>
                    <Link
                      href={`/category/${business.category_slug}/${business.subcategory_slug}`}
                      className="transition hover:text-ink-950"
                    >
                      {business.subcategory_name}
                    </Link>
                  </li>
                </>
              )}
            <li>
              <ChevronRight className="h-3.5 w-3.5 text-ink-500/40" />
            </li>
            <li className="font-medium text-ink-950" aria-current="page">
              {business.title}
            </li>
          </ol>
        </nav>

        <BusinessHero business={business} shareUrl={pageUrl} />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <BusinessContent business={business} />
            <BusinessVerification business={business} />
            <ReportIncorrectInfo
              listingSlug={business.slug}
              listingTitle={business.title}
            />
          </div>
          <div className="lg:col-span-4">
            <BusinessInfoSidebar business={business} />
          </div>
        </div>

        <RelatedBusinesses
          listings={related}
          categorySlug={business.category_slug}
        />
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
