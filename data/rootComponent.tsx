import { jsonifyTimestampsFe } from "@/data/fetchHelpers/jsonifyTimestampsFe"
import {
  distinctUntilChanged,
  firstValueFrom,
  map,
  Observable,
  of,
  withLatestFrom,
} from "rxjs"
import { DataWithoutStatics, splitDataAndStatics } from "./DataWithStatics"
import { ServerDataReceiverComponent } from "./ServerDataReceiverComponent"
import { JSX } from "react"
import { queryObs } from "./readerFe"

export type PassFromServerToClientProp<
  InitialValuesType extends Record<string, unknown>,
  ParamsType extends Record<string, unknown> = any,
> = {
  _initialValues?: InitialValuesType
  params?: ParamsType
}
export type ComponentWithInitialValues<
  InitialValuesType extends Record<string, unknown>,
  ParamsType extends Record<string, unknown> = any,
  StaticProps extends Record<string, unknown> = any,
> = (
  props: PassFromServerToClientProp<InitialValuesType, ParamsType> & StaticProps
) => JSX.Element

export type GetObsForArgFn<ArgObject extends Record<string, unknown>> = <
  ArgName extends keyof ArgObject,
>(
  argName: ArgName
) => Observable<ArgObject[ArgName] | null>

export type DataFnType<
  DataType extends Record<string, unknown> = any,
  ParamsType extends Record<string, unknown> = any,
  PropsType extends Record<string, unknown> = any,
> = (args: {
  getParam: GetObsForArgFn<ParamsType>
  getProp: GetObsForArgFn<PropsType>
}) => DataType & { _deps?: unknown[] }

export const buildKeyGetterFromObs = <
  ParamsType extends Record<string, unknown>,
>(
  paramObs: Observable<ParamsType>,
  castUndefToNull = of(false)
): GetObsForArgFn<ParamsType> => {
  return (paramName) => {
    const $param = paramObs.pipe(
      map((_) => {
        return _[paramName] as ParamsType[any]
      }),
      distinctUntilChanged()
    )
    const withPossibleNullCast = $param.pipe(
      withLatestFrom(castUndefToNull),
      map(([param, castUndefToNull]) => {
        return castUndefToNull && param === undefined ? null : param
      })
    )
    return withPossibleNullCast
  }
}

export const rootComponent = <
  InputDataFnsType extends Record<string, DataFnType>,
>(
  dataFns: InputDataFnsType,
  ClientComponent: ServerDataReceiverComponent<InputDataFnsType>
) => {
  const Component = async ({
    params,
    searchParams,
  }: {
    params: Promise<Record<string, any>>
    searchParams: Promise<Record<string, any>>
  }) => {
    const obs = queryObs("qaPairings", ({ where }) => {
      return [
        where("archived", "==", false),
        where("createdAt", "==", "2025-02-25"),
      ]
    })
    await firstValueFrom(obs)

    const res = {} as Record<string, unknown>
    const resolvedParams = await params
    const resolvedSearchParams = await searchParams

    const dataPromises = Object.keys(dataFns).map(async (dataFnName) => {
      const dataObj = dataFns[dataFnName]({
        getParam: buildKeyGetterFromObs(
          of({ ...resolvedParams, ...resolvedSearchParams })
        ),
        getProp: buildKeyGetterFromObs(of({})),
      })

      const { dataObs } = splitDataAndStatics(dataObj)
      const data = await firstValueFrom(dataObs)
      res[dataFnName] = data
    })

    await Promise.all(dataPromises)

    return (
      <ClientComponent
        _initialValues={
          jsonifyTimestampsFe(res) as {
            [key in keyof InputDataFnsType]: DataWithoutStatics<
              ReturnType<InputDataFnsType[key]>
            >
          }
        }
        params={{ ...resolvedParams, ...resolvedSearchParams }}
      ></ClientComponent>
    )
  }
  return Component
}
