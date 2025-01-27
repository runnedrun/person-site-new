"use client"

import { AboutModeProvider } from "@/components/shared/AboutModeContext"
import Resume from "@/components/shared/Resume"
import { About } from "../components/shared/About"
import { ChevronDown } from "lucide-react"
import { OverlayProvider } from "@/components/shared/OverlayContext"

export default function Home() {
  return (
    <main className="relative flex flex-col items-center">
      <OverlayProvider>
        <div className="flex h-screen flex-col p-2">
          <div className="flex min-h-0 grow flex-col">
            <AboutModeProvider>
              <About />
            </AboutModeProvider>
          </div>

          <div className="flex h-8 w-full shrink-0 items-start justify-center gap-2">
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-600">
                Read my resumé
              </span>
              <ChevronDown className="h-6 w-6"></ChevronDown>
            </div>
          </div>
        </div>

        <div className="min-h-screen">
          <Resume />
        </div>
      </OverlayProvider>
    </main>
  )
}
