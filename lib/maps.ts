/**
 * Google Maps helpers — Business Profile share links → precise embeds.
 *
 * Priority for embed precision:
 * 1. Official embed URL / iframe src
 * 2. Business Profile CID (0x…:0x… or ?cid=)
 * 3. Place pin coords (!3d!4d)
 * 4. Knowledge Graph mid (/g/…) from share.google
 * 5. Viewport @lat,lng (less precise)
 * Address text is only used when no Maps URL was provided.
 */

export function locationQuery(address?: string | null, city?: string | null) {
  return [address?.trim(), city?.trim()].filter(Boolean).join(", ");
}

/** Embed from free-text query (address / lat,lng / place name). Prefer pin helpers instead. */
export function buildEmbedFromQuery(query: string, zoom = 15) {
  const q = query.trim();
  if (!q) return null;
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&output=embed`;
}

export function buildEmbedFromLatLng(lat: string, lng: string, zoom = 17) {
  return buildEmbedFromQuery(`${lat},${lng}`, zoom);
}

/** Business Profile CID embed — pins the exact listing, not a street address. */
export function buildEmbedFromCid(cid: string) {
  const id = cid.trim();
  if (!/^\d+$/.test(id)) return null;
  return `https://www.google.com/maps?cid=${id}&output=embed`;
}

/** Knowledge Graph / entity mid (share.google → /g/xxxx). */
export function buildEmbedFromKgMid(mid: string) {
  const m = mid.trim();
  if (!m.startsWith("/g/")) return null;
  return buildEmbedFromQuery(m, 17);
}

/** “Open in Google Maps” link from a free-text query. */
export function buildMapsOpenUrl(query: string) {
  const q = query.trim();
  if (!q) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function isGoogleMapsEmbedUrl(url: string) {
  try {
    const u = new URL(url.trim());
    if (!/(^|\.)google\./i.test(u.hostname) && u.hostname !== "maps.google.com") {
      return false;
    }
    return (
      u.pathname.includes("/maps/embed") ||
      u.searchParams.get("output") === "embed"
    );
  } catch {
    return false;
  }
}

export function isLikelyMapsShareOrPageUrl(url: string) {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.toLowerCase();
    if (
      host === "maps.app.goo.gl" ||
      host === "goo.gl" ||
      host === "g.co" ||
      host === "share.google"
    ) {
      return true;
    }
    if (/(^|\.)google\./i.test(host) || host === "maps.google.com") {
      return (
        u.pathname.includes("/maps") ||
        u.pathname.includes("/share.google") ||
        u.searchParams.has("kgmid")
      );
    }
    return false;
  } catch {
    return false;
  }
}

/** If admin pastes full <iframe …>, pull the src. */
export function extractIframeSrc(raw: string): string | null {
  const trimmed = raw.trim();
  const match = trimmed.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  return match?.[1]?.trim() || null;
}

/**
 * Hex feature id in Maps URLs: 1s0xABC:0xDEF — the second value is the CID.
 */
export function cidFromMapsFeatureId(urlOrData: string): string | null {
  const match = urlOrData.match(/0x[0-9a-f]+:(0x[0-9a-f]+)/i);
  if (!match?.[1]) return null;
  try {
    return BigInt(match[1]).toString();
  } catch {
    return null;
  }
}

function coordsFromPlacePin(url: string): { lat: string; lng: string } | null {
  // Exact place pin (preferred over viewport @lat,lng)
  const pin = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (pin) return { lat: pin[1], lng: pin[2] };

  const at = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (at) return { lat: at[1], lng: at[2] };

  return null;
}

function kgMidFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const fromParam = u.searchParams.get("kgmid");
    if (fromParam?.startsWith("/g/")) return fromParam;
  } catch {
    // ignore
  }
  const m = url.match(/(\/g\/[0-9a-z_]+)/i);
  return m?.[1] || null;
}

/** Parse a Maps page / share / search URL into the most precise embed src. */
export function embedUrlFromMapsPageUrl(finalUrl: string): string | null {
  const trimmed = finalUrl.trim();
  if (!trimmed) return null;
  if (isGoogleMapsEmbedUrl(trimmed)) return trimmed;

  const cidParam = (() => {
    try {
      return new URL(trimmed).searchParams.get("cid");
    } catch {
      return null;
    }
  })();
  if (cidParam && /^\d+$/.test(cidParam)) {
    return buildEmbedFromCid(cidParam);
  }

  const featureCid = cidFromMapsFeatureId(trimmed);
  if (featureCid) return buildEmbedFromCid(featureCid);

  // Prefer !3d!4d pin when present
  const pinOnly = trimmed.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (pinOnly) return buildEmbedFromLatLng(pinOnly[1], pinOnly[2]);

  const kg = kgMidFromUrl(trimmed);
  if (kg) return buildEmbedFromKgMid(kg);

  const coords = coordsFromPlacePin(trimmed);
  if (coords) return buildEmbedFromLatLng(coords.lat, coords.lng);

  try {
    const u = new URL(trimmed);
    const q =
      u.searchParams.get("q") ||
      u.searchParams.get("query") ||
      u.searchParams.get("destination");
    if (q) {
      if (q.startsWith("/g/")) return buildEmbedFromKgMid(q);
      // Avoid treating whole place path slug as soft address search when we
      // already had a Maps URL — still better than nothing for full place URLs.
      if (/^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(q)) {
        return buildEmbedFromQuery(q, 17);
      }
      return buildEmbedFromQuery(q, 16);
    }

    const place = u.pathname.match(/\/maps\/place\/([^/]+)/);
    if (place?.[1]) {
      return buildEmbedFromQuery(
        decodeURIComponent(place[1].replace(/\+/g, " ")),
        16,
      );
    }
  } catch {
    // ignore
  }

  return null;
}

