-- =============================================================================
-- Business Directory Indonesia by Optisio
-- Supabase PostgreSQL — Initial Schema + Seed Data
-- =============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE public.listing_status AS ENUM ('draft', 'pending', 'published');
CREATE TYPE public.listing_tier AS ENUM ('free', 'premium');

-- =============================================================================
-- CATEGORIES
-- =============================================================================

CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT categories_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

COMMENT ON TABLE public.categories IS 'Top-level business categories';
COMMENT ON COLUMN public.categories.icon_name IS 'Icon identifier (e.g. Lucide icon name)';

-- =============================================================================
-- SUBCATEGORIES
-- =============================================================================

CREATE TABLE public.subcategories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories (id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT subcategories_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT subcategories_category_slug_unique UNIQUE (category_id, slug)
);

CREATE INDEX idx_subcategories_category_id ON public.subcategories (category_id);

COMMENT ON TABLE public.subcategories IS 'Subcategories belonging to a category';

-- =============================================================================
-- LISTINGS
-- =============================================================================

CREATE TABLE public.listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic
  title           TEXT NOT NULL,              -- Official business name
  slug            TEXT NOT NULL UNIQUE,
  logo_url        TEXT,
  banner_url      TEXT,
  short_tagline   TEXT,

  -- Dynamic / rich content (HTML or JSON from Rich Text Editor)
  content         TEXT,

  -- Contact & address (all optional)
  address         TEXT,
  city            TEXT,
  map_iframe_url  TEXT,
  phone           TEXT,
  whatsapp        TEXT,
  email           TEXT,
  website_url     TEXT,

  -- Social media (optional)
  instagram       TEXT,
  linkedin        TEXT,
  facebook        TEXT,
  youtube         TEXT,
  twitter         TEXT,
  tiktok          TEXT,

  -- Status & monetization
  status          public.listing_status NOT NULL DEFAULT 'draft',
  tier            public.listing_tier   NOT NULL DEFAULT 'free',
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  verified_badge  BOOLEAN NOT NULL DEFAULT false,
  view_count      INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0),

  -- Subcategory mapping
  subcategory_id  UUID NOT NULL REFERENCES public.subcategories (id) ON DELETE RESTRICT,

  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  expired_at      TIMESTAMPTZ,

  CONSTRAINT listings_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT listings_email_format CHECK (
    email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  )
);

CREATE INDEX idx_listings_subcategory_id ON public.listings (subcategory_id);
CREATE INDEX idx_listings_status ON public.listings (status);
CREATE INDEX idx_listings_tier ON public.listings (tier);
CREATE INDEX idx_listings_is_featured ON public.listings (is_featured) WHERE is_featured = true;
CREATE INDEX idx_listings_city ON public.listings (city);
CREATE INDEX idx_listings_expired_at ON public.listings (expired_at);
CREATE INDEX idx_listings_published_featured
  ON public.listings (is_featured DESC, created_at DESC)
  WHERE status = 'published';

COMMENT ON TABLE public.listings IS 'Business directory listings';
COMMENT ON COLUMN public.listings.title IS 'Official business name';
COMMENT ON COLUMN public.listings.content IS 'Long description / history from Rich Text Editor (HTML or JSON)';
COMMENT ON COLUMN public.listings.map_iframe_url IS 'Google Maps (or similar) embed iframe URL';
COMMENT ON COLUMN public.listings.expired_at IS 'Premium/listing expiry; NULL means no expiry';

-- =============================================================================
-- SITE SETTINGS (key-value)
-- =============================================================================

CREATE TABLE public.site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT site_settings_key_format CHECK (key ~ '^[a-z0-9]+(?:_[a-z0-9]+)*$')
);

COMMENT ON TABLE public.site_settings IS 'General site settings (site name, hero title, banners, etc.)';

-- =============================================================================
-- UPDATED_AT TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_subcategories_updated_at
  BEFORE UPDATE ON public.subcategories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read: categories & subcategories
CREATE POLICY "Public can read categories"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read subcategories"
  ON public.subcategories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Public read: only published listings
CREATE POLICY "Public can read published listings"
  ON public.listings FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Public read: site settings
CREATE POLICY "Public can read site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Service role / authenticated admin writes are typically done via service_role
-- (bypasses RLS) or future admin policies. Add write policies when auth is ready.

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Fixed UUIDs for predictable testing / FK references
-- Category
INSERT INTO public.categories (id, name, slug, description, icon_name)
VALUES (
  'a1000000-0000-4000-8000-000000000001',
  'Teknologi & IT',
  'teknologi-it',
  'Perusahaan dan layanan di bidang teknologi informasi, software, dan digital.',
  'cpu'
);

