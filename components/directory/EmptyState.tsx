import Link from "next/link";
import { Building2, Plus } from "lucide-react";

type EmptyStateProps = {
  title?: string;
  description?: string;
  categorySlug?: string;
};

export default function EmptyState({
  title = "Belum ada bisnis di sini",
  description = "Belum ada listing yang cocok dengan filter atau kategori ini. Coba ubah filter, atau daftarkan bisnis pertama Anda.",
  categorySlug,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-16 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm">
        <Building2 className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-[16px] font-semibold tracking-tight text-slate-950">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-slate-500">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/submit"
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-slate-950 px-4 text-[13px] font-medium text-white transition hover:bg-slate-800"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          Submit Business
        </Link>
        {categorySlug && (
          <Link
            href={`/category/${categorySlug}`}
            className="text-[13px] font-medium text-slate-600 transition hover:text-slate-950"
          >
            Lihat semua di kategori
          </Link>
        )}
      </div>
    </div>
  );
}
