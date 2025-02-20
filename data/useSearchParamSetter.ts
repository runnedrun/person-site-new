import { isNil } from "lodash"
import { useCallback } from "react"
import {
  RouterInfo,
  useRouterInfoNext12,
  useRouterInfoNext13,
} from "./useRouterInfo"

export type SearchParamSetter<ParamName extends string | number | symbol> = (
  param: ParamName,
  value: string | null | undefined
) => void

export const useSearchParamSetterNext12 = <
  ParamName extends string = string,
>() => {
  return useSearchParamSetterBase<ParamName>(useRouterInfoNext12())
}

export const useSearchParamSetter = <
  ParamName extends string | number | symbol = string | number | symbol,
>() => {
  return useSearchParamSetterBase<ParamName>(useRouterInfoNext13())
}

export const useSearchParamSetterBase = <
  ParamName extends string | number | symbol = string | number | symbol,
>(
  routerInfo: RouterInfo
): SearchParamSetter<ParamName> => {
  const { pathname, searchParams, router } = routerInfo
  const createQueryString = useCallback(
    (name: ParamName, value: string | null | undefined) => {
      const params = new URLSearchParams(searchParams)

      isNil(value)
        ? params.delete(name as string)
        : params.set(name as string, value)

      return params.toString()
    },
    [searchParams]
  )

  return useCallback(
    (paramName: ParamName, paramValue: string | null | undefined) => {
      router.replace(pathname + "?" + createQueryString(paramName, paramValue))
    },
    [router, createQueryString]
  )
}
