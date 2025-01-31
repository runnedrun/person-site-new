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

type TextWithProgressProps = {
  content: string
  progress: number
  progressPopupContent: React.ReactNode
}

const TextWithProgress = ({
  content,
  progress,
  progressPopupContent,
}: TextWithProgressProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="grow">{content}</div>
      <ProgressBarWithPopup
        progress={progress}
        content={progressPopupContent}
      />
    </div>
  )
}

export const FutureAbout = () => {
  return (
    <div className="flex min-w-0 flex-col gap-8">
      <TextWithProgress
        content="I'd like to live in a city I love, and spend time regularly with a community who puts their focus and energy on many of the same things I do."
        progress={70}
        progressPopupContent={
          <div>
            Currently I live in Gothenburg, Sweden, with my partner, and love
            it! We moved here in August 2024, from Geneva, Switzerland (which we
            also loved). I can move this progress bar to 100% if things are
            still this great after a year.
          </div>
        }
      />

      <TextWithProgress
        content="I want to work on challenging problems with a team that I depend on as much as they depend on me."
        progress={60}
        progressPopupContent={
          <div>
            In most of my work I get paid to do things I&apos;ve done in the
            past, but this time with fewer mistakes. It has it&apos;s pros
            (flexible hours, remote work), but one downside is I learn from and
            and rely on my peers less than I&apos;d like.
          </div>
        }
      />

      <TextWithProgress
        content="I'd like to help my team love their work as much as I do."
        progress={65}
        progressPopupContent={
          <div>
            I love building software products. But it&apos;s hard to feel the
            same joy if those around me are anxious or unhappy with their work.
            I&apos;d like to be a calming influence when things move fast, and a
            motivating influence when things move slow.
          </div>
        }
      />

      <TextWithProgress
        content="I want to feel OK, even when things go backward."
        progress={80}
        progressPopupContent={
          <div>
            <div>
              Wow what a world we live in. It seems possible that some parts of
              my life will, for reasons beyond my control, be worse in 5 years
              than now. At the least, The AI products I help create will start
              to eat my job.
            </div>
            <div className="mt-2">
              I want to be OK with this. Because, while I can influence the
              future, I&apos;ve started to realize I can&apos;t control it.
            </div>
          </div>
        }
      />

      <TextWithProgress
        content="I'm looking to solve problems that have an immediate impact on my own life"
        progress={80}
        progressPopupContent={
          <div>
            <div>
              In my 20&apos;s I worked on products that&apos;s I cared about,
              despite them solving a problem I didn&apos;t have: An important
              social media platform, which I rarely used. An amazing app, for
              the opposite gender. A company that changed peoples live&apos;s—
              on a continent I didn&apos;t grow up on.
            </div>
            <div className="mt-2">
              I loved this work, and it would be unrealistic to expect that all
              my projects will help me.
            </div>
            <div className="mt-2">
              However, I hope to work on more projects that I can use everyday.
              Like my own{" "}
              <Link
                className="text-blue-600 hover:underline"
                href="https://yaya.press"
              >
                language app, yaya.press
              </Link>{" "}
              that has taught me 3 languages, and{" "}
              <Link
                className="text-blue-600 hover:underline"
                href="https://thearcgame.com"
              >
                my own digital board game, thearcgame.com
              </Link>{" "}
              that I play monthly with friends.
            </div>
          </div>
        }
      />

      <TextWithProgress
        content="I want to keep finding moments of moderation every day."
        progress={50}
        progressPopupContent={
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
  )
}
