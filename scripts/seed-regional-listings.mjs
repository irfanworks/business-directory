/**
 * Seed 12 real listings: Bandung, Surabaya, Semarang, Bali.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   OR run: supabase/migrations/009_seed_bandung_surabaya_semarang_bali.sql
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-regional-listings.mjs
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Run supabase/migrations/009_seed_bandung_surabaya_semarang_bali.sql in Supabase SQL Editor instead.",
  );
  process.exit(1);
}

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  "Content-Type": "application/json",
};

async function rest(path, init = {}) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${path} → ${res.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

const LISTINGS = [
  {
    title: "One Eighty Coffee and Music",
    slug: "one-eighty-coffee-and-music",
    short_tagline: "Kafe dan restoran dengan live music di Bandung",
    address: "Jl. Ganesa No. 3, Lebak Siliwangi, Coblong",
    city: "Bandung",
    whatsapp: "+6282218000155",
    website_url: "https://oneeightycoffeeandmusic.shop",
    sub_slug: "kafe-coffee-shop",
  },
  {
    title: "Kartika Sari",
    slug: "kartika-sari",
    short_tagline: "Toko kue dan oleh-oleh khas Bandung",
    address: "Jl. H. Akbar No. 4, Pasir Kaliki, Cicendo",
    city: "Bandung",
    phone: "+62224231355",
    whatsapp: "+628112045777",
    email: "cs.online@kartikasari.com",
    website_url: "https://kartikasari.com",
    sub_slug: "restoran",
  },
  {
    title: "North Wood Coffee & Eatery",
    slug: "north-wood-coffee-eatery",
    short_tagline: "Coffee shop dan eatery di Bandung",
    address: "Jl. Gegerkalong Hilir No. 179, Sarijadi, Sukasari",
    city: "Bandung",
    phone: "+6282119259922",
    email: "info@northwood.co",
    website_url: "https://nowood.site123.me",
    sub_slug: "kafe-coffee-shop",
  },
  {
    title: "Excelso Coffee Surabaya",
    slug: "excelso-coffee-surabaya",
    short_tagline: "Kantor Excelso Coffee di Surabaya (Kapal Api Group)",
    address:
      "Ruko Klampis Jaya, Jl. Klampis Jaya No. 138, Klampis Ngasem, Sukolilo",
    city: "Surabaya",
    website_url: "https://excelso-coffee.com",
    sub_slug: "kafe-coffee-shop",
  },
  {
    title: "Steak Hotel by Holycow Pakuwon Mall Surabaya",
    slug: "holycow-pakuwon-mall-surabaya",
    short_tagline: "Restoran steak Holycow di Pakuwon Mall Surabaya",
    address:
      "Pakuwon Mall Surabaya Lantai B1 Unit 48, Jl. Puncak Indah Lontar II No. 2, Lontar, Wiyung",
    city: "Surabaya",
    whatsapp: "+628151808507",
    website_url:
      "https://www.holycowsteak.com/pages/steak-hotel-by-holycow-tkp-surabaya",
    sub_slug: "restoran",
  },
  {
    title: "Steak Hotel by Holycow Trans Icon Surabaya",
    slug: "holycow-trans-icon-surabaya",
    short_tagline: "Restoran steak Holycow di Trans Icon Mall Surabaya",
    address:
      "Trans Icon Mall Surabaya Lantai GF, Jl. Ahmad Yani No. 260, Menanggal, Gayungan",
    city: "Surabaya",
    whatsapp: "+628151808507",
    website_url:
      "https://www.holycowsteak.com/pages/steak-hotel-by-holycow-lokasi",
    sub_slug: "restoran",
  },
  {
    title: "LIKA LIKU",
    slug: "lika-liku-semarang",
    short_tagline: "Restoran dan kafe fusion di Semarang",
    address: "Jl. Veteran No. 16-18, Lempongsari, Gajahmungkur",
    city: "Semarang",
    whatsapp: "+628112618820",
    website_url: "https://likaliku.shop",
    sub_slug: "restoran",
  },
  {
    title: "Steak Hotel by Holycow DP Mall Semarang",
    slug: "holycow-dp-mall-semarang",
    short_tagline: "Restoran steak Holycow di DP Mall Semarang",
    address:
      "DP Mall Lantai 2 Unit 25, Jl. Pemuda No. 150, Sekayu, Semarang Tengah",
    city: "Semarang",
    whatsapp: "+62895354991000",
    website_url:
      "https://www.holycowsteak.com/pages/steak-hotel-by-holycow-tkp-semarang",
    sub_slug: "restoran",
  },
  {
    title: "Toko Oen",
    slug: "toko-oen-semarang",
    short_tagline:
      "Restoran, ice cream palace, dan patisserie bersejarah di Semarang",
    address: "Jl. Pemuda No. 52",
    city: "Semarang",
    phone: "+62243541683",
    whatsapp: "+628551231936",
    website_url: "https://tokooen.com",
    instagram: "https://instagram.com/tokooen.id",
    sub_slug: "restoran",
  },
  {
    title: "Sisterfields",
    slug: "sisterfields-seminyak",
    short_tagline: "Cafe breakfast dan brunch di Seminyak, Bali",
    address: "Jl. Kayu Cendana No. 7, Kerobokan Kelod, Kuta Utara, Badung",
    city: "Bali",
    whatsapp: "+628113860507",
    website_url: "https://sisterfieldsbali.com",
    sub_slug: "kafe-coffee-shop",
  },
  {
    title: "Cafe Bali Seminyak",
    slug: "cafe-bali-seminyak",
    short_tagline: "Cafe di jantung Seminyak, Bali",
    address: "Jl. Kayu Aya / Laksmana, Kerobokan Kelod, Kuta Utara, Badung",
    city: "Bali",
    phone: "+62361736484",
    whatsapp: "+6281243181679",
    email: "info@cafebaliseminyak.com",
    website_url: "https://cafebaliseminyak.com",
    instagram: "https://instagram.com/cafebaliseminyak",
    sub_slug: "kafe-coffee-shop",
  },
  {
    title: "Kilo Kitchen Bali",
    slug: "kilo-kitchen-bali",
    short_tagline: "Restoran fusion Latin-Asian di Seminyak, Bali",
    address: "Jl. Drupadi No. 22, Seminyak, Kuta, Badung",
    city: "Bali",
    whatsapp: "+6281246167618",
    email: "office@kilobali.com",
    website_url: "https://kiloseminyak.com",
    sub_slug: "restoran",
  },
];

async function main() {
  const slugs = [
    ...new Set(LISTINGS.map((l) => l.sub_slug)),
  ];
  const subs = await rest(
    `subcategories?select=id,slug&slug=in.(${slugs.join(",")})`,
  );
  const bySlug = Object.fromEntries(subs.map((s) => [s.slug, s.id]));

  let inserted = 0;
  let skipped = 0;

  for (const row of LISTINGS) {
    const existing = await rest(
      `listings?select=id&slug=eq.${encodeURIComponent(row.slug)}`,
    );
    if (existing?.length) {
      console.log(`skip ${row.slug}`);
      skipped += 1;
      continue;
    }
    const subcategory_id = bySlug[row.sub_slug];
    if (!subcategory_id) throw new Error(`Missing sub: ${row.sub_slug}`);

    await rest("listings", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        title: row.title,
        slug: row.slug,
        short_tagline: row.short_tagline || null,
        address: row.address || null,
        city: row.city || null,
        phone: row.phone || null,
        whatsapp: row.whatsapp || null,
        email: row.email || null,
        website_url: row.website_url || null,
        instagram: row.instagram || null,
        status: "published",
        tier: "free",
        is_featured: false,
        verified_badge: false,
        subcategory_id,
      }),
    });
    console.log(`+ ${row.city}: ${row.title}`);
    inserted += 1;
  }

  console.log(`Done. inserted=${inserted} skipped=${skipped}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
