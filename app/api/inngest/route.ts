const maxDuration = 60 * 15
import { serve } from "inngest/next"
import { inngest } from "../../../inngest/client"
import { sampleFn } from "@/inngest/functions/aggregrateProjects/sampleFn"

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sampleFn],
})
