import { dataFn } from "@/data/dataFn"
import { queryObs } from "@/data/reader"

export const projectADayData = dataFn()(() => {
  return {
    potentialProjects: queryObs("potentialProjects", ({ where }) => [
      where("archived", "!=", true),
    ]),
  }
})

export const projectADayDataFunctions = {
  main: projectADayData,
}
