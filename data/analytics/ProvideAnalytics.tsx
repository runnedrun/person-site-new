"use client"

import Script from "next/script"
import React, { useEffect } from "react"

import { logEvent, setCurrentScreen, setLogContext } from "./logEvent"
import { usePathname, useSearchParams } from "next/navigation"
import { analyticsLoadedSubject } from "./analyticsLoadedSubject"

const screenNameMatchers = [
  {
    regex: /^\/about$/,
    screenName: "about",
  },
]

const getFallbackScreenName = (pathname: string) => {
  return encodeURIComponent(`${pathname.split("/").slice(1).join("_")}`)
}

const getScreenName = (pathname: string) => {
  const matchedMatcher = screenNameMatchers.find((matcher) =>
    matcher.regex.test(pathname)
  )
  return matchedMatcher?.screenName || getFallbackScreenName(pathname)
}

export const ProvideAnalytics = ({
  children,
}: React.PropsWithChildren<object>) => {
  const pathname = usePathname()

  useEffect(() => {
    setCurrentScreen(getScreenName(pathname))
    logEvent("page_view")
  }, [pathname])

  return (
    <>
      <Script
        src="https://square-boat-42ee.runnedrun.workers.dev/static/files/pa.js"
        id="pianjs"
        data-code="8ihEjBo5W0mDaIRLspl2eNDvDiYMBesq"
        data-hit-endpoint="https://square-boat-42ee.runnedrun.workers.dev/p/pv"
        data-event-endpoint="https://square-boat-42ee.runnedrun.workers.dev/p/e"
        data-session-endpoint="https://square-boat-42ee.runnedrun.workers.dev/p/s"
        data-dev={"freedavid.info"}
        onLoad={() => {
          analyticsLoadedSubject.next(true)
        }}
      ></Script>
      {children}
    </>
  )
}
