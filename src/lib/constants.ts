// Wording officiel Paradeyes v3 - Validé par Basilide le 20 avril 2026

export const SITE_NAME = "Paradeyes Agency";
export const SITE_URL = "https://paradeyesagency.com";

export const SIGNATURE = "Agence créative au service de votre croissance.";

export const TITLE_TEXT =
  "On\u00A0comprend. On\u00A0conçoit. On\u00A0construit.";

export const NARRATIVE_PART_1 =
  "Une agence qui comprend votre business avant de proposer. Communication stratégique, design, vidéo, site web.";
export const NARRATIVE_PART_2 =
  "Construits sur-mesure, pensés pour convertir.";
export const NARRATIVE = `${NARRATIVE_PART_1} ${NARRATIVE_PART_2}`;

export const PRE_CTA_TEXT = "Notre site est en construction, en attendant :";
export const CTA_LABEL = "Parlons de votre projet";
export const CTA_HREF =
  "mailto:hello@paradeyesagency.com?subject=Demande%20de%20contact%20via%20paradeyesagency.com";

export const EMAIL = "hello@paradeyesagency.com";
export const LINKEDIN_URL = "https://www.linkedin.com/company/paradeyesagency/";
export const INSTAGRAM_URL = "https://www.instagram.com/paradeyesagency";

export const SITE_DESCRIPTION =
  "Paradeyes est une agence créative au service de votre croissance. Communication stratégique, design, vidéo et site web pour les marques qui veulent scaler.";

export const SEO_TITLE =
  "Paradeyes | Agence créative au service de votre croissance";
export const SEO_DESCRIPTION =
  "Une agence qui comprend votre business avant de proposer. Communication stratégique, design, vidéo, site web. Construits sur-mesure, pensés pour convertir.";

export const COLORS = {
  darkGreen: "#023236",
  electricGreen: "#57EEA1",
  white: "#FFFFFF",
} as const;

export const EASINGS = {
  premium: [0.22, 1, 0.36, 1] as const,
  smooth: [0.4, 0, 0.6, 1] as const,
} as const;

export const FALLBACK_COMING_SOON = {
  signature: "Agence créative au service de votre croissance.",
  titre: "On\u00A0comprend. On\u00A0conçoit. On\u00A0construit.",
  narratif:
    "Une agence qui comprend votre business avant de proposer. Communication stratégique, design, vidéo, site web. Construits sur-mesure, pensés pour convertir.",
  phrasePreCta: "Notre site est en construction, en attendant :",
  labelCta: "Parlons de votre projet",
  mailtoSubject: "Demande de contact via paradeyesagency.com",
};

export const FALLBACK_SEO = {
  titleGoogle: "Paradeyes | Agence créative au service de votre croissance",
  descriptionGoogle:
    "Une agence qui comprend votre business avant de proposer. Communication stratégique, design, vidéo, site web. Construits sur-mesure, pensés pour convertir.",
  titleSocial: "Paradeyes | Agence créative au service de votre croissance",
  descriptionSocial:
    "Une agence qui comprend votre business avant de proposer. Communication stratégique, design, vidéo, site web. Construits sur-mesure, pensés pour convertir.",
  keywords: [
    "agence créative",
    "agence communication Cannes",
    "communication stratégique",
    "design premium",
    "motion design",
    "site web sur-mesure",
    "direction artistique",
    "identité visuelle",
    "Paradeyes",
    "Paradeyes Agency",
  ],
};

export const FALLBACK_CONTACT = {
  email: "hello@paradeyesagency.com",
  linkedinUrl: "https://www.linkedin.com/company/paradeyesagency/",
  instagramUrl: "https://www.instagram.com/paradeyesagency",
};
