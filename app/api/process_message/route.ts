import { getBeAppNext } from "@/helpers/initFbBe"
import { NextRequest, NextResponse } from "next/server"
import { getStorage } from "firebase-admin/storage"
import { getFirestore, Timestamp } from "firebase-admin/firestore"

import { createLogger, format, transports } from "winston"
import { serialize } from "next-mdx-remote/serialize"
import { QAPairing } from "@/data/types/QAPairing"
import { answerFormatExplanation } from "./answerFormatExplanation"
import Anthropic from "@anthropic-ai/sdk"
import { TextBlock, ToolUseBlock } from "@anthropic-ai/sdk/resources/index.mjs"
import { URLReaderImpl, URLReaderInput } from "@/lib/tools/URLReaderImpl"
import { getSecretAbout } from "@/sanity/getSecretAbout"
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
    const urlReader = new URLReaderImpl({
      allowedDomains: [], // Configure allowed domains as needed
      maxContentSize: 5 * 1024 * 1024, // 5MB limit
      allowRedirects: true,
    })

    const tools = [
      {
        name: "read_url",
        description: `Fetches and reads content from specified URLs. Use this tool when you need to read content from a webpage.
        The tool will return the text content of the page with HTML tags stripped.
        Only use this for valid HTTP/HTTPS URLs.
        If the URL is invalid or inaccessible, the tool will return an error message.
        The tool has a 5MB size limit and 5 second timeout by default.
        Do not use this tool unless explicitly asked to read from a URL.`,
        input_schema: {
          type: "object" as const,
          properties: {
            url: {
              type: "string",
              description:
                "The URL to fetch content from. Must be a valid HTTP/HTTPS URL.",
            },
            timeout: {
              type: "number",
              description: "Optional timeout in milliseconds (default: 5000)",
            },
            stripHtml: {
              type: "boolean",
              description:
                "Whether to strip HTML tags from response (default: true)",
            },
          },
          required: ["url"],
        },
      },
    ]

    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    })
    const app = getBeAppNext()
    const db = getFirestore(app)
    const storage = getStorage(app)

    const { messageId } = await req.json()

    // Get the QA pairing
    const qaDoc = await db.collection("qaPairings").doc(messageId).get()
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
    const context = await getSecretAbout()

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
4. Answer in the first person, as if you are David, with no prefix.
5. Return your response in valid JSON format`

    const userPrompt = `${previousQuestionsString}`

    // Get Claude response
    const completion = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 400,
      messages: [
        { role: "assistant", content: systemPrompt },
        { role: "user", content: userPrompt },
        { role: "assistant", content: "Here is my answer, as if I am David:" },
      ],
      tools: tools,
    })

    // Handle tool use if Claude requests it
    if (completion.stop_reason === "tool_use") {
      const toolUse = completion.content.find(
        (block: any) => block.type === "tool_use"
      ) as ToolUseBlock

      if (toolUse && toolUse.name === "read_url") {
        try {
          const result = await urlReader.execute(
            toolUse.input as URLReaderInput
          )

          // Send the tool result back to Claude
          const toolResponse = await anthropic.messages.create({
            model: "claude-3-7-sonnet-latest",
            max_tokens: 400,
            messages: [
              { role: "assistant", content: systemPrompt },
              { role: "user", content: userPrompt },
              {
                role: "assistant",
                content: completion.content,
              },
              {
                role: "assistant",
                content: [
                  {
                    type: "tool_result",
                    tool_use_id: toolUse.id,
                    content: result.content,
                    is_error: result.error ? true : false,
                  },
                ],
              },
            ],
            tools: tools,
          })

          // Use the final response from Claude
          const claudeResponse = (toolResponse.content[0] as TextBlock).text

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
        } catch (error) {
          logger.error("Tool execution error", error)
          return NextResponse.json(
            { error: "Error executing tool" },
            { status: 500 }
          )
        }
      }
    }

    // Handle normal response (no tool use)
    const claudeResponse = (completion.content[0] as TextBlock).text

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
