/**
 * Seed 20 real Jakarta listings into Supabase.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (Project Settings → API).
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-jakarta-listings.mjs
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Add SUPABASE_SERVICE_ROLE_KEY to .env.local, then re-run.\n" +
      "Alternatively run supabase/migrations/008_seed_jakarta_listings.sql in the SQL Editor.",
  );
  process.exit(1);
}

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

async function rest(path, init = {}) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers || {}) },
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  if (!res.ok) {
    throw new Error(`${init.method || "GET"} ${path} → ${res.status}: ${text}`);
  }
  return json;
}

const CATEGORIES = {
  fnb: "60f52e50-2631-4000-99c6-321ef3806a76",
  retail: "53481c29-b28f-4089-9105-747495649baa",
  transport: "e4a532e2-1cdf-4ccb-93d2-a6d9eeaf5969",
  health: "9f65091c-2bad-471b-834a-8f65bfa0c79a",
  beauty: "ae2e3438-0450-421e-a650-8c317ac13bf4",
  tech: "a1000000-0000-4000-8000-000000000001",
  education: "fdfe3d15-2aac-49fa-8291-bc9cc9d6cb2a",
};

const SUBCATEGORIES = [
  {
    id: "d1000000-0000-4000-8000-000000000001",
    category_id: CATEGORIES.fnb,
    name: "Restoran",
    slug: "restoran",
    description: "Restoran, fine dining, dan tempat makan formal.",
  },
  {
    id: "d1000000-0000-4000-8000-000000000002",
    category_id: CATEGORIES.fnb,
    name: "Kafe & Coffee Shop",
    slug: "kafe-coffee-shop",
    description: "Kafe, coffee shop, dan specialty coffee.",
  },
  {
    id: "d1000000-0000-4000-8000-000000000003",
    category_id: CATEGORIES.retail,
    name: "E-commerce & Marketplace",
    slug: "e-commerce-marketplace",
    description: "Toko online, marketplace, dan retail digital.",
  },
  {
    id: "d1000000-0000-4000-8000-000000000004",
    category_id: CATEGORIES.transport,
    name: "Transportasi Online",
    slug: "transportasi-online",
    description: "Ride-hailing, pengantaran, dan mobilitas digital.",
  },
  {
    id: "d1000000-0000-4000-8000-000000000005",
    category_id: CATEGORIES.transport,
    name: "Taksi & Armada",
    slug: "taksi-armada",
    description: "Layanan taksi dan transportasi armada.",
  },
  {
    id: "d1000000-0000-4000-8000-000000000006",
    category_id: CATEGORIES.health,
    name: "Klinik & Laboratorium",
    slug: "klinik-laboratorium",
    description: "Klinik, laboratorium, dan layanan diagnostik.",
  },
  {
    id: "d1000000-0000-4000-8000-000000000007",
    category_id: CATEGORIES.health,
    name: "Kesehatan Digital",
    slug: "kesehatan-digital",
    description: "Telemedicine, apotek online, dan healthtech.",
  },
  {
    id: "d1000000-0000-4000-8000-000000000008",
    category_id: CATEGORIES.beauty,
    name: "Beauty Retail & E-commerce",
    slug: "beauty-retail-e-commerce",
    description: "Retail dan e-commerce produk kecantikan.",
  },
  {
    id: "d1000000-0000-4000-8000-000000000009",
    category_id: CATEGORIES.tech,
    name: "Travel Tech",
    slug: "travel-tech",
    description: "Platform pemesanan perjalanan dan lifestyle digital.",
  },
  {
    id: "d1000000-0000-4000-8000-00000000000a",
    category_id: CATEGORIES.retail,
    name: "Furniture & Home Living",
    slug: "furniture-home-living",
    description: "Retail furnitur dan perlengkapan rumah.",
  },
  {
    id: "d1000000-0000-4000-8000-00000000000b",
    category_id: CATEGORIES.education,
    name: "EdTech",
    slug: "edtech",
    description: "Platform pendidikan dan pembelajaran digital.",
  },
  {
    id: "d1000000-0000-4000-8000-00000000000c",
    category_id: CATEGORIES.retail,
    name: "Hardware & DIY",
    slug: "hardware-diy",
    description: "Retail peralatan rumah, perkakas, dan DIY.",
  },
];

/** @type {Array<Record<string, string | null>>} */
const LISTINGS = [
  {
    title: "Gojek",
    slug: "gojek",
    short_tagline: "Super app transportasi, pengantaran, dan pembayaran",
    address:
      "Pasaraya Blok M Gedung B Lt. 6, Jl. Iskandarsyah II No. 7, Melawai, Kebayoran Baru",
    city: "Jakarta Selatan",
    website_url: "https://www.gojek.com",
    sub_slug: "transportasi-online",
  },
  {
    title: "Tokopedia",
    slug: "tokopedia",
    short_tagline: "Marketplace dan ekosistem e-commerce Indonesia",
    address:
      "Millennium Centennial Center, Lantai 28, Jl. Jenderal Sudirman Kav. 25, Karet, Setiabudi",
    city: "Jakarta Selatan",
    website_url: "https://www.tokopedia.com",
    sub_slug: "e-commerce-marketplace",
  },
  {
    title: "Traveloka",
    slug: "traveloka",
    short_tagline: "Platform pemesanan tiket perjalanan dan lifestyle",
    city: "Jakarta",
    phone: "+622130122077",
    website_url: "https://www.traveloka.com",
    sub_slug: "travel-tech",
  },
  {
    title: "Kopi Kenangan",
    slug: "kopi-kenangan",
    short_tagline: "Jaringan coffee shop grab-and-go Indonesia",
    address:
      "Plaza Blok M, Lantai 7, Jl. Bulungan No. 76, Kramat Pela, Kebayoran Baru",
    city: "Jakarta Selatan",
    website_url: "https://kopikenangan.com",
    instagram: "https://instagram.com/kopikenangan.id",
    sub_slug: "kafe-coffee-shop",
  },
  {
    title: "Fore Coffee",
    slug: "fore-coffee",
    short_tagline: "Specialty coffee chain asal Indonesia",
    address:
      "Thamrin Plaza, Jl. M.H. Thamrin Kav. 8-9 Lt. PH, Kebon Melati, Tanah Abang",
    city: "Jakarta Pusat",
    phone: "+6281211118456",
    email: "hello@fore.coffee",
    website_url: "https://fore.coffee",
    sub_slug: "kafe-coffee-shop",
  },
  {
    title: "August Jakarta",
    slug: "august-jakarta",
    short_tagline: "Restoran fine dining modern dengan pengaruh Indonesia",
    address:
      "Sequis Tower, Ground Floor #03-02, Jl. Jenderal Sudirman Kav. 71",
    city: "Jakarta Selatan",
    whatsapp: "+6287738000808",
    email: "rsvp@augustjakarta.com",
    website_url: "https://www.augustjakarta.com",
    sub_slug: "restoran",
  },
  {
    title: "FOG Jakarta",
    slug: "fog-jakarta",
    short_tagline: "Restoran Italian-Japanese di Mega Kuningan",
    address:
      "Ground Floor, Arden Grove Mall, Jl. Mega Kuningan Barat No. 3, Mega Kuningan",
    city: "Jakarta Selatan",
    whatsapp: "+6281113021770",
    email: "reservation@fog-dining.com",
    website_url: "https://fog-dining.com",
    sub_slug: "restoran",
  },
  {
    title: "Defensa Coffee Outpost",
    slug: "defensa-coffee-outpost",
    short_tagline: "Specialty coffee dan workspace di Kebayoran Baru",
    address: "Jl. Wijaya I No. 73, Kebayoran Baru",
    city: "Jakarta Selatan",
    whatsapp: "+6285219690497",
    website_url: "https://defensa.id",
    sub_slug: "kafe-coffee-shop",
  },
  {
    title: "Medizen Clinic",
    slug: "medizen-clinic",
    short_tagline: "Klinik umum, gigi, dan laboratorium di Jakarta Selatan",
    address:
      "RDTX Square, Lobby Podium Lantai 2, Jl. Prof. Dr. Satrio No. 164",
    city: "Jakarta Selatan",
    phone: "+6282210383388",
    whatsapp: "+6282166888382",
    email: "admin@medizen.co.id",
    website_url: "https://medizen.co.id",
    sub_slug: "klinik-laboratorium",
  },
  {
    title: "Halodoc",
    slug: "halodoc",
    short_tagline:
      "Platform kesehatan digital: konsultasi dokter, apotek, dan lab",
    address: "Halodoc Building, Jl. H.R. Rasuna Said Kav. B32-33, Kuningan",
    city: "Jakarta Selatan",
    phone: "+622150959900",
    website_url: "https://www.halodoc.com",
    sub_slug: "kesehatan-digital",
  },
  {
    title: "Bluebird",
    slug: "bluebird",
    short_tagline: "Layanan taksi dan transportasi Bluebird Group",
    address: "Jl. Mampang Prapatan Raya No. 60",
    city: "Jakarta Selatan",
    phone: "+62217971245",
    whatsapp: "+6281117941234",
    email: "customercare@bluebirdgroup.com",
    website_url: "https://www.bluebirdgroup.com",
    sub_slug: "taksi-armada",
  },
  {
    title: "Ruangguru",
    slug: "ruangguru",
    short_tagline: "Platform pendidikan dan bimbingan belajar digital",
    city: "Jakarta",
    phone: "+622130930000",
    email: "info@ruangguru.com",
    website_url: "https://www.ruangguru.com",
    sub_slug: "edtech",
  },
  {
    title: "Blibli",
    slug: "blibli",
    short_tagline: "Platform e-commerce dan omnichannel Indonesia",
    address: "Gedung Sarana Jaya, Jl. Budi Kemuliaan I No. 1, Gambir",
    city: "Jakarta Pusat",
    phone: "08041871871",
    website_url: "https://www.blibli.com",
    sub_slug: "e-commerce-marketplace",
  },
  {
    title: "Sociolla",
    slug: "sociolla",
    short_tagline: "E-commerce beauty dan produk perawatan diri",
    city: "Jakarta",
    whatsapp: "+62811987881",
    email: "cs@sociolla.com",
    website_url: "https://www.sociolla.com",
    sub_slug: "beauty-retail-e-commerce",
  },
  {
    title: "Prodia",
    slug: "prodia",
    short_tagline: "Jaringan laboratorium klinik dan layanan diagnostik",
    address: "Prodia Tower, Jl. Kramat Raya No. 150",
    city: "Jakarta Pusat",
    phone: "+62213144182",
    whatsapp: "+628551500830",
    email: "info@prodia.co.id",
    website_url: "https://www.prodia.co.id",
    instagram: "https://instagram.com/prodia_lab",
    sub_slug: "klinik-laboratorium",
  },
  {
    title: "Informa",
    slug: "informa",
    short_tagline: "Retail furnitur dan perlengkapan rumah",
    address: "Jl. Puri Kencana No. 1, RT.6/RW.2, Kembangan Selatan",
    city: "Jakarta Barat",
    website_url: "https://www.informa.co.id",
    sub_slug: "furniture-home-living",
  },
  {
    title: "Grab Indonesia",
    slug: "grab-indonesia",
    short_tagline: "Super app transportasi, pengantaran, dan pembayaran",
    address:
      "Lippo Kuningan Lt. 27, Jl. H.R. Rasuna Said Kav. B-12, Karet Kuningan",
    city: "Jakarta Selatan",
    website_url: "https://www.grab.com/id",
    sub_slug: "transportasi-online",
  },
  {
    title: "Janji Jiwa",
    slug: "janji-jiwa",
    short_tagline: "Jaringan coffee shop dari Jiwa Group",
    city: "Jakarta",
    website_url: "https://jiwagroup.com",
    instagram: "https://instagram.com/kopijanjijiwa",
    sub_slug: "kafe-coffee-shop",
  },
  {
    title: "Mekari",
    slug: "mekari",
    short_tagline: "Software bisnis untuk HR, akuntansi, dan operasional",
    address:
      "MidPlaza 2, Jl. Jenderal Sudirman No. 4, Karet Tengsin, Tanah Abang",
    city: "Jakarta Pusat",
    phone: "+622150501500",
    website_url: "https://mekari.com",
    sub_slug: "software-development",
  },
  {
    title: "ACE Hardware Indonesia",
    slug: "ace-hardware-indonesia",
    short_tagline: "Retail peralatan rumah tangga, perkakas, dan DIY",
    address:
      "Gedung Kawan Lama Lt. 5, Jl. Puri Kencana No. 1, Meruya, Kembangan",
    city: "Jakarta Barat",
    phone: "+62215822222",
    website_url: "https://www.acehardware.co.id",
    sub_slug: "hardware-diy",
  },
];

