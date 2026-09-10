-- Seed Optisio social settings keys (safe upsert)
INSERT INTO public.site_settings (key, value)
VALUES
  ('social_instagram', 'https://instagram.com/optisio'),
  ('social_linkedin', 'https://linkedin.com/company/optisio'),
  ('social_facebook', 'https://facebook.com/optisio'),
  ('social_twitter', 'https://twitter.com/optisio'),
  ('social_youtube', 'https://youtube.com/@optisio'),
  ('social_tiktok', 'https://tiktok.com/@optisio')
ON CONFLICT (key) DO NOTHING;
