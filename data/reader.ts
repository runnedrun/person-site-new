import { Observable, firstValueFrom, from } from "rxjs"
import { map, switchMap } from "rxjs/operators"
import { CollectionModels } from "./CollectionModels"
import { isServerside } from "./helpers/isServerside"
import * as readerFe from "./readerFe"
import { orObs } from "./helpers/orObs"
import * as toBeQueryBuilderModule from "./toBeQueryBuilder"
import * as readerBe from "./readerBe"

// Re-export common types
export type {
  BuilderFilters,
  BuilderReturnType,
  FieldPathPathString,
  OrObservable,
  PossibleQueryConstraint,
  TypedAnd,
  TypedLimit,
  TypedOr,
  TypedOrderBy,
  TypedQueryBuilder,
  TypedWhere,
  WhereValues,
} from "./readerFe"

export const SKIP = readerFe.SKIP

// Helper function to get backend reader if available
const getBeReader = () => {
  if (!isServerside()) return null
  if ((readerBe as any)._isStub) return null
  return readerBe
}

/**
 * Reads a single document from a collection by its ID.
 * Works in both client and server environments.
 *
 * @example
 * // Read a QA pairing document
 * const qaDoc = await readDoc("qaPairings", messageId);
 *
 * @param collectionName - The name of the collection to read from
 * @param id - The document ID to read
 * @returns Promise resolving to the document data
 */
export const readDoc = async <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  id: string
): Promise<CollectionModels[CollectionName]> => {
  const beReader = getBeReader()
  if (beReader) {
    return beReader.readDoc(collectionName, id)
  }
  return readerFe.readDoc(collectionName, id)
}

/**
 * Creates an Observable that emits document data whenever it changes.
 * The ID can be either a string or an Observable of string/null.
 *
 * @example
 * // Observe a QA pairing document that changes based on selection
 * const startingQA = docObs("qaPairings", $selectedQAId);
 *
 * @param collectionName - The name of the collection to observe
 * @param id - Document ID or Observable of document ID
 * @returns Observable that emits document data or null if ID is null. If the document doesn't exist, it will still an object, but the object will only have the field uid: string. Thus if you wish to check if the document exists, you should check if the field "createdAt" is set.
 */
export const docObs = <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  id: string | Observable<string | null>
): Observable<CollectionModels[CollectionName] | null> => {
  const beReader = getBeReader()
  return orObs(id).pipe(
    switchMap((idValue) => {
      if (!idValue) return from([null])
      if (beReader) {
        return from(beReader.readDoc(collectionName, idValue))
      }
      return readerFe.docObs(collectionName, id)
    })
  )
}

/**
 * Executes a query against a collection and returns results as a Promise.
 * Supports complex queries with where clauses, ordering, and limits.
 *
 * @example
 * // Query QA pairings with a where clause
 * const results = await readQuery(
      "qaPairings",
      ({ where, orderBy, limit, or, and }) => [
        where("archived", "==", false),
        or(where("answer", "!=", null), where("answer", "!=", "")),
        orderBy("createdAt", "desc"),
        limit(3),
      ]
    );
 *
 * @param collectionName - The name of the collection to query
 * @param buildQuery - Function that builds the query constraints
 * @returns Promise resolving to an array of documents
 */
export const readQuery = <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  buildQuery: readerFe.TypedQueryBuilder<CollectionName>
): Promise<CollectionModels[CollectionName][]> => {
  const beReader = getBeReader()
  if (beReader) {
    return firstValueFrom(
      readerFe.buildQueryWithDefaultBuilders(buildQuery).pipe(
        map((constraints) =>
          toBeQueryBuilderModule.toBeQueryBuilder<CollectionName>(constraints)
        ),
        switchMap((beBuilder) =>
          from(beReader.queryDocs(collectionName, beBuilder))
        )
      )
    )
  }
  return readerFe.readQuery(collectionName, buildQuery)
}

/**
 * Creates an Observable that emits query results whenever the underlying data changes.
 * Supports the same query capabilities as readQuery.
 *
 * @example
 * // Observe QA pairings for a specific user
 * const qaObs = readQuery(
      "qaPairings",
      ({ where, orderBy, limit, or, and }) => [
        where("archived", "==", false),
        or(where("answer", "!=", null), where("answer", "!=", "")),
        orderBy("createdAt", "desc"),
        limit(3),
      ]
    ).pipe(
      map((results) => results.filter((result) => result.createdAt.toDate() > new Date("2025-03-12"))
    );
 *
 * @param collectionName - The name of the collection to observe
 * @param buildQuery - Function that builds the query constraints
 * @returns Observable that emits arrays of documents
 */
export const queryObs = <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  buildQuery: readerFe.TypedQueryBuilder<CollectionName>
): Observable<CollectionModels[CollectionName][]> => {
  const beReader = getBeReader()
  if (beReader) {
    return readerFe.buildQueryWithDefaultBuilders(buildQuery).pipe(
      map((constraints) =>
        toBeQueryBuilderModule.toBeQueryBuilder<CollectionName>(constraints)
      ),
      switchMap((beBuilder) =>
        from(beReader.queryDocs(collectionName, beBuilder))
      )
    )
  }
  return readerFe.queryObs(collectionName, buildQuery)
}

/**
 * Creates an Observable that emits the count of documents matching a query.
 * The count updates when either the query results change or the refreshObs emits.
 *
 * @example
 * // Count QA pairings and update when refresh$ emits
 * const count$ = countObs("qaPairings", ({ where }) => [where("status", "==", "active")], refresh$);
 *
 * @param collectionName - The name of the collection to count
 * @param buildQuery - Function that builds the query constraints
 * @param refreshObs - Observable that triggers a refresh when it emits
 * @returns Observable that emits the count of matching documents
 */
export const countObs = <CollectionName extends keyof CollectionModels>(
  collectionName: CollectionName,
  buildQuery: readerFe.TypedQueryBuilder<CollectionName>,
  refreshObs: Observable<unknown>
): Observable<number> => {
  const beReader = getBeReader()
  if (beReader) {
    return readerFe.buildQueryWithDefaultBuilders(buildQuery).pipe(
      map((constraints) =>
        toBeQueryBuilderModule.toBeQueryBuilder<CollectionName>(constraints)
      ),
      switchMap((beBuilder) =>
        from(beReader.countDocs(collectionName, beBuilder))
      )
    )
  }
  return readerFe.countObs(collectionName, buildQuery, refreshObs)
}
