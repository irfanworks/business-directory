-- Seed: 12 real businesses — Bandung (3), Surabaya (3), Semarang (3), Bali (3)
-- Sources: official company websites / store locators (Sep 2026).
-- Only verified fields are filled.

CREATE OR REPLACE FUNCTION pg_temp.sub_id(p_slug text)
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT id FROM public.subcategories WHERE slug = p_slug LIMIT 1;
$$;

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
    -- ===================== BANDUNG =====================
    (
      'One Eighty Coffee and Music',
      'one-eighty-coffee-and-music',
      'Kafe dan restoran dengan live music di Bandung',
      'Jl. Ganesa No. 3, Lebak Siliwangi, Coblong',
      'Bandung',
      NULL,
      '+6282218000155',
      NULL,
      'https://oneeightycoffeeandmusic.shop',
      NULL,
      'kafe-coffee-shop'
    ),
    (
      'Kartika Sari',
      'kartika-sari',
      'Toko kue dan oleh-oleh khas Bandung',
      'Jl. H. Akbar No. 4, Pasir Kaliki, Cicendo',
      'Bandung',
      '+62224231355',
      '+628112045777',
      'cs.online@kartikasari.com',
      'https://kartikasari.com',
      NULL,
      'restoran'
    ),
    (
      'North Wood Coffee & Eatery',
      'north-wood-coffee-eatery',
      'Coffee shop dan eatery di Bandung',
      'Jl. Gegerkalong Hilir No. 179, Sarijadi, Sukasari',
      'Bandung',
      '+6282119259922',
      NULL,
      'info@northwood.co',
      'https://nowood.site123.me',
      NULL,
      'kafe-coffee-shop'
    ),

    -- ===================== SURABAYA =====================
    (
      'Excelso Coffee Surabaya',
      'excelso-coffee-surabaya',
      'Kantor Excelso Coffee di Surabaya (Kapal Api Group)',
      'Ruko Klampis Jaya, Jl. Klampis Jaya No. 138, Klampis Ngasem, Sukolilo',
      'Surabaya',
      NULL,
      NULL,
      NULL,
      'https://excelso-coffee.com',
      NULL,
      'kafe-coffee-shop'
    ),
    (
      'Steak Hotel by Holycow Pakuwon Mall Surabaya',
      'holycow-pakuwon-mall-surabaya',
      'Restoran steak Holycow di Pakuwon Mall Surabaya',
      'Pakuwon Mall Surabaya Lantai B1 Unit 48, Jl. Puncak Indah Lontar II No. 2, Lontar, Wiyung',
      'Surabaya',
      NULL,
      '+628151808507',
      NULL,
      'https://www.holycowsteak.com/pages/steak-hotel-by-holycow-tkp-surabaya',
      NULL,
      'restoran'
    ),
    (
      'Steak Hotel by Holycow Trans Icon Surabaya',
      'holycow-trans-icon-surabaya',
      'Restoran steak Holycow di Trans Icon Mall Surabaya',
      'Trans Icon Mall Surabaya Lantai GF, Jl. Ahmad Yani No. 260, Menanggal, Gayungan',
      'Surabaya',
      NULL,
      '+628151808507',
      NULL,
      'https://www.holycowsteak.com/pages/steak-hotel-by-holycow-lokasi',
      NULL,
      'restoran'
    ),

    -- ===================== SEMARANG =====================
    (
      'LIKA LIKU',
      'lika-liku-semarang',
      'Restoran dan kafe fusion di Semarang',
      'Jl. Veteran No. 16-18, Lempongsari, Gajahmungkur',
      'Semarang',
      NULL,
      '+628112618820',
      NULL,
      'https://likaliku.shop',
      NULL,
      'restoran'
    ),
    (
      'Steak Hotel by Holycow DP Mall Semarang',
      'holycow-dp-mall-semarang',
      'Restoran steak Holycow di DP Mall Semarang',
      'DP Mall Lantai 2 Unit 25, Jl. Pemuda No. 150, Sekayu, Semarang Tengah',
      'Semarang',
      NULL,
      '+62895354991000',
      NULL,
      'https://www.holycowsteak.com/pages/steak-hotel-by-holycow-tkp-semarang',
      NULL,
      'restoran'
    ),
    (
      'Toko Oen',
      'toko-oen-semarang',
      'Restoran, ice cream palace, dan patisserie bersejarah di Semarang',
      'Jl. Pemuda No. 52',
      'Semarang',
      '+62243541683',
      '+628551231936',
      NULL,
      'https://tokooen.com',
      'https://instagram.com/tokooen.id',
      'restoran'
    ),

    -- ===================== BALI =====================
    (
      'Sisterfields',
      'sisterfields-seminyak',
      'Cafe breakfast dan brunch di Seminyak, Bali',
      'Jl. Kayu Cendana No. 7, Kerobokan Kelod, Kuta Utara, Badung',
      'Bali',
      NULL,
      '+628113860507',
      NULL,
      'https://sisterfieldsbali.com',
      NULL,
      'kafe-coffee-shop'
    ),
    (
      'Cafe Bali Seminyak',
      'cafe-bali-seminyak',
      'Cafe di jantung Seminyak, Bali',
      'Jl. Kayu Aya / Laksmana, Kerobokan Kelod, Kuta Utara, Badung',
      'Bali',
      '+62361736484',
      '+6281243181679',
      'info@cafebaliseminyak.com',
      'https://cafebaliseminyak.com',
      'https://instagram.com/cafebaliseminyak',
      'kafe-coffee-shop'
    ),
    (
      'Kilo Kitchen Bali',
      'kilo-kitchen-bali',
      'Restoran fusion Latin-Asian di Seminyak, Bali',
      'Jl. Drupadi No. 22, Seminyak, Kuta, Badung',
      'Bali',
      NULL,
      '+6281246167618',
      'office@kilobali.com',
      'https://kiloseminyak.com',
      NULL,
      'restoran'
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
