import type { MetadataRoute } from "next";
import { directionsData } from "@/data/directions.js";
import { landingsData } from "@/data/landings.js";
import { blogPosts } from "@/data/blog.js";

const BASE = "https://razumeyka-school.ru";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Направления с href (напр. рисование → /risovanie) — это не [slug]-лендинги,
  // их канонический URL добавляется отдельно, поэтому здесь их пропускаем.
  const directions = (directionsData as { slug: string; href?: string }[])
    .filter((d) => !d.href)
    .map((d) => ({
      url: `${BASE}/${d.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  const landings = (landingsData as { slug: string }[]).map((l) => ({
    url: `${BASE}/${l.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blog = (blogPosts as { slug: string; date: string }[]).map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/risovanie`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/mentalnaya-arifmetika`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...directions,
    ...landings,
    ...blog,
  ];
}
