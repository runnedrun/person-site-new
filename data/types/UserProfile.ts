import { Model } from "../baseTypes/Model"

export type UserProfile = Model<{
  name: string
  profilePicture: {
    url: string
    firebaseStorageDocRef: string
  } | null
}>
