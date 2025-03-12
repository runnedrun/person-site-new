import { QAPairing } from "./types/QAPairing"
import { PotentialProject } from "./types/PotentialProject"

export const CollectionNames: (keyof AllModels)[] = [
  "qaPairings",
  "potentialProjects",
] as const

export type AllModels = {
  qaPairings: QAPairing
  potentialProjects: PotentialProject
}

export type CollectionModels = Omit<AllModels, "user">
