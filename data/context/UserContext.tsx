"use client"

import { User, getAuth, onAuthStateChanged } from "@firebase/auth"
import { createContext, ReactNode, useState, useEffect } from "react"
import { init } from "../helpers/initFb"

// Create a separate type for the user context
export type UserContextType = {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

// Create a new context for the user with the separate type
export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
})
// Create a provider component

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const store = init()
    const auth = getAuth(store.app)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setIsAuthenticated(!!currentUser && !currentUser.isAnonymous)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  )
}
