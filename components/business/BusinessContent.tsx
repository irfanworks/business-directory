import type { BusinessListing } from "@/lib/types";

type BusinessContentProps = {
  business: BusinessListing;
};

export default function BusinessContent({ business }: BusinessContentProps) {
  const html = business.content?.trim();

  return (
    <section className="rounded-card border border-border bg-white p-6 shadow-card sm:p-8">
      <h2 className="text-small uppercase tracking-[0.12em] text-ink-500">
        Tentang
      </h2>

      {html ? (
        <div
          className="prose prose-slate mt-4 max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-accent prose-img:rounded-card"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="mt-4 text-[14px] leading-relaxed text-ink-500">
          Deskripsi lengkap belum tersedia untuk bisnis ini.
          {business.short_tagline ? ` ${business.short_tagline}` : ""}
        </p>
      )}
    </section>
  );
}
