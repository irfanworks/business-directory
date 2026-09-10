import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import {
  BadgeCheck,
  ExternalLink,
  MessageCircle,
  Pin,
} from "lucide-react";
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

export default function BusinessHero({ business, shareUrl }: BusinessHeroProps) {
  const priority = isPriorityListing(business);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="relative h-44 w-full bg-slate-200 sm:h-56 lg:h-64">
        {business.banner_url ? (
          <SafeImage
            src={business.banner_url}
            alt={`Banner ${business.title}`}
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#134e4a_55%,#0d9488_100%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
      </div>

      <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.45)] sm:h-28 sm:w-28">
              {business.logo_url ? (
                <SafeImage
                  src={business.logo_url}
                  alt={`Logo ${business.title}`}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-2xl font-semibold text-slate-500">
                  {business.title.slice(0, 1)}
                </div>
              )}
            </div>

            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {business.title}
                </h1>
                {business.verified_badge && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-700 ring-1 ring-teal-200/80">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
                {priority && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200/80">
                    <Pin className="h-3 w-3" />
                    Featured
                  </span>
                )}
              </div>

              {business.short_tagline && (
                <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-slate-600">
                  {business.short_tagline}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {business.category_name && business.category_slug && (
                  <Link
                    href={`/category/${business.category_slug}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[12px] font-medium text-slate-600 transition hover:border-teal-300 hover:text-teal-800"
                  >
                    {business.category_name}
                  </Link>
                )}
                {business.subcategory_name &&
                  business.category_slug &&
                  business.subcategory_slug && (
                    <Link
                      href={`/category/${business.category_slug}/${business.subcategory_slug}`}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-600 transition hover:border-teal-300 hover:text-teal-800"
                    >
                      {business.subcategory_name}
                    </Link>
                  )}
                {business.tier === "premium" && (
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-800">
                    Premium
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {business.website_url && (
              <a
                href={business.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-950 px-4 text-[13px] font-medium text-white transition hover:bg-slate-800"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Visit Website
              </a>
            )}
            {business.whatsapp && (
              <a
                href={whatsappHref(business.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 text-[13px] font-medium text-emerald-800 transition hover:bg-emerald-100"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Contact WhatsApp
              </a>
            )}
            <ShareProfileButton title={business.title} url={shareUrl} />
          </div>
        </div>
      </div>
    </section>
  );
}
