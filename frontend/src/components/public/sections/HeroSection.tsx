import { ArrowRightIcon, HeartHandshakeIcon, PlayCircleIcon, PhoneIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CloudinaryImage } from '@/components/media/CloudinaryImage'
import { resolveImage, type ImageKey } from '@/config/images'
import { site } from '@/config/site'
import { cn } from '@/lib/utils'

/**
 * Rotating hero backdrops.
 *
 * Sourced through `config/images.ts`, so changing a hero photograph is a one-line
 * edit in that file — paste any Unsplash (or other) URL — with no change here.
 */
const SLIDE_KEYS: readonly ImageKey[] = ['hero1', 'hero2', 'hero3', 'hero4', 'hero5']

const SLIDE_INTERVAL_MS = 6500

/** Phrases cycled in the headline. */
const ROTATING_WORDS = ['Welcome home.', 'Come as you are.', 'Grow in faith.'] as const

/**
 * Full-screen homepage hero.
 *
 * Three details worth noting:
 *
 * 1. **Only the first slide is `priority`.** It is the largest contentful paint, so
 *    it loads eagerly; the rest are lazy. Marking all five eager would have them
 *    compete for bandwidth and delay the one the visitor actually sees.
 * 2. **Rotation stops for reduced-motion users.** An auto-advancing backdrop is
 *    exactly the kind of motion that setting asks to suppress.
 * 3. **The overlay is a gradient, not a flat tint.** It is darkest behind the text
 *    and clears toward the top, so the headline holds contrast on every slide
 *    without washing the photograph out.
 */
export function HeroSection() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    // Respect the OS setting: no automatic rotation when reduced motion is asked for.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const slideTimer = window.setInterval(
      () => setSlideIndex((current) => (current + 1) % SLIDE_KEYS.length),
      SLIDE_INTERVAL_MS,
    )
    const wordTimer = window.setInterval(
      () => setWordIndex((current) => (current + 1) % ROTATING_WORDS.length),
      3200,
    )

    return () => {
      window.clearInterval(slideTimer)
      window.clearInterval(wordTimer)
    }
  }, [])

  return (
    <section
      id="home"
      aria-label="Welcome"
      // dvh rather than vh: on mobile Safari, vh includes the collapsing URL bar,
      // which makes the hero taller than the visible viewport.
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      {/* --- Rotating backdrop ------------------------------------------- */}
      <div aria-hidden="true" className="absolute inset-0">
        {SLIDE_KEYS.map((key, index) => {
          const image = resolveImage(key)
          return (
            <div
              key={key}
              className={cn(
                'absolute inset-0 transition-opacity duration-1000 ease-in-out',
                index === slideIndex ? 'opacity-100' : 'opacity-0',
              )}
            >
              <CloudinaryImage
                publicId={image.publicId}
                fallbackSrc={image.fallbackSrc}
                alt=""
                width={2560}
                sizes="100vw"
                priority={index === 0}
                containerClassName="size-full"
                className="scale-105"
              />
            </div>
          )
        })}

        {/* Darkest at the bottom where the text sits. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/50 to-transparent" />
      </div>

      {/* --- Content ------------------------------------------------------ */}
      <div className="container-page relative z-10 pt-[var(--header-height)] pb-16">
        <div className="flex max-w-3xl flex-col gap-6">
          <span
            className={cn(
              'w-fit rounded-full border border-white/25 bg-white/10 px-4 py-1.5',
              'text-xs font-medium tracking-wider text-white/90 uppercase backdrop-blur-sm',
              'animate-fade-in',
            )}
          >
            {site.fullName}
          </span>

          <h1 className="text-4xl leading-[1.05] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="block animate-fade-up">You belong here.</span>
            {/* Fixed-height line so swapping the phrase does not reflow the page.
                aria-live keeps the change announced without repeating the h1. */}
            <span className="mt-2 block h-[1.15em] overflow-hidden">
              <span
                key={wordIndex}
                aria-live="polite"
                className="block animate-fade-up bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent"
              >
                {ROTATING_WORDS[wordIndex]}
              </span>
            </span>
          </h1>

          <p className="max-w-xl animate-fade-up text-base leading-relaxed text-white/85 sm:text-lg">
            {site.vision}
          </p>

          {/* --- Calls to action ---------------------------------------- */}
          <div className="flex animate-fade-up flex-col gap-3 pt-2 xs:flex-row xs:flex-wrap">
            <Button asChild size="xl" variant="gold">
              <Link to="/contact">
                Join Us
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            </Button>

            <Button
              asChild
              size="xl"
              variant="outline"
              className="border-white/35 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            >
              <Link to="/sermons">
                <PlayCircleIcon aria-hidden="true" />
                Watch Sermons
              </Link>
            </Button>

            <Button
              asChild
              size="xl"
              variant="ghost"
              className="text-white hover:bg-white/15 hover:text-white"
            >
              <Link to="/give">
                <HeartHandshakeIcon aria-hidden="true" />
                Give Online
              </Link>
            </Button>

            <Button
              asChild
              size="xl"
              variant="ghost"
              className="text-white hover:bg-white/15 hover:text-white"
            >
              <a href={`tel:${site.contact.phoneHref}`}>
                <PhoneIcon aria-hidden="true" />
                Contact Us
              </a>
            </Button>
          </div>

          {/* --- Next service, at a glance ------------------------------ */}
          <dl className="mt-6 flex animate-fade-up flex-wrap gap-x-8 gap-y-3 border-t border-white/20 pt-6">
            <div>
              <dt className="text-xs tracking-wider text-white/60 uppercase">Sunday Worship</dt>
              <dd className="text-sm font-semibold text-white">8:00 AM – 12:00 PM</dd>
            </div>
            <div>
              <dt className="text-xs tracking-wider text-white/60 uppercase">Where</dt>
              <dd className="text-sm font-semibold text-white">
                {site.contact.addressLines[0]}
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-wider text-white/60 uppercase">Call us</dt>
              <dd className="text-sm font-semibold text-white">{site.contact.phone}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* --- Slide controls ---------------------------------------------- */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDE_KEYS.map((key, index) => (
          <button
            key={key}
            type="button"
            onClick={() => setSlideIndex(index)}
            aria-label={`Show background image ${index + 1} of ${SLIDE_KEYS.length}`}
            aria-current={index === slideIndex}
            className={cn(
              // 44px tap target via padding, while the visible dot stays small.
              'focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
              'grid size-11 place-items-center rounded-full',
            )}
          >
            <span
              className={cn(
                'block h-1.5 rounded-full transition-all duration-300',
                index === slideIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/50',
              )}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
