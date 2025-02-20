import { UserContext } from "@/data/context/UserContext"
import { isNotNil } from "@/data/helpers/isUndefTyped"
import { queryObs } from "@/data/readerFe"
import { QAPairing } from "@/data/types/QAPairing"
import { useObs } from "@/data/useObs"
import { fbCreate } from "@/data/writerFe"
import { useMDXComponents } from "@/mdx-components"
import { Timestamp } from "firebase/firestore"
import { uniqBy } from "lodash"
import { ArrowDown, ChevronLeft, ChevronRight, Send } from "lucide-react"
import { MDXRemote as MDXRemoteClient } from "next-mdx-remote"
import { useContext, useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { LoadingBounce } from "../ui/loading-bounce"
import { LoadingSpinner } from "../ui/loading-spinner"
import { AboutContext } from "./AboutPageWrapper"
import { CurrentAbout } from "./CurrentAbout"
import { DavidSummary } from "./DavidSummary"

export const DEFAULT_QUESTION = "Who are you?"

export const QADisplay = () => {
  const { startingQA, setParam } = useContext(AboutContext)
  const { user } = useContext(UserContext)

  const qaPairings = useObs(
    user
      ? queryObs("qaPairings", ({ where }) => {
          return [where("askedBy", "==", user.uid)]
        })
      : null,
    []
  )

  const defaultQA: Partial<QAPairing> = {
    question: DEFAULT_QUESTION,
    answer: null,
    uid: undefined,
  }

  const withDefaultQuestion = uniqBy(
    [defaultQA, startingQA, ...(qaPairings ?? [])].filter(isNotNil),
    (_) => _.uid
  )

  const [question, setQuestion] = useState(DEFAULT_QUESTION)
  const [qaIndex, setQaIndex] = useState(withDefaultQuestion.length - 1)
  const [isLoading, setIsLoading] = useState(false) // Get all QA pairings for user

  const currentQA = withDefaultQuestion?.[qaIndex] as QAPairing

  useEffect(() => {
    if (currentQA?.uid) {
      console.log("setting selectedQAId", currentQA.uid)
      setParam("selectedQAId", currentQA.uid)
    }
  }, [currentQA])

  const currentAnsweredQuestion = currentQA?.question

  const currentAnswerIsForCurrentQuestion =
    currentAnsweredQuestion?.trim() === question?.trim()

  useEffect(() => {
    if (currentAnsweredQuestion) {
      setQuestion(currentAnsweredQuestion)
    }
  }, [currentAnsweredQuestion])

  const canGoForward = qaIndex < (withDefaultQuestion?.length ?? 0) - 1
  const canGoBack = qaIndex > 0

  const navigateQA = (direction: "back" | "forward") => {
    if (direction === "back" && canGoBack) {
      setQaIndex(qaIndex - 1)
    } else if (direction === "forward" && canGoForward) {
      setQaIndex(qaIndex + 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (currentAnswerIsForCurrentQuestion) {
      return
    }

    setIsLoading(true)
    e.preventDefault()
    if (!question.trim() || !user) return

    // Create new QA pairing
    const newQA: QAPairing = {
      question,
      answer: "",
      askedBy: user.uid,
      createdAt: Timestamp.now(),
      answeredAt: null,
      notFound: null,
      serializedAnswer: null,
    }

    setQaIndex(qaIndex + 1)

    const ref = await fbCreate("qaPairings", newQA)

    // Trigger answer processing
    await fetch("/api/process_message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId: ref.id }),
    })
    setIsLoading(false)
  }

  const components = useMDXComponents({})

  let submitButton = <Send className="cursor-pointer" onClick={handleSubmit} />

  if (isLoading) {
    submitButton = <LoadingSpinner className="h-4 w-4" />
  } else if (currentAnswerIsForCurrentQuestion) {
    submitButton = <ArrowDown />
  }

  const display = (qa: Partial<QAPairing>) => {
    if (qa.answeredAt && qa.serializedAnswer && qa.answer) {
      return (
        <MDXRemoteClient {...qa.serializedAnswer} components={components} />
      )
    } else if (qa.question === DEFAULT_QUESTION) {
      return <CurrentAbout />
    } else {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <LoadingBounce />
        </div>
      )
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <DavidSummary />
      <div className="w-full text-center font-bold">
        Ask David Bot some questions!
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => navigateQA("back")}
          disabled={!canGoBack}
        >
          <ChevronLeft />
        </Button>
        <Input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e)
            }
          }}
          value={question}
          disabled={isLoading}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask David Bot a question about himself!"
          className="w-full resize-none rounded-lg bg-white bg-opacity-30 p-3 focus:ring-2 focus:ring-blue-500"
        />
        {submitButton}

        <Button
          variant="ghost"
          onClick={() => navigateQA("forward")}
          disabled={!canGoForward}
        >
          <ChevronRight />
        </Button>
      </div>
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${qaIndex * 100}%)` }}
        >
          {withDefaultQuestion.map((qa) => {
            return (
              <div key={qa.uid || "default"} className="w-full flex-shrink-0">
                {display(qa)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
