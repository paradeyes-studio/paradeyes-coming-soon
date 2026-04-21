import { groq } from "next-sanity";

export const comingSoonQuery = groq`*[_type == "comingSoon"][0]{
  signature, titre, narratif, phrasePreCta, labelCta, mailtoSubject
}`;

export type ComingSoonData = {
  signature: string;
  titre: string;
  narratif: string;
  phrasePreCta: string;
  labelCta: string;
  mailtoSubject: string;
};

export const seoQuery = groq`*[_type == "seo"][0]{
  titleGoogle, descriptionGoogle, titleSocial, descriptionSocial, keywords
}`;

export type SeoData = {
  titleGoogle: string;
  descriptionGoogle: string;
  titleSocial: string;
  descriptionSocial: string;
  keywords: string[];
};

export const contactQuery = groq`*[_type == "contact"][0]{
  email, linkedinUrl, instagramUrl
}`;

export type ContactData = {
  email: string;
  linkedinUrl: string;
  instagramUrl: string;
};
