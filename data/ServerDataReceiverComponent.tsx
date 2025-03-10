import { DataWithoutStatics } from "./DataWithStatics"
import { ComponentWithInitialValues, DataFnType } from "./rootComponent"

export type ServerDataReceiverComponent<
  InputDataFnsType extends Record<string, DataFnType>,
> = ComponentWithInitialValues<
  {
    [key in keyof InputDataFnsType]: DataWithoutStatics<
      ReturnType<InputDataFnsType[key]>
    >
  },
  {},
  { params: any }
>
