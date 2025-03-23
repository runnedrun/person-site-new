import { NextRequest, NextResponse } from "next/server"
import {
  AuthenticatedLinkTokenData,
  decryptAuthenticatedLinkToken,
} from "./decryptAuthenticatedLinkToken"
import { getUserFromTokenBe } from "@/data/auth/getUserFromTokenBe"
import { readDoc } from "@/data/reader"
import { doc } from "@firebase/firestore"

type HandleAuthenticatedLinkTokenRequest = {
  token: string
  userToken: string
}

export type HandleAuthenticatedLinkTokenResponse =
  | {
      needsLoginForEmail: string
    }
  | {
      handled: true
    }
  | {
      invalidToken: true
    }
  | {
      notAuhtorized: boolean
    }
  | {
      notValid: boolean
    }

export const POST = async (request: NextRequest) => {
  const { token, userToken } =
    (await request.json()) as HandleAuthenticatedLinkTokenRequest

  const user = await getUserFromTokenBe(userToken)

  let data: AuthenticatedLinkTokenData
  let resp: HandleAuthenticatedLinkTokenResponse = {
    notValid: true,
  }

  try {
    data = decryptAuthenticatedLinkToken(token)
  } catch {
    return NextResponse.json({
      invalidToken: true,
    })
  }

  const shareRecord = await readDoc("shareRecord", data.shareRecordKey)

  if (!shareRecord) {
    resp = {
      notValid: true,
    }
  }

  if (!user) {
    resp = {
      needsLoginForEmail: data.email,
    }
  } else if (user.email !== data.email) {
    resp = {
      notAuhtorized: true,
    }
  } else if (data.recordPermissions.length > 0) {
    // todo read through the permission records here.
  }

  return NextResponse.json(resp)
}
