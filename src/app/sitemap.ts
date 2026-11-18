import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Bump when page content changes. A fixed date (not "now") gives Google an honest
 * last-modified signal and lets the sitemap be built statically.
 */
const LAST_UPDATED = "2026-11-18";

/** Served at /sitemap.xml — submit this URL in Google Search Console. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = LAST_UPDATED;
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/founder`, lastModified, changeFrequency: "monthly", priority: 0.7 },
  ];
}
