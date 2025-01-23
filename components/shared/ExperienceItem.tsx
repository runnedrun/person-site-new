import Image from "next/image"
import Link from "next/link"

interface ExperienceItemProps {
  logo?: string
  logoText?: string
  title: string
  link: string
  period: string
  role: string
  description: string
}

export default function ExperienceItem({
  logo,
  logoText,
  title,
  link,
  period,
  role,
  description,
}: ExperienceItemProps) {
  return (
    <div className="space-y-4">
      <div className="mx-auto h-12 w-12">
        {logo ? (
          <Image
            src={logo}
            alt={`${title} Logo`}
            width={48}
            height={48}
            className="object-contain"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center font-mono text-lg">
            {logoText}
          </div>
        )}
      </div>
      <div className="text-center">
        <Link href={link} className="text-lg font-semibold hover:text-blue-600">
          {title}
        </Link>
        <p className="text-sm text-gray-600">{period}</p>
        <p className="text-sm text-gray-600">{role}</p>
        <p className="mt-2 text-sm">{description}</p>
      </div>
    </div>
  )
}
