import { getAuth } from "firebase-admin/auth"

export const getUserFromTokenBe = async (userToken: string) => {
  const user = await getAuth().verifyIdToken(userToken)
  if (!user.uid) {
    return null
  }

  return user
}
