import { Model } from "../baseTypes/Model"

export type Survey = Model<{
  title: string
  description: string
  questions: {
    id: string
    type: "text" | "select" | "multiselect" | "radio"
    question: string
    options?: string[]
    required: boolean
  }[]
  createdAt: Date
  updatedAt: Date
}>
