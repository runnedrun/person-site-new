import { dataFn } from "@/data/dataFn"
import { queryObs } from "@/data/reader"

const defaultParams = {}

export const surveysDataFunctions = {
  surveysData: dataFn(defaultParams, () => {
    const $surveys = queryObs("surveys", ({ orderBy }) => [
      orderBy("createdAt", "desc"),
    ])
    return {
      surveys: $surveys,
    }
  }),
}
