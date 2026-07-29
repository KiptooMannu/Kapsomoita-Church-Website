import { useEffect, useState } from 'react'

/**
 * True once the page is scrolled past `threshold`.
 *
 * Split out from the progress value on purpose. The previous version returned
 * `{ y, isScrolled, progress }` from one hook, so any consumer re-rendered on
 * **every scroll frame** — roughly 60 times a second. In the header that meant
 * re-rendering the navigation and the mobile drawer continuously, and a tap on the
 * hamburger had to wait behind that work, which is exactly the lag you saw. It was
 * worst in light mode because the header also paints a `backdrop-filter`, and blur
 * is re-rasterised on each of those renders.
 *
 * This hook only changes state when the boolean actually flips — twice per scroll
 * through the threshold, not sixty times a second.
 */
export function useIsScrolled(threshold = 24): boolean {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const next = window.scrollY > threshold
      // Bail out unless the value genuinely changed. React would bail on an
      // identical value anyway, but this avoids even queueing the update.
      setIsScrolled((current) => (current === next ? current : next))
    }

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [threshold])

  return isScrolled
}

/**
 * Drives a scroll-progress indicator without re-rendering React at all.
 *
 * The ratio is written straight to a CSS custom property on the given element, so
 * the browser updates the bar on the compositor while React stays idle. Returning a
 * number here instead would reintroduce the per-frame re-render this file exists to
 * avoid.
 *
 * @param ref element whose `--scroll-progress` property is updated
 */
export function useScrollProgressVar(ref: React.RefObject<HTMLElement | null>): void {
  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const element = ref.current
      if (!element) return

      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
      element.style.setProperty('--scroll-progress', progress.toFixed(4))
    }

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    // The document grows as lazy content loads, so the ratio must be remeasured.
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [ref])
}
