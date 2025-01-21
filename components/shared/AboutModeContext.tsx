
import { createContext, useContext, useState, ReactNode } from 'react'

interface AboutModeContextType {
  aspirationalMode: boolean
  setAspirationalMode: (value: boolean) => void
}

const AboutModeContext = createContext<AboutModeContextType | undefined>(undefined)

export function AboutModeProvider({ children }: { children: ReactNode }) {
  const [aspirationalMode, setAspirationalMode] = useState(false)

  return (
    <AboutModeContext.Provider value={{ aspirationalMode, setAspirationalMode }}>
      {children}
    </AboutModeContext.Provider>
  )
}

export function useAboutMode() {
  const context = useContext(AboutModeContext)
  if (context === undefined) {
    throw new Error('useAboutMode must be used within an AboutModeProvider')
  }
  return context
}