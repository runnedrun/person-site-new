import { isNil, isUndefined } from "lodash"

export const isUndefTyped = (value: unknown): value is undefined => {
  return isUndefined(value)
}

export const isNotUndefined = <T>(value: T): value is Exclude<T, undefined> => {
  return !isUndefTyped(value)
}

export const isNotNil = <T>(
  value: T
): value is Exclude<T, null | undefined> => {
  return !isNil(value)
}
