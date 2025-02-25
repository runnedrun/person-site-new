import Link from "next/link"
import WritingLayout from "./WritingLayout"
import { writings } from "./writings"

export default function WritingPage() {
  return (
    <WritingLayout header="Writing">
      <div className="space-y-6">
        <div>
          I don't publish my writing often, but here are my favorite, evergreen,
          pieces. More can be found on my old{" "}
          <a
            href="https://gaynor.substack.com"
            className="text-blue-400 underline"
          >
            personal substack
          </a>
          , or{" "}
          <a
            href="https://painlesstech.substack.com/"
            className="text-blue-400 underline"
          >
            Tech Writing Substack
          </a>
          .
        </div>
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
