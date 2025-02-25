import WritingLayout from "../WritingLayout"
import TrainEmployersPost from "./train-employers.mdx"
import dayjs from "dayjs"
export default function TrainEmployers() {
  return (
    <WritingLayout
      header="Train Employers, not Engineers"
      forewords={[
        {
          date: dayjs("2025-02-23").toDate(),
          text: (
            <div className="flex flex-col gap-4">
              <div>
                I wrote this in 2020, shortly after leaving my role directing
                engineer training products at Andela. Man, how things have
                changed.
              </div>
              <div>
                The simplification of software engineering I had hoped for has
                happened— in the form of LLM tools that can generate better code
                than I could have written as a junior engineer.
              </div>
              <div>
                Now it doesn't seem like we need bootcamps at all— but also,
                it's unclear if we need junior engineers. In fact, maybe we
                won't need senior engineers soon enough.
              </div>
              <div>
                It's still super early days in this change, but it reminds me a
                lot of the Web 2.0 shift in 2010. It really does feel like the
                first time I tried Ruby on Rails. LLMs bring so much joy to my
                work, it's hard to complain, even if they do take my job one
                day.
              </div>
            </div>
          ),
        },
      ]}
    >
      <TrainEmployersPost />
    </WritingLayout>
  )
}
