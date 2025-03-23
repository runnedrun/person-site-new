import { Model } from "../baseTypes/Model"

export type ShareRecord = Model<{
  email: string
  createdAt: number
}>
