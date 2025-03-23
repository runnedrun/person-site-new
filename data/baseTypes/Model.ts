import { Timestamp } from "@firebase/firestore"

export type ModelBaseFields = keyof Model<{}>
export const BaseFields: ModelBaseFields[] = [
  "uid",
  "archived",
  "archivedOn",
  "createdAt",
  "updatedAt",
  "permissions",
]

export type PermissionValue = "admin" | "write" | "read"

export type ModelBase = {
  uid?: string
  archived?: boolean
  archivedOn?: Timestamp
  createdAt?: Timestamp
  updatedAt?: Timestamp
  ownerKeys?: string[]
  permissions?: {
    // read: can read the doc
    // write: can write any field EXCEPT permissions
    // admin: can update any field
    [key: string]: "admin" | "write" | "read"
  }
}

export type Model<
  Type extends { [key: string]: unknown } = { [key: string]: unknown },
> = Type & ModelBase

export type AnyGenericModel = Model<{}>

export type ModelTypeFromModel<FullModel extends AnyGenericModel> =
  FullModel extends Model<infer ModelType> ? ModelType : never
