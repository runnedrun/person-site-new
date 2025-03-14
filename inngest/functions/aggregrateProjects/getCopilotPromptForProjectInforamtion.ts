import {
  gatherInformation,
  TechnologyInfo,
  TrendingTech,
} from "./gatherInformation"
import { z } from "zod"
import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod"
import { omit } from "lodash"

// Define the schema for the copilot prompt
const ProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  technologyDemonstrated: z.string(),
  starterPromptForAiCopilot: z.string(),
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// only have new technologies
// include a link to documentation for the new technology
//

const instructionsPrompt = `
You are a project idea generator that creates detailed prompts for building new features in a NextJS, React, TypeScript application.
Your goal is to take a trending technology and create an interesting project idea that showcases its capabilities.
The project should be something that can be built as a new feature in an existing app.
Focus on creating something that would be fun to build and learn from.
`

const getInputPrompt = ({ information }: { information: TechnologyInfo }) => `
Please create a project idea based on the following trending technology:

${JSON.stringify(omit(information, "originalSearchSource"))}

The new project will be implemented as a new feature in an existing NextJS 15 app that is designed to be a portfolio of different small projects.
Therefore the feature should be self contained and not rely on other parts of the app.  

Next JS app router
React 18
TypeScript
TailwindCSS
Shadcn UI
Firebase

The project should:
1. MUST be implementable as a new feature in the above existing NextJS app
2. Use modern React patterns and TypeScript
3. Be focused on learning and experimenting with ${information.name}
4. Be something that could be completed in 5 days of coding.
5. Be a real, complete feature, that is not ONLY a demo of the technology.

Format the response as a project with:
- A fun name
- A brief description
- The NEW technology
- A starter prompt for an AI copilot that will help implement the feature

The starter prompt must be designed to be run by an AI copilot like Cursor, Copilot, etc.
The starter prompt does NOT need to include details about how to read/write from the database— the AI already knows how to do that.
The starter prompt MUST be structured as a DETAILED step by step guide for the AI to follow.
The starter prompt MUST include a link to the documentation for the new technology.
`

export const getCopilotPromptForProjectInforamtion = async ({
  information,
}: {
  information: TechnologyInfo
}) => {
  try {
    const response = await openai.responses.parse({
      model: "gpt-4o",
      input: getInputPrompt({ information }),
      instructions: instructionsPrompt,
      tools: [
        {
          type: "web_search_preview",
        },
      ],
      text: {
        format: zodTextFormat(ProjectSchema, "project_prompt"),
      },
    })

    return {
      project: response.output_parsed!,
      originalInformation: information,
    }
  } catch (error) {
    console.error("Error generating project prompt:", error)
    throw error
  }
}
