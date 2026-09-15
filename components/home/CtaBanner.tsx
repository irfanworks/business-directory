import Link from "next/link";
import { Plus } from "lucide-react";

type CtaBannerProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
};

export default function CtaBanner({
  eyebrow = "Untuk pemilik bisnis",
  title = "Daftarkan bisnis Anda di Optisio Directory",
  description = "Tampil di platform discovery bisnis Indonesia — bangun kredibilitas dengan verifikasi, dan jangkau calon klien yang siap terhubung.",
  buttonLabel = "Daftarkan bisnis",
}: CtaBannerProps) {
  return (
    <section className="section-y pt-0">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-surface border border-ink-900/80 bg-ink-950 px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(225,29,46,0.22),transparent_45%)]"
          />
          <div className="relative max-w-2xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-accent">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-h2 text-white">{title}</h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/60">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/submit"
                className="inline-flex h-11 items-center gap-1.5 rounded-btn bg-white px-5 text-[13px] font-medium text-ink-950 transition duration-150 hover:bg-surface-soft"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                {buttonLabel}
              </Link>
              <Link
                href="/kontak"
                className="inline-flex h-11 items-center rounded-btn px-4 text-[13px] font-medium text-white/70 transition duration-150 hover:text-white"
              >
                Hubungi kami →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
