import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const isPages = process.env.DEPLOY_TARGET === "pages";
const repo = "everyday-chemistry";
const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (isPages ? `https://geck0ta.github.io/${repo}` : "https://everyday-chemistry.vercel.app");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
