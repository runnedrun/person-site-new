"use client"

import { AboutModeProvider } from "@/components/shared/AboutModeContext"
import Resume from "@/components/shared/Resume"
import { About } from "../components/shared/About"
import { ChevronDown } from "lucide-react"
import { OverlayProvider } from "@/components/shared/OverlayContext"
import { GeometricBg } from "@/components/shared/GeometricBg"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  return (
    <main className="relative flex flex-col items-center">
      <AboutModeProvider>
        <div className="absolute inset-0 -z-20">
          <GeometricBg />
        </div>
        <OverlayProvider>
          <div className="flex min-h-screen flex-col p-2">
            <div className="flex min-h-0 grow flex-col">
              <About />
            </div>

            <div
              className="flex h-8 w-full shrink-0 cursor-pointer items-start justify-center gap-2"
              onClick={() => router.push("#resume")}
            >
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-600">
                  Read my resumé
                </span>
                <ChevronDown className="h-6 w-6"></ChevronDown>
              </div>
            </div>
          </div>

          <div className="min-h-screen">
            <AboutModeProvider>
              <Resume />
            </AboutModeProvider>
          </div>
        </OverlayProvider>
      </AboutModeProvider>
    </main>
  )
}
