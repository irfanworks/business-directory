"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import BusinessLogo from "@/components/ui/BusinessLogo";
import type { FeaturedListing } from "@/lib/types";
import { isPriorityListing } from "@/lib/types";

type ListingCardProps = {
  listing: FeaturedListing;
};

function whatsappHref(whatsapp: string) {
  return `https://wa.me/${whatsapp.replace(/\D/g, "")}`;
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

export default function ListingCard({ listing }: ListingCardProps) {
  const profileHref = `/business/${listing.slug}`;
  const priority = isPriorityListing(listing);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <BusinessLogo
          name={listing.title}
          logoUrl={listing.logo_url}
          size="lg"
          className="rounded-2xl border border-slate-100 shadow-sm"
        />

        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {listing.verified_badge ? <VerifiedBadge /> : null}
          {priority ? (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              Featured
            </span>
          ) : null}
        </div>
      </div>

      <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-gray-900">
        <Link
          href={profileHref}
          className="transition-colors hover:text-gray-700"
        >
          {listing.title}
        </Link>
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {listing.category_name ? (
          <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-medium text-rose-700">
            {listing.category_name}
          </span>
        ) : null}
        {typeof listing.view_count === "number" && listing.view_count > 0 ? (
          <span className="text-[12px] text-gray-500">
            {listing.view_count.toLocaleString("id-ID")} dilihat
          </span>
        ) : null}
      </div>

      {listing.city ? (
        <p className="mt-3 inline-flex items-center gap-1 text-[13px] text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {listing.city}, Indonesia
        </p>
      ) : null}

      {listing.short_tagline ? (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-700">
          {listing.short_tagline}
        </p>
      ) : null}

      <div className="mt-auto flex gap-2 pt-5">
        {listing.whatsapp ? (
          <a
            href={whatsappHref(listing.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-[13px] font-semibold text-white transition hover:bg-[#1ebe57]"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Chat WhatsApp
          </a>
        ) : (
          <Link
            href={profileHref}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-gray-900 text-[13px] font-semibold text-white transition hover:bg-gray-800"
          >
            Lihat profil
          </Link>
        )}
        <Link
          href={profileHref}
          aria-label={`Buka profil ${listing.title}`}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-gray-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-gray-900"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div className="h-14 w-14 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-5 w-20 animate-pulse rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-slate-100" />
      <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-slate-50" />
      <div className="mt-6 h-11 animate-pulse rounded-xl bg-slate-50" />
    </div>
  );
}
