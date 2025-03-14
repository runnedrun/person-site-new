const maxDuration = 60 * 15
import { serve } from "inngest/next"
import { inngest } from "../../../inngest/client"
import { aggregrateProjects } from "@/inngest/functions/aggregrateProjects/aggregrateProjects"

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [aggregrateProjects],
})
