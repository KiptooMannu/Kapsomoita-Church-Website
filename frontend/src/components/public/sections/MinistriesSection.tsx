import { ArrowRightIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CloudinaryImage } from '@/components/media/CloudinaryImage'
import { Section, SectionHeading } from '@/components/public/Section'
import { ministries } from '@/config/content'
import { mediaPublicId } from '@/config/media-manifest'
import { cn } from '@/lib/utils'

/**
 * Ministries overview.
 *
 * Split into two groups deliberately: the four with their own page get a large
 * image card, while the rest are listed compactly. Giving a linkless ministry the
 * same prominent card would imply a page that does not exist.
 */
export function MinistriesSection() {
  const featured = ministries.filter((ministry) => ministry.to !== undefined)
  const others = ministries.filter((ministry) => ministry.to === undefined)

  return (
    <Section id="ministries" tone="muted">
      <SectionHeading
        eyebrow="Get involved"
        title="Our ministries"
        description="Every member has a place to serve and to be served. Find where you fit."
      />

      {/* --- Ministries with their own page ------------------------------- */}
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {featured.map((ministry) => (
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
                <div className="relative">
                  <CloudinaryImage
                    publicId={
                      ministry.imageLocalPath
                        ? (mediaPublicId(ministry.imageLocalPath) ?? '')
                        : ''
                    }
                    alt={ministry.name}
                    width={640}
                    sizes="(min-width: 1280px) 20rem, (min-width: 640px) 50vw, 100vw"
                    aspectRatio="4 / 3"
                    containerClassName="w-full"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                  />
                  <h3 className="absolute bottom-3 left-4 text-lg font-semibold text-white">
                    {ministry.name}
                  </h3>
                </div>

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
        ))}
      </ul>

      {/* --- Ministries without a page yet ------------------------------- */}
      {others.length > 0 && (
        <div className="mt-10 flex flex-col gap-4">
          <h3 className="text-center text-sm font-semibold tracking-wider uppercase">
            More ways to serve
          </h3>
          <ul className="flex flex-wrap justify-center gap-3">
            {others.map((ministry) => (
              <li key={ministry.slug}>
                <Card className="py-3">
                  <CardContent className="flex items-center gap-3 px-4">
                    <span className="text-sm font-medium">{ministry.name}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {ministry.description}
                    </Badge>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )
}
