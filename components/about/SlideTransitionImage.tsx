import Image from "next/image"

interface SlideTransitionImageProps {
  aspirationalMode: boolean
}

export const SlideTransitionImage = ({
  aspirationalMode,
}: SlideTransitionImageProps) => {
  return (
    <div className="relative h-32 w-32 overflow-hidden">
      <div
        className={`flex transition-transform duration-300 ease-in-out ${
          aspirationalMode ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="relative h-32 w-32 flex-shrink-0">
          <Image
            src="/no_bg_normal.png"
            alt="Profile Picture"
            fill
            sizes="150px"
            className="object-cover"
          />
        </div>
        <div className="relative h-32 w-32 flex-shrink-0">
          <Image
            src="/no_bg_fun.png"
            alt="Profile Picture"
            fill
            sizes="150px"
            className="scale-125 object-cover"
          />
        </div>
      </div>
    </div>
  )
}
