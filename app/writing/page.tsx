import Link from "next/link"
import WritingLayout from "./WritingLayout"
import { writings } from "./writings"

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
