import { dataFn } from "@/data/dataFn"
import { queryObs } from "@/data/reader"
import { map } from "rxjs"

const defaultParams = {}

export const projectADayDataFunctions = {
  projectADayData: dataFn(defaultParams, () => {
    return {
      projects: queryObs("potentialProjects", ({ where }) => [
        where("archived", "==", false),
      ]).pipe(
        map((projects) =>
          projects.sort(
            (a, b) =>
              (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)
          )
        )
      ),
    }
  }),
}
