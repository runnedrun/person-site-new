interface ExperienceGroupProps {
  title: string
  children: React.ReactNode
}

export default function ExperienceGroup({
  title,
  children,
}: ExperienceGroupProps) {
  return (
    <div className="w-full rounded-lg border-gray-200 p-2 md:border">
      <div className="mb-8 flex flex-col items-center">
        <h2 className="text-center text-2xl font-bold underline underline-offset-8 print:text-base">
          {title}
        </h2>
        {/* <div className="h-1 w-4/5 border-b-2 border-gray-600 md:hidden"></div> */}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">{children}</div>
    </div>
  )
}
