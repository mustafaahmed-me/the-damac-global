import type { MetadataRoute } from "next";

const ROUTES = ["/", "/services", "/packages", "/portfolio", "/about", "/founder", "/contact", "/leadforge"];

export default function sitemap(): MetadataRoute.Sitemap {
  // Only publish absolute URLs when the production domain is known.
  const base = process.env.SITE_URL?.trim().replace(/\/$/, "");
  if (!base) return [];

  return ROUTES.map((route) => ({
    url: route === "/" ? base : `${base}${route}`,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
