import { useEffect, useState } from 'react'

export interface ScrollState {
  /** Pixels scrolled from the top. */
  y: number
  /** True once scrolled past the given threshold. */
  isScrolled: boolean
  /** Fraction of the page scrolled, 0–1. */
  progress: number
}

/**
 * Tracks vertical scroll position.
 *
 * The listener is passive and the state update is coalesced into a single
 * `requestAnimationFrame`. Without that, a scroll handler firing on every wheel
 * event triggers a React re-render per event and visibly stutters on a mid-range
 * phone — which is the whole reason this is a hook rather than an inline listener.
 *
 * @param threshold pixels after which `isScrolled` becomes true
 */
export function useScrollPosition(threshold = 24): ScrollState {
  const [state, setState] = useState<ScrollState>({ y: 0, isScrolled: false, progress: 0 })

  useEffect(() => {
    let frame = 0

    const measure = () => {
      const y = window.scrollY
      // The scrollable distance, which is zero on a page shorter than the viewport.
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0

      setState({ y, isScrolled: y > threshold, progress })
      frame = 0
    }

    const onScroll = () => {
      // Ignore further events until the queued frame runs.
      if (frame === 0) {
        frame = window.requestAnimationFrame(measure)
      }
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    // The page height changes as lazy content loads, so progress must be remeasured.
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [threshold])

  return state
}
