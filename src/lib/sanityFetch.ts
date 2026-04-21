import { sanityClient } from "./sanity";

export async function sanityFetch<T>({
  query,
  tags = [],
  revalidate = 60,
}: {
  query: string;
  tags?: string[];
  revalidate?: number;
}): Promise<T | null> {
  try {
    return await sanityClient.fetch<T>(
      query,
      {},
      {
        next: { revalidate: tags.length ? false : revalidate, tags },
      }
    );
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return null;
  }
}
