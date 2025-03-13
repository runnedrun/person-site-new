import { WhereFilterOp, OrderByDirection } from "@firebase/firestore"
import { Filter } from "@google-cloud/firestore"
import { CollectionModels } from "./CollectionModels"
import { PossibleQueryConstraint } from "./readerFe"
import { BeQueryBuilder, QueryWithTypedWhere } from "./readerBe"

type Field = {
  segments: string[]
}

type QueryConstraint = {
  type: "where" | "and" | "or" | "orderBy" | "limit"
  _field?: Field
  _op?: WhereFilterOp
  _value?: any
  _limit?: number
  _direction?: OrderByDirection
}

type CompositeQuery = {
  type: "and" | "or"
  _queryConstraints: QueryConstraint[]
}

const getFieldStringFromField = (field: Field) => {
  return field.segments.join(".")
}

export const toBeQueryBuilder = <CollectionName extends keyof CollectionModels>(
  constraints: PossibleQueryConstraint[]
): BeQueryBuilder<CollectionName> => {
  return (ref) => {
    let query = ref as QueryWithTypedWhere<CollectionModels[CollectionName]>

    for (const constraint of constraints) {
      if (!constraint) continue

      switch (constraint.type) {
        case "where":
          query = query.where(
            getFieldStringFromField(
              (constraint as QueryConstraint)._field!
            ) as any,
            (constraint as QueryConstraint)._op as WhereFilterOp,
            (constraint as QueryConstraint)._value
          )
          break
        case "and":
          query = query.where(
            Filter.and(
              ...(constraint as CompositeQuery)._queryConstraints.map((f) =>
                Filter.where(
                  getFieldStringFromField((f as QueryConstraint)._field!),
                  (f as QueryConstraint)._op as WhereFilterOp,
                  (f as QueryConstraint)._value
                )
              )
            )
          )
          break
        case "or":
          query = query.where(
            Filter.or(
              ...(constraint as CompositeQuery)._queryConstraints.map((f) =>
                Filter.where(
                  getFieldStringFromField((f as QueryConstraint)._field!),
                  (f as QueryConstraint)._op as WhereFilterOp,
                  (f as QueryConstraint)._value
                )
              )
            )
          )
          break
        case "orderBy":
          query = query.orderBy(
            getFieldStringFromField(
              (constraint as QueryConstraint)._field!
            ) as any,
            (constraint as QueryConstraint)._direction as OrderByDirection
          )
          break
        case "limit":
          query = query.limit((constraint as QueryConstraint)._limit as number)
          break
      }
    }
    return query
  }
}
