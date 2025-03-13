import { dataFn } from "@/data/dataFn"
import { map } from "rxjs"

const defaultParams = {
  isUppercase: false,
}

export const examplePageDataFunctions = {
  exampleData: dataFn(defaultParams, ({ getParam }) => {
    const $isUppercase = getParam("isUppercase")
    return {
      title: $isUppercase.pipe(
        map((isUppercase) =>
          isUppercase ? "THIS IS A PIECE OF DATA" : "this is a piece of data"
        )
      ),
    }
  }),
}
