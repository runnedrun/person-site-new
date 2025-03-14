import { rootComponent } from "@/data/rootComponent"
import { surveysDataFunctions } from "./surveysDataFunctions"
import { SurveysClientDataProviders } from "./SurveysClientDataProviders"

const SurveysPage = rootComponent(
  surveysDataFunctions,
  SurveysClientDataProviders
)

export default SurveysPage
