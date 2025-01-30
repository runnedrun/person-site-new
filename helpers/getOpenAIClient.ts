import OpenAI from "openai"

const openAiApiKey = process.env.OPENAI_API_KEY

export const getOpenAIClient = () => {
  return new OpenAI({
    apiKey: openAiApiKey,
  })
}
