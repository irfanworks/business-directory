import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { socialIcons } from "@/components/business/SocialIcons";
import { getBusinessMapDisplay } from "@/lib/maps";
import type { BusinessListing } from "@/lib/types";

type BusinessInfoSidebarProps = {
  business: BusinessListing;
};

export default function BusinessInfoSidebar({
  business,
}: BusinessInfoSidebarProps) {
  const socials = [
    { key: "instagram" as const, href: business.instagram, label: "Instagram" },
    { key: "linkedin" as const, href: business.linkedin, label: "LinkedIn" },
    { key: "facebook" as const, href: business.facebook, label: "Facebook" },
    { key: "youtube" as const, href: business.youtube, label: "YouTube" },
    { key: "twitter" as const, href: business.twitter, label: "Twitter / X" },
    { key: "tiktok" as const, href: business.tiktok, label: "TikTok" },
  ].filter((s) => Boolean(s.href));

  const { embedUrl, openUrl } = getBusinessMapDisplay({
    maps_url: business.maps_url,
    map_iframe_url: business.map_iframe_url,
    address: business.address,
    city: business.city,
  });

  const hasAddress = Boolean(business.address || business.city);
  const hasContact = Boolean(
    business.phone || business.whatsapp || business.email,
  );
  const hasMap = Boolean(embedUrl);
  const hasOpenMaps = Boolean(openUrl);
  const hasSocials = socials.length > 0;

  if (!hasAddress && !hasContact && !hasMap && !hasOpenMaps && !hasSocials) {
    return null;
  }

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-card border border-border bg-white p-5 shadow-card">
        <h2 className="text-small uppercase tracking-[0.12em] text-ink-500">
          Informasi bisnis
        </h2>

        {hasAddress && (
          <div className="mt-4">
            <p className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-500">
              <MapPin className="h-3.5 w-3.5" />
              Lokasi
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-900">
              {[business.address, business.city].filter(Boolean).join(", ")}
            </p>
          </div>
        )}

        {hasMap && embedUrl && (
          <div className="mt-4 overflow-hidden rounded-btn border border-border">
            <iframe
              src={embedUrl}
              title={`Peta ${business.title}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-48 w-full border-0"
              allowFullScreen
            />
          </div>
        )}

        {hasOpenMaps && openUrl && (
          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-[12px] font-medium text-accent transition hover:text-accent/80 ${
              hasMap ? "mt-2" : "mt-4"
            }`}
          >
            Buka di Google Maps
            <ExternalLink className="h-3 w-3" />
          </a>
        )}

        {hasContact && (
          <div
            className={
              hasAddress || hasMap || hasOpenMaps
                ? "mt-5 border-t border-border pt-5"
                : "mt-4"
            }
          >
            <p className="text-[12px] font-medium text-ink-500">Kontak</p>
            <ul className="mt-2.5 space-y-2.5">
              {business.phone && (
                <li>
                  <a
                    href={`tel:${business.phone}`}
                    className="inline-flex items-center gap-2 text-[13px] text-ink-700 transition hover:text-accent"
                  >
                    <Phone className="h-3.5 w-3.5 text-ink-500" />
                    {business.phone}
                  </a>
                </li>
              )}
              {business.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[13px] text-ink-700 transition hover:text-accent"
                  >
                    <Phone className="h-3.5 w-3.5 text-accent" />
                    WhatsApp {business.whatsapp}
                  </a>
                </li>
              )}
              {business.email && (
                <li>
                  <a
                    href={`mailto:${business.email}`}
                    className="inline-flex items-center gap-2 text-[13px] text-ink-700 transition hover:text-accent"
                  >
                    <Mail className="h-3.5 w-3.5 text-ink-500" />
                    {business.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}

        {hasSocials && (
          <div
            className={
              hasAddress || hasMap || hasOpenMaps || hasContact
                ? "mt-5 border-t border-border pt-5"
                : "mt-4"
            }
          >
            <p className="text-[12px] font-medium text-ink-500">
              Media sosial
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {socials.map(({ key, href, label }) => {
                const Icon = socialIcons[key];
                return (
                  <li key={key}>
                    <a
                      href={href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-btn border border-border bg-surface-soft text-ink-700 transition duration-150 hover:border-border-strong hover:text-ink-950"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
