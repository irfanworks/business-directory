export type SettingsMap = Record<string, string>;

export type SettingsField = {
  key: string;
  label: string;
  group: "general" | "hero" | "homepage" | "seo" | "contact" | "social";
  hint?: string;
  input?: "text" | "textarea" | "url" | "email";
};

export const SETTINGS_FIELDS: SettingsField[] = [
  {
    key: "site_name",
    label: "Nama situs",
    group: "general",
    hint: "Ditampilkan di judul browser dan footer.",
  },
  {
    key: "site_tagline",
    label: "Tagline situs",
    group: "general",
    hint: "Contoh: by Optisio",
  },
  {
    key: "hero_eyebrow",
    label: "Eyebrow hero",
    group: "hero",
    hint: "Teks kecil di atas headline.",
  },
  {
    key: "hero_title",
    label: "Judul hero",
    group: "hero",
    hint: "Bagian sebelum aksen italic.",
  },
  {
    key: "hero_title_accent",
    label: "Aksen judul hero",
    group: "hero",
    hint: "Kata italic emas, contoh: Terpercaya",
  },
  {
    key: "hero_subtitle",
    label: "Subtitle hero",
    group: "hero",
    input: "textarea",
    hint: "Tagline di bawah headline.",
  },
  {
    key: "trending_title",
    label: "Judul section trending",
    group: "homepage",
  },
  {
    key: "trending_description",
    label: "Deskripsi section trending",
    group: "homepage",
    input: "textarea",
  },
  {
    key: "categories_title",
    label: "Judul section kategori",
    group: "homepage",
  },
  {
    key: "categories_description",
    label: "Deskripsi section kategori",
    group: "homepage",
    input: "textarea",
  },
  {
    key: "cta_eyebrow",
    label: "Eyebrow CTA",
    group: "homepage",
  },
  {
    key: "cta_title",
    label: "Judul CTA",
    group: "homepage",
  },
  {
    key: "cta_description",
    label: "Deskripsi CTA",
    group: "homepage",
    input: "textarea",
  },
  {
    key: "cta_button_label",
    label: "Label tombol CTA",
    group: "homepage",
  },
  {
    key: "seo_title",
    label: "Meta title (default)",
    group: "seo",
    hint: "Judul SEO homepage / default situs. Ideal 50–60 karakter.",
  },
  {
    key: "seo_description",
    label: "Meta description",
    group: "seo",
    input: "textarea",
    hint: "Deskripsi SERP. Ideal 140–160 karakter.",
  },
  {
    key: "seo_keywords",
    label: "Keywords",
    group: "seo",
    hint: "Pisahkan dengan koma.",
  },
  {
    key: "seo_og_image",
    label: "OG Image URL",
    group: "seo",
    input: "url",
    hint: "Gambar Open Graph (1200×630 direkomendasikan).",
  },
  {
    key: "contact_email",
    label: "Email kontak admin",
    group: "contact",
    input: "email",
  },
  {
    key: "footer_text",
    label: "Teks footer",
    group: "contact",
    input: "textarea",
  },
  {
    key: "social_instagram",
    label: "Instagram",
    group: "social",
    input: "url",
  },
  {
    key: "social_linkedin",
    label: "LinkedIn",
    group: "social",
    input: "url",
  },
  {
    key: "social_facebook",
    label: "Facebook",
    group: "social",
    input: "url",
  },
  {
    key: "social_twitter",
    label: "Twitter / X",
    group: "social",
    input: "url",
  },
  {
    key: "social_youtube",
    label: "YouTube",
    group: "social",
    input: "url",
  },
  {
    key: "social_tiktok",
    label: "TikTok",
    group: "social",
    input: "url",
  },
];

export const DEFAULT_SETTINGS: SettingsMap = {
  site_name: "Business Directory Indonesia",
  site_tagline: "by Optisio",
  hero_eyebrow: "Optisio Directory",
  hero_title: "Temukan Bisnis",
  hero_title_accent: "Terpercaya",
  hero_subtitle:
    "Where Search Engines Find You. Where AI Recommends You.",
  trending_title: "Sedang Trending",
  trending_description:
    "Bisnis yang sedang banyak dijelajahi di Optisio Directory.",
  categories_title: "Jelajahi kategori",
  categories_description:
    "Temukan bisnis berdasarkan industri yang relevan.",
  cta_eyebrow: "Untuk pemilik bisnis",
  cta_title: "Daftarkan bisnis Anda di Optisio Directory",
  cta_description:
    "Tampil di platform discovery bisnis Indonesia — bangun kredibilitas dengan verifikasi, dan jangkau calon klien yang siap terhubung.",
  cta_button_label: "Daftarkan bisnis",
  seo_title: "Business Directory Indonesia by Optisio",
  seo_description:
    "Direktori bisnis profesional untuk menemukan dan mempromosikan bisnis terbaik di Indonesia.",
  seo_keywords:
    "direktori bisnis, UMKM Indonesia, bisnis terverifikasi, Optisio",
  seo_og_image: "",
  contact_email: "support@optisio.id",
  footer_text:
    "© Business Directory Indonesia by Optisio. All rights reserved.",
  social_instagram: "https://instagram.com/optisio",
  social_linkedin: "https://linkedin.com/company/optisio",
  social_facebook: "https://facebook.com/optisio",
  social_twitter: "https://twitter.com/optisio",
  social_youtube: "https://youtube.com/@optisio",
  social_tiktok: "https://tiktok.com/@optisio",
};

export const SETTINGS_GROUPS = [
  {
    id: "general" as const,
    title: "Identitas situs",
    description: "Nama dan tagline utama brand.",
  },
  {
    id: "hero" as const,
    title: "Hero homepage",
    description: "Headline dan subtitle di bagian atas beranda.",
  },
  {
    id: "homepage" as const,
    title: "Konten section homepage",
    description: "Judul section trending, kategori, dan CTA.",
  },
  {
    id: "seo" as const,
    title: "SEO dasar",
    description: "Meta title, description, keywords, dan OG image.",
  },
  {
    id: "contact" as const,
    title: "Kontak & footer",
    description: "Email admin dan teks hak cipta footer.",
  },
  {
    id: "social" as const,
    title: "Social media Optisio",
    description: "Link resmi akun sosial Optisio.",
  },
];
