const PRODUCTION_SITE_URL = "https://directory.optisio.com";

function normalizeSiteUrl(raw: string) {
  const trimmed = raw.trim().replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/** True for one-off deploy hosts like project-abc123-user.vercel.app */
function isEphemeralVercelHost(raw: string) {
  const host = raw.replace(/^https?:\/\//, "").split("/")[0] ?? "";
  return /^[a-z0-9-]+-[a-z0-9]+-[a-z0-9]+\.vercel\.app$/i.test(host);
}

/**
 * Canonical public origin for sitemap, canonicals, OG, robots.
 * Prefer NEXT_PUBLIC_SITE_URL; never emit ephemeral Vercel deploy URLs in production.
 */
export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit && !isEphemeralVercelHost(explicit)) {
    return normalizeSiteUrl(explicit);
  }

  // Production custom domain — do not fall back to VERCEL_URL (deploy hash host).
  if (process.env.VERCEL_ENV === "production") {
    const project =
      process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
      PRODUCTION_SITE_URL;
    if (!isEphemeralVercelHost(project)) {
      return normalizeSiteUrl(project);
    }
    return PRODUCTION_SITE_URL;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return normalizeSiteUrl(vercelUrl);

  return "http://localhost:3000";
}
