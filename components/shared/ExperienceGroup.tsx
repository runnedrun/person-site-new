interface ExperienceGroupProps {
  title: string
  children: React.ReactNode
}

export default function ExperienceGroup({
  title,
  children,
}: ExperienceGroupProps) {
  return (
    <div className="rounded-lg border-gray-200 p-2 md:border">
      <h2 className="mb-8 text-center text-2xl font-bold">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2">{children}</div>
    </div>
  )
}
