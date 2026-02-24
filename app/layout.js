import { Geist, Geist_Mono } from "next/font/google";
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
    icon: "/images/logoNuovo.png",
    shortcut: "/images/logoNuovo.png",
    apple: "/images/logoNuovo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <link rel="icon" href="/images/logoNuovo.png?v=3" sizes="any" />
        <link rel="shortcut icon" href="/images/logoNuovo.png?v=3" />
        <link rel="apple-touch-icon" href="/images/logoNuovo.png?v=3" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
