import { ArrowRightIcon, HeartHandshakeIcon, PlayCircleIcon, PhoneIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { CloudinaryImage } from '@/components/media/CloudinaryImage'
import { resolveImage, type ImageKey } from '@/config/images'
import { contentApi } from '@/features/content/content-api'
import { usePublicSite } from '@/features/content/use-public-site'
import { queryKeys } from '@/lib/query-client'
import { cn } from '@/lib/utils'
import { AnnouncementsSideWidget } from '@/components/public/sections/AnnouncementsSideWidget'

/**
 * Fallback hero photographs, used until an admin publishes hero banners.
 */
const SLIDE_KEYS: readonly ImageKey[] = ['hero1', 'hero2', 'hero3', 'hero4', 'hero5']

const SLIDE_INTERVAL_MS = 6500

/** Phrases cycled in the headline when no published banner supplies its own. */
const ROTATING_WORDS = ['Welcome home.', 'Come as you are.', 'Grow in faith.'] as const

export interface HeroSlide {
  id: string
  imageUrl?: string | null
  title: string
  description?: string | null
  linkUrl?: string | null
}

/**
 * Full-screen homepage hero.
 *
 * Published Homepage hero banners replace the built-in photographs. The church
 * name, vision, phone and address come from Church Settings.
 */
export function HeroSection({ slides = [] }: { slides?: HeroSlide[] }) {
  const publicSite = usePublicSite()
  const serviceTimesQuery = useQuery({
    queryKey: queryKeys.public.serviceTimes,
    queryFn: contentApi.publicServiceTimes,
    staleTime: 5 * 60_000,
  })

  const publishedSlides = slides.filter((slide) => slide.imageUrl)
  const slideCount = publishedSlides.length > 0 ? publishedSlides.length : SLIDE_KEYS.length
  const [slideIndex, setSlideIndex] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const slideTimer = window.setInterval(
      () => setSlideIndex((current) => (current + 1) % slideCount),
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
  }, [slideCount])

  const activeSlide = publishedSlides[slideIndex]
  const headline = activeSlide?.title || ROTATING_WORDS[wordIndex]
  const supporting = activeSlide?.description || publicSite.vision
  const primaryService =
    serviceTimesQuery.data?.find((service) => service.primary) ?? serviceTimesQuery.data?.[0]
  const primaryLink = activeSlide?.linkUrl

  return (
    <section
      id="home"
      aria-label="Welcome"
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      <div aria-hidden="true" className="absolute inset-0">
        {publishedSlides.length > 0
          ? publishedSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={cn(
                  'absolute inset-0 transition-opacity duration-1000 ease-in-out',
                  index === slideIndex ? 'opacity-100' : 'opacity-0',
                )}
              >
                <img
                  src={slide.imageUrl ?? undefined}
                  alt=""
                  className="size-full scale-105 object-cover"
                />
              </div>
            ))
          : SLIDE_KEYS.map((key, index) => {
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/50 to-transparent" />
      </div>

      <div className="container-page relative z-10 w-full pt-[var(--header-height)] pb-16">
        <div className="flex flex-col items-center justify-center">
          <div className="flex max-w-3xl flex-col items-center gap-6 text-center">
            <span
              className={cn(
                'w-fit rounded-full border border-white/25 bg-white/10 px-4 py-1.5',
                'text-xs font-medium tracking-wider text-white/90 uppercase backdrop-blur-sm',
                'animate-fade-in',
              )}
            >
              {publicSite.fullName}
            </span>

            <h1 className="text-4xl leading-[1.05] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="block animate-fade-up">You belong here.</span>
              <span className="mt-2 block min-h-[1.15em] overflow-hidden">
                <span
                  key={activeSlide?.id ?? wordIndex}
                  aria-live="polite"
                  className="block animate-fade-up bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent"
                >
                  {headline}
                </span>
              </span>
            </h1>

            <p className="max-w-xl animate-fade-up text-base leading-relaxed text-white/85 sm:text-lg">
              {supporting}
            </p>

            <div className="flex animate-fade-up flex-col items-center justify-center gap-3 pt-2 xs:flex-row xs:flex-wrap">
              <Button asChild size="xl" variant="gold">
                {primaryLink?.startsWith('http') ? (
                  <a href={primaryLink} target="_blank" rel="noreferrer">
                    Learn more
                    <ArrowRightIcon aria-hidden="true" />
                  </a>
                ) : (
                  <Link to={primaryLink || '/contact'}>
                    {primaryLink ? 'Learn more' : 'Join Us'}
                    <ArrowRightIcon aria-hidden="true" />
                  </Link>
                )}
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
                <a href={`tel:${publicSite.contact.phoneHref}`}>
                  <PhoneIcon aria-hidden="true" />
                  Contact Us
                </a>
              </Button>
            </div>

            <dl className="mt-6 flex w-full animate-fade-up flex-wrap justify-center gap-x-8 gap-y-3 border-t border-white/20 pt-6">
              <div>
                <dt className="text-xs tracking-wider text-white/60 uppercase">
                  {primaryService?.name ?? 'Sunday Worship'}
                </dt>
                <dd className="text-sm font-semibold text-white">
                  {primaryService
                    ? `${primaryService.dayLabel} · ${primaryService.timeLabel}`
                    : '8:00 AM – 12:00 PM'}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wider text-white/60 uppercase">Where</dt>
                <dd className="text-sm font-semibold text-white">
                  {primaryService?.location || publicSite.contact.addressLines[0]}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wider text-white/60 uppercase">Call us</dt>
                <dd className="text-sm font-semibold text-white">{publicSite.contact.phone}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 animate-fade-up">
            <AnnouncementsSideWidget />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {Array.from({ length: slideCount }, (_, index) => (
          <button
            key={publishedSlides[index]?.id ?? SLIDE_KEYS[index] ?? index}
            type="button"
            onClick={() => setSlideIndex(index)}
            aria-label={`Show background image ${index + 1} of ${slideCount}`}
            aria-current={index === slideIndex ? 'true' : undefined}
            className="focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none grid size-11 place-items-center rounded-full"
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
