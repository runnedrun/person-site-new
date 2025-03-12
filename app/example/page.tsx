import { rootComponent } from "@/data/rootComponent"
import { examplePageDataFunctions } from "./examplePageDataFunctions"
import { ExamplePageClientComponent } from "./ExamplePageClientComponent"

const ExamplePage = rootComponent(
  examplePageDataFunctions,
  ExamplePageClientComponent
)

export default ExamplePage
