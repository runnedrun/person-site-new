import { AboutPageWrapper } from "@/components/about/AboutPageWrapper"
import { rootComponent } from "@/data/rootComponent"
import { aboutDataFns } from "@/loaders/about/aboutDataFns"

export default rootComponent(aboutDataFns, AboutPageWrapper)

export async function generateMetadata() {
  return {
    title: "All About David Gaynor",
    description: "Hi I'm David. Here's a bunch of information about me.",
  }
}
