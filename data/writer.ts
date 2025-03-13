import { ModelBase } from "./baseTypes/Model"
import { CollectionModels } from "./CollectionModels"
import { CreateOptions } from "./helpers/CreateOptions"
import { isServerside } from "./helpers/isServerside"
import * as writerBe from "./writerBe"
import * as writerFe from "./writerFe"

// Helper function to get backend writer if available
const getBeWriter = () => {
  if (!isServerside()) return null
  if ((writerBe as any)._isStub) return null
  return writerBe
}

/**
 * Sets or replaces the entire document at the specified path with the provided data.
 *
 * @example
 * ```typescript
 * // Set a QA pairing document
 * await setDoc('qaPairings', 'qa123', {
 *   question: "What is Firebase?",
 *   answer: "Firebase is a platform developed by Google for creating mobile and web applications.",
 *   askedBy: "user123"
 * });
 * ```
 *
 * @param collectionName - The name of the collection to write to
 * @param docId - The ID of the document to set
 * @param data - The data to write to the document
 */
export const setDoc = async <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  docId: string,
  data: Partial<CollectionModels[CollectionName]>
) => {
  const beWriter = getBeWriter()
  if (beWriter) {
    return beWriter.setDoc(collectionName, docId, data)
  }
  return writerFe.setDoc(collectionName, docId, data)
}

/**
 * Deletes the document at the specified path.
 *
 * @example
 * ```typescript
 * // Delete a QA pairing
 * await deleteDoc('qaPairings', 'qa123');
 * ```
 *
 * @param collectionName - The name of the collection containing the document
 * @param docId - The ID of the document to delete
 */
export const deleteDoc = async <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  docId: string
) => {
  const beWriter = getBeWriter()
  if (beWriter) {
    return beWriter.deleteDoc(collectionName, docId)
  }
  return writerFe.deleteDoc(collectionName, docId)
}

/**
 * Updates fields in the document at the specified path.
 * Only the fields specified in the data will be updated.
 *
 * @example
 * ```typescript
 * // Update the answer of a QA pairing
 * await updateDoc('qaPairings', 'qa123', {
 *   answer: "Updated answer about Firebase",
 *   answeredAt: backendNow()
 * });
 * ```
 *
 * @param collectionName - The name of the collection containing the document
 * @param docId - The ID of the document to update
 * @param data - Object containing the fields and values to update
 */
export const updateDoc = async <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  docId: string,
  data: Partial<CollectionModels[CollectionName]>
) => {
  const beWriter = getBeWriter()
  if (beWriter) {
    return beWriter.updateDoc(collectionName, docId, data)
  }
  return writerFe.updateDoc(collectionName, docId, data)
}

/**
 * Creates a new document in the specified collection.
 * Automatically adds base model fields (createdAt, updatedAt, etc.).
 *
 * @example
 * ```typescript
 * // Create a new QA pairing
 * const docRef = await createDoc('qaPairings', {
 *   question: "How do I use Firestore?",
 *   askedBy: "user456",
 *   notFound: false,
 *   answer: null,
 *   answeredAt: null,
 *   serializedAnswer: null
 * }, {id: customIdForDoc (will be auto-generated if not provided)});
 * ```
 *
 * @param collectionName - The name of the collection to create the document in
 * @param data - The data for the new document (excluding base model fields)
 * @param opts - Optional settings for document creation (e.g., custom ID)
 * @returns A reference to the created document
 */
export const createDoc = async <Key extends keyof CollectionModels>(
  collectionName: Key,
  data: Omit<CollectionModels[Key], keyof ModelBase>,
  opts?: CreateOptions
) => {
  const beWriter = getBeWriter()
  if (beWriter) {
    return beWriter.createDoc(collectionName, data, opts)
  }
  return writerFe.createDoc(collectionName, data, opts)
}

/**
 * Sets multiple documents in batches. Useful for bulk operations while maintaining
 * atomicity within each batch.
 *
 * @example
 * ```typescript
 * // Batch set multiple QA pairings
 * const qaPairings = [
 *   {
 *     question: "Question 1",
 *     askedBy: "user1",
 *     answer: null
 *   },
 *   {
 *     question: "Question 2",
 *     askedBy: "user2",
 *     answer: null
 *   }
 * ];
 *
 * await batchSet('qaPairings', qaPairings,
 *   (record, index) => `batch-qa-${index}` // Optional key generator
 * );
 * ```
 *
 * @param collectionName - The name of the collection to write to
 * @param records - Array of documents to write
 * @param getDocKey - Optional function to generate document IDs
 * @param batchSize - Maximum number of operations per batch (default: 100)
 */
export const batchSet = async <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  records: CollectionModels[CollectionName][],
  getDocKey?: (record: CollectionModels[CollectionName], i: number) => string,
  batchSize: number = 100
) => {
  const beWriter = getBeWriter()
  if (beWriter) {
    return beWriter.batchSet(collectionName, records, getDocKey, batchSize)
  }
  return writerFe.batchSet(collectionName, records, getDocKey, batchSize)
}

/**
 * Deletes multiple documents in batches. Useful for bulk deletions while maintaining
 * atomicity within each batch.
 *
 * @example
 * ```typescript
 * // Batch delete multiple QA pairings
 * await batchDelete('qaPairings', ['qa123', 'qa456', 'qa789']);
 * ```
 *
 * @param collectionName - The name of the collection containing the documents
 * @param recordIds - Array of document IDs to delete
 * @param batchSize - Maximum number of operations per batch (default: 100)
 */
export const batchDelete = async <
  CollectionName extends keyof CollectionModels,
>(
  collectionName: CollectionName,
  recordIds: string[],
  batchSize: number = 100
) => {
  const beWriter = getBeWriter()
  if (beWriter) {
    return beWriter.batchDelete(collectionName, recordIds, batchSize)
  }
  return writerFe.batchDelete(collectionName, recordIds, batchSize)
}
