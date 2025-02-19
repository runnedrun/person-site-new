import Image from "next/image"
import Link from "next/link"

interface SlideTransitionContactInfoProps {
  aspirationalMode: boolean
}

export const SlideTransitionContactInfo = ({
  aspirationalMode,
}: SlideTransitionContactInfoProps) => {
  return (
    <div className="relative h-40 w-40 overflow-hidden">
      <div
        className={`flex transition-transform duration-300 ease-in-out ${
          aspirationalMode ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="relative w-40 flex-shrink-0">
          <div className="mt-2 flex flex-col items-center text-sm">
            <div className="flex flex-col items-center font-grotesk text-lg font-bold text-orange-600">
              I'm David Gaynor.
            </div>
            <Link
              href="https://github.com/runnedrun"
              className="hover:underline"
            >
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
        <div className="relative w-40 flex-shrink-0">
          <div className="mt-2 flex flex-col items-center text-sm">
            <div className="flex flex-col flex-wrap items-center font-grotesk text-lg font-bold text-orange-600">
              I'm still David Gaynor
            </div>
            <div>but I hope a few things will be different...</div>
          </div>
        </div>
      </div>
    </div>
  )
}
