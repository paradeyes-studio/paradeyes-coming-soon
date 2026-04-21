import {
  FALLBACK_CONTACT,
  FALLBACK_SEO,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import {
  contactQuery,
  seoQuery,
  type ContactData,
  type SeoData,
} from "@/lib/sanity.queries";
import { sanityFetch } from "@/lib/sanityFetch";

export default async function JsonLd() {
  const [sanitySeo, sanityContact] = await Promise.all([
    sanityFetch<SeoData>({ query: seoQuery, tags: ["seo"] }),
    sanityFetch<ContactData>({ query: contactQuery, tags: ["contact"] }),
  ]);
  const seo: SeoData = sanitySeo ?? FALLBACK_SEO;
  const contact: ContactData = sanityContact ?? FALLBACK_CONTACT;

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
    description: seo.descriptionGoogle,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cannes",
      addressRegion: "Provence-Alpes-Côte d'Azur",
      addressCountry: "FR",
    },
    sameAs: [contact.linkedinUrl, contact.instagramUrl],
    founder: {
      "@type": "Person",
      name: "Basilide Gonot",
      jobTitle: "Fondateur et Directeur Artistique",
    },
    foundingDate: "2026",
    industry: "Communication créative",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: seo.descriptionGoogle,
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
