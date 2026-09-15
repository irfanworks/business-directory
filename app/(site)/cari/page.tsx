import type { Metadata } from "next";
import CategoryDirectoryView from "@/components/directory/CategoryDirectoryView";
import { getAllPublishedListings } from "@/lib/data/directory";

export const metadata: Metadata = {
  title: "Cari bisnis",
  description:
    "Temukan bisnis terverifikasi di Optisio Directory berdasarkan nama, layanan, kategori, dan lokasi.",
};

export const revalidate = 60;

type PageProps = {
  searchParams: {
    q?: string;
    city?: string;
    verified?: string;
  };
};

export default async function SearchPage({ searchParams }: PageProps) {
  const listings = await getAllPublishedListings();
  const q = searchParams.q?.trim() ?? "";
  const city = searchParams.city?.trim() ?? "";
  const verified = searchParams.verified === "1";

  return (
    <CategoryDirectoryView
      listings={listings}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Cari" },
      ]}
      title="Cari bisnis"
      description="Hasil discovery di seluruh Optisio Directory. Saring berdasarkan lokasi, verifikasi, dan relevansi."
      initialQuery={q}
      initialCity={city}
      initialVerified={verified}
    />
  );
}
