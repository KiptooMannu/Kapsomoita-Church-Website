import { useEffect, useState } from 'react'

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** True once the target moment has passed. */
  hasPassed: boolean
}

function remaining(target: number): Countdown {
  const diff = target - Date.now()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, hasPassed: true }
  }

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    hasPassed: false,
  }
}

/**
 * Live countdown to an ISO timestamp.
 *
 * Computed from the absolute difference on every tick rather than decrementing a
 * stored value. That matters because a decrementing counter drifts whenever the tab
 * is backgrounded — browsers throttle timers in inactive tabs, so a visitor
 * returning after ten minutes would see a countdown ten minutes behind reality.
 *
 * The interval clears itself once the target passes, so a page left open on an old
 * event does not tick forever.
 *
 * @param isoDate ISO 8601 timestamp of the event
 */
export function useCountdown(isoDate: string): Countdown {
  const target = new Date(isoDate).getTime()
  const isValidDate = !Number.isNaN(target)

  const [countdown, setCountdown] = useState<Countdown>(() =>
    isValidDate ? remaining(target) : { days: 0, hours: 0, minutes: 0, seconds: 0, hasPassed: true },
  )

  useEffect(() => {
    if (!isValidDate) return

    // Recompute immediately, so a prop change is reflected without waiting a second.
    setCountdown(remaining(target))

    const timer = window.setInterval(() => {
      const next = remaining(target)
      setCountdown(next)
      if (next.hasPassed) {
        window.clearInterval(timer)
      }
    }, 1000)

    return () => window.clearInterval(timer)
  }, [target, isValidDate])

  return countdown
}
