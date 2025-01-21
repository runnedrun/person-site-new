'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FutureToggle } from '@/components/shared/FutureToggle'
import { AboutSection } from '@/components/shared/AboutSection'
import { AboutModeProvider } from '@/components/shared/AboutModeContext'

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-96 flex flex-col items-center gap-6">
        {/* Profile Picture */}
        <div className="relative w-48 h-48 rounded-full overflow-hidden">
          <Image
            src="/normal-prof-pic.jpg"
            alt="Profile Picture"
            fill
            className="object-cover"
          />
        </div>

        {/* Contact Links */}
        <div className="flex flex-col items-center gap-2 text-sm">
          <Link href="https://github.com/runnedrun" className="hover:underline">
            github.com/runnedrun
          </Link>
          <Link href="mailto:runnedrun@gmail.com" className="hover:underline">
            runnedrun@gmail.com
          </Link>
          <Link href="https://www.linkedin.com/in/runnedrun/" className="hover:underline">
            linkedin.com/in/runnedrun
          </Link>
        </div>

        {/* Mode Toggle and Sections */}
        <AboutModeProvider>
          <FutureToggle />
          
          <div className="w-full flex flex-col gap-4">
            <AboutSection 
              nowContent={<p>I&apos;m currently working as a software engineer.</p>}
              aspirationalContent={<p>I aim to lead engineering teams building impactful products.</p>}
            />
            <AboutSection 
              nowContent={<p>I specialize in React and TypeScript development.</p>}
              aspirationalContent={<p>I want to master system architecture and team leadership.</p>}
            />
            <AboutSection 
              nowContent={<p>I contribute to open source projects regularly.</p>}
              aspirationalContent={<p>I plan to create my own widely-used open source framework.</p>}
            />
            <AboutSection 
              nowContent={<p>I enjoy solving complex frontend challenges.</p>}
              aspirationalContent={<p>I want to tackle full-stack distributed systems.</p>}
            />
            <AboutSection 
              nowContent={<p>I mentor junior developers in my spare time.</p>}
              aspirationalContent={<p>I aim to build and lead high-performing engineering teams.</p>}
            />
          </div>
        </AboutModeProvider>
      </div>
    </main>
  );
}
