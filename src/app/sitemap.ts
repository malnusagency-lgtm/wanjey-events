import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://wanjeyevents.com";
  const routes = ["/", "/about", "/services", "/packages", "/gallery", "/contact"];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : 0.8,
  }));
}
