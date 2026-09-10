export type SettingsMap = Record<string, string>;

export const SETTINGS_FIELDS = [
  { key: "site_name", label: "Site Name", group: "general" },
  { key: "site_tagline", label: "Site Tagline", group: "general" },
  { key: "hero_title", label: "Hero Title", group: "hero" },
  { key: "hero_subtitle", label: "Hero Subtitle", group: "hero" },
  { key: "hero_banner_url", label: "Hero Banner URL", group: "hero" },
  { key: "contact_email", label: "Contact Email Admin", group: "contact" },
  { key: "footer_text", label: "Footer Text", group: "contact" },
  { key: "social_instagram", label: "Instagram Optisio", group: "social" },
  { key: "social_linkedin", label: "LinkedIn Optisio", group: "social" },
  { key: "social_facebook", label: "Facebook Optisio", group: "social" },
  { key: "social_twitter", label: "Twitter / X Optisio", group: "social" },
  { key: "social_youtube", label: "YouTube Optisio", group: "social" },
  { key: "social_tiktok", label: "TikTok Optisio", group: "social" },
] as const;

export const DEFAULT_SETTINGS: SettingsMap = {
  site_name: "Business Directory Indonesia",
  site_tagline: "by Optisio",
  hero_title: "Temukan Bisnis Terbaik di Indonesia",
  hero_subtitle:
    "Direktori bisnis profesional untuk UMKM, startup, dan enterprise.",
  hero_banner_url:
    "https://placehold.co/1600x600/0f172a/e2e8f0?text=Business+Directory+Indonesia",
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
