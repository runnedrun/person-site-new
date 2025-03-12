"use client"

import { createContext, useContext, useState } from "react"

interface OverlayContextType {
  isOverlayVisible: boolean
  setIsOverlayVisible: (visible: boolean) => void
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined)

export const OverlayProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)

  return (
    <OverlayContext.Provider value={{ isOverlayVisible, setIsOverlayVisible }}>
      {children}
    </OverlayContext.Provider>
  )
}

export const useOverlay = () => {
  const context = useContext(OverlayContext)
  if (!context) {
    throw new Error("useOverlay must be used within an OverlayProvider")
  }
  return context
}
