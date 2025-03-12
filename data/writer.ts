import { AllModels, CollectionModels } from "./CollectionModels"
import { isServerside } from "./helpers/isServerside"
import * as writerFe from "./writerFe"
import * as writerBe from "./writerBe"
import {
  DocumentReference,
  PartialWithFieldValue,
  Timestamp,
} from "firebase/firestore"
import { ModelBase } from "./baseTypes/Model"
import { CreateOptions } from "./helpers/CreateOptions"

// Helper function to get backend writer if available
const getBeWriter = () => {
  if (!isServerside()) return null
  if ((writerBe as any)._isStub) return null
  return writerBe
}

export const setDoc = async <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  docId: string,
  data: Partial<AllModels[CollectionName]>
) => {
  const beWriter = getBeWriter()
  if (beWriter) {
    return beWriter.setDoc(collectionName, docId, data)
  }
  return writerFe.setDoc(collectionName, docId, data)
}

export const deleteDoc = async <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  docId: string
) => {
  const beWriter = getBeWriter()
  if (beWriter) {
    return beWriter.deleteDoc(collectionName, docId)
  }
  return writerFe.deleteDoc(collectionName, docId)
}

export const updateDoc = async <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  docId: string,
  data: Partial<AllModels[CollectionName]>
) => {
  const beWriter = getBeWriter()
  if (beWriter) {
    return beWriter.updateDoc(collectionName, docId, data)
  }
  return writerFe.updateDoc(collectionName, docId, data)
}

export const createDoc = async <Key extends keyof CollectionModels>(
  collectionName: Key,
  data: Omit<AllModels[Key], keyof ModelBase>,
  opts?: CreateOptions
) => {
  const beWriter = getBeWriter()
  if (beWriter) {
    return beWriter.createDoc(collectionName, data, opts)
  }
  return writerFe.createDoc(collectionName, data, opts)
}

export const batchSet = async <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  records: AllModels[CollectionName][],
  getDocKey?: (record: AllModels[CollectionName], i: number) => string,
  batchSize: number = 100
) => {
  const beWriter = getBeWriter()
  if (beWriter) {
    return beWriter.batchSet(collectionName, records, getDocKey, batchSize)
  }
  return writerFe.batchSet(collectionName, records, getDocKey, batchSize)
}

export const batchDelete = async <CollectionName extends keyof AllModels>(
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

// Re-export utility functions
export const genExtraData = writerFe.genExtraData
export const backendNow = writerFe.backendNow
