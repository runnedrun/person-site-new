import { PotentialProject } from "@/data/types/PotentialProject"
import { createDoc } from "@/data/writer"
import dotenv from "dotenv"
import path from "path"

dotenv.config({
  path: path.join(__dirname, "../..", ".env.development"),
})

const sampleProjects: PotentialProject[] = [
  {
    technologyDemonstrated:
      "React, TypeScript, TailwindCSS, Shadcn UI, Firebase",
    title: "AI-Powered Plant Care Assistant",
    description: `# Plant Care Assistant

This project creates an AI assistant that helps users take care of their houseplants by:
- Identifying plants from photos
- Providing care schedules and reminders
- Diagnosing plant health issues
- Offering seasonal care tips

Uses computer vision APIs and a plant care knowledge base to provide personalized advice.`,
    starterPromptForAiCopilot:
      "Create a Next.js app that helps users care for their houseplants. It should use computer vision to identify plants and their health conditions, and provide care recommendations. Start with the basic structure and plant identification feature.",
    documentationLink: "https://www.google.com",
    searchSource: "https://www.google.com",
    infoSource: "https://www.google.com",
  },

  {
    technologyDemonstrated:
      "React, TypeScript, TailwindCSS, Shadcn UI, Firebase",
    title: "Code Review Summarizer",
    description: `# Code Review Summarizer

A tool that analyzes GitHub pull requests and generates concise, structured summaries:
- Key changes and their impact
- Potential risks and edge cases
- Test coverage analysis
- Best practices compliance check

Perfect for tech leads and developers who review lots of PRs daily.`,
    starterPromptForAiCopilot:
      "Build a TypeScript CLI tool that connects to GitHub's API, fetches PR details, and generates markdown summaries of code changes. Include file changes, complexity metrics, and potential risk areas.",
    documentationLink: "https://www.google.com",
    searchSource: "https://www.google.com",
    infoSource: "https://www.google.com",
  },
  {
    technologyDemonstrated:
      "React, TypeScript, TailwindCSS, Shadcn UI, Firebase",
    title: "Recipe Cost Calculator",
    description: `# Smart Recipe Cost Calculator

A web app that helps home cooks and small restaurants calculate and optimize recipe costs:
- Ingredient price tracking
- Portion size calculator
- Cost per serving analysis
- Ingredient substitution suggestions
- Price trend visualization

Helps users make informed decisions about menu pricing and ingredient choices.`,
    starterPromptForAiCopilot:
      "Create a React application for calculating recipe costs. Start with components for ingredient management, recipe creation, and cost calculation. Use a modern UI library for the interface.",
    documentationLink: "https://www.google.com",
    searchSource: "https://www.google.com",
    infoSource: "https://www.google.com",
  },
]

const run = async () => {
  console.log("Adding sample potential projects...")

  for (const project of sampleProjects) {
    await createDoc("potentialProjects", project)
    console.log(`Created project: ${project.title}`)
  }

  console.log("Done!")
}

run().catch(console.error)
