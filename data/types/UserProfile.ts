import { Model } from "../baseTypes/Model"

export type FbFile = {
  url: string
  firebaseStorageDocRef: string
  fileName: string
}

export type UserProfile = Model<{
  name: {
    first: string
    last: string
    displayName?: string
  }
  profilePicture: FbFile | null
}>
