import type { NextConfig } from "next";

// GitHub Pages menyajikan repo di subpath /<nama-repo>
const isPages = process.env.DEPLOY_TARGET === "pages";
const repo = "everyday-chemistry";

const nextConfig: NextConfig = {
  output: isPages ? "export" : undefined,
  basePath: isPages ? `/${repo}` : "",
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: isPages ? `/${repo}` : "",
  },
};

export default nextConfig;
