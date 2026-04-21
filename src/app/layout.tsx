import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { FALLBACK_SEO, SITE_NAME, SITE_URL } from "@/lib/constants";
import { seoQuery, type SeoData } from "@/lib/sanity.queries";
import { sanityFetch } from "@/lib/sanityFetch";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const sanitySeo = await sanityFetch<SeoData>({
    query: seoQuery,
    tags: ["seo"],
  });
  const seo: SeoData = sanitySeo ?? FALLBACK_SEO;

  return {
    metadataBase: new URL(SITE_URL),

    title: {
      default: seo.titleGoogle,
      template: "%s | Paradeyes",
    },

    description: seo.descriptionGoogle,

    keywords: [...seo.keywords],

    authors: [{ name: "Basilide Gonot", url: SITE_URL }],
    creator: "Paradeyes Agency",
    publisher: "Paradeyes Agency",

    alternates: {
      canonical: SITE_URL,
      languages: {
        "fr-FR": SITE_URL,
      },
    },

    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: seo.titleSocial,
      description: seo.descriptionSocial,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Paradeyes - Agence créative au service de votre croissance",
          type: "image/png",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@paradeyesagency",
      creator: "@paradeyesagency",
      title: seo.titleSocial,
      description: seo.descriptionSocial,
      images: ["/og-image.png"],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    category: "Agence de communication",

    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
    },

    manifest: "/manifest.json",
  };
}

export const viewport: Viewport = {
  themeColor: "#023236",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap"
        />
      </head>
      <body
        className="min-h-full bg-[#023236] text-white"
        suppressHydrationWarning
      >
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
