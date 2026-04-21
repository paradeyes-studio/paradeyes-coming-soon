import ComingSoonClient from "./ComingSoonClient";
import { FALLBACK_COMING_SOON, FALLBACK_CONTACT } from "@/lib/constants";
import {
  comingSoonQuery,
  contactQuery,
  type ComingSoonData,
  type ContactData,
} from "@/lib/sanity.queries";
import { sanityFetch } from "@/lib/sanityFetch";

export const revalidate = 60;

export default async function Home() {
  const [sanityComingSoon, sanityContact] = await Promise.all([
    sanityFetch<ComingSoonData>({
      query: comingSoonQuery,
      tags: ["comingSoon"],
    }),
    sanityFetch<ContactData>({ query: contactQuery, tags: ["contact"] }),
  ]);

  const data: ComingSoonData = sanityComingSoon ?? FALLBACK_COMING_SOON;
  const contact: ContactData = sanityContact ?? FALLBACK_CONTACT;

  return <ComingSoonClient data={data} contact={contact} />;
}
