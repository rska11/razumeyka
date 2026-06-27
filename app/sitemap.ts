import type { MetadataRoute } from "next";
import { directionsData } from "@/data/directions.js";

const BASE = "https://razumeyka-school.ru";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const directions = (directionsData as { slug: string }[]).map((d) => ({
    url: `${BASE}/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...directions,
  ];
}
