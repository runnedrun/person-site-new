"use client"
import { useAboutMode } from "@/components/shared/AboutModeContext"
import { FutureToggle } from "@/components/shared/FutureToggle"
import Link from "next/link"
import { Overlay } from "./Overlay"
import { SlideTransitionAbout } from "./SlideTransitionAbout"
import { SlideTransitionImage } from "./SlideTransitionImage"

export const About = () => {
  const { aspirationalMode } = useAboutMode()

  return (
    <div className="relative flex min-h-0 w-full max-w-[500px] grow flex-col items-center gap-8 overflow-x-hidden overflow-y-visible">
      <Overlay />
      <div className="flex flex-wrap items-center gap-8">
        <SlideTransitionImage aspirationalMode={aspirationalMode} />
        {/* Contact Links */}
        <div className="mb-6 mt-2 flex flex-col items-center text-sm">
          <div className="flex flex-col items-center font-grotesk text-lg font-bold text-orange-600">
            I'm David Gaynor.
          </div>
          <Link href="https://github.com/runnedrun" className="hover:underline">
            github.com/runnedrun
          </Link>
          <Link href="mailto:runnedrun@gmail.com" className="hover:underline">
            runnedrun@gmail.com
          </Link>
          <Link
            href="https://www.linkedin.com/in/runnedrun/"
            className="hover:underline"
          >
            linkedin.com/in/runnedrun
          </Link>
          <Link href="/writing" className="hover:underline">
            Writing
          </Link>
        </div>
      </div>
      {/* Mode Toggle and Sections */}
      <FutureToggle />
      <div className="z-50 flex min-h-0 grow flex-col">
        <SlideTransitionAbout aspirationalMode={aspirationalMode} />
      </div>
    </div>
  )
}
