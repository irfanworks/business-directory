import Link from "next/link";
import HeroSearch from "@/components/home/HeroSearch";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type HeroSectionProps = {
  categories: CategoryOption[];
};

export default function HeroSection({ categories }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Full-bleed atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(13,148,136,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,#f8fafc)]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.08) 1px, transparent 0)",
            backgroundSize: "28px 28px",
            maskImage:
              "linear-gradient(to bottom, black 0%, transparent 85%)",
          }}
        />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-14 text-center sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 shadow-sm backdrop-blur-md transition hover:border-teal-200"
        >
          <span className="text-[13px] font-semibold tracking-tight text-slate-950">
            Optisio
          </span>
          <span className="h-3 w-px bg-slate-200" />
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500">
            Directory
          </span>
        </Link>

        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
          Discover & Connect with Top-Tier Verified Businesses
        </h1>

        <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-slate-600 sm:text-base">
          Business Directory Indonesia membantu Anda menemukan partner
          terpercaya — verified, curated, dan siap berkolaborasi.
        </p>

        <div className="mt-9 w-full flex justify-center">
          <HeroSearch categories={categories} />
        </div>
      </div>
    </section>
  );
}
