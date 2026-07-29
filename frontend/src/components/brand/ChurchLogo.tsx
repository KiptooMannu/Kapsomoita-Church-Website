import { cn } from '@/lib/utils'

export interface ChurchLogoProps {
  className?: string
  /** Pixel size of the square mark. */
  size?: number
  /** Renders the mark on a filled brand tile, for use on light surfaces. */
  variant?: 'plain' | 'tile'
}

/**
 * The church mark: a stylised chapel with a cross and an open door.
 *
 * Inline SVG rather than an image file, deliberately:
 *
 * - The previous `public/AGC-logo.png` was a **0-byte file**, so the logo and the
 *   favicon were both broken. An inline mark cannot 404 or arrive empty.
 * - It costs no network request and stays crisp at every size and pixel density.
 * - It inherits `currentColor`, so it works in light and dark mode without a
 *   second asset.
 *
 * Replace the paths here if the church has an official logo — or swap this
 * component's body for an `<img>` pointing at a real file once one exists.
 */
export function ChurchLogo({ className, size = 40, variant = 'plain' }: ChurchLogoProps) {
  const mark = (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      // Decorative: the accessible name comes from the adjacent wordmark, so
      // announcing this too would read the church's name twice.
      aria-hidden="true"
      focusable="false"
      className={cn('shrink-0', variant === 'plain' && className)}
    >
      {/* Cross above the roof */}
      <path
        d="M24 3v10M20 7h8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Roof */}
      <path
        d="M24 13 8 25v2h32v-2L24 13Z"
        fill="currentColor"
        fillOpacity="0.9"
      />

      {/* Building body */}
      <path
        d="M11 27h26v16a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1V27Z"
        fill="currentColor"
        fillOpacity="0.65"
      />

      {/* Arched doorway, cut out so the surface shows through */}
      <path
        d="M24 31a5 5 0 0 0-5 5v8h10v-8a5 5 0 0 0-5-5Z"
        fill="currentColor"
        fillOpacity="0.25"
      />

      {/* Windows either side of the door */}
      <circle cx="15.5" cy="34" r="1.75" fill="currentColor" fillOpacity="0.3" />
      <circle cx="32.5" cy="34" r="1.75" fill="currentColor" fillOpacity="0.3" />
    </svg>
  )

  if (variant === 'tile') {
    return (
      <span
        className={cn(
          'bg-primary text-primary-foreground flex items-center justify-center rounded-xl',
          className,
        )}
        style={{ width: size, height: size }}
      >
        {/* Inset so the mark does not touch the tile edge. */}
        <span className="scale-[0.72]">{mark}</span>
      </span>
    )
  }

  return mark
}

export interface ChurchWordmarkProps {
  className?: string
  /** Name shown on the first line. */
  name: string
  /** Optional second line. */
  tagline?: string
  /** Hides the tagline below this breakpoint, where space is tight. */
  hideTaglineBelow?: 'sm' | 'md' | 'never'
  /** Inverts colours for use over a dark hero. */
  onDark?: boolean
}

/** The church name beside the mark. Carries the accessible name for the pair. */
export function ChurchWordmark({
  className,
  name,
  tagline,
  hideTaglineBelow = 'sm',
  onDark = false,
}: ChurchWordmarkProps) {
  return (
    <span className={cn('flex flex-col leading-tight', className)}>
      <span
        className={cn(
          'text-base font-bold tracking-tight transition-colors sm:text-lg',
          onDark ? 'text-white' : 'text-foreground',
        )}
      >
        {name}
      </span>

      {tagline && (
        <span
          className={cn(
            'text-xs transition-colors',
            hideTaglineBelow === 'sm' && 'hidden sm:block',
            hideTaglineBelow === 'md' && 'hidden md:block',
            onDark ? 'text-white/70' : 'text-muted-foreground',
          )}
        >
          {tagline}
        </span>
      )}
    </span>
  )
}
