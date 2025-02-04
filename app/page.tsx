import { AboutModeProvider } from "@/components/shared/AboutModeContext"
import { GeometricBg } from "@/components/shared/GeometricBg"
import { OverlayProvider } from "@/components/shared/OverlayContext"
import Resume from "@/components/shared/Resume"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { About } from "../components/shared/About"

export default function Home() {
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

            <Link
              href="#resume"
              className="flex h-8 w-full shrink-0 cursor-pointer items-start justify-center gap-2"
            >
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-600">
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
  )
}

export async function generateMetadata() {
  return {
    title: "All About David Gaynor",
    description:
      "Hi I'm David. Here's a bunch of information about me— free of charge!",
  }
}
