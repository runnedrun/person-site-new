"use client"

import { AboutModeProvider } from "@/components/shared/AboutModeContext"
import Resume from "@/components/shared/Resume"
import { About } from "../components/shared/About"
import { ChevronDown } from "lucide-react"

export default function Home() {
  return (
    <main className="relative flex flex-col items-center">
      <div className="flex min-h-svh flex-col p-2">
        <div className="grow">
          <AboutModeProvider>
            <About />
          </AboutModeProvider>
        </div>

        <div className="flex w-full shrink-0 items-center justify-center gap-2">
          <span className="mb-1 text-lg font-semibold">Resumé</span>
          <ChevronDown className="h-6 w-6"></ChevronDown>
        </div>
      </div>

      <div className="min-h-screen">
        <Resume />
      </div>
    </main>
  )
}
