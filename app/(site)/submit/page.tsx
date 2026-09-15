import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Daftarkan Bisnis",
  description:
    "Daftarkan bisnis Anda ke Business Directory Indonesia by Optisio untuk meningkatkan eksposure, kredibilitas, dan SEO lokal.",
};

const STEPS = [
  {
    icon: FileText,
    title: "Isi profil bisnis",
    description:
      "Siapkan nama resmi, kategori, tagline, deskripsi, dan kontak bisnis Anda.",
  },
  {
    icon: Clock3,
    title: "Tim Optisio meninjau",
    description:
      "Kami memverifikasi kelengkapan data agar listing tetap berkualitas dan terpercaya.",
  },
  {
    icon: BadgeCheck,
    title: "Tayang di direktori",
    description:
      "Bisnis Anda muncul di pencarian dengan peluang tampil sebagai unggulan.",
  },
] as const;

const BENEFITS = [
  "Visibilitas di mesin pencari dan discovery lokal",
  "Kepercayaan lewat badge terverifikasi",
  "Jalur kontak yang jelas: WhatsApp, email, atau website",
  "Opsi Premium & Featured untuk eksposure prioritas",
] as const;

export default function SubmitPage() {
  return (
    <div className="container-site pt-28 pb-8 lg:pt-32 lg:pb-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="label-eyebrow">Submit</p>
        <h1 className="text-h1 mt-3 text-balance text-ink-950">
          Daftarkan bisnis Anda ke Optisio Directory
        </h1>
        <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink-500 sm:text-base">
          Tingkatkan jangkauan dan kredibilitas. Listing Anda membantu calon
          pelanggan menemukan layanan yang tepat.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="mailto:hello@optisio.id?subject=Pendaftaran%20Bisnis%20Directory"
            className="btn-primary"
          >
            Mulai daftar via email
          </a>
          <Link href="/kontak" className="btn-secondary">
            Tanya tim Optisio
          </Link>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="rounded-card border border-border bg-white p-5 shadow-card"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-control border border-border bg-surface-soft text-ink-700">
                <Icon className="h-4 w-4" />
              </span>
              <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-500">
                Langkah {index + 1}
              </p>
              <h2 className="mt-1 text-[16px] font-semibold tracking-tight text-ink-950">
                {step.title}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="rounded-card border border-border bg-white p-6 shadow-card lg:col-span-7 sm:p-8">
          <p className="label-eyebrow">Keuntungan</p>
          <h2 className="mt-3 text-h2 text-ink-950">
            Mengapa bisnis Indonesia perlu ada di sini
          </h2>
          <ul className="mt-5 space-y-3">
            {BENEFITS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-[14px] leading-relaxed text-ink-700"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-card border border-ink-900/80 bg-ink-950 p-6 text-white/70 lg:col-span-5 sm:p-8">
          <h2 className="text-[16px] font-semibold tracking-tight text-white">
            Siap submit sekarang?
          </h2>
          <p className="mt-3 text-[13px] leading-relaxed text-white/55">
            Kirimkan nama bisnis, kategori, kota, website/WhatsApp, dan ringkasan
            singkat layanan Anda.
          </p>
          <div className="mt-6 space-y-3 text-[13px]">
            <p>
              Email:{" "}
              <a
                href="mailto:hello@optisio.id"
                className="text-white underline underline-offset-2"
              >
                hello@optisio.id
              </a>
            </p>
            <p>
              WhatsApp:{" "}
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline underline-offset-2"
              >
                +62 812-3456-7890
              </a>
            </p>
          </div>
          <Link
            href="/kontak"
            className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-btn bg-white text-[13px] font-medium text-ink-950 transition hover:bg-surface-soft"
          >
            Buka halaman kontak
          </Link>
        </section>
      </div>
    </div>
  );
}
