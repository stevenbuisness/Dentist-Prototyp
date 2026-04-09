import { Helmet } from "react-helmet-async";

interface MetaTagsProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

export const MetaTags = ({
  title = "Zahnarztpraxis Dr. Maria Schmidt · Evidenzbasierte Zahnmedizin Düsseldorf",
  description = "Diagnostik, Planung und Behandlung auf dokumentiert hohem Niveau in Düsseldorf. Ruhige Abläufe, klare Kommunikation, messbare Qualitätsstandards.",
  canonical = "https://zahnarztpraxis-schmidt.de",
  ogImage = "https://zahnarztpraxis-schmidt.de/og-image.png",
  ogType = "website"
}: MetaTagsProps) => {
  const fullTitle = title.includes("Dr. Maria Schmidt") 
    ? title 
    : `${title} | Zahnarztpraxis Dr. Maria Schmidt`;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};
