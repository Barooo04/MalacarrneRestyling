const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.studiomalacarne.com";

export const metadata = {
  title: "Termini e Condizioni",
  description:
    "Termini e condizioni d'uso del sito Studio Malacarne, inclusi limiti di responsabilità e condizioni del servizio chatbot.",
  alternates: {
    canonical: `${siteUrl}/termini-condizioni`,
  },
  openGraph: {
    title: "Termini e Condizioni | Studio Malacarne",
    description:
      "Condizioni di utilizzo del sito e del chatbot, proprietà intellettuale, responsabilità e legge applicabile.",
    url: `${siteUrl}/termini-condizioni`,
    type: "article",
    locale: "it_IT",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TerminiCondizioniLayout({ children }) {
  return children;
}
