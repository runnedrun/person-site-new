import { getFbPrivateKey } from "@/helpers/initFbBe"
import { VertexAI } from "@google-cloud/vertexai"

export const getVertexAIClient = () => {
  return new VertexAI({
    project: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_PROJECT_ID,
    location: "global",
    apiEndpoint: "aiplatform.googleapis.com",
    googleAuthOptions: {
      credentials: {
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: getFbPrivateKey(),
      },
    },
  })
}
