import VerifiedBadge from "@/components/ui/VerifiedBadge";
import BusinessLogo from "@/components/ui/BusinessLogo";
import Link from "next/link";
import { Globe, MapPin, MessageCircle } from "lucide-react";
import ShareProfileButton from "@/components/business/ShareProfileButton";
import type { BusinessListing } from "@/lib/types";
import { isPriorityListing } from "@/lib/types";

type BusinessHeroProps = {
  business: BusinessListing;
  shareUrl: string;
};

function whatsappHref(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function formatWebsiteLabel(url: string) {
  try {
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const parsed = new URL(normalized);
    const host = parsed.hostname.replace(/^www\./, "");
    const path =
      parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
    return `${host}${path}`;
  } catch {
    return url.replace(/^https?:\/\//i, "").replace(/^www\./, "");
  }
}

function websiteHref(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

const btnBase =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-[12px] font-semibold transition";

export default function BusinessHero({ business, shareUrl }: BusinessHeroProps) {
  const priority = isPriorityListing(business);
  const hasWhatsApp = Boolean(business.whatsapp);
  const contactHref = business.whatsapp
    ? whatsappHref(business.whatsapp)
    : business.email
      ? `mailto:${business.email}`
      : business.phone
        ? `tel:${business.phone}`
        : null;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-red-100/80 bg-white shadow-[0_8px_40px_rgba(127,29,29,0.08)]">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-700 via-amber-500 to-red-600"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-red-50 via-amber-50/80 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-rose-50/90"
      />

      <div className="relative px-5 py-7 sm:px-8 sm:py-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <BusinessLogo
              name={business.title}
              logoUrl={business.logo_url}
              size="xl"
              priority
              className="rounded-2xl border border-red-100 shadow-[0_8px_24px_rgba(127,29,29,0.12)]"
            />

            <div className="min-w-0">
              <div className="mb-2.5 flex flex-wrap items-center gap-2">
                {business.verified_badge ? <VerifiedBadge size="md" /> : null}
                {priority ? (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800">
                    Featured
                  </span>
                ) : null}
              </div>

              <h1 className="font-display text-3xl font-bold tracking-tight text-red-950 sm:text-[2.15rem]">
                {business.title}
              </h1>

              {business.short_tagline ? (
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-red-900/65">
                  {business.short_tagline}
                </p>
              ) : null}

              {business.website_url ? (
                <a
                  href={websiteHref(business.website_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 text-[13px] font-semibold text-amber-900 shadow-[0_0_0_1px_rgba(251,191,36,0.15)] transition hover:border-amber-300 hover:from-amber-100 hover:to-orange-50 hover:text-red-950"
                >
                  <Globe
                    className="h-3.5 w-3.5 shrink-0 text-amber-600"
                    aria-hidden
                  />
                  <span className="truncate">
                    {formatWebsiteLabel(business.website_url)}
                  </span>
                </a>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-red-900/60">
                {business.category_name && business.category_slug ? (
                  <Link
                    href={`/category/${business.category_slug}`}
                    className="rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-800 transition hover:bg-red-100 hover:text-red-950"
                  >
                    {business.category_name}
                    {business.subcategory_name
                      ? ` · ${business.subcategory_name}`
                      : ""}
                  </Link>
                ) : null}
                {business.city ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {business.city}, Indonesia
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            {contactHref ? (
              <a
                href={contactHref}
                target={hasWhatsApp ? "_blank" : undefined}
                rel={hasWhatsApp ? "noopener noreferrer" : undefined}
                className={`${btnBase} bg-gradient-to-r from-amber-500 to-amber-600 text-red-950 hover:from-amber-400 hover:to-amber-500 hover:shadow-[0_0_16px_rgba(251,191,36,0.3)]`}
              >
                {hasWhatsApp ? (
                  <WhatsAppIcon className="h-3.5 w-3.5 text-[#128C7E]" />
                ) : (
                  <MessageCircle className="h-3.5 w-3.5" />
                )}
                Hubungi bisnis
              </a>
            ) : null}
            <ShareProfileButton
              title={business.title}
              url={shareUrl}
              compact
            />
          </div>
        </div>
      </div>
    </section>
  );
}
