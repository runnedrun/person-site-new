import { Timestamp } from "firebase/firestore"

export type QAPairing = {
  createdAt: Timestamp
  question: string
  answer: string
  askedBy: string // userId
  notFound: boolean
  answeredAt: Timestamp
}
