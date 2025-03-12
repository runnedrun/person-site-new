import {
  combineLatest,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  from,
  isObservable,
  map,
  Observable,
  of,
  switchMap,
} from "rxjs"

import { AllModels } from "@/data/CollectionModels"
import {
  and,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  DocumentSnapshot,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  or,
  orderBy,
  OrderByDirection,
  Query,
  query,
  QueryFieldFilterConstraint,
  QueryOrderByConstraint,
  QuerySnapshot,
  SnapshotListenOptions,
  Timestamp,
  where,
  WhereFilterOp,
} from "@firebase/firestore"
import {
  DocumentData,
  QueryCompositeFilterConstraint,
  QueryEndAtConstraint,
  QueryLimitConstraint,
  QueryStartAtConstraint,
} from "firebase/firestore"
import { isArray, isEqual, isNil, isNull, isUndefined, partition } from "lodash"
import { ValuesType } from "utility-types"
import { init } from "./helpers/initFb"
import { isNotUndefined } from "./helpers/isUndefTyped"

const DEFAULT_OPTIONS = { includeMetadataChanges: true }

export function queryObsFromFbRef(
  ref: CollectionReference | Query | DocumentReference,
  options: SnapshotListenOptions = DEFAULT_OPTIONS
): Observable<QuerySnapshot> {
  return new Observable((subscriber) => {
    const unsubscribe = onSnapshot(ref as CollectionReference, options, {
      next: subscriber.next.bind(subscriber),
      error: subscriber.error.bind(subscriber),
      complete: subscriber.complete.bind(subscriber),
    })
    return { unsubscribe }
  })
}

export function docObsFromFbRef(
  ref: CollectionReference | Query | DocumentReference,
  options: SnapshotListenOptions = DEFAULT_OPTIONS
): Observable<DocumentSnapshot> {
  return new Observable((subscriber) => {
    const unsubscribe = onSnapshot(ref as CollectionReference, options, {
      next: subscriber.next.bind(subscriber),
      error: subscriber.error.bind(subscriber),
      complete: subscriber.complete.bind(subscriber),
    } as any)
    return { unsubscribe }
  })
}

export const readDoc = async <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  id: string
): Promise<AllModels[CollectionName]> => {
  const db = init()
  const snap = await getDoc(doc(db, collectionName, id))
  return {
    ...snap.data(),
    uid: id,
  } as AllModels[CollectionName]
}

export const docObs = <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  id: string | Observable<string | null>
): Observable<AllModels[CollectionName] | null> => {
  if (isNull(id)) {
    return of(null)
  }
  const db = init()
  const idObs = isObservable(id) ? id : of(id)

  const docSnapshotObs = idObs.pipe(
    switchMap((id) =>
      id ? docObsFromFbRef(doc(db, collectionName, id)) : of(null)
    )
  )

  let hasSeenDataFromServer = false
  const obs = docSnapshotObs.pipe(
    map<DocumentSnapshot | null, AllModels[CollectionName] | null | undefined>(
      (snap: DocumentSnapshot | null) => {
        if (!snap) {
          return null
        }
        const isValidServerData =
          !snap.metadata.fromCache && !snap.metadata.hasPendingWrites

        hasSeenDataFromServer = hasSeenDataFromServer || isValidServerData

        if (!hasSeenDataFromServer) {
          return undefined
        }

        return {
          ...snap.data(),
          uid: snap.id,
        } as AllModels[CollectionName]
      }
    ),
    filter<
      AllModels[CollectionName] | null | undefined,
      AllModels[CollectionName] | null
    >(isNotUndefined),
    distinctUntilChanged<AllModels[CollectionName] | null>(isEqual)
  )
  return obs
}

export type OrObservable<T> = Observable<T> | T

export type WhereValues =
  | string
  | number
  | boolean
  | Timestamp
  | string[]
  | number[]
  | null

export type FieldPathPathString<T> = {
  [K in keyof T]: T[K] extends object
    ? `${string & K}.${keyof T[K] & string}`
    : never
}[keyof T]

