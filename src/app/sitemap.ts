import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Served at /sitemap.xml — submit this URL in Google Search Console. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/founder`, lastModified, changeFrequency: "monthly", priority: 0.7 },
  ];
}
