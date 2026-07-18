import type { MetadataRoute } from "next";
import { directionsData } from "@/data/directions.js";
import { landingsData } from "@/data/landings.js";
import { blogPosts } from "@/data/blog.js";

const BASE = "https://razumeyka-school.ru";

// Дата последнего содержательного обновления страниц программ.
// Менять при реальном изменении контента, а не при каждом деплое —
// иначе Яндекс перестаёт доверять датам в sitemap.
const CONTENT_UPDATED = new Date("2026-07-18");

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPost = (blogPosts as { date: string }[])
    .map((p) => new Date(p.date))
    .reduce((a, b) => (a > b ? a : b), CONTENT_UPDATED);

  // Направления с href (напр. рисование → /risovanie) — это не [slug]-лендинги,
  // их канонический URL добавляется отдельно, поэтому здесь их пропускаем.
  const directions = (directionsData as { slug: string; href?: string }[])
    .filter((d) => !d.href)
    .map((d) => ({
      url: `${BASE}/${d.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  const landings = (landingsData as { slug: string }[]).map((l) => ({
    url: `${BASE}/${l.slug}`,
    lastModified: CONTENT_UPDATED,
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
    { url: BASE, lastModified: latestPost, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/risovanie`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/risovanie/galereya`, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/mentalnaya-arifmetika`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: latestPost, changeFrequency: "weekly", priority: 0.7 },
    ...directions,
    ...landings,
    ...blog,
  ];
}
