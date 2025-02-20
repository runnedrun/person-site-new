import { isNull } from "lodash"
import { useEffect, useState } from "react"
import { Observable } from "rxjs"

/**
 * Custom React hook that subscribes to an RxJS Observable and returns its latest value
 * @template DataType - The type of data emitted by the Observable
 * @param {Observable<DataType>} observable - The RxJS Observable to subscribe to
 * @param {unknown[]} [deps] - Optional dependency array for controlling subscription lifecycle
 * @returns {DataType | null} The latest value emitted by the Observable, or null if no value has been emitted
 */
export const useObs = <DataType extends unknown>(
  observable: Observable<DataType> | null,
  deps: unknown[]
) => {
  // Store the latest emitted value, initially null
  const [value, setValue] = useState<DataType | null>(null)

  const depsToUse = deps || []

  useEffect(() => {
    if (isNull(observable)) {
      return
    }
    // Subscribe to the observable and update state when new values arrive
    const subscription = observable.subscribe((newValue) => {
      setValue(newValue)
    })

    // Cleanup: unsubscribe when the component unmounts or deps change
    return () => subscription.unsubscribe()
  }, [...depsToUse, isNull(observable)]) // Use provided deps or empty array for mount-only subscription

  return value
}
