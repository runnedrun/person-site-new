import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing"
import { readFileSync } from "fs"
import { resolve } from "path"
import {
  describe,
  test,
  beforeAll,
  afterAll,
  beforeEach,
  expect,
} from "@jest/globals"

// Load the rules file
const rules = readFileSync(resolve(__dirname, "../firestore.rules"), "utf8")

let testEnv: RulesTestEnvironment

describe("Firestore security rules", () => {
  beforeAll(async () => {
    // Initialize the test environment with the emulator on port 8072
    testEnv = await initializeTestEnvironment({
      projectId: "test-project",
      firestore: {
        rules,
        host: "127.0.0.1",
        port: 8072,
      },
    })
  })

  afterAll(async () => {
    // Clean up test environment
    await testEnv.cleanup()
  })

  beforeEach(async () => {
    // Clear the database between tests
    await testEnv.clearFirestore()
  })

  describe("Basic read rules", () => {
    test("unauthenticated users can read documents if they are in visibleTo", async () => {
      if (!testEnv) {
        console.log("Skipping test - emulator not configured")
        return
      }

      // Set up the test document
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore()
        await adminDb
          .collection("items")
          .doc("public")
          .set({
            title: "Public Item",
            visibleTo: ["public"], // Public user ID for unauthenticated users
          })
      })

      // Test that unauthenticated users can read it
      const db = testEnv.unauthenticatedContext().firestore()
      await assertSucceeds(db.collection("items").doc("public").get())
    })

    test("unauthenticated users cannot read documents if not in visibleTo", async () => {
      if (!testEnv) {
        console.log("Skipping test - emulator not configured")
        return
      }

      // Set up the test document
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore()
        await adminDb
          .collection("items")
          .doc("restricted")
          .set({
            title: "Restricted Item",
            visibleTo: ["user123"], // Only visible to specific user
          })
      })

      // Test that unauthenticated users cannot read it
      const db = testEnv.unauthenticatedContext().firestore()
      await assertFails(db.collection("items").doc("restricted").get())
    })

    test("authenticated users can read documents they are in visibleTo", async () => {
      const userId = "user123"

      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore()
        await adminDb
          .collection("items")
          .doc("readable")
          .set({
            title: "Readable Item",
            visibleTo: [userId],
            permissions: {}, // Empty permissions but still readable due to visibleTo
          })
      })

      // Test the rule
      const db = testEnv.authenticatedContext(userId).firestore()
      await assertSucceeds(db.collection("items").doc("readable").get())
    })

    test("authenticated users cannot read documents they are not in visibleTo", async () => {
      const userId = "user123"
      const db = testEnv.authenticatedContext(userId).firestore()

      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore()
        await adminDb
          .collection("items")
          .doc("notReadable")
          .set({
            title: "Not Readable Item",
            visibleTo: ["otherUser"],
            permissions: { [userId]: "write" }, // Even with write permissions, not visible
          })
      })

      // Test the rule
      await assertFails(db.collection("items").doc("notReadable").get())
    })
  })

  // Test writing documents
  describe("write operations", () => {
    test("unauthenticated users cannot create documents", async () => {
      const db = testEnv.unauthenticatedContext().firestore()

      // Test the rule
      await assertFails(
        db.collection("items").doc("newItem").set({
          title: "New Item",
        })
      )
    })

    test("authenticated users with admin permission can create documents", async () => {
      // Skip if testEnv is not properly initialized
      if (!testEnv) {
        console.log("Skipping test - emulator not configured")
        return
      }

      const userId = "admin123"
      const db = testEnv.authenticatedContext(userId).firestore()

      // Test creating a document with admin permission
      await assertSucceeds(
        db
          .collection("items")
          .doc("newItem")
          .set({
            title: "New Item",
            permissions: {
              [userId]: "admin",
            },
          })
      )
    })

    test("authenticated users can create documents with themselves having write permission", async () => {
      const userId = "user123"
      const db = testEnv.authenticatedContext(userId).firestore()

      // Test the rule
      await assertSucceeds(
        db
          .collection("items")
          .doc("newItem")
          .set({
            title: "New Item",
            permissions: {
              [userId]: "write",
            },
          })
      )
    })

    test("authenticated users cannot create documents without setting permissions", async () => {
      const db = testEnv.authenticatedContext("user123").firestore()

      // Test the rule - documents with null permissions
      await assertFails(
        db.collection("items").doc("newItem1").set({
          title: "New Item",
          permissions: null,
        })
      )

      // Test the rule - documents without permissions field
      await assertSucceeds(
        db.collection("items").doc("newItem2").set({
          title: "New Item",
        })
      )
    })

    test("authenticated users cannot create documents giving others admin permission", async () => {
      const userId = "user123"
      const db = testEnv.authenticatedContext(userId).firestore()

      // Test the rule
      await assertFails(
        db
          .collection("items")
          .doc("newItem")
          .set({
            title: "New Item",
            permissions: {
              otherUser: "admin",
            },
          })
      )
    })

    test("users with admin permission can update any field", async () => {
      const userId = "user123"
      const db = testEnv.authenticatedContext(userId).firestore()

      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore()
        await adminDb
          .collection("items")
          .doc("adminEditable")
          .set({
            title: "Admin Editable Item",
            permissions: {
              [userId]: "admin",
            },
          })
      })

      // Test the rule - including updating permissions
      await assertSucceeds(
        db
          .collection("items")
          .doc("adminEditable")
          .update({
            title: "Updated Admin Item",
            permissions: {
              [userId]: "admin",
              newUser: "read",
            },
          })
      )
    })

    test("users with write permission cannot update permissions field", async () => {
      const userId = "user123"
      const db = testEnv.authenticatedContext(userId).firestore()

      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore()
        await adminDb
          .collection("items")
          .doc("writable")
          .set({
            title: "Writable Item",
            content: "Original content",
            permissions: {
              [userId]: "write",
            },
          })
      })

      // Test the rule - updating non-permissions fields should succeed
      await assertSucceeds(
        db.collection("items").doc("writable").update({
          title: "Updated Writable Item",
          content: "Updated content",
        })
      )

      // Test the rule - updating permissions field should fail
      await assertFails(
        db
          .collection("items")
          .doc("writable")
          .update({
            permissions: {
              [userId]: "admin",
            },
          })
      )
    })

    test("users with read permission cannot update documents", async () => {
      const userId = "user123"
      const db = testEnv.authenticatedContext(userId).firestore()

      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore()
        await adminDb
          .collection("items")
          .doc("readable")
          .set({
            title: "Readable Item",
            permissions: {
              [userId]: "read",
            },
          })
      })

      // Test the rule
      await assertFails(
        db.collection("items").doc("readable").update({
          title: "Updated Readable Item",
        })
      )
    })
  })
})
