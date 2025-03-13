import { rootComponent } from "@/data/rootComponent"
import { examplePageDataFunctions } from "./examplePageDataFunctions"
import { ExamplePageClientDataProviders } from "./ExamplePageClientDataProviders"

const ExamplePage = rootComponent(
  examplePageDataFunctions,
  ExamplePageClientDataProviders
)

export default ExamplePage
