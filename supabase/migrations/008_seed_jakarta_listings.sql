-- Seed: 20 real Jakarta businesses + needed subcategories
-- Verified from official company websites / contact pages (Sep 2026).
-- Only known fields are filled; unknown fields stay NULL.

-- ---------------------------------------------------------------------------
-- Subcategories (idempotent by category_id + slug)
-- ---------------------------------------------------------------------------
INSERT INTO public.subcategories (id, category_id, name, slug, description)
VALUES
  (
    'd1000000-0000-4000-8000-000000000001',
    '60f52e50-2631-4000-99c6-321ef3806a76',
    'Restoran',
    'restoran',
    'Restoran, fine dining, dan tempat makan formal.'
  ),
  (
    'd1000000-0000-4000-8000-000000000002',
    '60f52e50-2631-4000-99c6-321ef3806a76',
    'Kafe & Coffee Shop',
    'kafe-coffee-shop',
    'Kafe, coffee shop, dan specialty coffee.'
  ),
  (
    'd1000000-0000-4000-8000-000000000003',
    '53481c29-b28f-4089-9105-747495649baa',
    'E-commerce & Marketplace',
    'e-commerce-marketplace',
    'Toko online, marketplace, dan retail digital.'
  ),
  (
    'd1000000-0000-4000-8000-000000000004',
    'e4a532e2-1cdf-4ccb-93d2-a6d9eeaf5969',
    'Transportasi Online',
    'transportasi-online',
    'Ride-hailing, pengantaran, dan mobilitas digital.'
  ),
  (
    'd1000000-0000-4000-8000-000000000005',
    'e4a532e2-1cdf-4ccb-93d2-a6d9eeaf5969',
    'Taksi & Armada',
    'taksi-armada',
    'Layanan taksi dan transportasi armada.'
  ),
  (
    'd1000000-0000-4000-8000-000000000006',
    '9f65091c-2bad-471b-834a-8f65bfa0c79a',
    'Klinik & Laboratorium',
    'klinik-laboratorium',
    'Klinik, laboratorium, dan layanan diagnostik.'
  ),
  (
    'd1000000-0000-4000-8000-000000000007',
    '9f65091c-2bad-471b-834a-8f65bfa0c79a',
    'Kesehatan Digital',
    'kesehatan-digital',
    'Telemedicine, apotek online, dan healthtech.'
  ),
  (
    'd1000000-0000-4000-8000-000000000008',
    'ae2e3438-0450-421e-a650-8c317ac13bf4',
    'Beauty Retail & E-commerce',
    'beauty-retail-e-commerce',
    'Retail dan e-commerce produk kecantikan.'
  ),
  (
    'd1000000-0000-4000-8000-000000000009',
    'a1000000-0000-4000-8000-000000000001',
    'Travel Tech',
    'travel-tech',
    'Platform pemesanan perjalanan dan lifestyle digital.'
  ),
  (
    'd1000000-0000-4000-8000-00000000000a',
    '53481c29-b28f-4089-9105-747495649baa',
    'Furniture & Home Living',
    'furniture-home-living',
    'Retail furnitur dan perlengkapan rumah.'
  ),
  (
    'd1000000-0000-4000-8000-00000000000b',
    'fdfe3d15-2aac-49fa-8291-bc9cc9d6cb2a',
    'EdTech',
    'edtech',
    'Platform pendidikan dan pembelajaran digital.'
  ),
  (
    'd1000000-0000-4000-8000-00000000000c',
    '53481c29-b28f-4089-9105-747495649baa',
    'Hardware & DIY',
    'hardware-diy',
    'Retail peralatan rumah, perkakas, dan DIY.'
  )
