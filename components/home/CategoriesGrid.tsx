"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getCategoryIcon } from "@/lib/icons";
import type { Category } from "@/lib/types";

type CategoriesGridProps = {
  categories: Category[];
};

export default function CategoriesGrid({ categories }: CategoriesGridProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="border-y border-slate-200/70 bg-white/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-teal-700">
            Categories
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Explore by industry
          </h2>
          <p className="mt-2 text-[14px] text-slate-600">
            Jelajahi kategori utama dan temukan bisnis yang relevan dengan
            kebutuhan Anda.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = getCategoryIcon(category.icon_name);
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: 0.35,
                  delay: Math.min(index * 0.04, 0.28),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="group flex h-full items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 transition duration-300 hover:border-teal-200 hover:bg-white hover:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.2)]"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-teal-700 shadow-sm transition group-hover:border-teal-200 group-hover:text-teal-800">
                    <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[14px] font-semibold tracking-tight text-slate-950">
                        {category.name}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:text-teal-600" />
                    </span>
                    <span className="mt-1 block text-[12px] text-slate-500">
                      {category.listing_count ?? 0} listing
                      {(category.listing_count ?? 0) === 1 ? "" : "s"}
                    </span>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
