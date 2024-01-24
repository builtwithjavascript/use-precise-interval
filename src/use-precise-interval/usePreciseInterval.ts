// file: src/use-precise-interval/usePreciseInterval.ts

export type TCancelFunction = () => void

/**
 * @name usePreciseInterval
 * @description
 * Hopefully a more accurate version of setInterval that runs without drifting.
 * @param callback the function to invoke at each interval
 * @param interval in milliseconds
 * @returns a reference to a function to cancel
 */
export const usePreciseInterval = (callback: () => void, interval: number): TCancelFunction => {
  let _lastUpdateTime = Date.now()
  let _frameId: number | undefined = undefined

  const update = () => {
    const now = Date.now()
    const elapsed = now - _lastUpdateTime

    if (elapsed >= interval) {
      _lastUpdateTime = now - (elapsed % interval)
      callback()
    }

    _frameId = requestAnimationFrame(update)
  }

  _frameId = requestAnimationFrame(update)

  return () => {
    if (_frameId !== undefined && _frameId !== null) {
      cancelAnimationFrame(_frameId as any)
      _frameId = undefined
    }
  }
}
