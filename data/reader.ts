import { Observable, combineLatest, from } from "rxjs"
import { map, switchMap } from "rxjs/operators"
import { AllModels } from "./CollectionModels"
import { isServerside } from "./helpers/isServerside"
import * as readerFe from "./readerFe"
import { orObs } from "./helpers/orObs"
import { toBeQueryBuilder } from "./toBeQueryBuilder"

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

export const readDoc = async <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  id: string
): Promise<AllModels[CollectionName]> => {
  if (isServerside()) {
    const readDoc = (await import("./readerBe")).readDoc
    return readDoc(collectionName, id)
  } else {
    return readerFe.readDoc(collectionName, id)
  }
}

export const docObs = <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  id: string | Observable<string | null>
): Observable<AllModels[CollectionName] | null> => {
  if (isServerside()) {
    const readDocObs = from(import("./readerBe")).pipe(
      map((readerBe) => readerBe.readDoc)
    )
    return combineLatest([readDocObs, orObs(id)]).pipe(
      switchMap(([readDoc, id]) => from(readDoc(collectionName, id as string)))
    )
  } else {
    return readerFe.docObs(collectionName, id)
  }
}

export const queryObs = <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  buildQuery: readerFe.TypedQueryBuilder<CollectionName>
): Observable<AllModels[CollectionName][]> => {
  if (isServerside() && process.env.NEXT_RUNTIME === "nodejs") {
    const queryDocs = from(import("./readerBe")).pipe(
      map((readerBe) => readerBe.queryDocs)
    )
    return readerFe.buildQueryWithDefaultBuilders(buildQuery).pipe(
      map((constraints) => toBeQueryBuilder<CollectionName>(constraints)),
      switchMap((beBuilder) =>
        queryDocs.pipe(
          switchMap((queryDocsFunc) =>
            from(queryDocsFunc(collectionName, beBuilder))
          )
        )
      )
    )
  } else {
    return readerFe.queryObs(collectionName, buildQuery)
  }
}

export const countObs = <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  buildQuery: readerFe.TypedQueryBuilder<CollectionName>,
  refreshObs: Observable<unknown>
): Observable<number> => {
  if (isServerside()) {
    const countDocs = from(import("./readerBe")).pipe(
      map((readerBe) => readerBe.countDocs)
    )
    return readerFe.buildQueryWithDefaultBuilders(buildQuery).pipe(
      map((constraints) => toBeQueryBuilder(constraints)),
      switchMap((beBuilder) =>
        countDocs.pipe(
          switchMap((countDocsFunc) =>
            from(countDocsFunc(collectionName, beBuilder))
          )
        )
      )
    )
  } else {
    return readerFe.countObs(collectionName, buildQuery, refreshObs)
  }
}
