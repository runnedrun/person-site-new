"use client"

import { AboutModeProvider } from "@/components/shared/AboutModeContext"
import { About } from "../components/shared/About"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <AboutModeProvider>
        <About />
      </AboutModeProvider>
    </main>
  )
}
