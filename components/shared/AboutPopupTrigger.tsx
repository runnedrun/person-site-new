"use client"

import * as React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useAboutMode } from "./AboutModeContext"
import { useOverlay } from "./OverlayContext"

interface AboutPopupTriggerProps {
  children: React.ReactNode
  popupContent: React.ReactNode
  showUnderline?: boolean
}

export const AboutPopupTrigger = ({
  children,
  popupContent,
  showUnderline = true,
}: AboutPopupTriggerProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { aspirationalMode } = useAboutMode()

  const { setIsOverlayVisible } = useOverlay()
  React.useEffect(() => {
    setIsOverlayVisible(isOpen)
  }, [isOpen, setIsOverlayVisible])

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 z-40 ${aspirationalMode ? "translate-x-full" : "translate-x-0"}`}
        />
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "group relative z-50 inline-block cursor-pointer transition-all",
              {
                "scale-105": isOpen,
              }
            )}
          >
            {children}
            {isOpen && (
              <div className="absolute -left-[5px] top-0 -z-10 h-[105%] w-[calc(100%+10px)] bg-blue-100/80" />
            )}
            {showUnderline && (
              <div className="-mt-0.5 h-[2px] w-full bg-orange-400/60 transition-colors group-hover:bg-orange-500" />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="relative z-50 w-64 p-4 md:w-96">
          {popupContent}
        </PopoverContent>
      </Popover>
    </>
  )
}
