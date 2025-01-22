"use client"

import * as React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50" />}
      <PopoverTrigger asChild>
        <div
          className={cn(
            "group relative z-50 inline-block cursor-pointer transition-all",
            {
              "bg-white p-1": isOpen,
            }
          )}
        >
          {children}
          {showUnderline && (
            <div className="mt-0.5 h-[3px] w-full bg-orange-400/60 transition-colors group-hover:bg-orange-500" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="relative z-50 w-64 p-4 md:w-96">
        {popupContent}
      </PopoverContent>
    </Popover>
  )
}
