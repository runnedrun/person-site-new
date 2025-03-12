"use client"
import { buildDataContext } from "@/data/context/buildDataContext"
import {
  examplePageDataFunction,
  examplePageDataFunctions,
} from "./examplePageDataFunctions"
import { ServerDataReceiverComponent } from "@/data/ServerDataReceiverComponent"
import { useContext } from "react"

export const [ExamplePageContext, ProvideExamplePageContext] = buildDataContext(
  examplePageDataFunction
)

const ExampleDisplay = () => {
  const { title } = useContext(ExamplePageContext)
  return <div>{title}</div>
}

export const ExamplePageClientComponent: ServerDataReceiverComponent<
  typeof examplePageDataFunctions
> = ({ params, _initialValues }) => {
  return (
    <ProvideExamplePageContext
      params={params}
      _initialValues={_initialValues?.exampleData}
    >
      <ExampleDisplay></ExampleDisplay>
    </ProvideExamplePageContext>
  )
}
