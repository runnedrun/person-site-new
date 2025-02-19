import { init } from "@/helpers/initFb"
import { useMDXComponents } from "@/mdx-components"
import { QAPairing } from "@/data/types/QAPairing"
import { getAuth, signInAnonymously } from "firebase/auth"
import {
  addDoc,
  collection,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore"
import {
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
} from "lucide-react"
import { MDXRemote } from "next-mdx-remote"
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { DavidSummary } from "./DavidSummary"

export const DEFAULT_QUESTION = "Who are you?"

export const QADisplay = ({
  defaultAnswer,
}: {
  defaultAnswer: React.ReactNode
}) => {
  const [question, setQuestion] = useState(DEFAULT_QUESTION)
  const [qaIndex, setQaIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false) // Get all QA pairings for user

  const withDefaultQuestion = [
    {
      question: DEFAULT_QUESTION,
      answer: null,
    },
    ...(qaPairings ?? []),
  ]

  useEffect(() => {
    setQaIndex(withDefaultQuestion.length - 1)
  }, [withDefaultQuestion.length])

  const currentQA = withDefaultQuestion?.[qaIndex] as QAPairing | undefined

  const currentAnsweredQuestion = currentQA?.question

  const currentAnswerIsForCurrentQuestion =
    currentAnsweredQuestion?.trim() === question?.trim()

  useEffect(() => {
    if (currentAnsweredQuestion) {
      setQuestion(currentAnsweredQuestion)
    }
  }, [currentAnsweredQuestion])

  console.log("qaPairings", withDefaultQuestion, qaIndex)

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
    const newQA = {
      question,
      answer: "",
      askedBy: user.uid,
      createdAt: Timestamp.now(),
      answeredAt: null,
    }

    const docRef = await addDoc(collection(db, "qaPairings"), newQA)

    // Trigger answer processing
    await fetch("/api/process_message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId: docRef.id }),
    })
    setIsLoading(false)
  }

  const components = useMDXComponents({})

  let submitButton = <Send className="cursor-pointer" onClick={handleSubmit} />

  if (isLoading) {
    submitButton = <Loader2 />
  } else if (currentAnswerIsForCurrentQuestion) {
    submitButton = <ArrowDown />
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
          className="w-full resize-none rounded-lg bg-transparent p-3 focus:ring-2 focus:ring-blue-500"
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

      {currentQA ? (
        <div>
          {currentQA.answeredAt ? (
            <MDXRemote
              {...currentQA.serializedAnswer}
              components={components}
            />
          ) : (
            defaultAnswer
          )}
        </div>
      ) : (
        defaultAnswer
      )}
    </div>
  )
}
