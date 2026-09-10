"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { deleteListing } from "@/app/admin/listings/actions";
import SafeImage from "@/components/ui/SafeImage";
import type { AdminListingTableRow } from "@/lib/admin/listings";

type ListingsTableProps = {
  listings: AdminListingTableRow[];
};

export default function ListingsTable({ listings }: ListingsTableProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [tier, setTier] = useState("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((row) => {
      if (status !== "all" && row.status !== status) return false;
      if (tier !== "all" && row.tier !== tier) return false;
      if (!q) return true;
      const haystack = [
        row.title,
        row.slug,
        row.category_name,
        row.subcategory_name,
        row.city,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [listings, query, status, tier]);

  function onDelete(id: string, title: string) {
    const confirmed = window.confirm(
      `Hapus listing "${title}"? Tindakan ini tidak bisa dibatalkan.`,
    );
    if (!confirmed) return;

    setPendingId(id);
    startTransition(async () => {
      const result = await deleteListing(id);
      setPendingId(null);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Listing berhasil dihapus");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, slug, kategori…"
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-3 text-[13px] outline-none transition focus:border-teal-300 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-teal-300"
        >
          <option value="all">All status</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="published">Published</option>
        </select>
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-teal-300"
        >
          <option value="all">All tier</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[13px]">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Logo</th>
                <th className="px-4 py-3 font-medium">Nama Bisnis</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Tier</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((listing) => (
                <tr
                  key={listing.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                      {listing.logo_url ? (
                        <SafeImage
                          src={listing.logo_url}
                          alt={`Logo ${listing.title}`}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[12px] font-semibold text-slate-400">
                          {listing.title.slice(0, 1)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">
                      {listing.title}
                    </div>
                    <div className="text-[12px] text-slate-400">
                      /{listing.slug}
                      {listing.is_featured ? " · Featured" : ""}
                      {listing.verified_badge ? " · Verified" : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div>{listing.category_name || "—"}</div>
                    {listing.subcategory_name && (
                      <div className="text-[12px] text-slate-400">
                        {listing.subcategory_name}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={listing.status} />
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-700">
                    {listing.tier}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/listings/${listing.id}`}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-[12px] font-medium text-slate-700 transition hover:border-slate-300"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Link>
                      <a
                        href={`/business/${listing.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-[12px] font-medium text-slate-700 transition hover:border-slate-300"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Link
                      </a>
                      <button
                        type="button"
                        disabled={isPending && pendingId === listing.id}
                        onClick={() => onDelete(listing.id, listing.title)}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-rose-200 px-2.5 text-[12px] font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-slate-500"
                  >
                    Tidak ada listing yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-teal-50 text-teal-700 ring-teal-200",
    pending: "bg-amber-50 text-amber-800 ring-amber-200",
    draft: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ring-inset ${
        styles[status] || styles.draft
      }`}
    >
      {status}
    </span>
  );
}
