import type { Metadata } from "next"
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ProvideAnalytics } from "@/data/analytics/ProvideAnalytics"
import { UserProvider } from "@/data/context/UserContext"
import { Navbar } from "@/components/layout/Navbar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "All About David Gaynor",
  description: "Hi I'm David. Here's a bunch of information about me.",
  icons: {
    icon: "/no_bg_normal.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <ProvideAnalytics>
        <UserProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
          >
            <Navbar />
            {children}
          </body>
        </UserProvider>
      </ProvideAnalytics>
    </html>
  )
}
