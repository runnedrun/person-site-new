import { rootComponent } from "@/data/rootComponent"
import { ProjectADayClientComponent } from "./ProjectADayClientComponent"
import { projectADayDataFunctions } from "./projectADayDataFunctions"

export default rootComponent(
  projectADayDataFunctions,
  ProjectADayClientComponent
)
