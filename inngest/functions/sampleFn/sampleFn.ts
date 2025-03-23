import { inngest } from "../../client"

export const sampleFn = inngest.createFunction(
  { id: "aggregrate-projects" },
  {
    cron: "0 0 * * *", // Run at midnight
    timezone: "Europe/Paris", // CET timezone
  },
  async ({ event }) => {
    if (!process.env.NEXT_PUBLIC_RUN_CRONS) {
      console.log("in preview branch, not running crons")
      return
    }

    return { message: `Hello ${event.data.email}!` }
  }
)
