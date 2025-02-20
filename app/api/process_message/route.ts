import { getOpenAIClient } from "@/helpers/getOpenAIClient"
import { getBeAppNext } from "@/helpers/initFbBe"
import { NextRequest, NextResponse } from "next/server"
import { getStorage } from "firebase-admin/storage"
import { getFirestore, Timestamp } from "firebase-admin/firestore"
import { zodResponseFormat } from "openai/helpers/zod"
import { GPTResponse } from "@/models/GPTResponse"

import { createLogger, format, transports } from "winston"
import { serialize } from "next-mdx-remote/serialize"
import { QAPairing } from "@/data/types/QAPairing"
import { answerFormatExplanation } from "./answerFormatExplanation"
const { combine, errors, timestamp } = format

const baseFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  format((info) => {
    info.level = info.level.toUpperCase()
    return info
  })()
)

// const splunkFormat = combine(baseFormat, format.json())

const prettyFormat = combine(baseFormat, format.prettyPrint())

var logger = createLogger({
  level: "info",
  format: prettyFormat,
  handleExceptions: true,
  handleRejections: true,
  transports: [new transports.Console()],
})

export type ProcessMessageArgs = {
  messageId: string
}

export async function POST(req: NextRequest) {
  try {
    const openai = getOpenAIClient()
    const app = getBeAppNext()
    const db = getFirestore(app)
    const storage = getStorage(app)

    const { messageId } = await req.json()

    console.log("messageId", messageId)
    // Get the QA pairing
    const qaDoc = await db.collection("qaPairings").doc(messageId).get()
    console.log("qaDoc", qaDoc.data())
    const previousQuestions = await db
      .collection("qaPairings")
      .where("askedBy", "==", qaDoc.data()?.askedBy)
      .orderBy("createdAt", "desc")
      .limit(3)
      .get()

    if (!qaDoc.exists) {
      return NextResponse.json(
        { error: "QA pairing not found" },
        { status: 404 }
      )
    }

    const previousQuestionsString = previousQuestions.docs
      .reverse()
      .map((doc) => {
        const answerString = doc.data().answer
          ? `Answer: ${doc.data().answer}\n`
          : ""
        return `Question: ${doc.data().question}${answerString}`
      })
      .join("\n")

    // Get context from storage
    const bucket = storage.bucket("david-qa.firebasestorage.app")
    const file = bucket.file("secret_about.md")
    const [content] = await file.download()
    const context = content.toString("utf-8")

    const currentDate = new Date().toISOString()

    // Prepare the prompt
    const systemPrompt = `You are an AI assistant that answers questions as if you ARE David Gaynor, your creator. You give fun answers to direct questions about David using ONLY the information provided in the attached files.
Answer in the first person, as if you are David.
Answer using the style of the writing in the below context.
If asked about who you are say you're David Bot, a more digital but slightly less clever version of David.
If the user requests a response that's longer than 800 characters, explain that you can only provide brief responses.
If you don't have exactly the information the user is asking for, try your best to give some related information, but call out the information you don't have explicitly.
If you are missing information use phrases like "I don't know that" DONT say things like "My context doesn't have that information" or "The information provided doesn't include that". Don't mention you have a context or information that you're referencing.

${answerFormatExplanation}

Your response must be in JSON format with two fields:
- response: An MDX string containing your brief answer or explanation
- notFound: A boolean that should be true if ANY requested information is not found in the context

Context:
todays date: ${currentDate}

${context}

Remember:
1. Only provide brief responses
2. Only use information from the provided context
3. If ANY part of the question cannot be answered, set notFound to true and explain what information was missing
4. Always provide a response, even if no relevant information is found
5. Answer in the first person, as if you are David.
6. Return your response in valid JSON format`

    const userPrompt = `
${previousQuestionsString}

Your answer, as if you are David:`

    console.log("ser", systemPrompt)

    // Get GPT response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: zodResponseFormat(GPTResponse, "response"),
      max_tokens: 200,
    })

    const gptResponse = JSON.parse(completion.choices[0].message.content ?? "")

    // Update QA pairing with response
    await db
      .collection("qaPairings")
      .doc(messageId)
      .update({
        answer: gptResponse.response,
        serializedAnswer: await serialize(gptResponse.response),
        notFound: gptResponse.notFound,
        answeredAt: Timestamp.now(),
      } as Partial<QAPairing>)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    logger.error("err0", error)
    return NextResponse.json(
      { error: "Error processing message" },
      { status: 500 }
    )
  }
}
