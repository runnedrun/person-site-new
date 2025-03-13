"use client"
import { buildDataContext } from "@/data/context/buildDataContext"
import { projectADayDataFunctions } from "./projectADayDataFunctions"
import { ServerDataReceiverComponent } from "@/data/ServerDataReceiverComponent"
import { useContext } from "react"
import ReactMarkdown from "react-markdown"

export const [ProjectADayContext, ProvideProjectADayContext] = buildDataContext(
  projectADayDataFunctions.projectADayData
)

const ProjectCard = ({
  title,
  description,
  starterPromptForCopilot,
}: {
  title: string
  description: string
  starterPromptForCopilot: string
}) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">{title}</h2>
      <div className="prose mb-4">
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>
      <div className="rounded-md bg-gray-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-600">
          Starter Prompt:
        </h3>
        <p className="font-mono text-sm text-gray-700">
          {starterPromptForCopilot}
        </p>
      </div>
    </div>
  )
}

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
        <ProjectCard
          key={project.uid}
          title={project.title}
          description={project.description}
          starterPromptForCopilot={project.starterPromptForCopilot}
        />
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
