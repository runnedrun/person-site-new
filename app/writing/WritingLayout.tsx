interface WritingLayoutProps {
  children: React.ReactNode
  header: string
}

export default function WritingLayout({
  children,
  header,
}: WritingLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">{header}</h1>
      <div className="prose prose-lg">{children}</div>
    </div>
  )
}