ON CONFLICT (category_id, slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Helper: resolve subcategory id by slug
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION pg_temp.sub_id(p_slug text)
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT id FROM public.subcategories WHERE slug = p_slug LIMIT 1;
$$;

-- ---------------------------------------------------------------------------
-- Listings (skip existing slugs)
-- ---------------------------------------------------------------------------
INSERT INTO public.listings (
  title,
  slug,
  short_tagline,
  address,
  city,
  phone,
  whatsapp,
  email,
  website_url,
  instagram,
  status,
  tier,
  is_featured,
  verified_badge,
  subcategory_id
)
SELECT
  v.title,
  v.slug,
  v.short_tagline,
  v.address,
  v.city,
  v.phone,
  v.whatsapp,
  v.email,
  v.website_url,
  v.instagram,
  'published'::public.listing_status,
  'free'::public.listing_tier,
  false,
  false,
  pg_temp.sub_id(v.sub_slug)
FROM (
  VALUES
    (
      'Gojek',
      'gojek',
      'Super app transportasi, pengantaran, dan pembayaran',
      'Pasaraya Blok M Gedung B Lt. 6, Jl. Iskandarsyah II No. 7, Melawai, Kebayoran Baru',
      'Jakarta Selatan',
      NULL,
      NULL,
      NULL,
      'https://www.gojek.com',
      NULL,
      'transportasi-online'
    ),
    (
      'Tokopedia',
      'tokopedia',
      'Marketplace dan ekosistem e-commerce Indonesia',
      'Millennium Centennial Center, Lantai 28, Jl. Jenderal Sudirman Kav. 25, Karet, Setiabudi',
      'Jakarta Selatan',
      NULL,
      NULL,
      NULL,
      'https://www.tokopedia.com',
      NULL,
      'e-commerce-marketplace'
    ),
    (
      'Traveloka',
      'traveloka',
      'Platform pemesanan tiket perjalanan dan lifestyle',
      NULL,
      'Jakarta',
      '+622130122077',
      NULL,
      NULL,
      'https://www.traveloka.com',
      NULL,
      'travel-tech'
    ),
    (
      'Kopi Kenangan',
      'kopi-kenangan',
      'Jaringan coffee shop grab-and-go Indonesia',
      'Plaza Blok M, Lantai 7, Jl. Bulungan No. 76, Kramat Pela, Kebayoran Baru',
      'Jakarta Selatan',
      NULL,
      NULL,
      NULL,
      'https://kopikenangan.com',
      'https://instagram.com/kopikenangan.id',
      'kafe-coffee-shop'
    ),
    (
      'Fore Coffee',
      'fore-coffee',
      'Specialty coffee chain asal Indonesia',
      'Thamrin Plaza, Jl. M.H. Thamrin Kav. 8-9 Lt. PH, Kebon Melati, Tanah Abang',
      'Jakarta Pusat',
      '+6281211118456',
      NULL,
      'hello@fore.coffee',
      'https://fore.coffee',
      NULL,
      'kafe-coffee-shop'
    ),
    (
      'August Jakarta',
      'august-jakarta',
      'Restoran fine dining modern dengan pengaruh Indonesia',
      'Sequis Tower, Ground Floor #03-02, Jl. Jenderal Sudirman Kav. 71',
      'Jakarta Selatan',
      NULL,
      '+6287738000808',
      'rsvp@augustjakarta.com',
      'https://www.augustjakarta.com',
      NULL,
      'restoran'
    ),
    (
      'FOG Jakarta',
      'fog-jakarta',
      'Restoran Italian-Japanese di Mega Kuningan',
      'Ground Floor, Arden Grove Mall, Jl. Mega Kuningan Barat No. 3, Mega Kuningan',
      'Jakarta Selatan',
      NULL,
      '+6281113021770',
      'reservation@fog-dining.com',
      'https://fog-dining.com',
      NULL,
      'restoran'
    ),
    (
      'Defensa Coffee Outpost',
      'defensa-coffee-outpost',
      'Specialty coffee dan workspace di Kebayoran Baru',
      'Jl. Wijaya I No. 73, Kebayoran Baru',
      'Jakarta Selatan',
      NULL,
      '+6285219690497',
      NULL,
      'https://defensa.id',
      NULL,
      'kafe-coffee-shop'
    ),
    (
      'Medizen Clinic',
      'medizen-clinic',
      'Klinik umum, gigi, dan laboratorium di Jakarta Selatan',
      'RDTX Square, Lobby Podium Lantai 2, Jl. Prof. Dr. Satrio No. 164',
      'Jakarta Selatan',
      '+6282210383388',
      '+6282166888382',
      'admin@medizen.co.id',
      'https://medizen.co.id',
      NULL,
      'klinik-laboratorium'
    ),
    (
      'Halodoc',
      'halodoc',
      'Platform kesehatan digital: konsultasi dokter, apotek, dan lab',
      'Halodoc Building, Jl. H.R. Rasuna Said Kav. B32-33, Kuningan',
      'Jakarta Selatan',
      '+622150959900',
      NULL,
      NULL,
      'https://www.halodoc.com',
      NULL,
      'kesehatan-digital'
    ),
    (
      'Bluebird',
      'bluebird',
      'Layanan taksi dan transportasi Bluebird Group',
      'Jl. Mampang Prapatan Raya No. 60',
      'Jakarta Selatan',
      '+62217971245',
      '+6281117941234',
      'customercare@bluebirdgroup.com',
      'https://www.bluebirdgroup.com',
      NULL,
      'taksi-armada'
    ),
    (
      'Ruangguru',
      'ruangguru',
      'Platform pendidikan dan bimbingan belajar digital',
      NULL,
      'Jakarta',
      '+622130930000',
      NULL,
      'info@ruangguru.com',
      'https://www.ruangguru.com',
      NULL,
      'edtech'
    ),
    (
      'Blibli',
      'blibli',
      'Platform e-commerce dan omnichannel Indonesia',
      'Gedung Sarana Jaya, Jl. Budi Kemuliaan I No. 1, Gambir',
      'Jakarta Pusat',
      '08041871871',
      NULL,
      NULL,
      'https://www.blibli.com',
      NULL,
      'e-commerce-marketplace'
    ),
    (
      'Sociolla',
      'sociolla',
      'E-commerce beauty dan produk perawatan diri',
      NULL,
      'Jakarta',
      NULL,
      '+62811987881',
      'cs@sociolla.com',
      'https://www.sociolla.com',
      NULL,
      'beauty-retail-e-commerce'
    ),
    (
      'Prodia',
      'prodia',
      'Jaringan laboratorium klinik dan layanan diagnostik',
      'Prodia Tower, Jl. Kramat Raya No. 150',
      'Jakarta Pusat',
      '+62213144182',
      '+628551500830',
      'info@prodia.co.id',
      'https://www.prodia.co.id',
      'https://instagram.com/prodia_lab',
      'klinik-laboratorium'
    ),
    (
      'Informa',
      'informa',
      'Retail furnitur dan perlengkapan rumah',
      'Jl. Puri Kencana No. 1, RT.6/RW.2, Kembangan Selatan',
      'Jakarta Barat',
      NULL,
      NULL,
      NULL,
      'https://www.informa.co.id',
      NULL,
      'furniture-home-living'
    ),
    (
      'Grab Indonesia',
      'grab-indonesia',
      'Super app transportasi, pengantaran, dan pembayaran',
      'Lippo Kuningan Lt. 27, Jl. H.R. Rasuna Said Kav. B-12, Karet Kuningan',
      'Jakarta Selatan',
      NULL,
      NULL,
      NULL,
      'https://www.grab.com/id',
      NULL,
      'transportasi-online'
    ),
    (
      'Janji Jiwa',
      'janji-jiwa',
      'Jaringan coffee shop dari Jiwa Group',
      NULL,
      'Jakarta',
      NULL,
      NULL,
      NULL,
      'https://jiwagroup.com',
      'https://instagram.com/kopijanjijiwa',
      'kafe-coffee-shop'
    ),
    (
      'Mekari',
      'mekari',
      'Software bisnis untuk HR, akuntansi, dan operasional',
      'MidPlaza 2, Jl. Jenderal Sudirman No. 4, Karet Tengsin, Tanah Abang',
      'Jakarta Pusat',
      '+622150501500',
      NULL,
      NULL,
      'https://mekari.com',
      NULL,
      'software-development'
    ),
    (
      'ACE Hardware Indonesia',
      'ace-hardware-indonesia',
      'Retail peralatan rumah tangga, perkakas, dan DIY',
      'Gedung Kawan Lama Lt. 5, Jl. Puri Kencana No. 1, Meruya, Kembangan',
      'Jakarta Barat',
      '+62215822222',
      NULL,
      NULL,
      'https://www.acehardware.co.id',
      NULL,
      'hardware-diy'
    )
) AS v(
  title,
  slug,
  short_tagline,
  address,
  city,
  phone,
  whatsapp,
  email,
  website_url,
  instagram,
  sub_slug
)
WHERE NOT EXISTS (
  SELECT 1 FROM public.listings l WHERE l.slug = v.slug
)
AND pg_temp.sub_id(v.sub_slug) IS NOT NULL;
