import { GeometricBg } from "@/components/about/GeometricBg"
import dayjs from "dayjs"

interface WritingLayoutProps {
  children: React.ReactNode
  header: string
  forewords?: { date: Date; text: React.ReactNode }[]
}

export default function WritingLayout({
  children,
  header,
  forewords,
}: WritingLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center">
      <div className="absolute inset-0 -z-20">
        <GeometricBg />
      </div>
      <div className="max-w-3xl px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">{header}</h1>
        {forewords && (
          <div className="mb-8 flex flex-col gap-4">
            {forewords.map((foreword, index) => (
              <p key={index} className="text-lg italic text-gray-600">
                {dayjs(foreword.date).format("MMMM D, YYYY")} - {foreword.text}
              </p>
            ))}
          </div>
        )}
        <div className="prose prose-lg">{children}</div>
      </div>
    </div>
  )
}
