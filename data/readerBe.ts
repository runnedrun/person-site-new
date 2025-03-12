import { Model } from "@/data/baseTypes/Model"
import { CollectionModels } from "@/data/CollectionModels"
import { FieldPathPathString } from "@/data/readerFe"
import { getBeAppNext } from "@/helpers/initFbBe"

import {
  CollectionReference,
  Filter,
  getFirestore,
  OrderByDirection,
  Query,
  Timestamp,
  WhereFilterOp,
} from "firebase-admin/firestore"
// import moment from "moment"

export const readDoc = async <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  id: string
): Promise<CollectionModels[CollectionName]> => {
  getBeAppNext()
  const firestore = getFirestore()
  const snap = await firestore.collection(collectionName).doc(id).get()
  return { ...snap.data(), uid: id } as CollectionModels[CollectionName]
}

type WhereValues =
  | string
  | number
  | boolean
  | null
  | Array<string | number | boolean>
  | Array<string | number | boolean | Array<string | number | boolean>>
  | Array<
      | string
      | number
      | boolean
      | Array<string | number | boolean | Array<string | number | boolean>>
    >
  | Array<
      | string
      | number
      | boolean
      | Array<
          | string
          | number
          | boolean
          | Array<string | number | boolean | Array<string | number | boolean>>
        >
    >
  | Timestamp

type TypedWheres<ModelType extends Model<any>> = {
  where: {
    (filter: Filter): QueryWithTypedWhere<ModelType>
    (
      fieldPath: keyof ModelType | FieldPathPathString<ModelType>,
      opStr: WhereFilterOp,
      value: WhereValues
    ): QueryWithTypedWhere<ModelType>
  }
  orderBy: (
    fieldPath: keyof ModelType | FieldPathPathString<ModelType>,
    directionStr?: OrderByDirection
  ) => QueryWithTypedWhere<ModelType>
  limit: (limit: number) => QueryWithTypedWhere<ModelType>
}

export type QueryWithTypedWhere<ModelType extends Model<any>> = Omit<
  Query<ModelType>,
  "where" | "orderBy" | "limit"
> &
  TypedWheres<ModelType>

export type CollectionReferenceWithTypedWhere<ModelType extends Model<any>> =
  Omit<CollectionReference<ModelType>, "where" | "orderBy" | "limit"> &
    TypedWheres<ModelType>

export type BeQueryBuilder<CollectionName extends keyof CollectionModels> = (
  ref: CollectionReferenceWithTypedWhere<CollectionModels[CollectionName]>
) =>
  | CollectionReferenceWithTypedWhere<CollectionModels[CollectionName]>
  | QueryWithTypedWhere<CollectionModels[CollectionName]>

export const queryDocs = async <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  buildQuery: BeQueryBuilder<CollectionName>,
  opts: { includeArchived: boolean } = { includeArchived: false }
): Promise<CollectionModels[CollectionName][]> => {
  getBeAppNext()
  const firestore = getFirestore()
  const ref = firestore.collection(collectionName)

  let query = buildQuery(
    ref as CollectionReferenceWithTypedWhere<CollectionModels[CollectionName]>
  )

  if (!opts.includeArchived) {
    query = query.where("archived", "==", false)
  }

  const snap = await query.get()

  const docs = snap.docs
  return docs.map((doc) => {
    return { ...doc.data(), uid: doc.id } as CollectionModels[CollectionName]
  })
}

export const countDocs = async <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  buildQuery: BeQueryBuilder<CollectionName>
): Promise<number> => {
  getBeAppNext()
  const firestore = getFirestore()
  const ref = firestore.collection(collectionName)

  const query = buildQuery(
    ref as CollectionReferenceWithTypedWhere<CollectionModels[CollectionName]>
  )
  const snap = await query.count().get()
  return snap.data().count
}

export const runTransaction = async <
  CollectionName extends keyof CollectionModels,
>(
  collectionName: CollectionName,
  id: string,
  transactionFn: (
    doc: CollectionModels[CollectionName]
  ) => Partial<CollectionModels[CollectionName]>
): Promise<CollectionModels[CollectionName]> => {
  getBeAppNext()
  const firestore = getFirestore()
  const snapRef = firestore.collection(collectionName).doc(id)

  return firestore.runTransaction(async (tr) => {
    const doc = await tr.get(snapRef)
    const docData = doc.data() as CollectionModels[CollectionName]
    const valueToSave = transactionFn(docData)
    if (!valueToSave) return docData
    tr.set(snapRef, valueToSave, { merge: true })
    return { ...docData, ...valueToSave }
  })
}

export const _isStub = false
