import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/nav";
import ServiceWorkerRegister from "@/components/sw-register";
import "./globals.css";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Everyday Chemistry",
    template: "%s · Everyday Chemistry",
  },
  description:
    "Kalkulator kimia dengan langkah penyelesaian, 23 fenomena sehari-hari, simulasi, database zat, dan lab virtual.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://everyday-chemistry.vercel.app"),
  manifest: "manifest.json",
  icons: {
    icon: [
      { url: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "icons/icon-192.png" }],
  },
  applicationName: "Everyday Chemistry",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Everyday Chemistry",
    title: "Everyday Chemistry",
    description:
      "Kalkulator kimia dengan langkah penyelesaian, 23 fenomena sehari-hari, simulasi interaktif, database zat, dan lab virtual.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Everyday Chemistry",
    description:
      "Kalkulator kimia dengan langkah penyelesaian, 23 fenomena sehari-hari, simulasi interaktif, dan lab virtual.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Everyday Chemistry",
    applicationCategory: "EducationalApplication",
    inLanguage: "id-ID",
    description:
      "Kalkulator kimia dengan langkah penyelesaian, fenomena kimia sehari-hari, simulasi interaktif, dan lab virtual.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
    audience: { "@type": "EducationalAudience", educationalRole: "student" },
  };

  return (
    <html lang="id" suppressHydrationWarning className={`${displayFont.variable} ${monoFont.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <div className="ambient" aria-hidden />
        <Nav />
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
