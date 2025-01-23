import { CurrentAbout } from "./CurrentAbout"
import { FutureAbout } from "./FutureAbout"

interface SlideTransitionAboutProps {
  aspirationalMode: boolean
}

export const SlideTransitionAbout = ({
  aspirationalMode,
}: SlideTransitionAboutProps) => {
  console.log(aspirationalMode)
  return (
    <div className="w-full">
      <div
        className={`flex w-full transition-transform duration-300 ease-in-out ${aspirationalMode ? "-translate-x-full" : "translate-x-0"} `}
      >
        <div className="w-full flex-shrink-0 bg-white p-2">
          <CurrentAbout />
        </div>
        <div className="w-full flex-shrink-0 bg-white p-2">
          <FutureAbout />
        </div>
      </div>
    </div>
  )
}
