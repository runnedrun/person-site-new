import { getOpenAIClient } from "@/helpers/getOpenAIClient"
import { getBeAppNext } from "@/helpers/initFbBe"
import { NextRequest, NextResponse } from "next/server"
import { getStorage } from "firebase-admin/storage"
import { getFirestore } from "firebase-admin/firestore"
import { zodResponseFormat } from "openai/helpers/zod"
import { GPTResponse } from "@/models/GPTResponse"

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

    if (!qaDoc.exists) {
      return NextResponse.json(
        { error: "QA pairing not found" },
        { status: 404 }
      )
    }

    const qaPairing = qaDoc.data()

    // Get context from storage
    const bucket = storage.bucket("david-qa.firebasestorage.app")
    const file = bucket.file("secret_about.md")
    const [content] = await file.download()
    const context = content.toString("utf-8")

    const currentDate = new Date().toISOString()

    // Prepare the prompt
    const systemPrompt = `You are an AI assistant that gives BRIEF answers to direct questions about David using ONLY the information provided in the context below.
If the user's message is not a direct question or requests a long-form response, explain that you can only provide brief responses to direct questions about David.
If you are missing information use phrases like "I don't know that" NOT "My context doesn't have that information" or "The information provided doesn't include that".

Your response must be in JSON format with two fields:
- response: A string containing your brief answer or explanation
- notFound: A boolean that should be true if ANY requested information is not found in the context

Context:
todays date: ${currentDate}

${context}

Remember:
1. Only provide brief responses to direct questions
2. If the input is not a direct question, explain your limitations
3. Only use information from the provided context
4. If ANY part of the question cannot be answered, set notFound to true and explain what information was missing
5. Always provide a response, even if no relevant information is found
6. Return your response in valid JSON format`

    // Get GPT response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: qaPairing?.question },
      ],
      response_format: zodResponseFormat(GPTResponse, "response"),
      max_tokens: 200,
    })

    const gptResponse = JSON.parse(completion.choices[0].message.content ?? "")

    // Update QA pairing with response
    await db.collection("qaPairings").doc(messageId).update({
      answer: gptResponse.response,
      notFound: gptResponse.notFound,
      answeredAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.log("Error processing message", error.message)
    return NextResponse.json(
      { error: "Error processing message" },
      { status: 500 }
    )
  }
}
