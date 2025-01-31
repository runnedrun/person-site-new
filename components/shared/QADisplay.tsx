import { init } from "@/helpers/initFb"
import { useAuthState } from "react-firebase-hooks/auth"
import { getAuth, signInAnonymously } from "firebase/auth"
import {
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  Timestamp,
} from "firebase/firestore"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { QAPairing } from "@/models/QAPairing"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Send } from "lucide-react"
import { Input } from "../ui/input"

export const QADisplay = () => {
  const db = init()
  const auth = getAuth()
  const [user] = useAuthState(auth)

  const [question, setQuestion] = useState("")

  // Sign in anonymously if no user
  useEffect(() => {
    if (!user) {
      signInAnonymously(auth)
    }
  }, [user, auth])

  // Get latest QA pairing for user
  const qaQuery = query(
    collection(db, "qaPairings"),
    orderBy("createdAt", "desc"),
    limit(1)
  )
  const [qaPairings] = useCollectionData(qaQuery)
  const latestQA = qaPairings?.[0] as QAPairing | undefined

  const handleSubmit = async (e: React.FormEvent) => {
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
    fetch("/api/process_message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId: docRef.id }),
    })

    setQuestion("")
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {latestQA && (
        <div className="space-y-4 rounded-lg bg-gray-50 p-6 shadow-md">
          <div className="text-gray-800">
            {latestQA.answeredAt ? (
              latestQA.answer
            ) : (
              <div className="flex items-center justify-center">
                <div className="animate-pulse">Loading...</div>
              </div>
            )}
          </div>
          <div className="border-t pt-4 italic text-gray-600">
            {latestQA.question}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask David Bot a question about himself!"
            className="w-full resize-none rounded-lg border border-gray-600 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" disabled={!question.trim()} className="w-12">
            <Send />
          </Button>
        </form>
      </div>
    </div>
  )
}
