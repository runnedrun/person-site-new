import { createDoc } from "@/data/writer"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, "../../.env.development") })

async function populateSampleProjects() {
  const sampleProjects = [
    {
      title: "AI-Powered Recipe Generator",
      description: `# AI Recipe Generator

Create an app that generates unique recipes based on:
- Available ingredients
- Dietary restrictions
- Cooking skill level

The app will use [OpenAI's API](https://platform.openai.com/docs/guides/text-generation) to combine ingredients in creative ways while ensuring the recipes are practical and tasty.

**Useful Resources:**
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI Cookbook](https://github.com/openai/openai-cookbook)`,
      starterPromptForCopilot:
        "Create a Next.js app that uses OpenAI's API to generate recipes based on user input ingredients and preferences. Include a beautiful UI for inputting ingredients and displaying the generated recipe with steps.",
      createdAt: new Date(),
    },
    {
      title: "Personal Finance Dashboard",
      description: `# Smart Finance Tracker

A dashboard that helps users:
- Track expenses and income
- Visualize spending patterns
- Set and monitor financial goals
- Get AI-powered savings recommendations

**Integrations:**
- [Plaid API](https://plaid.com/docs/) for bank connections
- [Chart.js](https://www.chartjs.org/) for financial visualizations
- [TailwindCSS](https://tailwindcss.com/) for styling`,
      starterPromptForCopilot:
        "Build a React dashboard that connects to Plaid API for bank transaction data. Create components for expense tracking, budget visualization, and financial goal setting. Use Chart.js for beautiful graphs.",
      createdAt: new Date(),
    },
    {
      title: "Social Book Club",
      description: `# Virtual Book Club Platform

A platform where readers can:
- Join virtual book clubs
- Track reading progress
- Share highlights and notes
- Schedule video discussions
- Get AI-powered book recommendations

**Technologies:**
- [Socket.io](https://socket.io/) for real-time chat
- [WebRTC](https://webrtc.org/) for video calls
- [Goodreads API](https://www.goodreads.com/api) for book data
- [Next.js](https://nextjs.org/) for the framework`,
      starterPromptForCopilot:
        "Create a Next.js app for virtual book clubs. Include authentication, real-time chat using Socket.io, and integration with Goodreads API for book data. Add video call functionality using WebRTC.",
      createdAt: new Date(),
    },
  ]

  await Promise.all(
    sampleProjects.map(async (project, index) => {
      await createDoc("potentialProjects", project, {
        id: `sample-project-${index}`,
      })
    })
  )

  console.log("Sample projects have been populated!")
}

populateSampleProjects().catch(console.error)
