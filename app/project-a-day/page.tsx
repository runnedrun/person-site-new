import { rootComponent } from "@/data/rootComponent"
import { projectADayDataFunctions } from "./projectADayDataFunctions"
import { ProjectADayClientDataProviders } from "./ProjectADayClientDataProviders"

const ProjectADayPage = rootComponent(
  projectADayDataFunctions,
  ProjectADayClientDataProviders
)

export default ProjectADayPage
