const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.studiomalacarne.com";

export default function sitemap() {
  const now = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/informativa-privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/termini-condizioni`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
