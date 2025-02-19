"use client"
import { useAboutMode } from "@/components/shared/AboutModeContext"
import { FutureToggle } from "@/components/shared/FutureToggle"
import Link from "next/link"
import { Overlay } from "./Overlay"
import { SlideTransitionAbout } from "./SlideTransitionAbout"
import { SlideTransitionImage } from "./SlideTransitionImage"
import { SlideTransitionContactInfo } from "./SlideTransitionContactInfo"

export const About = () => {
  const { aspirationalMode } = useAboutMode()

  return (
    <div className="relative flex min-h-0 w-full max-w-[500px] grow flex-col items-center gap-8 overflow-x-hidden overflow-y-visible">
      <Overlay />
      <div className="flex flex-wrap items-center gap-8">
        <div>
          <SlideTransitionImage aspirationalMode={aspirationalMode} />
        </div>
        {/* Contact Links */}
        <div className="mt-2 flex min-w-0 flex-col items-center text-sm">
          <FutureToggle />
          <SlideTransitionContactInfo aspirationalMode={aspirationalMode} />
        </div>
      </div>
      {/* Mode Toggle and Sections */}

      <div className="z-50 flex min-h-0 grow flex-col">
        <SlideTransitionAbout aspirationalMode={aspirationalMode} />
      </div>
    </div>
  )
}
