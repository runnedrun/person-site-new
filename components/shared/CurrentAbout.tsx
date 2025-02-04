import { AboutPopupTrigger } from "./AboutPopupTrigger"
import Link from "next/link"
import { PlaceTimeline } from "./PlaceTimeline"

export const CurrentAbout = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="">
        I&apos;ve lived in{" "}
        <AboutPopupTrigger
          popupContent={
            <div>
              <PlaceTimeline
                items={[
                  { time: "1991-2009", place: "Gaithersburg, MD, USA" },
                  { time: "2009-2013", place: "Needham, MA, USA" },
                  { time: "Jan 2012-June 2012", place: "Leeds, UK" },
                  { time: "2013-2016", place: "San Francisco, CA, USA" },
                  { time: "Jan 2017-Aug 2017", place: "Hong Kong" },
                  { time: "Aug 2017-Jan 2018", place: "Shanghai, China" },
                  { time: "Jan 2018 - Jan 2018", place: "Okland, CA, USA" },
                  { time: "Jan 2019-March 2020", place: "Nairobi, Kenya" },
                  { time: "March 2020-November 2020", place: "Tokyo, Japan" },
                  {
                    time: "November 2020-September 2021",
                    place: "Back in Nairobi",
                  },
                  {
                    time: "September 2021-May 2024",
                    place: "Geneva, Switzerland",
                  },
                  {
                    time: "August 2024-Present",
                    place: "Gothenburg, Sweden",
                  },
                ]}
              />
              <div className="mt-4 text-sm text-muted-foreground">
                *Notable mention for New York City and London, where I lived, on
                and off, for 1 month at a time, when I was figuring out where to
                go next.
              </div>
            </div>
          }
        >
          11 cities on 4 continents.
        </AboutPopupTrigger>
        . I worked at Twitter through its IPO. I spent a lot of my 20&apos;s
        launching startups, including one which was acquired. I&apos;ve enjoyed
        some success and grown a lot through failure. Here&apos;s a bit about
        me.
      </div>

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
                  href="/writing/i-love-building-software"
                  className="hover:underline"
                >
                  I Love Building Software...again
                </Link>
                ,{" "}
                <Link href="/writing/coding-and-ai" className="hover:underline">
                  Coding and AI
                </Link>
                ,{" "}
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
