import { Mail, MapPin, Phone } from "lucide-react";
import { socialIcons } from "@/components/business/SocialIcons";
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

  const hasAddress = Boolean(business.address || business.city);
  const hasContact = Boolean(
    business.phone || business.whatsapp || business.email,
  );
  const hasMap = Boolean(business.map_iframe_url);
  const hasSocials = socials.length > 0;

  if (!hasAddress && !hasContact && !hasMap && !hasSocials) {
    return null;
  }

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Business Info
        </h2>

        {hasAddress && (
          <div className="mt-4">
            <p className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              Address
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-800">
              {[business.address, business.city].filter(Boolean).join(", ")}
            </p>
          </div>
        )}

        {hasMap && business.map_iframe_url && (
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <iframe
              src={business.map_iframe_url}
              title={`Map of ${business.title}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-48 w-full border-0"
              allowFullScreen
            />
          </div>
        )}

        {hasContact && (
          <div
            className={
              hasAddress || hasMap
                ? "mt-5 border-t border-slate-100 pt-5"
                : "mt-4"
            }
          >
            <p className="text-[12px] font-medium text-slate-500">Contact</p>
            <ul className="mt-2.5 space-y-2.5">
              {business.phone && (
                <li>
                  <a
                    href={`tel:${business.phone}`}
                    className="inline-flex items-center gap-2 text-[13px] text-slate-700 transition hover:text-teal-700"
                  >
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
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
                    className="inline-flex items-center gap-2 text-[13px] text-slate-700 transition hover:text-teal-700"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-500" />
                    WhatsApp {business.whatsapp}
                  </a>
                </li>
              )}
              {business.email && (
                <li>
                  <a
                    href={`mailto:${business.email}`}
                    className="inline-flex items-center gap-2 text-[13px] text-slate-700 transition hover:text-teal-700"
                  >
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
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
              hasAddress || hasMap || hasContact
                ? "mt-5 border-t border-slate-100 pt-5"
                : "mt-4"
            }
          >
            <p className="text-[12px] font-medium text-slate-500">
              Social media
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
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
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
