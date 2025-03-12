import { dataFn } from "@/data/dataFn"
import { map, of } from "rxjs"

type ParamsNeededForThisDataFunction = { isUppercase: boolean }

export const examplePageDataFunction =
  dataFn<ParamsNeededForThisDataFunction>()(({ getParam }) => {
    const $isUppercase = getParam("isUppercase")
    return {
      title: $isUppercase.pipe(
        map((isUppercase) =>
          isUppercase ? "THIS IS A PIECE OF DATA" : "this is a piece of data"
        )
      ),
    }
  })

export const examplePageDataFunctions = {
  exampleData: examplePageDataFunction,
}
