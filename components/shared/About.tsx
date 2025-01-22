import Image from "next/image"
import Link from "next/link"
import { FutureToggle } from "@/components/shared/FutureToggle"
import { useAboutMode } from "@/components/shared/AboutModeContext"
import { CurrentAbout } from "./CurrentAbout"
import { FutureAbout } from "./FutureAbout"

export const About = () => {
  const { aspirationalMode } = useAboutMode()

  return (
    <div className="flex w-full max-w-96 flex-col items-center gap-6">
      {/* Profile Picture */}
      <div className="relative h-48 w-48 overflow-hidden rounded-full">
        <img
          src={aspirationalMode ? "/fun-prof-pic.jpg" : "/normal-prof-pic.jpg"}
          alt="Profile Picture"
          fill
          className="object-cover"
        />
      </div>

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

      <div className="flex w-full flex-col gap-4">
        {aspirationalMode ? <FutureAbout /> : <CurrentAbout />}
      </div>
    </div>
  )
}
