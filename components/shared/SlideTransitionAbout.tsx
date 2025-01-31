import { CurrentAbout } from "./CurrentAbout"
import { FutureAbout } from "./FutureAbout"
import { QADisplay } from "./QADisplay"

interface SlideTransitionAboutProps {
  aspirationalMode: boolean
}

export const SlideTransitionAbout = ({
  aspirationalMode,
}: SlideTransitionAboutProps) => {
  console.log(aspirationalMode)
  return (
    <div className="min-h-0 w-full grow">
      <div
        className={`flex h-full w-full transition-transform duration-300 ease-in-out ${aspirationalMode ? "-translate-x-full" : "translate-x-0"}`}
      >
        <div className="flex w-full flex-shrink-0 flex-col gap-8 px-2 pt-2">
          <CurrentAbout />
          <QADisplay />
        </div>
        <div className="w-full flex-shrink-0 p-2">
          <FutureAbout />
        </div>
      </div>
    </div>
  )
}
