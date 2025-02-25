import { AboutPopupTrigger } from "./AboutPopupTrigger"
import Link from "next/link"

export const CurrentAbout = () => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        I like to work with people{" "}
        <AboutPopupTrigger
          popupContent={
            <div>
              <div>
                Maybe IPOing Twitter, maybe training a cohort of students, maybe
                making improv comedy. My favorite teams have a shared passion,
                regardless of what it is.
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Related Essays:{" "}
                <Link
                  href="/writing/finding-product-flow"
                  className="hover:underline"
                >
                  Finding Product Flow
                </Link>
              </div>
            </div>
          }
        >
          who care
        </AboutPopupTrigger>
        .
      </div>

      <div>
        I enjoy progress, but{" "}
        <AboutPopupTrigger
          popupContent={
            <div>
              <div>
                Through writing, meditating and moving I try remind myself that
                am I enough, right now.
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Related Essays:{" "}
                <Link
                  href="/writing/authenticity-and-privilege"
                  className="hover:underline"
                >
                  Authenticity and Privilege
                </Link>
              </div>
            </div>
          }
        >
          am ok with where I am.
        </AboutPopupTrigger>
      </div>

      <div>
        I enjoy solving problems but also finding the{" "}
        <AboutPopupTrigger
          popupContent={
            <div>
              <div>
                I won&apos;t fix bugs when a new app is needed. I won&apos;t
                build an app when a new business is needed. I won&apos;t build a
                business when I can support an existing one.
              </div>

              <div className="mt-2 text-sm text-muted-foreground">
                Related Essays:{" "}
                <Link
                  href="/writing/5-lessons-from-impact-startups"
                  className="hover:underline"
                >
                  5 Lessons from Impact startups
                </Link>
                ,{" "}
                <Link
                  href="/writing/train-employers-not-engineers"
                  className="hover:underline"
                >
                  Train Employers, not Engineers
                </Link>
              </div>
            </div>
          }
        >
          right problem
        </AboutPopupTrigger>{" "}
        to solve.
      </div>

      <div>
        I aspire for{" "}
        <AboutPopupTrigger
          popupContent={
            <div>
              <div>
                Living my life as described above makes me really happy, but
                sometimes I go too far.
              </div>
              <div>
                Sometimes seeking continuous feedback leads me to solve shallow
                problems. Sometimes I try to be fearless and end up thoughtless.
                Sometimes my bias towards action causes me to give up on good
                ideas too soon.
              </div>
              <div>
                I seek moderation, knowing I&apos;ll never really get there, but
                I&apos;ll be happier if I try.
              </div>

              <div className="mt-2 text-sm text-muted-foreground">
                Related Essays:{" "}
                <Link
                  href="/writing/3-heuristics-for-moderation"
                  className="hover:underline"
                >
                  3 Heuristics for Moderation
                </Link>
              </div>
            </div>
          }
        >
          moderation
        </AboutPopupTrigger>
        . Lagom. 过犹不及.
      </div>
    </div>
  )
}
