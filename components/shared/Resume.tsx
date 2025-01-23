import Link from "next/link"
import Image from "next/image"
import ExperienceItem from "./ExperienceItem"
import ExperienceGroup from "./ExperienceGroup"
import ResearchItem from "./ResearchItem"

export default function Portfolio() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Main Experience Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        <ExperienceGroup title="Building Businesses">
          <ExperienceItem
            logo="/classadoo-logo-no-text.png"
            title="Consulting"
            link="http://classadoo.com"
            period="2020-Present"
            role="Early Stage Startup Advising"
            description="I help early stage businesses discover and deliver high value tech products."
          />
          <ExperienceItem
            logo="/andela-logo.png"
            title="Andela"
            link="http://andela.com"
            period="2019 - 2020"
            role="Director of Product"
            description="Led a team of 4 PMs and 12 engineers building tech to measure and facilitate engineering services."
          />
        </ExperienceGroup>

        <ExperienceGroup title="Building Software">
          <ExperienceItem
            logoText="O p  e   n"
            title="Open"
            link="http://o-p-e-n.com"
            period="2020-Present"
            role="Advisor/Principal Engineer"
            description="Helped unlock $7M in funding for online meditation classes."
          />
          <ExperienceItem
            logo="/dipsea-logo.png"
            title="Dipsea"
            link="http://dipseastories.com"
            period="2018-Present"
            role="Technical Advisor"
            description="Helped Dipsea launch their first iOS app. $0 to $12M in funding in 3 years."
          />
        </ExperienceGroup>
      </div>

      {/* Education Section */}
      <div className="mt-16">
        <div className="mb-6 flex items-center justify-center gap-4">
          <Image
            src="/olin-logo.png"
            alt="Olin Logo"
            width={60}
            height={60}
            className="rounded-full"
          />
          <h2 className="text-2xl font-bold">Olin College of Engineering</h2>
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4">
            Student, Teacher, Participant. Designed and taught 7 courses
            including{" "}
            <Link
              href="https://olinjs.github.com/olinjs.github.s13"
              className="text-blue-600 hover:underline"
            >
              Olin&apos;s first credited, student taught course
            </Link>
            .
          </p>
          <p className="text-gray-600">
            Graduated in 2013 with a degree in Engineering and Robotics, GPA of
            3.74.
          </p>
        </div>

        {/* Research Section */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <ResearchItem
            title="Research in Applied Physiology"
            period="2012-2013"
            description="Designed and built an experiment measuring the effect of ambient temperature on sleep."
          />
          <ResearchItem
            title="Research in Drones"
            period="2012-2013"
            description="Designed and built an autonomous drone for AGCO, to detect crop health."
          />
          <ResearchItem
            title="Research in Robotic Sailing"
            period="2013"
            description="Designed and built a Sailbot starter kit for high and middle school aged children."
          />
        </div>
      </div>
    </div>
  )
}
