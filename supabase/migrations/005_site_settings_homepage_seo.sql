-- Align site_settings with current homepage + SEO fields
INSERT INTO public.site_settings (key, value)
VALUES
  ('hero_eyebrow', 'Optisio Directory'),
  ('hero_title', 'Temukan Bisnis'),
  ('hero_title_accent', 'Terpercaya'),
  ('hero_subtitle', 'Where Search Engines Find You. Where AI Recommends You.'),
  ('trending_title', 'Sedang Trending'),
  ('trending_description', 'Bisnis yang sedang banyak dijelajahi di Optisio Directory.'),
  ('categories_title', 'Jelajahi kategori'),
  ('categories_description', 'Temukan bisnis berdasarkan industri yang relevan.'),
  ('cta_eyebrow', 'Untuk pemilik bisnis'),
  ('cta_title', 'Daftarkan bisnis Anda di Optisio Directory'),
  ('cta_description', 'Tampil di platform discovery bisnis Indonesia — bangun kredibilitas dengan verifikasi, dan jangkau calon klien yang siap terhubung.'),
  ('cta_button_label', 'Daftarkan bisnis'),
  ('seo_title', 'Business Directory Indonesia by Optisio'),
  ('seo_description', 'Direktori bisnis profesional untuk menemukan dan mempromosikan bisnis terbaik di Indonesia.'),
  ('seo_keywords', 'direktori bisnis, UMKM Indonesia, bisnis terverifikasi, Optisio'),
  ('seo_og_image', '')
ON CONFLICT (key) DO NOTHING;
