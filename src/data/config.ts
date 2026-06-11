// Canonical site origin used for sitemap, robots, and OpenGraph metadata.
// Order: explicit override, then the Vercel production domain, then a local default.
function resolveBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "https://jaykim.dev";
}

export const BASE_URL = resolveBaseUrl();
