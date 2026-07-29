import { ArrowRightIcon, ClockIcon, UsersIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CloudinaryImage } from '@/components/media/CloudinaryImage'
import { Section, SectionHeading } from '@/components/public/Section'
import { SeoHead } from '@/components/seo/SeoHead'
import { JoinMinistryForm } from '@/features/ministries/JoinMinistryForm'
import { ministryDetails } from '@/config/ministries'
import { resolveImage, type ImageKey } from '@/config/images'
import { cn } from '@/lib/utils'

/**
 * Maps a ministry slug to its image slot.
 *
 * Kept here rather than on the ministry record so `config/ministries.ts` stays
 * about content and `config/images.ts` remains the single place images are changed.
 */
const MINISTRY_IMAGE: Record<string, ImageKey> = {
  youth: 'ministryYouth',
  women: 'ministryWomen',
  men: 'ministryMen',
  kids: 'ministryKids',
  'sunday-school': 'ministrySundaySchool',
  choir: 'ministryChoir',
  'praise-team': 'ministryPraise',
  prayer: 'ministryPrayer',
  evangelism: 'ministryEvangelism',
  missions: 'ministryMissions',
  media: 'ministryMedia',
}

/**
 * Index of every ministry.
 *
 * Gives the eleven ministries one place to be browsed and compared, and gives the
 * "Ministries" navigation entry a real destination — previously the dropdown offered
 * four links and nothing else.
 */
export default function MinistriesIndexPage() {
  return (
    <>
      <SeoHead
        title="Ministries"
        description="Explore the ministries of Kapsomoita AGC — youth, women, men, children, Sunday School, choir, praise, prayer, evangelism, missions and media."
      />

      {/* --- Page header ------------------------------------------------- */}
      <header className="bg-brand-950 relative overflow-hidden py-16 text-white sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="bg-gold-500/12 absolute -top-24 right-1/4 size-80 rounded-full blur-3xl" />
          <div className="bg-brand-400/12 absolute -bottom-24 left-1/4 size-80 rounded-full blur-3xl" />
        </div>

        <div className="container-page relative">
          {/* Centred, with the text block itself constrained so the measure stays
              readable on a wide screen. */}
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <Badge variant="gold">Get involved</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Our ministries
            </h1>
            <p className="text-base leading-relaxed text-white/80 sm:text-lg">
              Every member has a place to serve and to be served. Find where you fit — and
              if you are not sure, tell us and we will help you work it out.
            </p>
          </div>
        </div>
      </header>

      {/* --- All ministries ---------------------------------------------- */}
      <Section id="all-ministries">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ministryDetails.map((ministry) => {
            const imageKey = MINISTRY_IMAGE[ministry.slug]
            const image = imageKey ? resolveImage(imageKey) : null

            return (
              <li key={ministry.slug}>
                <Link
                  to={`/ministries/${ministry.slug}`}
                  className={cn(
                    'group block h-full rounded-xl',
                    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2',
                    'focus-visible:outline-none',
                  )}
                >
                  <Card className="h-full overflow-hidden py-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lifted">
                    <div className="relative">
                      <CloudinaryImage
                        publicId={image?.publicId ?? ''}
                        fallbackSrc={image?.fallbackSrc}
                        alt={ministry.name}
                        width={768}
                        sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
                        aspectRatio="4 / 3"
                        containerClassName="w-full"
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"
                      />
                      <h2 className="absolute bottom-3 left-4 pr-4 text-lg font-semibold text-white">
                        {ministry.name}
                      </h2>
                    </div>

                    <CardContent className="flex flex-1 flex-col gap-3 pb-6">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {ministry.tagline}
                      </p>

                      <dl className="flex flex-col gap-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <UsersIcon
                            className="text-primary size-3.5 shrink-0"
                            aria-hidden="true"
                          />
                          <dt className="sr-only">Who it is for</dt>
                          <dd className="text-muted-foreground">{ministry.audience}</dd>
                        </div>
                        {ministry.meetings[0] && (
                          <div className="flex items-center gap-2">
                            <ClockIcon
                              className="text-primary size-3.5 shrink-0"
                              aria-hidden="true"
                            />
                            <dt className="sr-only">Meets</dt>
                            <dd className="text-muted-foreground">
                              {ministry.meetings[0].day} · {ministry.meetings[0].time}
                            </dd>
                          </div>
                        )}
                      </dl>

                      <span className="text-primary mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium">
                        Learn more and join
                        <ArrowRightIcon
                          className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            )
          })}
        </ul>
      </Section>

      {/* --- General application ----------------------------------------- */}
      <Section id="join" tone="muted">
        <SectionHeading
          eyebrow="Not sure where you fit?"
          title="Apply to join any ministry"
          description="Choose the ministry that interests you most and a leader will get in touch. If you are unsure, say so in the notes and we will help you find your place."
        />

        <div className="mx-auto mt-10 max-w-3xl">
          <JoinMinistryForm />
        </div>
      </Section>
    </>
  )
}
