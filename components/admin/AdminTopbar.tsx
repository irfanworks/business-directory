import Link from "next/link";
import { ChevronRight, ExternalLink, LogOut } from "lucide-react";
import { signOutAdmin } from "@/app/admin/actions";

export type AdminBreadcrumbItem = {
  label: string;
  href?: string;
};

type AdminTopbarProps = {
  breadcrumb: AdminBreadcrumbItem[];
  userEmail?: string | null;
  userName?: string | null;
};

export default function AdminTopbar({
  breadcrumb,
  userEmail,
  userName,
}: AdminTopbarProps) {
  const displayName = userName || userEmail?.split("@")[0] || "Admin";
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-6">
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-slate-500">
          {breadcrumb.map((item, index) => {
            const isLast = index === breadcrumb.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                )}
                {item.href && !isLast ? (
                  <Link href={item.href} className="truncate transition hover:text-slate-900">
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={`truncate ${isLast ? "font-medium text-slate-900" : ""}`}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link
          href="/"
          target="_blank"
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">View website</span>
        </Link>

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-[11px] font-semibold text-white">
            {initial}
          </span>
          <span className="hidden max-w-[140px] truncate text-[12px] font-medium text-slate-700 sm:block">
            {userEmail || displayName}
          </span>
        </div>

        <form action={signOutAdmin}>
          <button
            type="submit"
            aria-label="Sign out"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </header>
  );
}
