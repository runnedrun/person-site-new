import { Timestamp } from "firebase/firestore"
import { MDXRemoteSerializeResult } from "next-mdx-remote"
import { Model } from "../baseTypes/Model"

export type QAPairing = Model<{
  createdAt: Timestamp
  question: string
  answer: string | null
  askedBy: string // userId
  notFound: boolean | null
  answeredAt: Timestamp | null
  serializedAnswer: MDXRemoteSerializeResult | null
}>
