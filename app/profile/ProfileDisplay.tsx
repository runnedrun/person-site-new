"use client"

import { useContext } from "react"
import { UserContext } from "@/data/context/UserContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export const ProfileComponent = () => {
  const { userProfile } = useContext(UserContext)

  return <div>Profile</div>
}

export const ProfileDisplay = () => {
  return (
    <ProtectedRoute>
      <ProfileComponent />
    </ProtectedRoute>
  )
}
