import { z } from "zod"

export const GPTResponse = z.object({
  response: z.string(),
  notFound: z.boolean(),
})

export type GPTResponse = z.infer<typeof GPTResponse>
