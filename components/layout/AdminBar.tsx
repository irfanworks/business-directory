"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Pencil } from "lucide-react";
import { signOutAdmin } from "@/app/admin/actions";

type AdminBarProps = {
  email: string;
};

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/listings/new", label: "Tambah" },
  { href: "/admin/categories", label: "Kategori" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export default function AdminBar({ email }: AdminBarProps) {
  const pathname = usePathname();
  const businessSlug = pathname.match(/^\/business\/([^/]+)\/?$/)?.[1];

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-9 border-b border-red-900/80 bg-red-950 text-[12px] text-red-50">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3 overflow-x-auto px-3 sm:px-4">
        <span className="shrink-0 font-semibold tracking-wide text-amber-400">
          Admin
        </span>

        <nav className="flex items-center gap-1 sm:gap-0.5">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded px-2 py-1 text-red-100/85 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          {businessSlug ? (
            <Link
              href={`/admin/listings/by-slug/${businessSlug}`}
              className="inline-flex shrink-0 items-center gap-1 rounded bg-amber-500/20 px-2 py-1 font-medium text-amber-300 transition hover:bg-amber-500/30"
            >
              <Pencil className="h-3 w-3" aria-hidden />
              Edit bisnis
            </Link>
          ) : null}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <span className="hidden max-w-[10rem] truncate text-red-200/70 sm:inline">
            {email}
          </span>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-red-100/85 transition hover:bg-white/10 hover:text-white"
            title="Buka panel admin"
          >
            <ExternalLink className="h-3 w-3" aria-hidden />
            <span className="sr-only sm:not-sr-only">Panel</span>
          </Link>
          <form action={signOutAdmin}>
            <button
              type="submit"
              className="rounded px-2 py-1 text-red-200/80 transition hover:bg-white/10 hover:text-white"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
