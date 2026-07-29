import type { ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'

export interface SectionProps {
  children: ReactNode
  /** Anchor id, so in-page navigation and scroll-spy can target the section. */
  id?: string
  className?: string
  /** Container class, for sections needing a different max width. */
  containerClassName?: string
  /** Alternating surface tint, to separate adjacent sections without a border. */
  tone?: 'default' | 'muted' | 'brand'
  /** Set false for a section that must render immediately, e.g. above the fold. */
  animate?: boolean
}

/**
 * Standard page section: consistent vertical rhythm, container width and a
 * scroll-reveal fade.
 *
 * The reveal uses `IntersectionObserver` via `useInView` with `triggerOnce`, so it
 * fires as the section enters the viewport and then stops observing — a scroll
 * listener recalculating positions for a dozen sections would be far more expensive.
 *
 * Motion is handled by CSS transitions rather than JavaScript animation, which means
 * the global `prefers-reduced-motion` rule in index.css disables it for free.
 */
export function Section({
  children,
  id,
  className,
  containerClassName,
  tone = 'default',
  animate = true,
}: SectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    // Start the reveal slightly before the section is fully visible, so it has
    // finished by the time the user is actually reading it.
    rootMargin: '0px 0px -80px 0px',
    threshold: 0,
    // Treat as visible immediately when animation is off, so content never hides.
    skip: !animate,
  })

  const isVisible = !animate || inView

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        'scroll-mt-[var(--header-height)] py-16 sm:py-20 lg:py-24',
        tone === 'muted' && 'bg-muted/40',
        tone === 'brand' && 'bg-brand-950 text-white',
        className,
      )}
    >
      <div
        className={cn(
          'container-page transition-all duration-700 ease-out',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}

export interface SectionHeadingProps {
  /** Small label above the title, e.g. "Our Ministries". */
  eyebrow?: string
  title: string
  description?: string
  /** Centred by default; left-aligned when a section has an adjacent column. */
  align?: 'center' | 'left'
  className?: string
  /** Heading level. Only one `h1` per page, so sections default to `h2`. */
  as?: 'h1' | 'h2' | 'h3'
}

/** Consistent section heading block. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  as: Heading = 'h2',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl',
        className,
      )}
    >
      {eyebrow && (
        <span className="text-primary text-sm font-semibold tracking-wider uppercase">
          {eyebrow}
        </span>
      )}

      <Heading className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]">
        {title}
      </Heading>

      {description && (
        <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}
