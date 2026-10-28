import type { ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'

export interface RevealProps {
  children: ReactNode
  className?: string
  /** Stagger, in milliseconds, once the element has entered. */
  delay?: number
}

/**
 * Fade-and-rise for a single element as it enters the viewport.
 *
 * The observer fires once. Replaying the fade every time a card crosses the
 * edge hides text the reader is still looking at, so scroll-out is reserved
 * for imagery (the hero) rather than copy.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
    rootMargin: '0px 0px -48px 0px',
  })

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out motion-reduce:transition-none',
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
