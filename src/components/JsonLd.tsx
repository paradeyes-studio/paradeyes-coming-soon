import {
  EMAIL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";

export default function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "Paradeyes",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/favicon-512x512.png`,
      width: 512,
      height: 512,
    },
    description: SITE_DESCRIPTION,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cannes",
      addressRegion: "Provence-Alpes-Côte d'Azur",
      addressCountry: "FR",
    },
    sameAs: [LINKEDIN_URL, INSTAGRAM_URL],
    founder: {
      "@type": "Person",
      name: "Basilide Gonot",
      jobTitle: "Fondateur et Directeur Artistique",
    },
    foundingDate: "2026",
    industry: "Communication créative",
    knowsAbout: [
      "Communication stratégique",
      "Direction artistique",
      "Motion design",
      "Design graphique",
      "Développement web",
      "Vidéo corporate",
      "Identité visuelle",
      "Branding",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: "fr-FR",
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#service`,
    name: SITE_NAME,
    description:
      "Agence créative proposant communication stratégique, design, vidéo et développement web sur-mesure.",
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    serviceType: [
      "Communication stratégique",
      "Direction artistique",
      "Motion design",
      "Création de sites web",
      "Vidéo corporate",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceSchema),
        }}
      />
    </>
  );
}
