import { createDoc, setDoc } from "@/data/writer"
import { inngest } from "../../client"
import { gatherInformation, TrendingTech } from "./gatherInformation"
import { getProjectInformationFromTech } from "./getProjectInformationFromTech"

export const aggregrateProjects = inngest.createFunction(
  { id: "aggregrate-projects" },
  {
    cron: "0 0 * * *", // Run at midnight
    timezone: "Europe/Paris", // CET timezone
  },
  async ({ event, step }) => {
    console.log("aggregrating projects")
    const projectInformation = await step.run(
      "gather-information",
      gatherInformation
    )

    const projectsAndInformation = await Promise.all(
      projectInformation.map((information) => {
        return step.run("get-copilot-prompt", getProjectInformationFromTech, {
          information: information,
        })
      })
    )

    await step.run("create-project-data", async () => {
      return projectsAndInformation.map(({ project, originalInformation }) => {
        return createDoc("potentialProjects", {
          title: project.title,
          description: project.description,
          technologyDemonstrated: project.technologyDemonstrated,
          documentationLink: originalInformation.documentationLink,
          searchSource: originalInformation.source,
          infoSource: originalInformation.originalSearchSource,
          starterPromptForAiCopilot: project.starterPromptForAiCopilot,
        })
      })
    })
    return { message: `Hello ${event.data.email}!` }
  }
)
