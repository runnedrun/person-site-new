"use client"

import { User, UserProfile, getAuth, onAuthStateChanged } from "@firebase/auth"

import { createContext, ReactNode, useState, useEffect } from "react"
import { init } from "../helpers/initFb"
import { useObs } from "../useObs"
import { docObs } from "../reader"

// Create a separate type for the user context
export type UserContextType = {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  userProfile: UserProfile | null
}

// Create a new context for the user with the separate type
export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  userProfile: null,
})
// Create a provider component

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const store = init()
    const auth = getAuth(store.app)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const userProfile = useObs(docObs("userProfile", user?.uid), [user?.uid])

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !loading && !!user && !user.isAnonymous,
        userProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
