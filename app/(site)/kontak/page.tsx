import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Newspaper } from "lucide-react";
import ContactForm from "@/components/kontak/ContactForm";
import { getSiteSettings } from "@/lib/data/site-settings";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi tim Optisio untuk pertanyaan listing, partnership, atau dukungan Business Directory Indonesia.",
};

export default async function KontakPage() {
  const settings = await getSiteSettings();
  const contactEmail = settings.contact_email || "support@optisio.id";

  return (
    <div className="container-site pt-28 pb-8 lg:pt-32 lg:pb-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="label-eyebrow">Kontak</p>
        <h1 className="text-h1 mt-3 text-balance text-ink-950">
          Mari bicara tentang bisnis Anda
        </h1>
        <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink-500">
          Tim Optisio siap membantu pertanyaan listing, upgrade Premium,
          partnership, atau dukungan teknis.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        <a
          href={`mailto:${contactEmail}`}
          className="surface-card surface-card-hover p-5"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-control border border-border bg-surface-soft text-ink-700">
            <Mail className="h-4 w-4" />
          </span>
          <h2 className="mt-4 text-[15px] font-semibold text-ink-950">Email</h2>
          <p className="mt-1 text-[13px] text-ink-500">{contactEmail}</p>
        </a>

        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="surface-card surface-card-hover p-5"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-control border border-border bg-surface-soft text-ink-700">
            <MessageCircle className="h-4 w-4" />
          </span>
          <h2 className="mt-4 text-[15px] font-semibold text-ink-950">
            WhatsApp
          </h2>
          <p className="mt-1 text-[13px] text-ink-500">+62 812-3456-7890</p>
        </a>

        <div className="surface-card p-5">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-control border border-border bg-surface-soft text-ink-700">
            <MapPin className="h-4 w-4" />
          </span>
          <h2 className="mt-4 text-[15px] font-semibold text-ink-950">Lokasi</h2>
          <p className="mt-1 text-[13px] text-ink-500">Jakarta, Indonesia</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-card border border-border bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-[16px] font-semibold tracking-tight text-ink-950">
            Kirim pesan
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
            Kami biasanya membalas dalam 1×24 jam kerja.
          </p>
          <ContactForm />
        </section>

        <section className="rounded-card border border-border bg-surface-soft/70 p-6 sm:p-8">
          <h2 className="text-[16px] font-semibold tracking-tight text-ink-950">
            Butuh bantuan cepat?
          </h2>
          <ul className="mt-4 space-y-3 text-[14px] text-ink-700">
            <li>
              Ingin daftar listing? Kunjungi{" "}
              <Link
                href="/submit"
                className="font-medium text-accent underline underline-offset-2"
              >
                Submit
              </Link>
              .
            </li>
            <li>
              Baca insight di{" "}
              <a
                href="https://optisio.id/blog/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-accent underline underline-offset-2"
              >
                Blog
                <Newspaper className="h-3.5 w-3.5" />
              </a>
              .
            </li>
            <li>
              Jelajahi bisnis dari{" "}
              <Link
                href="/"
                className="font-medium text-accent underline underline-offset-2"
              >
                Home
              </Link>{" "}
              atau{" "}
              <Link
                href="/cari"
                className="font-medium text-accent underline underline-offset-2"
              >
                Cari
              </Link>
              .
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
