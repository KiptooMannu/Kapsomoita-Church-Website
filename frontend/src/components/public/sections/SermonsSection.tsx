import { format } from 'date-fns'
import { BookOpenIcon, ClockIcon, PlayCircleIcon, UserIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Section, SectionHeading } from '@/components/public/Section'
import { latestSermons } from '@/config/content'

/**
 * Latest sermons.
 *
 * The "Watch" control is only rendered as a link when a `videoUrl` actually exists.
 * A play button that does nothing is worse than no button — it reads as broken
 * rather than as not-yet-available, which is why the fallback is explicit text.
 */
export function SermonsSection() {
  if (latestSermons.length === 0) {
    return null
  }

  return (
    <Section id="sermons">
      <SectionHeading
        eyebrow="Teaching"
        title="Latest sermons"
        description="Missed a Sunday, or want to hear it again? Catch up here."
      />

      <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {latestSermons.map((sermon) => (
          <li key={sermon.id}>
            <Card className="h-full py-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted">
              <CardContent className="flex h-full flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <Badge variant="secondary">{sermon.series}</Badge>
                  <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
                    <ClockIcon className="size-3.5" aria-hidden="true" />
                    {sermon.durationMinutes} min
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold tracking-tight">{sermon.title}</h3>
                  <p className="text-primary text-sm font-medium">{sermon.topic}</p>
                </div>

                <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2.5">
                    <UserIcon className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                    <dt className="sr-only">Speaker</dt>
                    <dd className="text-muted-foreground">{sermon.speaker}</dd>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <BookOpenIcon
                      className="text-muted-foreground size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <dt className="sr-only">Bible reading</dt>
                    <dd className="text-muted-foreground">{sermon.bibleReference}</dd>
                  </div>
                </dl>

                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <time
                    dateTime={sermon.date}
                    className="text-muted-foreground text-xs"
                  >
                    {format(new Date(sermon.date), 'd MMMM yyyy')}
                  </time>

                  {sermon.videoUrl ? (
                    <Button asChild size="sm" variant="outline">
                      <a href={sermon.videoUrl} target="_blank" rel="noreferrer">
                        <PlayCircleIcon aria-hidden="true" />
                        Watch
                      </a>
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-xs">Recording coming soon</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex justify-center">
        <Button asChild size="lg" variant="outline">
          <Link to="/sermons">Browse all sermons</Link>
        </Button>
      </div>
    </Section>
  )
}
