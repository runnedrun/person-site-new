import { Model } from "../baseTypes/Model"

export type PotentialProject = Model<{
  title: string
  description: string
  technologyDemonstrated: string
  starterPromptForAiCopilot: string
  documentationLink: string
  searchSource: string
  infoSource: string
}>
