"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Mail,
  Newspaper,
  PlusCircle,
} from "lucide-react";

const BLOG_URL = "https://optisio.com/blog/";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    external: false,
    match: (pathname: string) => pathname === "/",
  },
  {
    href: "/submit",
    label: "Submit",
    icon: PlusCircle,
    external: false,
    match: (pathname: string) => pathname.startsWith("/submit"),
  },
  {
    href: BLOG_URL,
    label: "Blog",
    icon: Newspaper,
    external: true,
    match: () => false,
  },
  {
    href: "/kontak",
    label: "Kontak",
    icon: Mail,
    external: false,
    match: (pathname: string) => pathname.startsWith("/kontak"),
  },
] as const;

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama mobile"
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
    >
      <div className="border-t border-border bg-white/85 backdrop-blur-[18px] supports-[backdrop-filter]:bg-white/75">
        <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-1 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            const className = `flex flex-col items-center justify-center gap-1 rounded-btn px-2 py-2 transition duration-150 ${
              active ? "text-ink-950" : "text-ink-500 active:text-ink-800"
            }`;

            const content = (
              <>
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-control transition ${
                    active
                      ? "bg-accent-soft text-accent"
                      : "bg-transparent"
                  }`}
                >
                  <Icon
                    className="h-[18px] w-[18px]"
                    strokeWidth={active ? 2.4 : 2}
                  />
                </span>
                <span
                  className={`truncate text-[11px] font-medium tracking-tight ${
                    active ? "text-ink-950" : "text-ink-500"
                  }`}
                >
                  {item.label}
                </span>
              </>
            );

            return (
              <li key={item.href} className="min-w-0 flex-1">
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={className}
                  >
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
