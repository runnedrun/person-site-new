import { Observable, of } from "rxjs"

import { isObservable } from "rxjs"

export const orObs = <T extends unknown>(i: T | Observable<T>) => {
  if (isObservable(i)) {
    return i
  } else {
    return of(i)
  }
}
