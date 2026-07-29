import { cn } from '@/lib/utils'

export interface HamburgerButtonProps {
  isOpen: boolean
  onClick: () => void
  className?: string
  /** id of the panel this controls, for `aria-controls`. */
  controls?: string
}

/**
 * Three-line hamburger that morphs into a close icon.
 *
 * The animation is CSS transforms on three spans rather than swapping a menu icon
 * for an X: the bars physically rotate and converge, which reads as the same
 * control changing state instead of two different buttons.
 *
 * Accessibility essentials, since this is the only navigation on mobile:
 * `aria-expanded` announces the state, `aria-controls` ties it to the panel, and
 * the touch target is 44px — the minimum comfortably hit with a thumb.
 */
export function HamburgerButton({
  isOpen,
  onClick,
  className,
  controls,
}: HamburgerButtonProps) {
  const barBase =
    'absolute left-0 h-[2px] w-full rounded-full bg-current transition-all duration-300 ease-out'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls={controls}
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      className={cn(
        'relative flex size-11 shrink-0 items-center justify-center rounded-lg',
        'focus-visible:ring-ring transition-colors focus-visible:ring-2 focus-visible:outline-none',
        'hover:bg-foreground/5',
        className,
      )}
    >
      {/* Fixed-size box so the bars have a stable origin to rotate about. */}
      <span aria-hidden="true" className="relative block h-[14px] w-[22px]">
        <span
          className={cn(
            barBase,
            // Top bar drops to the middle, then rotates 45°.
            isOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0',
          )}
        />
        <span
          className={cn(
            barBase,
            'top-1/2 -translate-y-1/2',
            // Middle bar fades out; it would otherwise show through the X.
            isOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100',
          )}
        />
        <span
          className={cn(
            barBase,
            // Bottom bar rises to the middle, then rotates the other way.
            isOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'top-full -translate-y-full',
          )}
        />
      </span>
    </button>
  )
}
