import Image from "next/image"

interface SlideTransitionImageProps {
  aspirationalMode: boolean
}

export const SlideTransitionImage = ({
  aspirationalMode,
}: SlideTransitionImageProps) => {
  return (
    <div className="relative h-32 w-32 overflow-hidden rounded-full">
      <div
        className={`flex transition-transform duration-300 ease-in-out ${
          aspirationalMode ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="relative h-32 w-32 flex-shrink-0">
          <Image
            src="/normal-prof-pic.jpg"
            alt="Profile Picture"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative h-32 w-32 flex-shrink-0">
          <Image
            src="/fun-prof-pic.jpg"
            alt="Profile Picture"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}
