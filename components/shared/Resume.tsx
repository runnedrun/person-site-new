"use client"

import Link from "next/link"
import Image from "next/image"
import ExperienceItem from "./ExperienceItem"
import ExperienceGroup from "./ExperienceGroup"
import { useEffect } from "react"
import { AboutPopupTrigger } from "./AboutPopupTrigger"

export default function Portfolio() {
  useEffect(() => {
    // Check if URL has #resume anchor
    if (window.location.hash === "#resume") {
      // Get the resume element
      const element = document.getElementById("resume")
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [])
  return (
    <div className="mx-auto max-w-7xl px-4 py-4 print:p-0" id="resume">
      <div className="mb-4 flex w-full justify-center">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col print:text-sm">
            <div className="flex gap-1">
              <div className="font-bold">David Gaynor,</div>
              <a href="mailto:runnedrun@gmail.com" className="hover:underline">
                runnedrun@gmail.com
              </a>
            </div>
            <a
              href="https://freedavid.info"
              className="hidden hover:underline print:block"
              target="_blank"
            >
              freedavid.info
            </a>

            <div>Gothenburg, Sweden</div>
          </div>
          <div className="text-md max-w-[800px] pb-4 text-lg print:text-base">
            <div>
              I started my career at Twitter then went on to launch a few
              companies by myself and with others.
            </div>
            <div>
              {" "}
              My work tends to be:{" "}
              <AboutPopupTrigger popupContent="I built the first real-time messaging experience on Twitter. I built a live meditation studio that served classes with 20K+ users. I built a living coding classroom that let remote teachers do hands on classes with students around the world. I built a live, collaborative document editor for language learners. Honestly, I think I like this stuff because I like debugging and iterating with users in real time.">
                real-time
              </AboutPopupTrigger>
              ,{" "}
              <AboutPopupTrigger popupContent="My favorite projects have all started off as something small for myself, then grown one person at a time. This is not the only way to build software, and I've tried other approaches, including raising money and building something for a big market I've never met. I just don't like the balance of risk/return that gives.">
                iterative
              </AboutPopupTrigger>
              , and{" "}
              <AboutPopupTrigger popupContent="I've seen my own and other's companies fail because we got distracted by projects that were enjoyable, great for learning, cool or some combination of the above. I love working on those projects— but when my goal involves money, I'm strict about making sure every task is tied to a business outcome.">
                business value driven
              </AboutPopupTrigger>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <ExperienceGroup title="Building Businesses">
          <ExperienceItem
            logo="/personal-logo.png"
            title="Consulting"
            popupContent={
              <div>
                A few of my current clients:{" "}
                <a
                  className="text-blue-600 hover:underline"
                  href="https://www.asha.io/"
                >
                  Asha
                </a>
                ,{" "}
                <a
                  className="text-blue-600 hover:underline"
                  href="https://oscar.ai"
                >
                  Oscar AI
                </a>
              </div>
            }
            period="2020 - Present"
            role="Early Stage Startup Advising"
            description="I help early stage businesses discover and deliver high value tech products."
            className="translate-y-5 scale-[1.75]"
          />
          <ExperienceItem
            logo="/andela-logo.png"
            title="Andela"
            link="http://andela.com"
            period="2019 - 2020"
            role="Director of Product"
            description="Led a 16 person team building tech to measure and facilitate engineering services."
          />
          <ExperienceItem
            logo="/classadoo-logo-no-text.png"
            title="Classadoo"
            popupContent="Our software was integrated into Andela's platform, and is no longer publicly available. Sad."
            period="2017 - 2019"
            role="Founder, CEO"
            description="Tech powered Web Development classes accross the US, China and Pakistan. Acquired by Andela in 2018."
            className="-translate-y-5 scale-[.75]"
          />
          <ExperienceItem
            logo="/launch-camp-logo.svg"
            title="Launch"
            link="http://launchstudio.org"
            period="2015 - 2017"
            role="Founder, CEO"
            className="-translate-y-3 scale-[.8]"
            description={
              <div>
                Entrepreneurship Summer camp and after school program, now run
                as <a href="http://launchstudio.org">Launch Studio</a> across
                the SF bay area.
              </div>
            }
          />
        </ExperienceGroup>

        <ExperienceGroup title="Building Software">
          <ExperienceItem
            logo="/hylite-logo.png"
            title="Hylite"
            link="https://hylitepeople.com"
            period="2021 - Present"
            role="Fractional CTO"
            description="Ran engineering for Hylite as they grew from $0 to their first 6 figure contract."
          />
          <ExperienceItem
            logoText="O p  e   n"
            title="Open"
            className="w-24 -translate-x-6"
            link="https://hylitepeople.com"
            period="2020 - Present"
            role="Advisor/Principal Engineer"
            description="Built a digital meditation studio for real time classes. Helped unlock $7M in funding."
          />
          <ExperienceItem
            logo="/dipsea-logo.png"
            title="Dipsea"
            className="translate-y-4 scale-[1.75]"
            link="http://dipseastories.com"
            period="2018 - 2024"
            role="Technical Advisor"
            description="Launched Dipsea's first iOS app. Acquired by Revenue Cat in 2024."
          />
          <ExperienceItem
            logo="/twitter-logo.png"
            title="Twitter"
            link="https://x.com"
            period="2012 - 2015"
            role="Software Engineer"
            description="Worked on 3 teams. Built the first version of group messaging."
          />
        </ExperienceGroup>
      </div>
      {/* side projects */}

      <div className="mt-8 flex w-full flex-wrap items-center gap-4 print:justify-center print:text-xs">
        <div className="text-lg font-bold print:text-sm">
          Active side projects:
        </div>
        <div className="flex gap-2">
          <a
            href="https://yaya.press"
            className="w-36 shrink-0 text-blue-600 hover:underline md:w-auto"
          >
            Yaya.press
          </a>
          <div className="shrink"> Google Docs for language learners.</div>
        </div>
        <div className="flex gap-2">
          <a
            href="https://thearcgame.com"
            className="w-36 shrink-0 text-blue-600 hover:underline md:w-auto"
          >
            TheArcGame.com
          </a>
          <div>Control the arc of history.</div>
        </div>
        <div className="flex gap-2">
          <a
            href="https://curtaincall.me"
            className="w-36 shrink-0 text-blue-600 hover:underline md:w-auto"
          >
            Curtaincall.me
          </a>
          <div>Immersive theatre tool.</div>
        </div>
      </div>

      {/* Education Section */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-4">
            <Image
              src="/olin-logo.jpeg"
              alt="Olin Logo"
              width={60}
              height={60}
              className="rounded-full"
            />
            <h2 className="max-w-44 shrink text-2xl font-bold md:max-w-full print:text-base">
              <a
                href="https://olin.edu"
                className="hover:text-blue-600 hover:underline"
              >
                Olin College of Engineering
              </a>
            </h2>
          </div>
        </div>
        <div className="mx-auto max-w-4xl text-center print:text-xs">
          <div className="mb-4">
            Student, Teacher, Participant.{" "}
            <AboutPopupTrigger popupContent="Olin College was, at that time, 100% tuition free for all admitted students. In my year they enrolled 86 students out of over 1000 applicants.">
              Full scholarship
            </AboutPopupTrigger>
            . Designed and taught 7 courses. including{" "}
            <Link
              href="https://olinjs.github.com/olinjs.github.s13"
              className="text-blue-600 hover:underline"
            >
              Olin&apos;s first credited, student taught course
            </Link>
            . Graduated in 2013 with a degree in Engineering and Robotics, GPA
            of 3.74.
          </div>
        </div>
      </div>
    </div>
  )
}