-- Subcategories
INSERT INTO public.subcategories (id, category_id, name, slug, description)
VALUES
  (
    'b1000000-0000-4000-8000-000000000001',
    'a1000000-0000-4000-8000-000000000001',
    'Software Development',
    'software-development',
    'Pengembangan aplikasi web, mobile, dan enterprise software.'
  ),
  (
    'b1000000-0000-4000-8000-000000000002',
    'a1000000-0000-4000-8000-000000000001',
    'IT Consulting',
    'it-consulting',
    'Konsultan IT, transformasi digital, dan solusi infrastruktur.'
  );

-- Listing 1: Premium + Featured
INSERT INTO public.listings (
  id,
  title,
  slug,
  logo_url,
  banner_url,
  short_tagline,
  content,
  address,
  city,
  map_iframe_url,
  phone,
  whatsapp,
  email,
  website_url,
  instagram,
  linkedin,
  facebook,
  youtube,
  twitter,
  tiktok,
  status,
  tier,
  is_featured,
  verified_badge,
  view_count,
  subcategory_id,
  expired_at
)
VALUES (
  'c1000000-0000-4000-8000-000000000001',
  'Optisio Digital Solutions',
  'optisio-digital-solutions',
  'https://placehold.co/200x200/0f766e/ffffff?text=Optisio',
  'https://placehold.co/1200x400/134e4a/ffffff?text=Optisio+Banner',
  'Solusi digital profesional untuk bisnis Indonesia',
  '<h2>Tentang Optisio</h2><p>Optisio Digital Solutions adalah perusahaan teknologi yang membantu UMKM dan enterprise membangun kehadiran digital yang kuat.</p><h3>Sejarah</h3><p>Didirikan dengan visi menjadi mitra transformasi digital terpercaya di Indonesia.</p>',
  'Jl. Sudirman No. 123, Senayan',
  'Jakarta Selatan',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sid!4v1700000000000',
  '+622112345678',
  '+6281234567890',
  'hello@optisio.id',
  'https://optisio.id',
  'https://instagram.com/optisio',
  'https://linkedin.com/company/optisio',
  'https://facebook.com/optisio',
  'https://youtube.com/@optisio',
  'https://twitter.com/optisio',
  'https://tiktok.com/@optisio',
  'published',
  'premium',
  true,
  true,
  1280,
  'b1000000-0000-4000-8000-000000000001',
  now() + INTERVAL '1 year'
);

-- Listing 2: Free (not featured)
INSERT INTO public.listings (
  id,
  title,
  slug,
  logo_url,
  banner_url,
  short_tagline,
  content,
  address,
  city,
  map_iframe_url,
  phone,
  whatsapp,
  email,
  website_url,
  instagram,
  linkedin,
  facebook,
  youtube,
  twitter,
  tiktok,
  status,
  tier,
  is_featured,
  verified_badge,
  view_count,
  subcategory_id,
  expired_at
)
VALUES (
  'c1000000-0000-4000-8000-000000000002',
  'Nusantara Code Studio',
  'nusantara-code-studio',
  'https://placehold.co/200x200/1e3a5f/ffffff?text=NCS',
  NULL,
  'Tim developer lokal untuk website & aplikasi UMKM',
  '<p>Nusantara Code Studio fokus membantu UMKM membangun website dan aplikasi sederhana dengan harga terjangkau.</p>',
  'Jl. Malioboro No. 45',
  'Yogyakarta',
  NULL,
  '+622745551234',
  '+6285678901234',
  'halo@nusantaracode.id',
  'https://nusantaracode.id',
  'https://instagram.com/nusantaracode',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'published',
  'free',
  false,
  false,
  87,
  'b1000000-0000-4000-8000-000000000002',
  NULL
);

-- Site settings
INSERT INTO public.site_settings (key, value)
VALUES
  ('site_name', 'Business Directory Indonesia'),
  ('site_tagline', 'by Optisio'),
  ('hero_title', 'Temukan Bisnis Terbaik di Indonesia'),
  ('hero_subtitle', 'Direktori bisnis profesional untuk UMKM, startup, dan enterprise.'),
  ('hero_banner_url', 'https://placehold.co/1600x600/0f172a/e2e8f0?text=Business+Directory+Indonesia'),
  ('contact_email', 'support@optisio.id'),
  ('footer_text', '© Business Directory Indonesia by Optisio. All rights reserved.');
