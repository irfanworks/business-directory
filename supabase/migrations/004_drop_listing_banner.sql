-- Remove listing banner support (logo-only presentation).
ALTER TABLE public.listings DROP COLUMN IF EXISTS banner_url;
