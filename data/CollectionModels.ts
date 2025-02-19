import { QAPairing } from "./types/QAPairing"

export const CollectionNames: (keyof AllModels)[] = ["qaPairings"] as const

export type AllModels = {
  qaPairings: QAPairing
}

export type CollectionModels = Omit<AllModels, "user">