export type TypedWhere<T extends ValuesType<AllModels>> = (
  fieldPath: keyof T | FieldPathPathString<T>,
  opStr: WhereFilterOp,
  value: WhereValues | Observable<WhereValues | typeof SKIP>
) => OrObservable<QueryFieldFilterConstraint>

export type TypedOrderBy<T extends ValuesType<AllModels>> = (
  fieldPath: keyof T | FieldPathPathString<T>,
  directionStr?: Observable<OrderByDirection> | OrderByDirection
) => OrObservable<QueryOrderByConstraint>

export type TypedOr = (
  ...whereClauses: OrObservable<QueryFieldFilterConstraint>[]
) => OrObservable<QueryCompositeFilterConstraint>

export type TypedAnd = (
  ...whereClauses: OrObservable<QueryFieldFilterConstraint>[]
) => OrObservable<QueryCompositeFilterConstraint>

const orWithObservable: TypedOr = (...whereClauses) => {
  const allObservables = whereClauses.map((_) => (isObservable(_) ? _ : of(_)))
  return combineLatest(allObservables).pipe(map((clauses) => or(...clauses)))
}

const andWithObservable: TypedAnd = (...whereClauses) => {
  const allObservables = whereClauses.map((_) => (isObservable(_) ? _ : of(_)))
  return combineLatest(allObservables).pipe(map((clauses) => and(...clauses)))
}

const mapQuerySnapshotToModel =
  <ModelType extends ValuesType<AllModels>>() =>
  (_: QuerySnapshot) => {
    return _.docs.map((docToMap) => {
      return { ...docToMap.data(), uid: docToMap.id } as ModelType
    })
  }

const handleWhereValue = (value: WhereValues, fieldPath: string) => {
  if (isUndefined(value)) {
    throw new Error("undefined value in where for path: " + fieldPath)
  }
  if (isArray(value)) {
    return value.length === 0 ? ["__never__"] : value
  } else {
    return value
  }
}

export const SKIP = "__SKIP__" as const

const isSkip = (
  value: WhereValues | typeof SKIP | Observable<WhereValues | typeof SKIP>
): value is typeof SKIP => {
  return value === SKIP
}

const whereWithObservable = (
  fieldPath: string,
  opsStr: WhereFilterOp,
  value: WhereValues | Observable<WhereValues | typeof SKIP>
) => {
  isUndefined(value) && console.warn("Warning: undefined value for", fieldPath)

  if (isSkip(value)) {
    return of(null)
  }

  return isObservable(value)
    ? value.pipe(
        switchMap((_) => {
          isUndefined(_) &&
            console.warn("Warning: undefined value for", fieldPath)
          if (isSkip(_)) {
            return of(null)
          }
          return isUndefined(_)
            ? of()
            : of(where(fieldPath, opsStr, handleWhereValue(_, fieldPath)))
        })
      )
    : isUndefined(value)
      ? of()
      : of(where(fieldPath, opsStr, handleWhereValue(value, fieldPath)))
}

const orderByWithObservable = (
  fieldPath: string,
  directionStr?: OrderByDirection | Observable<OrderByDirection>
) => {
  return isObservable(directionStr)
    ? directionStr.pipe(map((_) => (isNil(_) ? null : orderBy(fieldPath, _))))
    : isNil(directionStr)
      ? null
      : orderBy(fieldPath, directionStr)
}

const limitWithObservable = (
  limitNum: number | Observable<number | null> | null
): Observable<QueryLimitConstraint | null> | QueryLimitConstraint | null => {
  return isObservable(limitNum)
    ? limitNum.pipe(map((_) => (isNil(_) ? null : limit(_))))
    : isNil(limitNum)
      ? null
      : limit(limitNum)
}

export type TypedLimit = (
  limit: number | Observable<number | null> | null
) => QueryLimitConstraint | Observable<QueryLimitConstraint | null> | null

export type PossibleQueryConstraint =
  | QueryFieldFilterConstraint
  | QueryCompositeFilterConstraint
  | QueryLimitConstraint
  | QueryOrderByConstraint
  | QueryStartAtConstraint
  | QueryEndAtConstraint
  | null

