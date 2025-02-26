"use client"
import { BehaviorSubject, filter, firstValueFrom } from "rxjs"

export const analyticsLoadedSubject = new BehaviorSubject<boolean>(false)
export const getAnalyticsLoadedPromise = () =>
  firstValueFrom(analyticsLoadedSubject.pipe(filter((loaded) => loaded)))
