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

// Helper function to get backend reader if available
const getBeReader = async () => {
  if (!isServerside()) return null
  const readerBe = await import("./readerBe")
  if ((readerBe as any)._isStub) return null
  return readerBe
}

export const readDoc = async <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  id: string
): Promise<AllModels[CollectionName]> => {
  const beReader = await getBeReader()
  if (beReader) {
    return beReader.readDoc(collectionName, id)
  }
  return readerFe.readDoc(collectionName, id)
}

export const docObs = <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  id: string | Observable<string | null>
): Observable<AllModels[CollectionName] | null> => {
  const beReaderObs = from(getBeReader())
  return combineLatest([beReaderObs, orObs(id)]).pipe(
    switchMap(([beReader, idValue]) => {
      if (!idValue) return from([null])
      if (beReader) {
        return from(beReader.readDoc(collectionName, idValue))
      }
      return readerFe.docObs(collectionName, id)
    })
  )
}

export const queryObs = <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  buildQuery: readerFe.TypedQueryBuilder<CollectionName>
): Observable<AllModels[CollectionName][]> => {
  const beReaderObs = from(getBeReader())
  return beReaderObs.pipe(
    switchMap((beReader) => {
      if (beReader) {
        return readerFe.buildQueryWithDefaultBuilders(buildQuery).pipe(
          map((constraints) => toBeQueryBuilder<CollectionName>(constraints)),
          switchMap((beBuilder) =>
            from(beReader.queryDocs(collectionName, beBuilder))
          )
        )
      }
      return readerFe.queryObs(collectionName, buildQuery)
    })
  )
}

export const countObs = <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  buildQuery: readerFe.TypedQueryBuilder<CollectionName>,
  refreshObs: Observable<unknown>
): Observable<number> => {
  const beReaderObs = from(getBeReader())
  return readerFe.buildQueryWithDefaultBuilders(buildQuery).pipe(
    map((constraints) => toBeQueryBuilder(constraints)),
    switchMap((beBuilder) =>
      beReaderObs.pipe(
        switchMap((beReader) => {
          if (beReader) {
            return from(beReader.countDocs(collectionName, beBuilder))
          }
          return readerFe.countObs(collectionName, buildQuery, refreshObs)
        })
      )
    )
  )
}
