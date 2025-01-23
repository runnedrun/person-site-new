import Link from "next/link"
import { AboutPopupTrigger } from "./AboutPopupTrigger"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import colors from "tailwindcss/colors"

import "react-circular-progressbar/dist/styles.css"

const ProgressBarWithPopup = ({
  progress,
  content,
}: {
  progress: number
  content: React.ReactNode
}) => {
  return (
    <div className="flex h-14 w-14 shrink-0 grow-0 cursor-pointer justify-center">
      <AboutPopupTrigger popupContent={content} showUnderline={false}>
        <CircularProgressbar
          value={progress}
          text={`${progress}%`}
          styles={buildStyles({
            pathColor: colors.orange[400],
            textColor: "hsl(var(--foreground))",
            backgroundColor: colors.orange[400],
          })}
        />
      </AboutPopupTrigger>
    </div>
  )
}

export const FutureAbout = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <div>
          I&apos;d like to live in a city I love, and spend time regularly with
          a community who puts their focus and energy on many of the same things
          I do.{" "}
        </div>
        <ProgressBarWithPopup
          progress={70}
          content={
            <div>
              Currently I live in Gothenburg, Sweden, with my partner, and love
              it! We moved here in August 2024, from Geneva, Switzerland (which
              we also loved). I can move this progress bar to 100% if things are
              still this great after a year.
            </div>
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <div>
          I want to work on challenging problems with a team that I depend on as
          much as they depend on me.{" "}
        </div>
        <ProgressBarWithPopup
          progress={60}
          content={
            <div>
              In most of my work I get paid to do things I&apos;ve done in the
              past, but this time with fewer mistakes. It has it&apos;s pros
              (flexible hours, remote work), but one downside is I learn from
              and and rely on my peers less than I&apos;d like.
            </div>
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <div>
          I&apos;d like to help my team love their work as much as I do.{" "}
        </div>
        <ProgressBarWithPopup
          progress={65}
          content={
            <div>
              I love building software products. But it&apos;s hard to feel the
              same joy if those around me are anxious or unhappy with their
              work. I&apos;d like to be a calming influence when things move
              fast, and a motivating influence when things move slow.
            </div>
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <div>I want to feel OK, even when things go backward.</div>
        <ProgressBarWithPopup
          progress={80}
          content={
            <div>
              <div>
                Wow what a world I live in. It feels like there&apos;s more
                anger, uncertainty and general strife than there was 5 years ago
                when I first wrote this. The AI products I help create will
                certainly take my job.
              </div>
              <div className="mt-2">
                I want to be OK with this. Because, while I can influence the
                future, I&apos;ve started to realize I can&apos;t control it.
              </div>
            </div>
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <div>
          I&apos;m looking to solve problems that have an immediate impact on my
          own life{" "}
        </div>
        <ProgressBarWithPopup
          progress={80}
          content={
            <div>
              <div>
                In my 20&apos;s I worked on products that&apos;s I cared about,
                despite them solving a problem I didn&apos;t have: An important
                social media platform, which I rarely used. An amazing app, for
                the opposite gender. A company that changed peoples live&apos;s—
                on a continent I didn&apos;t grow up on.
              </div>
              <div className="mt-2">
                I loved this work, and it would be unrealistic to expect that
                all my projects will be for little old me.
              </div>
              <div className="mt-2">
                However, I hope to work on more projects that I can use
                everyday. Like my own{" "}
                <Link href="https://yaya.press">language app, yaya.press</Link>{" "}
                that has taught me 3 languages, and{" "}
                <Link href="https://thearcgame.com">
                  my own digital board game, thearcgame.com
                </Link>{" "}
                that I play monthly with friends.
              </div>
            </div>
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <div>I want to keep finding moments of moderation every day.</div>
        <ProgressBarWithPopup
          progress={50}
          content={
            <div>
              <div>
                Moderation has always been a challenge for me. But it&apos;s
                getting better.
              </div>
              <div className="mt-2">
                I hope that there can be at least one time per day when I decide
                to stop working even though I&apos;m not done, stop meditating
                even though I&apos;m not calm, and stop running even though
                I&apos;m not tired.
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
