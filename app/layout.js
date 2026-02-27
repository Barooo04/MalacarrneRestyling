import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.studiomalacarne.com";
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Studio Malacarne | Consulenza professionale per imprese",
    template: "%s | Studio Malacarne",
  },
  description:
    "Studio Malacarne supporta imprese e professionisti con consulenza fiscale, societaria, contabile e strategica nelle sedi di Castelfranco di Sotto e Ponsacco.",
  keywords: [
    "Studio Malacarne",
    "commercialista Castelfranco di Sotto",
    "commercialista Ponsacco",
    "consulenza fiscale",
    "consulenza societaria",
    "revisione legale",
    "business plan",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Studio Malacarne | Consulenza professionale per imprese",
    description:
      "Consulenza fiscale, societaria e strategica per imprese e professionisti. Due sedi operative in provincia di Pisa.",
    url: siteUrl,
    siteName: "Studio Malacarne",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "/images/LogoDefinitivo.svg",
        width: 1200,
        height: 630,
        alt: "Studio Malacarne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Malacarne | Consulenza professionale per imprese",
    description:
      "Consulenza fiscale, societaria e strategica per imprese e professionisti. Due sedi operative in provincia di Pisa.",
    images: ["/images/LogoDefinitivo.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(googleSiteVerification
    ? {
        verification: {
          google: googleSiteVerification,
        },
      }
    : {}),
  icons: {
    icon: "/images/logoFavicon.svg",
    shortcut: "/images/logoFavicon.svg",
    apple: "/images/logoFavicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        {/* Start cookieyes banner */}
        <Script
          id="cookieyes"
          type="text/javascript"
          src="https://cdn-cookieyes.com/client_data/91925e790ed2865554d632381ed44cc4/script.js"
          strategy="beforeInteractive"
        />
        {/* End cookieyes banner */}
        <link rel="icon" href="/images/logoFavicon.svg" sizes="any" />
        <link rel="shortcut icon" href="/images/logoFavicon.svg" />
        <link rel="apple-touch-icon" href="/images/logoFavicon.svg" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
