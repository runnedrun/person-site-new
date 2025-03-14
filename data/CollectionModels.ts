import { QAPairing } from "./types/QAPairing"
import { PotentialProject } from "./types/PotentialProject"
import { Survey } from "./types/Survey"
import { SurveyResponse } from "./types/SurveyResponse"

export type CollectionModels = {
  qaPairings: QAPairing
  potentialProjects: PotentialProject
  surveys: Survey
  surveyResponses: SurveyResponse
}
