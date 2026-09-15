"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { getCategoryIcon } from "@/lib/icons";
import type { Category } from "@/lib/types";

export type CategoryCardProps = {
  category: Category;
  featured?: boolean;
  className?: string;
};

const MAX_VISIBLE_SUBS = 4;

export default function CategoryCard({
  category,
  featured = false,
  className = "",
}: CategoryCardProps) {
  const router = useRouter();
  const Icon: LucideIcon = getCategoryIcon(category.icon_name);
  const count = category.listing_count ?? 0;
  const subs = category.subcategories ?? [];
  const visible = subs.slice(0, MAX_VISIBLE_SUBS);
  const remaining = Math.max(0, subs.length - visible.length);
  const href = `/category/${category.slug}`;
  const iconSize = featured ? 32 : 24;

  function goToCategory() {
    router.push(href);
  }

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`${category.name}, ${count} bisnis${
        subs.length ? `, ${subs.length} subkategori` : ""
      }`}
      onClick={goToCategory}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToCategory();
        }
      }}
      className={[
        "group relative flex h-full min-h-[11rem] cursor-pointer flex-col overflow-hidden rounded-2xl bg-white category-card-shadow",
        "border-b border-slate-100 dark:border-slate-800 dark:bg-slate-950",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2",
        featured
          ? "bg-gradient-to-br from-accent-soft/60 to-transparent dark:from-accent/10"
          : "",
        className,
      ].join(" ")}
    >
      <div
        className={`relative z-[1] flex flex-1 flex-col p-5 ${
          featured ? "sm:p-6" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={[
              "inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600",
              "transition-colors duration-200 group-hover:bg-white group-hover:text-accent",
              "dark:bg-slate-900 dark:text-slate-300 dark:group-hover:text-accent",
              featured ? "h-14 w-14" : "h-11 w-11",
            ].join(" ")}
            aria-hidden
          >
            <Icon size={iconSize} strokeWidth={1.5} />
          </span>

          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-slate-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-hover:text-accent"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>

        <h3
          className={`mt-4 font-display font-bold tracking-tight text-slate-950 dark:text-white ${
            featured ? "text-xl sm:text-2xl" : "text-[15px] sm:text-base"
          }`}
        >
          {category.name}
        </h3>

        <p className="mt-1.5 text-[13px] font-medium text-slate-500 dark:text-slate-400">
          <span className="tabular-nums">{count}</span> bisnis
          {subs.length > 0 ? (
            <span className="text-slate-400"> · {subs.length} subkategori</span>
          ) : null}
        </p>

        {visible.length > 0 ? (
          <div className="category-subs-panel mt-3">
            <ul className="flex flex-wrap gap-1.5 pb-0.5">
              {visible.map((sub) => (
                <li key={sub.id}>
                  <Link
                    href={`/category/${category.slug}/${sub.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex min-h-[28px] max-w-full items-center rounded-full bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-accent-soft hover:text-accent dark:bg-slate-900 dark:text-slate-300"
                  >
                    <span className="truncate">{sub.name}</span>
                  </Link>
                </li>
              ))}
              {remaining > 0 ? (
                <li>
                  <span className="inline-flex min-h-[28px] items-center rounded-full px-2 py-1 text-xs font-medium text-slate-400">
                    +{remaining}
                  </span>
                </li>
              ) : null}
            </ul>
          </div>
        ) : (
          <div className="mt-auto pt-4" />
        )}
      </div>
    </article>
  );
}

export function CategoryCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={`category-skeleton min-h-[11rem] p-5 ${
        featured ? "lg:col-span-2" : ""
      }`}
      aria-hidden
    >
      <div className="h-11 w-11 rounded-xl bg-slate-200/80 dark:bg-slate-700" />
      <div className="mt-4 h-4 w-2/3 rounded bg-slate-200/80 dark:bg-slate-700" />
      <div className="mt-2 h-3 w-1/3 rounded bg-slate-200/70 dark:bg-slate-700" />
    </div>
  );
}
