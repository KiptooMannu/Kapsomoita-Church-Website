import { ChevronLeftIcon, ChevronRightIcon, QuoteIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Section, SectionHeading } from '@/components/public/Section'
import { testimonials } from '@/config/content'
import { cn } from '@/lib/utils'

const AUTOPLAY_MS = 7000

/**
 * Testimonial carousel.
 *
 * Accessibility decisions that matter more than the animation:
 *
 * - Autoplay pauses on hover *and* on keyboard focus, so a keyboard user reading a
 *   quote does not have it slide away mid-sentence.
 * - Autoplay is disabled entirely under `prefers-reduced-motion`.
 * - The slide container is a labelled group with `aria-live="off"`, so changing
 *   slides does not interrupt a screen reader; the previous/next buttons and dots
 *   provide explicit control instead.
 */
export function TestimonialsSection() {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const count = testimonials.length

  const goTo = useCallback(
    (next: number) => {
      // Wrap in both directions so the arrows never dead-end.
      setIndex(((next % count) + count) % count)
    },
    [count],
  )

  useEffect(() => {
    if (isPaused || count <= 1) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [isPaused, count])

  if (count === 0) {
    return null
  }

  return (
    <Section id="testimonials" tone="muted">
      <SectionHeading
        eyebrow="Voices"
        title="Stories from our church family"
        description="What people say about finding a home here."
      />

      <div
        className="relative mx-auto mt-12 max-w-3xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
        role="group"
        aria-roledescription="carousel"
        aria-label="Testimonials"
      >
        {/* Sliding track. Transform rather than re-mounting, so the transition is
            GPU-composited and the DOM stays stable for assistive tech. */}
        <div className="overflow-hidden rounded-xl">
          <ul
            aria-live="off"
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {testimonials.map((testimonial, slideIndex) => (
              <li
                key={testimonial.id}
                className="w-full shrink-0 px-1"
                aria-hidden={slideIndex !== index}
              >
                <Card className="py-8">
                  <CardContent className="flex flex-col items-center gap-5 text-center">
                    <QuoteIcon className="text-gold-500 size-8" aria-hidden="true" />

                    <blockquote className="text-lg leading-relaxed text-balance sm:text-xl">
                      “{testimonial.quote}”
                    </blockquote>

                    <footer className="flex flex-col gap-0.5">
                      <cite className="text-base font-semibold not-italic">
                        {testimonial.name}
                      </cite>
                      <span className="text-muted-foreground text-sm">{testimonial.role}</span>
                    </footer>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>

        {count > 1 && (
          <>
            {/* Arrows sit outside the card on wide screens and overlay it on
                narrow ones, where there is no room beside it. */}
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous testimonial"
              className={cn(
                'bg-card border-border shadow-soft absolute top-1/2 left-0 flex size-10',
                '-translate-y-1/2 items-center justify-center rounded-full border',
                'focus-visible:ring-ring transition-colors hover:bg-secondary',
                'focus-visible:ring-2 focus-visible:outline-none',
                'sm:-left-5',
              )}
            >
              <ChevronLeftIcon className="size-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next testimonial"
              className={cn(
                'bg-card border-border shadow-soft absolute top-1/2 right-0 flex size-10',
                '-translate-y-1/2 items-center justify-center rounded-full border',
                'focus-visible:ring-ring transition-colors hover:bg-secondary',
                'focus-visible:ring-2 focus-visible:outline-none',
                'sm:-right-5',
              )}
            >
              <ChevronRightIcon className="size-5" aria-hidden="true" />
            </button>

            <div className="mt-6 flex justify-center gap-1">
              {testimonials.map((testimonial, dotIndex) => (
                <button
                  key={testimonial.id}
                  type="button"
                  onClick={() => goTo(dotIndex)}
                  aria-label={`Show testimonial ${dotIndex + 1} of ${count}`}
                  aria-current={dotIndex === index}
                  className="focus-visible:ring-ring grid size-11 place-items-center rounded-full focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      'block h-1.5 rounded-full transition-all duration-300',
                      dotIndex === index ? 'bg-primary w-6' : 'bg-border w-1.5',
                    )}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </Section>
  )
}
