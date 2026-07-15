import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export function getSanityWriteClient() {
  const token = process.env.SANITY_WRITE_TOKEN;

  if (!token) {
    throw new Error("SANITY_WRITE_TOKEN is not configured");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });
}
