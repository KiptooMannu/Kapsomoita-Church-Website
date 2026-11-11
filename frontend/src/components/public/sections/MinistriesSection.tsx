import { ArrowRightIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollFrame } from '@/components/public/ScrollPhoto'
import { Section, SectionHeading } from '@/components/public/Section'
import { ministries } from '@/config/content'
import { MINISTRY_IMAGE_SLOT, useSiteImages } from '@/features/content/site-images'
import { getPublicHomepageItems } from '@/lib/api/homepage'
import { cn } from '@/lib/utils'

/**
 * Ministries overview.
 *
 * All eleven ministries now have detail pages, so every card is clickable.
 * Admin-highlighted items (MINISTRY category in Homepage Manager) appear as a
 * top-tier grid; the rest follow as standard linked cards.
 */
export function MinistriesSection() {
  const homepageQuery = useQuery({
    queryKey: ['public', 'homepage-items'],
    queryFn: getPublicHomepageItems,
    staleTime: 5 * 60_000,
  })

  const rawHomepageItems = Array.isArray(homepageQuery.data) ? homepageQuery.data : []
  const highlighted = rawHomepageItems.filter(
    (item) => item.category === 'MINISTRY' && item.status === 'PUBLISHED',
  )
  const photos = useSiteImages()
  // All ministries now carry a `to` link — every card is navigable.
  const featured = ministries.filter((ministry) => ministry.to !== undefined)

  return (
    <Section id="ministries" tone="muted">
      <SectionHeading
        eyebrow="Get involved"
        title="Our ministries"
        description="Every member has a place to serve and to be served. Find where you fit."
      />

      {highlighted.length > 0 && (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {highlighted.map((item) => (
            <li key={item.id}>
              <Card className="interactive-card group h-full overflow-hidden py-0">
                {item.imageUrl && (
                  <ScrollFrame index={0}>
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </ScrollFrame>
                )}
                <CardContent className="flex flex-col gap-3 py-6">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  )}
                  {item.linkUrl && (
                    item.linkUrl.startsWith('http') ? (
                      <a href={item.linkUrl} className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                        Learn more
                        <ArrowRightIcon className="size-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link to={item.linkUrl} className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                        Learn more
                        <ArrowRightIcon className="size-3.5" aria-hidden="true" />
                      </Link>
                    )
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {/* --- All ministries as linked image cards ------------------------- */}
      <ul className={cn('grid gap-6 sm:grid-cols-2 xl:grid-cols-4', highlighted.length > 0 ? 'mt-10' : 'mt-12')}>
        {featured.map((ministry, index) => {
          const photo = photos.url(MINISTRY_IMAGE_SLOT[ministry.slug] ?? '')
          return (
            <li key={ministry.slug}>
              <Link
                to={ministry.to!}
                className={cn(
                  'group block h-full rounded-xl',
                  'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2',
                  'focus-visible:outline-none',
                )}
              >
                <Card className="h-full overflow-hidden py-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lifted">
                  <ScrollFrame index={index} className="rounded-none">
                    <div className="bg-brand-900 relative aspect-[4/3]">
                      {photo && (
                        <img
                          src={photo}
                          alt={ministry.name}
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                      />
                      <h3 className="absolute bottom-3 left-4 text-lg font-semibold text-white">
                        {ministry.name}
                      </h3>
                    </div>
                  </ScrollFrame>

                  <CardContent className="flex flex-col gap-3 pb-6">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {ministry.description}
                    </p>
                    <span className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                      Learn more
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
  )
}
