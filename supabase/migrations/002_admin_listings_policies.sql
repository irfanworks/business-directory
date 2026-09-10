-- Admin write policies + public storage bucket for listing images
-- Run in Supabase SQL Editor after 001_initial_schema.sql

-- Listings: authenticated admins can manage all rows
DROP POLICY IF EXISTS "Authenticated can manage listings" ON public.listings;
CREATE POLICY "Authenticated can manage listings"
  ON public.listings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Categories / subcategories / settings (for future admin CRUD)
DROP POLICY IF EXISTS "Authenticated can manage categories" ON public.categories;
CREATE POLICY "Authenticated can manage categories"
  ON public.categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can manage subcategories" ON public.subcategories;
CREATE POLICY "Authenticated can manage subcategories"
  ON public.subcategories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can manage site settings" ON public.site_settings;
CREATE POLICY "Authenticated can manage site settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Storage bucket for listing logos/banners
INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'listings', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can read listing images" ON storage.objects;
CREATE POLICY "Public can read listing images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'listings');

DROP POLICY IF EXISTS "Authenticated can upload listing images" ON storage.objects;
CREATE POLICY "Authenticated can upload listing images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'listings');

DROP POLICY IF EXISTS "Authenticated can update listing images" ON storage.objects;
CREATE POLICY "Authenticated can update listing images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'listings')
  WITH CHECK (bucket_id = 'listings');

DROP POLICY IF EXISTS "Authenticated can delete listing images" ON storage.objects;
CREATE POLICY "Authenticated can delete listing images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'listings');
