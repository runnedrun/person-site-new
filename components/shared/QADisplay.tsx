import { UserContext } from "@/data/context/UserContext"
import { isNotNil } from "@/data/helpers/isUndefTyped"
import { queryObs } from "@/data/readerFe"
import { QAPairing } from "@/data/types/QAPairing"
import { useObs } from "@/data/useObs"
import { fbCreate } from "@/data/writerFe"
import { useMDXComponents } from "@/mdx-components"
import { orderBy, Timestamp } from "firebase/firestore"
import { isNil, uniqBy } from "lodash"
import { ArrowDown, ChevronLeft, ChevronRight, Send } from "lucide-react"
import { MDXRemote as MDXRemoteClient } from "next-mdx-remote"
import { useContext, useEffect, useState } from "react"
import { AutosizeTextarea } from "../ui/AutoGrowTextArea"
import { Button } from "../ui/button"
import { LoadingBounce } from "../ui/loading-bounce"
import { LoadingSpinner } from "../ui/loading-spinner"
import { AboutContext } from "./AboutPageWrapper"
import { CurrentAbout } from "./CurrentAbout"
import { DavidSummary } from "./DavidSummary"
import { logEvent } from "@/data/analytics/logEvent"

export const DEFAULT_QUESTION = "Describe yourself"

export const QADisplay = () => {
  const { startingQA, setParam } = useContext(AboutContext)
  const { user } = useContext(UserContext)

  const qaPairings = useObs(
    user
      ? queryObs("qaPairings", ({ where }) => {
          return [where("askedBy", "==", user.uid), orderBy("createdAt", "asc")]
        })
      : null,
    []
  )

  const defaultQA: Partial<QAPairing> = {
    question: DEFAULT_QUESTION,
    answer: null,
    uid: undefined,
  }

  const allPairings = [defaultQA, startingQA, ...(qaPairings ?? [])].filter(
    isNotNil
  )

  // todo handle when the other QAs take some time to load

  const withDefaultQuestion = uniqBy(
    allPairings.reverse(),
    (_) => _.uid
  ).reverse()

  const startingIndex = startingQA
    ? withDefaultQuestion.findIndex((qa) => qa.uid === startingQA.uid)
    : withDefaultQuestion.length - 1

  const [question, setQuestion] = useState(
    startingQA?.question ?? DEFAULT_QUESTION
  )
  const [qaIndex, setQaIndex] = useState(startingIndex)
  const [isLoading, setIsLoading] = useState(false) // Get all QA pairings for user

  const currentQA = withDefaultQuestion?.[qaIndex] as QAPairing

  useEffect(() => {
    if (qaPairings) {
      setQaIndex(startingIndex)
    }
  }, [isNil(qaPairings)])

  useEffect(() => {
    if (currentQA?.uid) {
      setParam("selectedQAId", currentQA.uid)
    }
  }, [currentQA?.uid])

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

    setQaIndex(withDefaultQuestion.length)

    logEvent("qa_submitted", {
      question,
      question_length: question.length,
    })
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
        Want to know more? Ask David Bot!
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => navigateQA("back")}
          disabled={!canGoBack}
        >
          <ChevronLeft />
        </Button>
        <AutosizeTextarea
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e)
            }
          }}
          value={question}
          disabled={isLoading}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask David Bot a question about himself!"
          className="min-h-[30px] w-full resize-none rounded-lg bg-white bg-opacity-30 p-2 focus:ring-2 focus:ring-blue-500"
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
