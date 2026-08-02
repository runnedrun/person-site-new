import toMarkdown from "@sanity/block-content-to-markdown"

import { latestAboutContext } from "@/loaders/about/latestAboutContext"
import { client } from "./client"

export const getSecretAbout = async () => {
  const aboutInfo = await client.fetch('*[_type == "about"]')
  return `${toMarkdown(aboutInfo[0].secretAboutContent, {})}\n\n${latestAboutContext}`
}
