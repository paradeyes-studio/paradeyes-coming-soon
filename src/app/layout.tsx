import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = "https://paradeyesagency.com";
const SITE_DESCRIPTION =
  "Agence créative au service de votre croissance. Une nouvelle agence arrive. Parlons de votre projet : hello@paradeyesagency.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Paradeyes Agency",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Paradeyes Agency",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: "website",
    locale: "fr_FR",
    siteName: "Paradeyes Agency",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paradeyes Agency",
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#023236",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${instrumentSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-darkgreen text-white">
        {children}
      </body>
    </html>
  );
}
