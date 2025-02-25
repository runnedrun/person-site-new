import dayjs from "dayjs"
import WritingLayout from "../WritingLayout"
import Lessons from "./impact-lessons.mdx"

export default function LessonsFromStartups() {
  return (
    <WritingLayout
      header="5 Lessons from Impact Startups"
      forewords={[
        {
          date: dayjs("2025-02-23").toDate(),
          text: "I wrote this article in 2021, and I'd say my experience has continued to reinforce most of these lessons. I'd add that 'stubborn storytellers' are even more prevalent— and important, today, than in 2021 and not just at impact startups.",
        },
      ]}
    >
      <Lessons />
    </WritingLayout>
  )
}
