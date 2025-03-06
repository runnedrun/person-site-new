import { createClient } from "next-sanity"
import imageUrlBuilder from "@sanity/image-url"
import { apiVersion, dataset, projectId } from "./env"

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // `false` if you want to ensure fresh data
  token: process.env.SANITY_API_READ_TOKEN,
})

// Set up a helper function for generating image URLs with only the asset reference data in your documents
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Helper function to use GROQ to query your Sanity Dataset
