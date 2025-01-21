import { useAboutMode } from "@/components/shared/AboutModeContext"
import { ReactNode } from "react"

interface AboutSectionProps {
  nowContent: ReactNode
  aspirationalContent: ReactNode
}

export function AboutSection({ nowContent, aspirationalContent }: AboutSectionProps) {
  const { aspirationalMode } = useAboutMode()

  return (
    <div className="relative h-[4rem] overflow-hidden">
      <div
        className={`absolute w-full transition-transform duration-500 ease-in-out ${
          aspirationalMode ? "translate-x-[-100%]" : "translate-x-0"
        }`}
      >
        {nowContent}
      </div>
      <div
        className={`absolute w-full transition-transform duration-500 ease-in-out ${
          aspirationalMode ? "translate-x-0" : "translate-x-[100%]"
        }`}
      >
        {aspirationalContent}
      </div>
    </div>
  )
}