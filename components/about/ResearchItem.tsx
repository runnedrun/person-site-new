interface ResearchItemProps {
  title: string
  period: string
  description: string
}

export default function ResearchItem({
  title,
  period,
  description,
}: ResearchItemProps) {
  return (
    <div className="text-center">
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="mb-2 text-sm text-gray-600">{period}</p>
      <p className="text-sm">{description}</p>
    </div>
  )
}
