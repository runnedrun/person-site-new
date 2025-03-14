import { Model } from "../baseTypes/Model"

export type SurveyResponse = Model<{
  surveyId: string
  answers: {
    questionId: string
    answer: string | string[]
  }[]
  createdAt: Date
  updatedAt: Date
}>