async function main() {
  console.log("Ensuring subcategories…");
  for (const sub of SUBCATEGORIES) {
    await rest("subcategories?on_conflict=category_id,slug", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify(sub),
    });
  }

  const subs = await rest(
    "subcategories?select=id,slug&slug=in.(" +
      SUBCATEGORIES.map((s) => s.slug).concat(["software-development"]).join(",") +
      ")",
  );
  const bySlug = Object.fromEntries(subs.map((s) => [s.slug, s.id]));

  // existing software-development from seed
  if (!bySlug["software-development"]) {
    const existing = await rest(
      "subcategories?select=id,slug&slug=eq.software-development",
    );
    if (existing[0]) bySlug["software-development"] = existing[0].id;
  }

  console.log("Inserting listings…");
  let inserted = 0;
  let skipped = 0;

  for (const row of LISTINGS) {
    const existing = await rest(
      `listings?select=id,slug&slug=eq.${encodeURIComponent(row.slug)}`,
    );
    if (existing?.length) {
      console.log(`  skip (exists): ${row.slug}`);
      skipped += 1;
      continue;
    }

    const subcategory_id = bySlug[row.sub_slug];
    if (!subcategory_id) {
      throw new Error(`Missing subcategory: ${row.sub_slug}`);
    }

    const payload = {
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
    };

    await rest("listings", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    });
    console.log(`  + ${row.title}`);
    inserted += 1;
  }

  console.log(`\nDone. inserted=${inserted} skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
