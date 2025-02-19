import { isUndefined } from "lodash"

export const isUndefTyped = (value: unknown): value is undefined => {
  return isUndefined(value)
}

export const isNotUndefined = <T>(value: T): value is Exclude<T, undefined> => {
  return !isUndefTyped(value)
}
