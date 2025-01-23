"use client"

import { useOverlay } from "./OverlayContext"

export const Overlay = () => {
  const { isOverlayVisible } = useOverlay()

  if (!isOverlayVisible) return null

  return (
    <div className={`fixed left-0 top-0 z-40 h-screen w-screen bg-black/50`} />
  )
}
