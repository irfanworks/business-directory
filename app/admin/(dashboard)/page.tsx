import type { Metadata } from "next";
import Link from "next/link";
import {
  FolderTree,
  ListChecks,
  Plus,
  Settings2,
  Sparkles,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

async function getOverviewStats() {
  if (!isSupabaseConfigured()) {
    return {
      listings: 3,
      published: 2,
      premium: 2,
      categories: 1,
      pending: 0,
    };
  }

  const supabase = createClient();
  if (!supabase) {
    return {
      listings: 0,
      published: 0,
      premium: 0,
      categories: 0,
      pending: 0,
    };
  }

  const [listingsRes, publishedRes, premiumRes, categoriesRes, pendingRes] =
    await Promise.all([
      supabase.from("listings").select("id", { count: "exact", head: true }),
      supabase
        .from("listings")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("listings")
        .select("id", { count: "exact", head: true })
        .eq("tier", "premium"),
      supabase.from("categories").select("id", { count: "exact", head: true }),
      supabase
        .from("listings")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
    ]);

  return {
    listings: listingsRes.count ?? 0,
    published: publishedRes.count ?? 0,
    premium: premiumRes.count ?? 0,
    categories: categoriesRes.count ?? 0,
    pending: pendingRes.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getOverviewStats();

  const cards = [
    { label: "Total listings", value: stats.listings, hint: "All statuses" },
    { label: "Published", value: stats.published, hint: "Live on site" },
    { label: "Premium", value: stats.premium, hint: "Monetized tier" },
    { label: "Pending review", value: stats.pending, hint: "Needs action" },
    { label: "Categories", value: stats.categories, hint: "Top-level" },
  ];

  return (
    <AdminShell
      title="Dashboard"
      description="Overview performa direktori dan akses cepat ke manajemen konten."
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Dashboard" }]}
      actions={
        <Link
          href="/admin/listings/new"
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-slate-950 px-4 text-[13px] font-medium text-white transition hover:bg-slate-800"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          Add listing
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
          >
            <p className="text-[12px] font-medium text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {card.value}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <QuickLink
          href="/admin/listings"
          icon={ListChecks}
          title="Listings Management"
          description="List, add, edit, and delete business profiles."
        />
        <QuickLink
          href="/admin/categories"
          icon={FolderTree}
          title="Categories & Subcategories"
          description="Kelola struktur industri dan mapping listing."
        />
        <QuickLink
          href="/admin/settings"
          icon={Settings2}
          title="Site Settings"
          description="Atur konten homepage, SEO, kontak, dan social."
        />
      </div>

      <div className="mt-6 rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50 to-white p-5">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/15 text-teal-700">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold text-slate-950">
              Admin shell siap dipakai
            </h2>
            <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-slate-600">
              Proteksi `/admin` sudah aktif via Supabase Auth middleware.
              Tambahkan email admin di `ADMIN_EMAILS` (comma-separated) untuk
              membatasi akses. Form CRUD detail bisa dilanjutkan di masing-masing
              halaman management.
            </p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof ListChecks;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:border-teal-200 hover:shadow-[0_12px_30px_-18px_rgba(15,23,42,0.2)]"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition group-hover:border-teal-200 group-hover:text-teal-700">
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-slate-950">
        {title}
      </h3>
      <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
        {description}
      </p>
    </Link>
  );
}
