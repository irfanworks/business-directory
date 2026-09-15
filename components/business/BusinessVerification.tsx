import { Check } from "lucide-react";
import type { BusinessListing } from "@/lib/types";

type BusinessVerificationProps = {
  business: BusinessListing;
};

export default function BusinessVerification({
  business,
}: BusinessVerificationProps) {
  if (!business.verified_badge) return null;

  const checks = [
    { label: "Identitas bisnis", done: Boolean(business.title) },
    {
      label: "Informasi kontak",
      done: Boolean(business.phone || business.whatsapp || business.email),
    },
    { label: "Website", done: Boolean(business.website_url) },
    {
      label: "Kategori bisnis",
      done: Boolean(business.category_name || business.subcategory_name),
    },
  ];

  return (
    <section className="rounded-card border border-border bg-white p-6 shadow-card sm:p-8">
      <h2 className="text-small uppercase tracking-[0.12em] text-ink-500">
        Verifikasi
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-500">
        Listing ini telah diverifikasi oleh Optisio Directory berdasarkan data
        yang tersedia.
      </p>

      <ul className="mt-5 space-y-3">
        {checks.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-2.5 text-[14px] text-ink-900"
          >
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                item.done
                  ? "bg-accent-soft text-accent"
                  : "bg-surface-soft text-ink-500"
              }`}
            >
              <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
            </span>
            <span className={item.done ? "" : "text-ink-500"}>
              {item.label}
              {!item.done && " — belum tersedia"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
