import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import { getSiteSettings } from "@/lib/data/site-settings";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings.site_name || "Business Directory Indonesia";
  const title = settings.seo_title || `${siteName} ${settings.site_tagline}`.trim();
  const description =
    settings.seo_description ||
    "Direktori bisnis profesional untuk menemukan dan mempromosikan bisnis terbaik di Indonesia.";
  const ogImage = settings.seo_og_image.trim();

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png" }],
      apple: [{ url: "/optisio-favicon.png", type: "image/png" }],
    },
    openGraph: {
      siteName,
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
