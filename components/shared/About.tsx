import { useAboutMode } from "@/components/shared/AboutModeContext"
import { FutureToggle } from "@/components/shared/FutureToggle"
import Link from "next/link"
import { Overlay } from "./Overlay"
import { SlideTransitionAbout } from "./SlideTransitionAbout"
import { SlideTransitionImage } from "./SlideTransitionImage"

export const About = () => {
  const { aspirationalMode } = useAboutMode()

  return (
    <div className="relative flex min-h-0 w-full max-w-[500px] grow flex-col items-center overflow-x-hidden overflow-y-visible">
      <Overlay />

      <SlideTransitionImage aspirationalMode={aspirationalMode} />
      {/* Contact Links */}
      <div className="mb-6 mt-2 flex flex-col items-center text-sm">
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
      <div className="z-50 flex min-h-0 grow flex-col">
        <SlideTransitionAbout aspirationalMode={aspirationalMode} />
      </div>
    </div>
  )
}
