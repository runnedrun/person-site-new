import toMarkdown from "@sanity/block-content-to-markdown"

import { client } from "./client"

export const getSecretAbout = async () => {
  const aboutInfo = await client.fetch('*[_type == "about"]')
  return toMarkdown(aboutInfo[0].secretAboutContent, {})
}
