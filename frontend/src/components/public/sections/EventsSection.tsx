import { format } from 'date-fns'
import { CalendarDaysIcon, MapPinIcon, UsersIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CloudinaryImage } from '@/components/media/CloudinaryImage'
import { Section, SectionHeading } from '@/components/public/Section'
import { eventsApi, type EventResponse } from '@/features/content/events-api'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'
import { useCountdown } from '@/hooks/useCountdown'
import { useQuery } from '@tanstack/react-query'

/**
 * Upcoming events with live countdowns.
 *
 * Events whose date has passed are filtered out rather than shown with a zeroed
 * countdown — a church site listing last year's conference as "upcoming" reads as
 * abandoned.
 */
export function EventsSection() {
  const eventsQuery = useQuery({
    queryKey: queryKeys.public.events,
    queryFn: () => eventsApi.upcoming({ size: 6 }),
  })

  if (eventsQuery.isPending) {
    return <Section id="events"><p className="py-12 text-center text-muted-foreground">Loading upcoming events...</p></Section>
  }

  if (eventsQuery.isError) {
    return <Section id="events"><p className="py-12 text-center text-destructive">{normaliseApiError(eventsQuery.error).message}</p></Section>
  }

  const futureEvents = eventsQuery.data.filter(
    (event) => new Date(event.startsAt).getTime() > Date.now(),
  )

  return (
    <Section id="events">
      <SectionHeading
        eyebrow="Diary"
        title="Upcoming events"
        description="Mark your calendar and bring someone with you."
      />

      {futureEvents.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">
          No upcoming events at the moment. Please check back soon.
        </p>
      ) : (
        <ul className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {futureEvents.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

function EventCard({ event }: { event: EventResponse }) {
  const countdown = useCountdown(event.startsAt)
  const startDate = new Date(event.startsAt)

  return (
    <Card className="h-full overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted">
      <CloudinaryImage
        publicId={event.bannerId ?? ''}
        fallbackSrc={event.bannerUrl ?? undefined}
        alt={event.title}
        width={768}
        sizes="(min-width: 1280px) 24rem, (min-width: 768px) 50vw, 100vw"
        aspectRatio="16 / 10"
        containerClassName="w-full"
      />

      <CardContent className="flex flex-1 flex-col gap-4 pb-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold tracking-tight">{event.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
        </div>

        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2.5">
            <CalendarDaysIcon className="text-primary size-4 shrink-0" aria-hidden="true" />
            <dt className="sr-only">Date</dt>
            {/* A <time> element with a machine-readable datetime, so the date is
                unambiguous to assistive tech and to crawlers. */}
            <dd>
              <time dateTime={event.startsAt}>
                {format(startDate, "EEEE d MMMM yyyy 'at' HH:mm")}
              </time>
            </dd>
          </div>

          <div className="flex items-center gap-2.5">
            <MapPinIcon className="text-primary size-4 shrink-0" aria-hidden="true" />
            <dt className="sr-only">Venue</dt>
            <dd className="text-muted-foreground">{event.venue}</dd>
          </div>

          {event.capacity !== null && (
            <div className="flex items-center gap-2.5">
              <UsersIcon className="text-primary size-4 shrink-0" aria-hidden="true" />
              <dt className="sr-only">Availability</dt>
              <dd className="text-muted-foreground">Capacity: {event.capacity}</dd>
            </div>
          )}
        </dl>

        {/* --- Countdown ------------------------------------------------- */}
        <div
          className="bg-muted/60 grid grid-cols-4 gap-1 rounded-lg p-3"
          // A per-second live region would be read aloud continuously, so the
          // countdown is hidden from assistive tech; the date above conveys it.
          aria-hidden="true"
        >
          {(
            [
              ['Days', countdown.days],
              ['Hrs', countdown.hours],
              ['Min', countdown.minutes],
              ['Sec', countdown.seconds],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex flex-col items-center">
              {/* tabular-nums keeps the digits from jittering as they change. */}
              <span className="text-lg font-bold tabular-nums">
                {String(value).padStart(2, '0')}
              </span>
              <span className="text-muted-foreground text-[10px] tracking-wider uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-3">
          {/*
            A full event renders a real <button disabled>, not a disabled link:
            `disabled` is not a valid attribute on an anchor, and passing it through
            `asChild` would land on the <a> and be ignored by the browser while
            React warns about it.
          */}
          <Button asChild block>
            <Link to="/contact">Register</Link>
          </Button>

          {countdown.days <= 7 && (
            <Badge variant="gold" className="shrink-0">
              Soon
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
