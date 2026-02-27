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

export const metadata = {
  title: "Studio Malacarne | Consulenza professionale",
  description:
    "Restyling moderno del sito Studio Malacarne: consulenza fiscale, societaria e strategica per imprese e professionisti.",
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
