-- Share-friendly Google Maps URL (maps.app.goo.gl, share.google, etc.)
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS maps_url TEXT;

COMMENT ON COLUMN public.listings.maps_url IS
  'Public Google Maps share/page URL for “Open in Maps”; map_iframe_url holds embed src';
