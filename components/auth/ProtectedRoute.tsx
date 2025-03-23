"use client"

import { useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserContext } from "@/data/auth/UserContext"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useContext(UserContext)

  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/sign_in")
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in the useEffect
  }

  return <>{children}</>
}
