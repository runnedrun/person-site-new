import Link from "next/link"
import WritingLayout from "./WritingLayout"

interface WritingEntry {
  slug: string
  title: string
}

const writings: WritingEntry[] = [
  {
    slug: "3-heuristics-for-moderation",
    title: "3 Heuristics for Moderation",
  },
  {
    slug: "5-lessons-from-impact-startups",
    title: "5 Lessons from Impact Startups",
  },
  {
    slug: "ai-and-coding",
    title: "AI and Coding",
  },
  {
    slug: "authenticity-and-privilege",
    title: "Authenticity and Privilege",
  },
  {
    slug: "finding-product-flow",
    title: "Finding Product Flow",
  },
  {
    slug: "train-employers-not-engineers",
    title: "Train Employers, not Engineers",
  },
]

export default function WritingPage() {
  return (
    <WritingLayout header="Writing">
      <div className="space-y-6">
        {writings.map((writing) => (
          <article key={writing.slug} className="group">
            <Link
              href={`/writing/${writing.slug}`}
              className="block hover:opacity-75"
            >
              <h2 className="mb-2 text-xl underline">{writing.title}</h2>
            </Link>
          </article>
        ))}
      </div>
    </WritingLayout>
  )
}
