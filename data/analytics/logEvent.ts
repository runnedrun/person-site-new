import { objKeys } from "../helpers/objKeys"
import { getAnalyticsLoadedPromise } from "./analyticsLoadedSubject"
import { isNil, pickBy } from "lodash"
import { shouldLog } from "./shouldLog"

let currentScreen: string | null = null
let logContext: object = {}

const pathMap = (source: object, key: string | null) => {
  const pathMapState = {} as Record<string, string>

  const visit = (nestedSource: object, nestedKey: string | null) => {
    objKeys(nestedSource).forEach((k) => {
      const item = nestedSource[k]
      const path = nestedKey ? `${nestedKey}_${k}` : k

      item && typeof item == "object"
        ? visit(item, k)
        : (pathMapState[path] = item)
    })
  }

  visit(source, key)

  return pathMapState
}

export const logEvent = (name: string, extraData?: object) => {
  if (typeof window !== "undefined") {
    const allExtraData = {
      ...(extraData || {}),
      ...logContext,
    }

    const allExtraDataWithoutNils = pickBy(
      allExtraData,
      (value) => !isNil(value)
    )

    const extraDataPathMap = pathMap(allExtraDataWithoutNils, null)
    const namespacedName = currentScreen ? `${currentScreen}.${name}` : name
    if (!shouldLog()) {
      console.debug(
        "ANALYTICS LOG:",
        namespacedName,
        extraDataPathMap,
        logContext
      )
    } else {
      getAnalyticsLoadedPromise().then(() => {
        pirsch(namespacedName, {
          duration: 1,
          meta: extraDataPathMap,
        })
      })
    }
  }
}

export const setLogContext = (setTo: object) => {
  logContext = setTo
}

export const updateLogContext = (updateWith: object) => {
  logContext = { ...logContext, ...updateWith }
}

export const setCurrentScreen = (name: string) => {
  if (typeof window !== "undefined") {
    currentScreen = name
  }
}
