import { useAboutMode } from "@/components/shared/AboutModeContext"
import { FutureToggle } from "@/components/shared/FutureToggle"
import Link from "next/link"
import { SlideTransitionAbout } from "./SlideTransitionAbout"
import { SlideTransitionImage } from "./SlideTransitionImage"
import { OverlayProvider } from "./OverlayContext"
import { Overlay } from "./Overlay"

export const About = () => {
  const { aspirationalMode } = useAboutMode()

  return (
    <OverlayProvider>
      <div className="relative flex w-full max-w-96 flex-col items-center gap-6 overflow-x-hidden overflow-y-visible">
        <Overlay />
        {/* Profile Picture */}
        {/* Profile Picture */}
        <SlideTransitionImage aspirationalMode={aspirationalMode} />
        {/* Contact Links */}
        <div className="flex flex-col items-center gap-2 text-sm">
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
        </div>
        {/* Mode Toggle and Sections */}
        <FutureToggle />
        <div className="z-50">
          <SlideTransitionAbout aspirationalMode={aspirationalMode} />
        </div>
      </div>
    </OverlayProvider>
  )
}
