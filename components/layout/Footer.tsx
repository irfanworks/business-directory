import Link from "next/link";
import { Mail } from "lucide-react";
import OptisioLogo from "@/components/brand/OptisioLogo";
import { getSiteSettings } from "@/lib/data/site-settings";

const TOP_CATEGORIES = [
  { href: "/category/teknologi-it", label: "Teknologi & IT" },
  { href: "/category/finansial", label: "Finansial" },
  { href: "/category/kesehatan", label: "Kesehatan" },
  { href: "/category/pendidikan", label: "Pendidikan" },
  { href: "/category/retail", label: "Retail & E-commerce" },
] as const;

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/submit", label: "Submit" },
  { href: "https://optisio.id/blog/", label: "Blog", external: true },
  { href: "/kontak", label: "Kontak" },
] as const;

const footerLabelClass =
  "text-[12px] font-semibold uppercase tracking-[0.12em] text-white/40";

export default async function Footer() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();
  const contactEmail = settings.contact_email || "support@optisio.id";
  const footerText =
    settings.footer_text ||
    `© ${year} ${settings.site_name} ${settings.site_tagline}`.trim();

  return (
    <footer className="relative mt-auto overflow-hidden bg-ink-950 pb-[calc(5.25rem+env(safe-area-inset-bottom))] text-white/70 md:pb-0">
      <div className="container-site relative pb-10 pt-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <OptisioLogo height={28} variant="onDark" />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/50">
              {settings.site_tagline
                ? `${settings.site_name} ${settings.site_tagline}.`
                : settings.site_name}
            </p>
          </div>

          <div>
            <p className={footerLabelClass}>Kategori</p>
            <ul className="mt-4 space-y-2.5">
              {TOP_CATEGORIES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[13px] text-white/55 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={footerLabelClass}>Navigasi</p>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  {"external" in item && item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] text-white/55 transition hover:text-white"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-[13px] text-white/55 transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <Link
                  href="/cari"
                  className="text-[13px] text-white/55 transition hover:text-white"
                >
                  Cari bisnis
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className={footerLabelClass}>Kontak</p>
            <p className="mt-4 text-[13px] leading-relaxed text-white/50">
              Hubungi tim Optisio untuk kerja sama dan dukungan listing.
            </p>
            <p className="mt-3 text-[12px] text-white/40">
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-1.5 text-white/70 underline decoration-white/20 underline-offset-2 transition hover:text-white"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
                {contactEmail}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-[12px] text-white/40">{footerText}</p>
          <div className="flex gap-4 text-[12px] text-white/40">
            <Link href="/kontak" className="transition hover:text-white/70">
              Kontak
            </Link>
            <Link href="/submit" className="transition hover:text-white/70">
              Submit
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
