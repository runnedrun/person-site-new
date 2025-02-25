import { getApp as fbGetApp, initializeApp } from "@firebase/app"
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  ReCaptchaV3Provider,
} from "@firebase/app-check"
import { connectAuthEmulator, getAuth } from "@firebase/auth"
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
} from "@firebase/firestore"
import { getStorage } from "@firebase/storage"
import { isServerside } from "./isServerside"

const getApp = (name?: string) => {
  let app = null
  try {
    app = fbGetApp(name)
  } catch {
    // this is expected the first time the app loads
  }
  return app
}

export const init = () => {
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE

  if (getApp()) return getFirestore()

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_PROJECT_ID,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_STORAGE_BUCKET,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_APP_ID,
    measurementId:
      process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_MEASUREMENT_ID,
  }

  const app = initializeApp(config)

  const db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  })

  const storage = getStorage(app)

  if (demoMode) {
    connectFirestoreEmulator(db, "localhost", 8072)
    // connectStorageEmulator(storage, "localhost", 9190)
    connectAuthEmulator(getAuth(), "http://localhost:9090", {
      disableWarnings: true,
    })
  } else if (!isServerside()) {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(
        "6LcUGuIqAAAAAJWgMLSitf24Rvpn0_UfO27XeUlz"
      ),

      isTokenAutoRefreshEnabled: true,
    })
  }

  return db
}

export const initFb = init
