"use client"

import { hydrateTimestampsFe } from "@/data/fetchHelpers/jsonifyTimestampsFe"
import { objHasUndef } from "@/data/helpers/filterUndef"
import { objKeys } from "@/data/helpers/objKeys"
import { omit } from "lodash"
import { useParams, useSearchParams } from "next/navigation"
import { JSX, Suspense, useEffect, useMemo, useState } from "react"
import { BehaviorSubject, of } from "rxjs"
import {
  DataWithoutStatics,
  DataWithStatics,
  splitDataAndStatics,
} from "./DataWithStatics"
import {
  buildKeyGetterFromObs,
  DataFnType,
  PassFromServerToClientProp,
} from "./rootComponent"
import { useSearchParamSetter } from "./useSearchParamSetter"

type WithDataOptions = {
  allowUndefined?: boolean
  name?: string
  loadingComponent?: JSX.Element
}

export type DataTypeFromDataFn<DataFn extends DataFnType> =
  DataFn extends DataFnType<infer DataType> ? DataType : never

export type ParamsTypeFromDataFn<DataFn extends DataFnType> =
  DataFn extends DataFnType<infer DataType, infer ParamsType>
    ? ParamsType
    : never

export type ResolvedDataTypeFromDataFn<DataFn extends DataFnType> =
  DataWithStatics<DataTypeFromDataFn<DataFn>>

type ComponentProps<
  DataType extends Record<string, unknown>,
  Params extends Record<string, unknown> = Record<string, unknown>,
  StaticProps extends Record<string, unknown> = Record<string, unknown>,
> = {
  data: DataWithStatics<DataType>
} & StaticProps & {
    setParam: (name: keyof Params, value: string | null | undefined) => void
    _isLoading: boolean
  }
type TopLevelReturnComponentProps<
  DataFn extends DataFnType,
  StaticProps extends Record<string, unknown> = Record<string, unknown>,
> = PassFromServerToClientProp<
  DataWithStatics<DataTypeFromDataFn<DataFn>>,
  ParamsTypeFromDataFn<DataFn>
> &
  StaticProps

type TopLevelReturnComponentType<
  DataFn extends DataFnType,
  StaticProps extends Record<string, unknown> = Record<string, unknown>,
> = (props: TopLevelReturnComponentProps<DataFn, StaticProps>) => JSX.Element

export const withData =
  <
    ParamsType extends Record<string, unknown> = Record<string, unknown>,
    StaticProps extends Record<string, unknown> = Record<string, unknown>,
  >() =>
  <
    DataType extends Record<string, unknown>,
    DataFn extends DataFnType<DataType, ParamsType> = DataFnType<
      DataType,
      ParamsType
    >,
  >(
    dataFn: DataFn,
    Component: (
      props: ComponentProps<
        DataTypeFromDataFn<DataFn>,
        ParamsTypeFromDataFn<DataFn>,
        StaticProps
      >
    ) => JSX.Element,
    options?: WithDataOptions
  ): TopLevelReturnComponentType<DataFn, StaticProps> => {
    const UnderlyingComponent = (
      props: TopLevelReturnComponentProps<DataFn>
    ) => {
      const setParam = useSearchParamSetter() as (
        name: keyof ParamsType,
        value: string
      ) => void

      const propsForPassingToChild = omit(
        props,
        "_initialValues",
        "params"
      ) as unknown as StaticProps

      const params = useParams()
      const searchParams = useSearchParams()

      const allSearchParams = {} as Record<string, string>
      searchParams.forEach((value, key) => {
        allSearchParams[key] = value
      })
      const allParams = {
        ...params,
        ...allSearchParams,
      } as unknown as ParamsType

      const routerReadySubj = useMemo(() => new BehaviorSubject(true), [])

      const paramsSub = useMemo(() => new BehaviorSubject(allParams), [])
      const getObsForParam = buildKeyGetterFromObs(paramsSub, routerReadySubj)

      useEffect(() => {
        paramsSub.next(allParams)
      }, [allParams])

      const dataObj = dataFn({
        getParam: getObsForParam,
      })

      const { dataObs, statics } = splitDataAndStatics(dataObj)

      const [resolvedData, setResolvedData] = useState(
        hydrateTimestampsFe(
          props._initialValues || {}
        ) as DataWithoutStatics<DataType>
      )

      useEffect(() => {
        const sub = dataObs.subscribe((data) => {
          setResolvedData(data as DataWithoutStatics<DataType>)
        })
        return () => sub.unsubscribe()
      }, [...(dataObj._deps || [])])

      const resolvedWithStatics = { ...resolvedData, ...statics }

      const dataKeys = objKeys(dataObj)

      const allKeysResolvedData = dataKeys.reduce((acc, key) => {
        return { ...acc, [key]: resolvedWithStatics[key] }
      }, {} as DataWithoutStatics<DataType>)

      const isLoading = objHasUndef(allKeysResolvedData)
      const shouldShow = !isLoading || options?.allowUndefined

      return shouldShow ? (
        <Component
          _isLoading={isLoading}
          setParam={setParam}
          data={
            { ...allKeysResolvedData, ...statics } as DataWithStatics<
              DataTypeFromDataFn<DataFn>
            >
          }
          {...(propsForPassingToChild as unknown as any)}
        />
      ) : (
        options?.loadingComponent || <div></div>
      )
    }
    return (props: TopLevelReturnComponentProps<DataFn>) => (
      <Suspense fallback={<div></div>}>
        <UnderlyingComponent {...props}></UnderlyingComponent>
      </Suspense>
    )
  }
