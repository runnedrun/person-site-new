import { ModelBase } from "@/data/baseTypes/Model"
import { CollectionModels } from "@/data/CollectionModels"
import { CreateOptions } from "@/data/helpers/CreateOptions"
import batchPromises from "batch-promises"
import { Timestamp, getFirestore, WriteBatch } from "firebase-admin/firestore"
import { chunk } from "lodash"
import { getUuid } from "@/data/helpers/getUuid"
import { getBeAppNext } from "@/helpers/initFbBe"
import { deepMapObj } from "./helpers/deepMapObj"
import { Timestamp as FeTimestamp } from "@firebase/firestore"

export const genExtraData = () => {
  return {
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    archived: false,
  }
}

const convertAllTimestamps = (obj: any) => {
  return deepMapObj(obj, (value) => {
    if (value instanceof Timestamp) {
      return Timestamp.fromDate(value.toDate()) as FeTimestamp
    }
    return
  })
}

export const backendNow = () => Timestamp.now()

export const setDoc = async <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  docId: string,
  data: Partial<CollectionModels[CollectionName]>
) => {
  getBeAppNext()
  const firestore = getFirestore()

  await firestore
    .collection(collectionName)
    .doc(docId)
    .set(
      {
        updatedAt: Timestamp.now(),
        ...convertAllTimestamps(data),
      },
      { merge: true }
    )

  return firestore.collection(collectionName).doc(docId)
}

export const deleteDoc = async <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  docId: string
) => {
  getBeAppNext()
  const firestore = getFirestore()
  await firestore.collection(collectionName).doc(docId).delete()
}

export const updateDoc = async <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  docId: string,
  data: Partial<CollectionModels[CollectionName]>
) => {
  getBeAppNext()
  return setDoc(collectionName, docId, data)
}

export const createDoc = async <Key extends keyof CollectionModels>(
  collectionName: Key,
  data: Omit<CollectionModels[Key], keyof ModelBase>,
  opts?: CreateOptions
) => {
  getBeAppNext()
  const firestore = getFirestore()
  const id = opts?.id ?? getUuid()
  const ref = firestore.collection(collectionName).doc(id)
  await ref.set(
    {
      ...genExtraData(),
      ...convertAllTimestamps(data),
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
  getBeAppNext()
  const firestore = getFirestore()
  const chunked = chunk(records, batchSize)
  const entries = Array.from(chunked.entries())

  return batchPromises(
    5,
    entries,
    async ([batchIndex, sentenceBatch]: [
      number,
      CollectionModels[CollectionName][],
    ]) => {
      const writer = firestore.batch()
      sentenceBatch.forEach((record, sentenceIndex) => {
        const recordToWrite = {
          ...record,
          ...genExtraData(),
        } as CollectionModels[CollectionName]

        const recordRef = getDocKey
          ? firestore
              .collection(collectionName)
              .doc(getDocKey(record, sentenceIndex + batchIndex * batchSize))
          : firestore.collection(collectionName).doc()

        writer.set(recordRef, convertAllTimestamps(recordToWrite), {
          merge: true,
        })
      })
      await writer.commit()
    }
  )
}

export const batchDelete = async <
  CollectionName extends keyof CollectionModels,
>(
  collectionName: CollectionName,
  recordIds: string[],
  batchSize: number = 100
) => {
  getBeAppNext()
  const firestore = getFirestore()
  const chunked = chunk(recordIds, batchSize)
  const entries = Array.from(chunked.entries())

  return batchPromises(
    5,
    entries,
    async ([, sentenceBatch]: [number, string[]]) => {
      const writer = firestore.batch()
      sentenceBatch.forEach((recordId) => {
        const recordRef = firestore.collection(collectionName).doc(recordId)
        writer.delete(recordRef)
      })
      await writer.commit()
    }
  )
}

export const _isStub = false
