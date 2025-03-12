"use client"
import { ChevronDown } from "lucide-react"

import { About } from "./About"
import { AboutModeProvider } from "./AboutModeContext"
import { GeometricBg } from "./GeometricBg"
import { OverlayProvider } from "./OverlayContext"
import Resume from "./Resume"
import { buildDataContext } from "@/data/context/buildDataContext"
import { aboutData } from "@/loaders/about/aboutData"
import { ServerDataReceiverComponent } from "@/data/ServerDataReceiverComponent"
import { aboutDataFns } from "@/loaders/about/aboutDataFns"
import { UserProvider } from "@/data/context/UserContext"
import Link from "next/link"

export const [AboutContext, ProvideAboutContext] = buildDataContext(aboutData)

export const AboutPageWrapper: ServerDataReceiverComponent<
  typeof aboutDataFns
> = ({ params, _initialValues }) => {
  return (
    <ProvideAboutContext
      _initialValues={_initialValues?.aboutData}
      params={params}
    >
      <UserProvider>
        <main className="relative flex flex-col items-center">
          <AboutModeProvider>
            <div className="absolute inset-0 -z-20">
              <GeometricBg />
            </div>
            <OverlayProvider>
              <div className="flex min-h-screen flex-col">
                <div className="flex min-h-0 grow flex-col">
                  <About />
                </div>

                <Link
                  href="#resume"
                  className="flex h-8 w-full shrink-0 cursor-pointer items-start justify-center gap-2 pb-10"
                >
                  <div className="flex items-center">
                    <span className="text-xl text-gray-600">
                      Read my resumé
                    </span>
                    <ChevronDown className="h-6 w-6"></ChevronDown>
                  </div>
                </Link>
              </div>

              <div className="min-h-screen">
                <AboutModeProvider>
                  <Resume />
                </AboutModeProvider>
              </div>
            </OverlayProvider>
          </AboutModeProvider>
        </main>
      </UserProvider>
    </ProvideAboutContext>
  )
}
