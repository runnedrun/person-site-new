import { ModelBase } from "@/data/baseTypes/Model"
import { CollectionModels } from "@/data/CollectionModels"
import { CreateOptions } from "@/data/helpers/CreateOptions"
import { PromisePool } from "@supercharge/promise-pool"
import {
  PartialWithFieldValue,
  Timestamp,
  collection,
  deleteDoc as fbDeleteDoc,
  doc,
  getFirestore,
  setDoc as fbSetDoc,
  writeBatch,
} from "@firebase/firestore"
import { chunk } from "lodash"
import { getUuid } from "@/data/helpers/getUuid"
import { init } from "./helpers/initFb"

export const genExtraData = () => {
  return {
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    archived: false,
  }
}

export const backendNow = () => Timestamp.now()

export const setDoc = async <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  docId: string,
  data: PartialWithFieldValue<CollectionModels[CollectionName]>
) => {
  init()
  const firestore = getFirestore()

  await fbSetDoc(
    doc(firestore, collectionName, docId),
    {
      updatedAt: Timestamp.now(),
      ...data,
    },
    { merge: true }
  )

  return doc(firestore, collectionName, docId)
}

export const deleteDoc = async <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  docId: string
) => {
  const firestore = getFirestore()

  await fbDeleteDoc(doc(firestore, collectionName, docId))
}

export const updateDoc = async <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  docId: string,
  data: Partial<CollectionModels[CollectionName]>
) => {
  return setDoc(collectionName, docId, data)
}

export const createDoc = async <Key extends keyof CollectionModels>(
  collectionName: Key,
  data: Omit<CollectionModels[Key], keyof ModelBase>,
  opts?: CreateOptions
) => {
  const firestore = getFirestore()
  const id = opts?.id ?? getUuid()
  const ref = doc(firestore, collectionName, id)
  await fbSetDoc(
    ref,
    {
      ...genExtraData(),
      ...data,
    },
    { merge: true }
  )
  return ref
}

export const batchSet = async <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  records: CollectionModels[CollectionName][],
  getDocKey?: (record: CollectionModels[CollectionName], i: number) => string,
  batchSize: number = 100
) => {
  const firestore = getFirestore()
  const chunked = chunk(records, batchSize)
  const entries = Array.from(chunked.entries())

  const { results } = await PromisePool.withConcurrency(5)
    .for(entries)
    .process(
      async ([batchIndex, sentenceBatch]: [
        number,
        CollectionModels[CollectionName][],
      ]) => {
        const writer = writeBatch(firestore)
        sentenceBatch.forEach((record, sentenceIndex) => {
          const recordToWrite = {
            ...record,
            ...genExtraData(),
          } as CollectionModels[CollectionName]

          const recordRef = getDocKey
            ? doc(
                firestore,
                collectionName,
                getDocKey(record, sentenceIndex + batchIndex * batchSize)
              )
            : doc(collection(firestore, collectionName))

          writer.set(recordRef, recordToWrite, { merge: true })
        })
        return writer.commit()
      }
    )

  return results
}

export const batchDelete = async <
  CollectionName extends keyof CollectionModels,
>(
  collectionName: CollectionName,
  recordIds: string[],
  batchSize: number = 100
) => {
  const firestore = getFirestore()
  const chunked = chunk(recordIds, batchSize)
  const entries = Array.from(chunked.entries())

  const { results } = await PromisePool.withConcurrency(5)
    .for(entries)
    .process(async ([, sentenceBatch]: [number, string[]]) => {
      const writer = writeBatch(firestore)
      sentenceBatch.forEach((recordId) => {
        const recordRef = doc(firestore, collectionName, recordId)

        writer.delete(recordRef)
      })

      return writer.commit()
    })

  return results
}
