import { DataFnType } from "./rootComponent"

export const dataFn =
  <ParamsType extends Record<string, unknown> = Record<string, unknown>>() =>
  <DataType extends Record<string, unknown>>(
    fn: DataFnType<DataType, ParamsType>
  ) => {
    return fn
  }
