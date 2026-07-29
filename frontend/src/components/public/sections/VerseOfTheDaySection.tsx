import { BookOpenIcon } from 'lucide-react'
import { useMemo } from 'react'
import { verseOfTheDay } from '@/config/content'

/**
 * Bible verse of the day.
 *
 * Selected by day-of-year rather than at random, so every visitor sees the same
 * verse on a given day and it does not change when a component re-renders.
 * Memoised on the date string so it is computed once per mount.
 */
export function VerseOfTheDaySection() {
  const verse = useMemo(() => verseOfTheDay(), [])
  const today = new Date()

  return (
    <section
      aria-labelledby="verse-heading"
      className="bg-brand-950 relative overflow-hidden py-16 text-white sm:py-20"
    >
      {/* Decorative glow, purely visual. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-gold-500/12 absolute -top-24 left-1/4 size-72 rounded-full blur-3xl" />
        <div className="bg-brand-400/12 absolute -bottom-24 right-1/4 size-72 rounded-full blur-3xl" />
      </div>

      <div className="container-page relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="bg-gold-500/15 text-gold-300 flex size-12 items-center justify-center rounded-xl">
            <BookOpenIcon className="size-6" aria-hidden="true" />
          </span>

          <h2
            id="verse-heading"
            className="text-gold-300 text-sm font-semibold tracking-wider uppercase"
          >
            Verse of the day
          </h2>

          <blockquote className="text-xl leading-relaxed font-medium text-balance sm:text-2xl lg:text-3xl">
            “{verse.text}”
          </blockquote>

          <cite className="text-gold-200 text-base font-semibold not-italic">
            {verse.reference}
          </cite>

          <time
            dateTime={today.toISOString().slice(0, 10)}
            className="text-xs text-white/50"
          >
            {today.toLocaleDateString(undefined, {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </div>
      </div>
    </section>
  )
}
