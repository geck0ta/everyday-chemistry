export const contentType = "application/manifest+json";
export const dynamic = "force-static";

export function GET() {
  // basePath GitHub Pages diselipkan via env build-time.
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const data: ManifestShape = {
    name: "Everyday Chemistry",
    short_name: "Chemistry",
    description:
      "Kalkulator kimia, simulasi interaktif, tabel periodik, dan database zat untuk belajar kimia sehari-hari.",
    start_url: `${basePath}/?source=pwa`,
    scope: `${basePath}/`,
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0d1117",
    theme_color: "#34e0a1",
    lang: "id",
    icons: [
      { src: `${basePath}/icons/icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `${basePath}/icons/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${basePath}/icons/icon-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  const body = JSON.stringify(data);
  return new Response(body, {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
  });
}

interface ManifestShape {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  scope: string;
  display: string;
  orientation: string;
  background_color: string;
  theme_color: string;
  lang: string;
  icons: Array<{ src: string; sizes: string; type: string; purpose: string }>;
}
