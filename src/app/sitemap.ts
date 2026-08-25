import type { MetadataRoute } from "next";
import { PHENOMENA } from "@/lib/phenomena";
import { SUBSTANCES } from "@/lib/substances";

export const dynamic = "force-static";

const isPages = process.env.DEPLOY_TARGET === "pages";
const repo = "everyday-chemistry";
const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (isPages ? `https://geck0ta.github.io/${repo}` : "https://everyday-chemistry.vercel.app");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/explorer", "/kenali-zat", "/tabel-periodik", "/simulasi", "/database", "/lab", "/referensi"].map((p) => ({
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

  const substances = SUBSTANCES.map((s) => ({
    // database pake pencarian klien-side (?cari=FORMULA), bukan route dinamis
    url: `${BASE}/database?cari=${encodeURIComponent(s.formula)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...phenomena, ...substances];
}
