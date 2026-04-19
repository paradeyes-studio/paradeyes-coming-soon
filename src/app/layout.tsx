import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Paradeyes Agency. On comprend. On conçoit. On construit.",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Paradeyes Agency",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: "website",
    locale: "fr_FR",
    siteName: SITE_NAME,
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
  maximumScale: 1,
  viewportFit: "cover",
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
        {children}
      </body>
    </html>
  );
}
