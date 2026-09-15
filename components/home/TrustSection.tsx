import { BadgeCheck, Search, Shield, Sparkles } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const REASONS = [
  {
    icon: Search,
    title: "Discovery yang fokus",
    description:
      "Cari berdasarkan nama, layanan, kategori, dan lokasi — tanpa noise.",
  },
  {
    icon: BadgeCheck,
    title: "Verifikasi yang bermakna",
    description:
      "Badge terverifikasi menandai identitas, kontak, dan kategori yang sudah dicek.",
  },
  {
    icon: Shield,
    title: "Kurasi yang tenang",
    description:
      "Listing dipilih agar Anda bisa mengevaluasi partner bisnis dengan percaya diri.",
  },
  {
    icon: Sparkles,
    title: "Siap terhubung",
    description:
      "Dari profil ke website, WhatsApp, atau email — langkah selanjutnya jelas.",
  },
] as const;

export default function TrustSection() {
  return (
    <section className="section-y">
      <div className="container-site">
        <SectionHeader
          eyebrow="Kepercayaan"
          title="Mengapa mempercayai Optisio Directory"
          description="Dirancang untuk perjalanan Discover → Evaluate → Trust → Connect."
        />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-card border border-border bg-white p-5 shadow-card"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-soft text-ink-700">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-ink-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
