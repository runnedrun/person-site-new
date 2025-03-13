import { Model } from "../baseTypes/Model"

export type PotentialProject = Model<{
  title: string
  description: string
  starterPromptForCopilot: string
}>
