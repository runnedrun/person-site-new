"use client"

import {
  projectADayData,
  projectADayDataFunctions,
} from "./projectADayDataFunctions"
import ReactMarkdown from "react-markdown"

import { buildDataContext } from "@/data/context/buildDataContext"
import { ServerDataReceiverComponent } from "@/data/ServerDataReceiverComponent"
import { useContext } from "react"

export const [ProjectADayContext, ProvideProjectADayContext] =
  buildDataContext(projectADayData)

const ProjectsDisplay = () => {
  const { potentialProjects } = useContext(ProjectADayContext)
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {potentialProjects?.map((project) => (
        <div
          key={project.uid}
          className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
        >
          <h2 className="mb-3 text-2xl font-semibold">{project.title}</h2>
          <div className="prose dark:prose-invert mb-4">
            <ReactMarkdown>{project.description}</ReactMarkdown>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <h3 className="mb-2 text-lg font-semibold">Starter Prompt:</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {project.starterPromptForCopilot}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
export const ProjectADayClientComponent: ServerDataReceiverComponent<
  typeof projectADayDataFunctions
> = ({ _initialValues }) => {
  return (
    <ProvideProjectADayContext _initialValues={_initialValues?.main}>
      <div className="container mx-auto p-8">
        <h1 className="mb-8 text-4xl font-bold">Project Ideas</h1>
        <ProjectsDisplay />
      </div>
    </ProvideProjectADayContext>
  )
}
