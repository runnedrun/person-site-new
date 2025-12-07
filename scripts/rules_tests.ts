import { initializeApp } from "@firebase/app"
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing"

import { readFileSync } from "fs"
import { resolve } from "path"

const rules = readFileSync(resolve(__dirname, "../firestore.rules"), "utf8")

export const run = async () => {
  const testEnv = await initializeTestEnvironment({
    projectId: "test-project",
    firestore: {
      rules,
      host: "127.0.0.1",
      port: 8072,
    },
  })

  testEnv.withSecurityRulesDisabled(async (context) => {
    const adminDb = context.firestore()
    await adminDb.collection("items").doc("public").set({})
  })
}
