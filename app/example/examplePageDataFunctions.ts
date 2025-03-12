import { dataFn } from "@/data/dataFn"
import { DataFnType } from "@/data/rootComponent"
import { of } from "rxjs"

type ParamsNeededForThisDataFunction = { isUppercase: boolean }

export const examplePageDataFunction =
  dataFn<ParamsNeededForThisDataFunction>()(({ getParam }) => {
    return {
      title: of(
        isUppercase ? "THIS IS A PIECE OF DATA" : "this is a piece of data"
      ),
    }
  })

export const examplePageDataFunctions = {
  exampleData: examplePageDataFunction,
}
