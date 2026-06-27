import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/teacher", "/cabinet", "/login", "/spasibo", "/api/", "/privacy", "/offer"],
    },
    sitemap: "https://razumeyka-school.ru/sitemap.xml",
    host: "https://razumeyka-school.ru",
  };
}
