const maxDuration = 90
import { getBeAppNext } from "@/helpers/initFbBe"
import { getVertexAIClient } from "@/helpers/getVertexAIClient"
import { Timestamp } from "firebase-admin/firestore"
import { NextRequest, NextResponse } from "next/server"

import { readDoc, readQuery } from "@/data/reader"
import { QAPairing } from "@/data/types/QAPairing"
import { setDoc } from "@/data/writer"

import { getSecretAbout } from "@/sanity/getSecretAbout"
import { serialize } from "next-mdx-remote/serialize"
import { answerFormatExplanation } from "./answerFormatExplanation"
export type ProcessMessageArgs = {
  messageId: string
}

export async function POST(req: NextRequest) {
  getBeAppNext()

  const { messageId } = await req.json()

  const qaDoc = await readDoc("qaPairings", messageId)

  const previousQuestions = await readQuery(
    "qaPairings",
    ({ where, orderBy, limit, or }) => [
      where("askedBy", "==", qaDoc.askedBy),
      orderBy("createdAt", "desc"),
      limit(3),
    ]
  )

  if (!qaDoc?.createdAt) {
    return NextResponse.json({ error: "QA pairing not found" }, { status: 404 })
  }

  const previousQuestionsString = previousQuestions
    .reverse()
    .map((doc) => {
      const answerString = doc.answer ? `Answer: ${doc.answer}\n` : ""
      return `Question: ${doc.question}${answerString}`
    })
    .join("\n")

  const context = await getSecretAbout()

  const currentDate = new Date().toISOString()

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
4. Answer in the first person, as if you are David, with no prefix.
5. Return your response in valid JSON format`

  const userPrompt = `${previousQuestionsString}`

  const model = getVertexAIClient().getGenerativeModel({
    model: "gemini-3.5-flash",
    systemInstruction: systemPrompt,
    generationConfig: { maxOutputTokens: 400 },
  })

  const completion = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
  })

  const aiResponse = completion.response.candidates![0].content.parts![0].text!

  await setDoc("qaPairings", messageId, {
    answer: aiResponse,
    serializedAnswer: await serialize(aiResponse),
    answeredAt: Timestamp.now(),
  } as Partial<QAPairing>)

  return NextResponse.json({ success: true })
}
