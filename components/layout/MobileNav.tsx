"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  Home,
  LayoutGrid,
  PlusCircle,
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    match: (pathname: string) => pathname === "/",
  },
  {
    href: "/category/teknologi-it",
    label: "Explore",
    icon: LayoutGrid,
    match: (pathname: string) => pathname.startsWith("/category"),
  },
  {
    href: "/saved",
    label: "Saved",
    icon: Bookmark,
    match: (pathname: string) => pathname.startsWith("/saved"),
  },
  {
    href: "/submit",
    label: "Submit",
    icon: PlusCircle,
    match: (pathname: string) => pathname.startsWith("/submit"),
  },
] as const;

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
    >
      <div className="border-t border-slate-200/70 bg-white/80 shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.18)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/65">
        <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-1 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;

            return (
              <li key={item.href} className="min-w-0 flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 transition ${
                    active
                      ? "text-teal-700"
                      : "text-slate-500 active:text-slate-800"
                  }`}
                >
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition ${
                      active
                        ? "bg-teal-50 shadow-[inset_0_0_0_1px_rgba(13,148,136,0.18)]"
                        : "bg-transparent"
                    }`}
                  >
                    <Icon
                      className="h-[18px] w-[18px]"
                      strokeWidth={active ? 2.4 : 2}
                    />
                  </span>
                  <span
                    className={`truncate text-[10px] font-medium tracking-tight ${
                      active ? "text-teal-800" : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
