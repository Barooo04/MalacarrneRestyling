const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.studiomalacarne.com";

export const metadata = {
  title: "Informativa Privacy",
  description:
    "Informativa sul trattamento dei dati personali del sito Studio Malacarne, redatta ai sensi del GDPR.",
  alternates: {
    canonical: `${siteUrl}/informativa-privacy`,
  },
  openGraph: {
    title: "Informativa Privacy | Studio Malacarne",
    description:
      "Dettagli su finalità, basi giuridiche, conservazione e diritti dell'interessato nel trattamento dei dati personali.",
    url: `${siteUrl}/informativa-privacy`,
    type: "article",
    locale: "it_IT",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function InformativaPrivacyLayout({ children }) {
  return children;
}
