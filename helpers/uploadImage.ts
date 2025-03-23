import { getStorage, ref, uploadBytes, getDownloadURL } from "@firebase/storage"
import { init } from "@/data/helpers/initFb"
import { getUuid } from "@/data/helpers/getUuid"

/**
 * Uploads an image to Firebase Storage and returns the URL and storage reference
 * @param file The file to upload
 * @param path Optional path in storage (defaults to 'profile-pictures')
 * @returns Object containing the download URL and Firebase storage document reference
 */
export const uploadImage = async (
  file: File,
  path: string = "profile-pictures"
) => {
  // Initialize Firebase if not already initialized
  init()

  // Get storage reference
  const storage = getStorage()
  const uuid = getUuid()
  const fileExtension = file.name.split(".").pop()
  const fileName = `${uuid}-${Date.now()}.${fileExtension}`
  const storageRef = ref(storage, `${path}/${fileName}`)

  // Set metadata to make the file publicly accessible
  const metadata = {
    contentType: file.type,
    cacheControl: "public, max-age=31536000",
  }

  // Upload the file with metadata for public access
  const snapshot = await uploadBytes(storageRef, file, metadata)

  // Get the download URL - this will be a public URL
  const downloadURL = await getDownloadURL(snapshot.ref)

  return {
    url: downloadURL,
    firebaseStorageDocRef: snapshot.ref.fullPath,
  }
}