export type BuilderReturnType = (OrObservable<PossibleQueryConstraint> | null)[]

export type BuilderFilters<CollectionName extends keyof AllModels> = {
  where: TypedWhere<AllModels[CollectionName]>
  orderBy: TypedOrderBy<AllModels[CollectionName]>
  limit: TypedLimit
  or: TypedOr
  and: TypedAnd
}

export type TypedQueryBuilder<CollectionName extends keyof AllModels> = (
  filters: BuilderFilters<CollectionName>
) => BuilderReturnType

export const buildQueryWithDefaultBuilders = <
  CollectionName extends keyof AllModels,
>(
  buildQuery: TypedQueryBuilder<CollectionName>
) => {
  const queryConstraintsOrObs = buildQuery({
    where: whereWithObservable as TypedWhere<AllModels[CollectionName]>,
    orderBy: orderByWithObservable as TypedOrderBy<AllModels[CollectionName]>,
    limit: limitWithObservable,
    or: orWithObservable,
    and: andWithObservable,
  }).filter(Boolean)
  const queryConstraintsObs = queryConstraintsOrObs
    .filter(Boolean)
    .map((_) => (isObservable(_) ? _ : of(_)))
  const orEmpty = queryConstraintsObs.length
    ? queryConstraintsObs
    : ([] as Observable<PossibleQueryConstraint>[])

  return combineLatest(orEmpty)
}

export const buildQueryObs = <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  buildQuery: TypedQueryBuilder<CollectionName>
): Observable<Query<DocumentData>> => {
  const db = init()
  const ref = collection(db, collectionName)

  return buildQueryWithDefaultBuilders(buildQuery).pipe(
    map((resolvedQueryContstraints: any[]) => {
      const includesArchived = resolvedQueryContstraints.some(
        (_) => _.type === "where" && _.field === "archived"
      )

      if (!includesArchived) {
        resolvedQueryContstraints.push(where("archived", "==", false))
      }

      const [whereQueryConstraints, otherQueryConstraints] = partition(
        resolvedQueryContstraints.filter(Boolean),
        (_) => _.type === "where" || _.type === "and" || _.type === "or"
      )
      const wrappedInAnd = and(...whereQueryConstraints)

      const allConstraints = [wrappedInAnd, ...otherQueryConstraints]

      if (allConstraints.length) {
        return query(ref, ...allConstraints)
      } else {
        return query(ref)
      }
    })
  )
}

export const queryObs = <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  buildQuery: TypedQueryBuilder<CollectionName>
): Observable<AllModels[CollectionName][]> => {
  return buildQueryObs(collectionName, buildQuery).pipe(
    switchMap((finalQuery) => {
      const obs = queryObsFromFbRef(finalQuery)

      let hasSeenDataFromServer = false
      return obs.pipe(
        map((snapshot) => {
          const isValidServerData =
            !snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites

          hasSeenDataFromServer = hasSeenDataFromServer || isValidServerData

          if (!hasSeenDataFromServer) {
            return null
          }

          return mapQuerySnapshotToModel<AllModels[CollectionName]>()(snapshot)
        }),
        filter(Boolean),
        distinctUntilChanged(isEqual)
      )
    })
  )
}

export const countObs = <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  buildQuery: TypedQueryBuilder<CollectionName>,
  refreshObs: Observable<unknown>
): Observable<number> => {
  return combineLatest([
    buildQueryObs(collectionName, buildQuery),
    refreshObs,
  ]).pipe(
    switchMap(([queryObs]) => {
      return from(getCountFromServer(queryObs)).pipe(map((_) => _.data().count))
    })
  )
}

export const readQuery = async <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  buildQuery: TypedQueryBuilder<CollectionName>
): Promise<AllModels[CollectionName][]> => {
  const finalQuery = await firstValueFrom(
    buildQueryObs(collectionName, buildQuery)
  )

  const snapshot = await getDocs(finalQuery)
  return mapQuerySnapshotToModel<AllModels[CollectionName]>()(snapshot)
}
