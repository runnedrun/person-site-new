import { PermissionValue } from "@/data/baseTypes/Model"
import jwt from "jsonwebtoken"
// TODO: don't use default
const key = process.env.AUTHENTICATED_LINK_TOKEN_SECRET || "123"

export type RecordPermission = {
  recordId: string
  collectionName: string
  permissions: Record<string, PermissionValue>
}

export type AuthenticatedLinkTokenData = {
  email: string
  recordPermissions: RecordPermission[]
  createdAt: number
  shareRecordKey: string
}

export const decryptAuthenticatedLinkToken = (token: string) => {
  return jwt.verify(token, key) as AuthenticatedLinkTokenData
}

export const encryptAuthenticatedLinkToken = (
  data: AuthenticatedLinkTokenData
) => {
  return jwt.sign(data, key)
}
