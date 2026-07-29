import { ArrowUpIcon } from 'lucide-react'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { cn } from '@/lib/utils'

/**
 * Floating "back to top" button, revealed after the first screen.
 *
 * Uses `scrollTo` with `behavior: 'smooth'`, which the browser automatically
 * downgrades to an instant jump when the user has `prefers-reduced-motion` set — so
 * no explicit check is needed here.
 *
 * Positioned above the mobile safe area so it does not sit under an iPhone's home
 * indicator.
 */
export function BackToTop() {
  const { isScrolled } = useScrollPosition(600)

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      // Removed from the tab order while hidden: a focusable invisible button is
      // a confusing dead stop for keyboard users.
      tabIndex={isScrolled ? 0 : -1}
      aria-hidden={!isScrolled}
      aria-label="Back to top"
      className={cn(
        'bg-primary text-primary-foreground shadow-lifted fixed right-4 z-30',
        'flex size-11 items-center justify-center rounded-full',
        'bottom-[max(1rem,env(safe-area-inset-bottom))]',
        'focus-visible:ring-ring transition-all duration-300 focus-visible:ring-2',
        'focus-visible:ring-offset-2 focus-visible:outline-none',
        'hover:bg-primary-hover hover:scale-105',
        'sm:right-6 sm:bottom-6',
        isScrolled
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <ArrowUpIcon className="size-5" aria-hidden="true" />
    </button>
  )
}