const RESOLVE_HEADERS: HeadersInit = {
  // Mobile Safari UA makes maps.app.goo.gl issue a real HTTP redirect to /maps/place/...
  "User-Agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
};

/**
 * Follow redirects for short Maps / share.google links.
 * Returns the final URL (Maps place page or Google Search with kgmid).
 */
export async function resolveMapsShareUrl(
  url: string,
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    let current = url.trim();

    for (let hop = 0; hop < 10; hop++) {
      const res = await fetch(current, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: RESOLVE_HEADERS,
      });

      const location = res.headers.get("location");
      if (location && res.status >= 300 && res.status < 400) {
        current = new URL(location, current).toString();
        continue;
      }

      clearTimeout(timer);

      // Some responses stay on short host in body; prefer Location chain result.
      // If follow-mode would help (edge cases), try one follow fetch.
      if (
        /maps\.app\.goo\.gl|share\.google|goo\.gl/i.test(
          new URL(current).hostname,
        )
      ) {
        const followed = await fetch(url.trim(), {
          method: "GET",
          redirect: "follow",
          signal: controller.signal,
          headers: RESOLVE_HEADERS,
        });
        return followed.url || current;
      }

      return res.url || current;
    }

    clearTimeout(timer);
    return current;
  } catch {
    return null;
  }
}

export type ResolvedListingMaps = {
  maps_url: string | null;
  map_iframe_url: string | null;
};

/**
 * Normalize admin Maps inputs:
 * - share / page URL → maps_url (+ resolve to precise Business Profile embed)
 * - embed URL / iframe HTML → map_iframe_url
 * - address fallback ONLY when no Maps URL was provided
 */
export async function resolveListingMaps(input: {
  mapsUrl?: string | null;
  mapIframeUrl?: string | null;
  address?: string | null;
  city?: string | null;
}): Promise<ResolvedListingMaps> {
  const rawInput = (input.mapsUrl || input.mapIframeUrl || "").trim();
  const fromIframe = rawInput ? extractIframeSrc(rawInput) : null;
  const raw = fromIframe || rawInput;
  const query = locationQuery(input.address, input.city);
  const hasMapsInput = Boolean(raw);

  let maps_url: string | null = null;
  let map_iframe_url: string | null = null;

  if (raw) {
    if (isGoogleMapsEmbedUrl(raw)) {
      map_iframe_url = raw;
    } else if (isLikelyMapsShareOrPageUrl(raw)) {
      maps_url = raw;
      const direct = embedUrlFromMapsPageUrl(raw);
      if (direct) {
        map_iframe_url = direct;
      } else {
        const resolved = await resolveMapsShareUrl(raw);
        if (resolved) {
          // Keep original share/short URL for “Open in Maps”; only derive embed.
          map_iframe_url = embedUrlFromMapsPageUrl(resolved);
        }
      }
    } else if (isGoogleMapsEmbedUrl(raw) === false && raw.startsWith("http")) {
      // Unknown URL — keep as open link; do not invent address embed when URL given
      maps_url = raw;
      map_iframe_url = embedUrlFromMapsPageUrl(raw);
    }
  }

  // Address-based embed only when admin did not paste a Maps/Business Profile URL
  if (!map_iframe_url && !hasMapsInput && query) {
    map_iframe_url = buildEmbedFromQuery(query);
  }

  if (!maps_url && query) {
    maps_url = buildMapsOpenUrl(query);
  }

  return { maps_url, map_iframe_url };
}

/** Runtime display helpers for public business pages. */
export function getBusinessMapDisplay(input: {
  maps_url?: string | null;
  map_iframe_url?: string | null;
  address?: string | null;
  city?: string | null;
}) {
  const query = locationQuery(input.address, input.city);
  const hasMapsUrl = Boolean(input.maps_url?.trim());

  const embedUrl =
    (input.map_iframe_url && isGoogleMapsEmbedUrl(input.map_iframe_url)
      ? input.map_iframe_url
      : null) ||
    (input.map_iframe_url
      ? embedUrlFromMapsPageUrl(input.map_iframe_url)
      : null) ||
    (input.maps_url ? embedUrlFromMapsPageUrl(input.maps_url) : null) ||
    // Only fall back to address when there is no Business Profile / Maps URL
    (!hasMapsUrl && query ? buildEmbedFromQuery(query) : null);

  const openUrl =
    (input.maps_url?.trim() && !isGoogleMapsEmbedUrl(input.maps_url)
      ? input.maps_url.trim()
      : null) ||
    (query ? buildMapsOpenUrl(query) : null) ||
    null;

  return { embedUrl, openUrl, query };
}
