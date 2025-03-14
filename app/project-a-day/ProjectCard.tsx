import ReactMarkdown from "react-markdown"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export const ProjectCard = ({
  title,
  description,
  starterPromptForAiCopilot,
  technologyDemonstrated,
  documentationLink,
  searchSource,
  infoSource,
}: {
  title: string
  description: string
  starterPromptForAiCopilot: string
  technologyDemonstrated: string
  documentationLink: string
  searchSource: string
  infoSource: string
}) => {
  const [copied, setCopied] = useState(false)

  return (
    <Card className="bg-white transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-800">{title}</CardTitle>
        <div className="text-sm text-gray-600">
          Technology: {technologyDemonstrated}
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose mb-4">
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
        <div className="mb-4 space-y-2 text-sm text-gray-600">
          {documentationLink && (
            <div>
              <span className="font-semibold">Documentation:</span>{" "}
              <a
                href={documentationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Documentation
              </a>
            </div>
          )}
          <div>
            <span className="font-semibold">Source:</span>{" "}
            <a
              href={infoSource}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {infoSource}
            </a>
          </div>
          <div>
            <span className="font-semibold">Found via:</span>{" "}
            <a
              href={searchSource}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {searchSource}
            </a>
          </div>
        </div>
        <div className="rounded-md bg-gray-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-600">
              Starter Prompt:
            </h3>
            <CopyToClipboard
              text={starterPromptForAiCopilot}
              onCopy={() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
            >
              <button className="rounded bg-blue-500 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-600">
                {copied ? "Copied!" : "Copy"}
              </button>
            </CopyToClipboard>
          </div>
          <p className="line-clamp-3 font-mono text-sm text-gray-700">
            {starterPromptForAiCopilot}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
