"use client"

import { OverlayProvider } from "@/components/shared/OverlayContext"
import Resume from "@/components/shared/Resume"

export default function ResumePage() {
  return (
    <div className="flex h-screen w-screen flex-col justify-center">
      <div className="print:origin-top print:scale-[85%]">
        <OverlayProvider>
          <Resume />
        </OverlayProvider>
      </div>
    </div>
  )
}
