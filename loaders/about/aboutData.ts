import { dataFn } from "@/data/dataFn"
import { docObs } from "@/data/reader"
import { first } from "rxjs/operators"

export const aboutData = dataFn(
  {
    selectedQAId: null as string | null,
  },
  ({ getParam }) => {
    const $selectedQAId = getParam("selectedQAId").pipe(first())

    const startingQA = docObs("qaPairings", $selectedQAId)

    return {
      startingQA,
    }
  }
)
