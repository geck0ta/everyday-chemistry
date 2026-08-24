import type { MetadataRoute } from "next";
import { PHENOMENA } from "@/lib/phenomena";

export const dynamic = "force-static";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://everyday-chemistry.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/explorer", "/simulasi", "/database", "/lab"].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const phenomena = PHENOMENA.map((p) => ({
    url: `${BASE}/explorer/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...phenomena];
}
