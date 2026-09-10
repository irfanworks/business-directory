import type { BusinessListing } from "@/lib/types";

type BusinessContentProps = {
  business: BusinessListing;
};

export default function BusinessContent({ business }: BusinessContentProps) {
  const html = business.content?.trim();

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-8">
      <h2 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        About
      </h2>

      {html ? (
        <div
          className="prose prose-slate mt-4 max-w-none prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-a:text-teal-700 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="mt-4 text-[14px] leading-relaxed text-slate-500">
          Deskripsi lengkap belum tersedia untuk bisnis ini.
          {business.short_tagline ? ` ${business.short_tagline}` : ""}
        </p>
      )}
    </section>
  );
}
