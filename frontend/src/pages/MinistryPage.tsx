import { useQuery } from '@tanstack/react-query'
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  QuoteIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CloudinaryImage } from '@/components/media/CloudinaryImage'
import { Section, SectionHeading } from '@/components/public/Section'
import { SeoHead } from '@/components/seo/SeoHead'
import { JoinMinistryForm } from '@/features/ministries/JoinMinistryForm'
import { publicGalleryApi } from '@/features/media/public-gallery-api'
import { findMinistry, ministryDetails } from '@/config/ministries'
import { mediaPublicId } from '@/config/media-manifest'
import { cn } from '@/lib/utils'

const GALLERY_LIMIT = 8

/**
 * One page template serving every ministry.
 *
 * Driven by the `:slug` route parameter against `config/ministries.ts`, so all eleven
 * ministries — including Sunday School, Choir, Prayer, Media and the rest that
 * previously had no page at all — get a complete page from a single implementation.
 * Adding a twelfth ministry is a config entry, not a new component.
 *
 * Each page carries: an introduction, who leads it, when it meets, what it does, a
 * verse, its photographs pulled live from the gallery, and the join form.
 */
export default function MinistryPage() {
  const { slug } = useParams<{ slug: string }>()
  const ministry = findMinistry(slug)

  // Every hook must run before any early return: React identifies hooks by call
  // order, so returning above a useQuery would change that order between renders
  // and crash. The query is disabled instead when there is nothing to fetch.
  const galleryCategory = ministry?.galleryCategory
  const galleryQuery = useQuery({
    queryKey: ['public', 'gallery', 'ministry', galleryCategory ?? 'none'],
    queryFn: () => publicGalleryApi.byCategory(galleryCategory!, 0, GALLERY_LIMIT),
    enabled: Boolean(galleryCategory),
    staleTime: 10 * 60_000,
    retry: 1,
  })

  // An unknown slug redirects rather than rendering an error, so an old bookmark
  // lands somewhere useful instead of a dead end.
  if (!ministry) {
    return <Navigate to="/" replace />
  }

  const photos = galleryQuery.data?.content ?? []
  const heroPublicId = ministry.imageLocalPath
    ? (mediaPublicId(ministry.imageLocalPath) ?? '')
    : ''

  return (
    <>
      <SeoHead
        title={ministry.name}
        description={`${ministry.tagline} ${ministry.description[0] ?? ''}`.trim()}
      />

      {/* --- Hero --------------------------------------------------------- */}
      <header className="relative isolate overflow-hidden">
        {heroPublicId || ministry.imageLocalPath ? (
          <>
            <CloudinaryImage
              publicId={heroPublicId}
              alt=""
              width={2560}
              sizes="100vw"
              priority
              containerClassName="absolute inset-0 -z-10 size-full"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/60 to-black/40"
            />
          </>
        ) : (
          // Ministries without a photograph get the brand gradient rather than an
          // empty grey band.
          <div
            aria-hidden="true"
            className="from-brand-900 to-brand-950 absolute inset-0 -z-10 bg-gradient-to-br"
          />
        )}

        <div className="container-page py-20 sm:py-24 lg:py-28">
          <div className="flex max-w-3xl flex-col gap-4">
            <Badge variant="gold" className="w-fit">
              Ministry
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {ministry.name}
            </h1>
            <p className="text-base leading-relaxed text-white/85 sm:text-lg">
              {ministry.tagline}
            </p>

            <div className="flex flex-col gap-3 pt-2 xs:flex-row">
              <Button asChild size="lg" variant="gold">
                <a href="#join">
                  Join this ministry
                  <ArrowRightIcon aria-hidden="true" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/35 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <Link to="/contact">Ask a question</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* --- About + details --------------------------------------------- */}
      <Section id="about-ministry">
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-14">
          <div className="flex flex-col gap-5">
            <SectionHeading
              as="h2"
              align="left"
              eyebrow="About"
              title={`Who we are`}
            />
            {ministry.description.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-muted-foreground leading-relaxed"
              >
                {paragraph}
              </p>
            ))}

            {ministry.verse && (
              <figure className="border-primary/40 bg-muted/40 mt-2 rounded-xl border-l-4 p-5">
                <QuoteIcon className="text-gold-500 mb-2 size-6" aria-hidden="true" />
                <blockquote className="text-base leading-relaxed italic">
                  “{ministry.verse.text}”
                </blockquote>
                <figcaption className="text-primary mt-2 text-sm font-semibold">
                  {ministry.verse.reference}
                </figcaption>
              </figure>
            )}
          </div>

          {/* --- At a glance ------------------------------------------- */}
          <aside className="flex flex-col gap-4">
            <Card className="py-5">
              <CardContent className="flex flex-col gap-4">
                <h3 className="text-base font-semibold">At a glance</h3>

                <dl className="flex flex-col gap-3 text-sm">
                  <div className="flex items-start gap-2.5">
                    <UserIcon className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <div>
                      <dt className="font-medium">Led by</dt>
                      <dd className="text-muted-foreground">{ministry.leaderRole}</dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <UsersIcon className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <div>
                      <dt className="font-medium">Who it is for</dt>
                      <dd className="text-muted-foreground">{ministry.audience}</dd>
                    </div>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card className="py-5">
              <CardContent className="flex flex-col gap-3">
                <h3 className="flex items-center gap-2 text-base font-semibold">
                  <ClockIcon className="text-primary size-4" aria-hidden="true" />
                  When we meet
                </h3>
                <ul className="flex flex-col gap-3 text-sm">
                  {ministry.meetings.map((meeting) => (
                    <li key={`${meeting.day}-${meeting.time}`} className="flex flex-col gap-0.5">
                      <span className="font-medium">{meeting.day}</span>
                      <span className="text-muted-foreground">{meeting.time}</span>
                      <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <MapPinIcon className="size-3" aria-hidden="true" />
                        {meeting.location}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </Section>

      {/* --- What we do -------------------------------------------------- */}
      <Section id="activities" tone="muted">
        <SectionHeading
          eyebrow="What we do"
          title="Our activities"
          description={`How ${ministry.name} serves the church, week by week.`}
        />

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ministry.activities.map((activity) => (
            <li key={activity}>
              <Card className="h-full py-4">
                <CardContent className="flex items-start gap-3">
                  <span
                    className="bg-primary/10 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full"
                    aria-hidden="true"
                  >
                    <CheckIcon className="size-3.5" />
                  </span>
                  <span className="text-sm leading-relaxed">{activity}</span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* --- Photographs ------------------------------------------------- */}
      {ministry.galleryCategory && (galleryQuery.isPending || photos.length > 0) && (
        <Section id="ministry-gallery">
          <SectionHeading
            eyebrow="In pictures"
            title={`${ministry.name} in action`}
            description="Photographs uploaded by our media team."
          />

          {galleryQuery.isPending ? (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: GALLERY_LIMIT }, (_, index) => (
                <Skeleton key={index} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : (
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((photo) => (
                <li key={photo.id} className="group overflow-hidden rounded-xl">
                  <CloudinaryImage
                    publicId={photo.publicId}
                    fallbackSrc={photo.secureUrl}
                    alt={photo.title}
                    width={512}
                    sizes="(min-width: 1024px) 16rem, (min-width: 640px) 33vw, 50vw"
                    aspectRatio="1 / 1"
                    containerClassName="size-full"
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline">
              <Link to="/gallery">See the full gallery</Link>
            </Button>
          </div>
        </Section>
      )}

      {/* --- Join -------------------------------------------------------- */}
      <Section id="join" tone="muted">
        <SectionHeading
          eyebrow="Get involved"
          title={`Join ${ministry.name}`}
          description="We would love to have you. Fill in the form and a leader will contact you."
        />

        <div className="mx-auto mt-10 max-w-3xl">
          {ministry.acceptingApplications ? (
            <JoinMinistryForm
              defaultMinistrySlug={ministry.slug}
              ministryName={ministry.name}
            />
          ) : (
            <Card className="py-10">
              <CardContent className="flex flex-col items-center gap-3 text-center">
                <h3 className="text-lg font-semibold">Applications are closed</h3>
                <p className="text-muted-foreground max-w-md text-sm">
                  {ministry.name} is not taking new members at the moment. Please contact the
                  church office and we will let you know when that changes.
                </p>
                <Button asChild variant="outline">
                  <Link to="/contact">Contact us</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </Section>

      {/* --- Other ministries -------------------------------------------- */}
      <Section id="other-ministries">
        <SectionHeading
          eyebrow="Explore"
          title="Other ministries"
          description="There may be somewhere else you fit even better."
        />

        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {ministryDetails
            .filter((other) => other.slug !== ministry.slug)
            .map((other) => (
              <li key={other.slug}>
                <Link
                  to={`/ministries/${other.slug}`}
                  className={cn(
                    'border-border bg-card hover:bg-secondary flex items-center gap-2 rounded-full',
                    'border px-4 py-2 text-sm font-medium transition-colors',
                    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                  )}
                >
                  {other.name}
                  <ArrowRightIcon className="size-3.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
        </ul>
      </Section>
    </>
  )
}
