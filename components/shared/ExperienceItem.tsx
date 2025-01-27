import Image from "next/image"
import Link from "next/link"
import { AboutPopupTrigger } from "./AboutPopupTrigger"
import { cn } from "@/lib/utils"

interface ExperienceItemProps {
  logo?: string
  logoText?: string
  title: string
  link?: string
  popupContent?: React.ReactNode
  period: string
  role: string
  description: React.ReactNode
  className?: string
}

export default function ExperienceItem({
  logo,
  logoText,
  title,
  link,
  popupContent,
  period,
  role,
  description,
  className,
}: ExperienceItemProps) {
  return (
    <div className={cn("h-50 space-y-4")}>
      <div className="mx-auto h-12 w-12">
        {logo ? (
          <Image
            src={logo}
            alt={`${title} Logo`}
            width={100}
            height={100}
            className={cn("object-contain", className)}
          />
        ) : (
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center font-mono text-lg",
              className
            )}
          >
            {logoText}
          </div>
        )}
      </div>
      <div className="text-center">
        {popupContent ? (
          <AboutPopupTrigger showUnderline={false} popupContent={popupContent}>
            <div className="text-lg font-semibold hover:text-blue-600">
              {title}
            </div>
          </AboutPopupTrigger>
        ) : (
          link && (
            <Link
              href={link}
              className="text-lg font-semibold hover:text-blue-600"
            >
              {title}
            </Link>
          )
        )}
        <div className="text-sm text-gray-600">{period}</div>
        <div className="text-sm text-gray-600">{role}</div>
        <div className="mt-2 text-sm">{description}</div>
      </div>
    </div>
  )
}
