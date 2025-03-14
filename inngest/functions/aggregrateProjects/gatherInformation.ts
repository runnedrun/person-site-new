import { z } from "zod"
import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod"

// Initialize environment variables

// Define the schema for a trending technology
const TrendingTechSchema = z.object({
  name: z.string(),
  description: z.string(),
  source: z.string().describe("The source of the information"),
  discussionContext: z
    .string()
    .describe(
      "A description of the context in which the technology is being discussed (is it liked or hated, etc)"
    ),
  documentationLink: z
    .string()
    .describe(
      "A link to the documentation for how to implement the new technology"
    ),
})

const TrendingTechs = z.object({
  technologies: z.array(TrendingTechSchema),
})

// Create a type from the schema
export type TrendingTech = z.infer<typeof TrendingTechSchema>

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const instructionsPrompt = `
You are a technology trend analyzer focusing on TypeScript and modern web development technologies.
`

const getInputPrompt = ({ siteToSearch }: { siteToSearch: string }) => `
Please search the web and analyze current discussions about trending technologies. 
Find up to 4 technologies that can be used in a nextJS, react, typescript project, that are being talked about somewhere on the internet. The discussion you find must be from within the last 1 week.
Today is: ${new Date().toISOString()}.
You MUST ONLY check the following site:
- ${siteToSearch}

The results you return will be used to brainstorm new features that can be built into a NextJS app, for fun, to learn new stuff.


If you don't find anything, respond with "No results found".
`

// todo: add in hacker news api directly instead of scraping: https://hn.algolia.com/api

const sitesToSearch = [
  // "https://news.ycombinator.com/",
  "https://thisweekinreact.com/newsletter",
  "https://javascriptweekly.com/issues",
]

const getInfoFromSite = async ({ siteToSearch }: { siteToSearch: string }) => {
  try {
    const response = await openai.responses.parse({
      model: "gpt-4o",
      input: getInputPrompt({ siteToSearch }),
      instructions: instructionsPrompt,
      tool_choice: "required",
      tools: [
        {
          type: "web_search_preview",
        },
      ],
      text: {
        format: zodTextFormat(TrendingTechs, "trending_techs"),
      },
    })

    const outputParsed = response.output_parsed!

    return outputParsed?.technologies!
  } catch (error) {
    console.error("Error fetching trending technologies:", error)
    throw error
  }
}

export type TechnologyInfo = TrendingTech & {
  originalSearchSource: string
}

export const gatherInformation = async (): Promise<TechnologyInfo[]> => {
  const results = await Promise.all(
    sitesToSearch.map(async (site) => {
      const technologies = await getInfoFromSite({ siteToSearch: site })
      return technologies.map((technology) => ({
        ...technology,
        originalSearchSource: site,
      }))
    })
  )
  return results.flat()
}
