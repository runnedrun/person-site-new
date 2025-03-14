"use client"
import { buildDataContext } from "@/data/context/buildDataContext"
import { projectADayDataFunctions } from "./projectADayDataFunctions"
import { ServerDataReceiverComponent } from "@/data/ServerDataReceiverComponent"
import { useContext } from "react"
import { ProjectCard } from "./ProjectCard"

export const [ProjectADayContext, ProvideProjectADayContext] = buildDataContext(
  projectADayDataFunctions.projectADayData
)

const ProjectsDisplay = () => {
  const { projects } = useContext(ProjectADayContext)

  if (!projects?.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">No projects available yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.uid} {...project} />
      ))}
    </div>
  )
}

export const ProjectADayClientDataProviders: ServerDataReceiverComponent<
  typeof projectADayDataFunctions
> = ({ params, _initialValues }) => {
  return (
    <ProvideProjectADayContext
      params={params}
      _initialValues={_initialValues?.projectADayData}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">Project A Day</h1>
        <ProjectsDisplay />
      </div>
    </ProvideProjectADayContext>
  )
}
