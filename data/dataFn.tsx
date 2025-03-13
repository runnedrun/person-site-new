import { DataFnType } from "./rootComponent"

export const dataFn = <
  ParamsType extends Record<string, unknown>,
  DataType extends Record<string, unknown>,
>(
  defaultParams: ParamsType,
  fn: DataFnType<DataType, ParamsType>
) => {
  return fn
}
