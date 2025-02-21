import { getBeAppNext } from "@/helpers/initFbBe"
import { NextRequest, NextResponse } from "next/server"
import { getStorage } from "firebase-admin/storage"
import { getFirestore, Timestamp } from "firebase-admin/firestore"

import { createLogger, format, transports } from "winston"
import { serialize } from "next-mdx-remote/serialize"
import { QAPairing } from "@/data/types/QAPairing"
import { answerFormatExplanation } from "./answerFormatExplanation"
import Anthropic from "@anthropic-ai/sdk"
import { TextBlock } from "@anthropic-ai/sdk/resources/index.mjs"
const { combine, errors, timestamp } = format

const baseFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  format((info) => {
    info.level = info.level.toUpperCase()
    return info
  })()
)

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
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    })
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


Context:
todays date: ${currentDate}

${context}

Remember:
1. Only provide brief responses
2. Only use information from the provided context
3. Always provide a response, even if no relevant information is found
4. Answer in the first person, as if you are David.
5. Return your response in valid JSON format`

    const userPrompt = `
${previousQuestionsString}

Your answer, as if you are David:`

    // Get Claude response
    const completion = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 400,
      messages: [
        { role: "assistant", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    })

    const claudeResponse = (completion.content[0] as TextBlock).text

    console.log("claudeResponse", claudeResponse)

    // Update QA pairing with response
    await db
      .collection("qaPairings")
      .doc(messageId)
      .update({
        answer: claudeResponse,
        serializedAnswer: await serialize(claudeResponse),
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
