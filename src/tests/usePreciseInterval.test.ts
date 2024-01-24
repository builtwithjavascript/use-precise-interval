import { usePreciseInterval } from '@/use-precise-interval/'
import { describe, expect, it, vi, beforeEach } from 'vitest'

describe('usePreciseInterval', () => {
  let callback: ReturnType<typeof vi.fn>
  let mockRAF: ReturnType<typeof vi.fn>

  beforeEach(() => {
    callback = vi.fn()
    let isCanceled = false // Control flag

    mockRAF = vi.fn((cb) => {
      setTimeout(() => {
        if (!isCanceled) cb(Date.now())
      }, 16) // 16ms delay
      return 0
    })

    global.requestAnimationFrame = mockRAF as unknown as typeof requestAnimationFrame
    global.cancelAnimationFrame = vi.fn(() => {
      isCanceled = true // Set the flag when canceled
    })
    vi.useFakeTimers()
  })

  /**
   * @name "Cancels the Interval Correctly"
   * @description
   * This test verifies the functionality of the usePreciseInterval hook to ensure
   * that it correctly cancels a set interval. The goal is to confirm that once
   * an interval is canceled, the callback function associated with that interval
   * is not called again, regardless of any additional time that passes.
   *
   * Test Steps
   *     1. Interval Setup: An interval is set up using usePreciseInterval with a specified callback
   *        function and interval duration (1000 milliseconds in this case).
   *     2. First Callback Invocation: The test advances the fake timers by 1000 milliseconds plus
   *        an additional 16 milliseconds to account for the delay introduced in mockRAF. This advancement is expected to trigger the first invocation of the callback.
   *     3. Interval Cancellation: Immediately after the first callback invocation, the interval
   *        is canceled using the cancellation function returned by usePreciseInterval.
   *     4. Further Timer Advancement: The fake timers are then advanced by
   *        an additional 2000 milliseconds to simulate more time passing.
   *     5. Assertion: The test asserts that the callback function has been called only once.
   *        This assertion confirms that the interval was successfully canceled after its first
   *        invocation and that no further invocations of the callback occurred despite the
   *        additional time passing.
   *
   * Explanation
   *      Testing Cancellation Logic:
   *      The key aspect of this test is to ensure that the cancellation logic within
   *      the usePreciseInterval hook is functioning as expected.
   *
   *      Simulating Asynchronous Behavior:
   *      The use of vi.useFakeTimers() and the delay in mockRAF simulate the asynchronous
   *      nature of requestAnimationFrame and ensure the test environment closely mimics
   *      real-world conditions.
   *
   *      Verification of Interval Cancellation:
   *      By checking the number of times the callback is invoked after cancellation,
   *      the test verifies the effectiveness of the interval cancellation mechanism in the hook.
   *      This test is crucial for ensuring the reliability of the usePreciseInterval hook,
   *      particularly in scenarios where dynamic cancellation of intervals is required.
   */
  it('cancels the interval correctly', () => {
    const cancel = usePreciseInterval(callback, 1000)

    // Advance timers to ensure the first callback is invoked
    vi.advanceTimersByTime(1000 + 16) // 1000ms for the interval + 16ms delay
    expect(callback).toHaveBeenCalledTimes(1) // First call should have happened

    // Cancel the interval
    cancel()

    // Advance timers to check if the interval is properly canceled
    vi.advanceTimersByTime(2000) // Additional time to check cancellation

    // Expect the callback to be called only once due to cancellation
    expect(callback).toHaveBeenCalledTimes(1)
  })

  /**
   * @name "Never calls the callback if the interval is canceled immediately"
   * @description
   * This test will ensure that if the interval is canceled immediately after being set,
   * the callback is never called.
   *
   * Explanation:
   *     - This test checks the scenario where an interval is set but canceled immediately.
   *     - We expect that the callback should never be called, as the interval is canceled
   *       before any time has passed.
   */
  it('Never calls the callback if the interval is canceled immediately', () => {
    const cancel = usePreciseInterval(callback, 1000)

    // Cancel the interval immediately
    cancel()

    // Advance timers by a significant amount
    vi.advanceTimersByTime(2000)

    // Expect the callback to never be called
    expect(callback).toHaveBeenCalledTimes(0)
  })

  /**
   * @name "Rapid Succession of Setting and Canceling Intervals"
   * @description
   * This test will check the hook's behavior when intervals are rapidly set
   * and canceled in succession, which can happen in dynamic scenarios.
   *
   * Explanation
   *     - This test simulates rapidly setting and canceling intervals,
   *       which could happen in a user interface with rapidly changing states.
   *     - The expectation is that the callback should not be called,
   *       as both intervals are canceled before the callback has a chance to execute.
   */
  it('handles rapid succession of setting and canceling intervals', () => {
    const cancelFirst = usePreciseInterval(callback, 1000)
    const cancelSecond = usePreciseInterval(callback, 1000)

    // Cancel the first interval
    cancelFirst()

    // Advance timers slightly
    vi.advanceTimersByTime(500)

    // Cancel the second interval
    cancelSecond()

    // Advance timers past the point where the callback would have been called
    vi.advanceTimersByTime(1500)

    // Expect the callback to never be called
    expect(callback).toHaveBeenCalledTimes(0)
  })
})
