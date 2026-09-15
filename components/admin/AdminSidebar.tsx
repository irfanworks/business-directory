"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderTree,
  LayoutDashboard,
  ListChecks,
  Menu,
  Settings2,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    description: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/listings",
    label: "Listings",
    description: "Manage businesses",
    icon: ListChecks,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    description: "Categories & subcategories",
    icon: FolderTree,
  },
  {
    href: "/admin/settings",
    label: "Site Settings",
    description: "Homepage, SEO & kontak",
    icon: Settings2,
  },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#070A12] text-slate-300 transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link href="/admin" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-[13px] font-semibold text-slate-950">
              O
            </span>
            <span>
              <span className="block text-[13px] font-semibold tracking-tight text-white">
                Optisio Admin
              </span>
              <span className="block text-[10px] uppercase tracking-[0.12em] text-slate-500">
                Directory
              </span>
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close sidebar"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href, "exact" in item ? item.exact : false);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition ${
                  active
                    ? "bg-white/10 text-white"
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    active ? "text-teal-400" : "text-slate-500"
                  }`}
                />
                <span>
                  <span className="block text-[13px] font-medium">{item.label}</span>
                  <span className="block text-[11px] text-slate-500">
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="text-[11px] leading-relaxed text-slate-500">
            Business Directory Indonesia by Optisio
          </p>
        </div>
      </aside>
    </>
  );
}
