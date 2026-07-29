import { ClockIcon, MapPinIcon, UserIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Section, SectionHeading } from '@/components/public/Section'
import { serviceTimes } from '@/config/site'
import { cn } from '@/lib/utils'

/**
 * Weekly gatherings.
 *
 * The first card is highlighted as the main service, since a first-time visitor
 * overwhelmingly wants to know when Sunday is and everything else is secondary.
 */
export function ServicesSection() {
  return (
    <Section id="services" tone="muted">
      <SectionHeading
        eyebrow="Join us"
        title="Weekly gatherings"
        description="There is a place for you at every one of these. Come as you are — no invitation needed."
      />

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {serviceTimes.map((service, index) => {
          const isPrimary = index === 0

          return (
            <li key={service.name}>
              <Card
                className={cn(
                  'h-full py-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted',
                  isPrimary && 'ring-primary/25 bg-card ring-2',
                )}
              >
                <CardContent className="flex h-full flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-tight">{service.name}</h3>
                    {isPrimary && <Badge variant="gold">Main service</Badge>}
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>

                  {/* A definition list, because these are genuinely label/value
                      pairs — it reads correctly to a screen reader. */}
                  <dl className="mt-auto flex flex-col gap-2.5 pt-2 text-sm">
                    <div className="flex items-center gap-2.5">
                      <ClockIcon
                        className="text-primary size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <dt className="sr-only">When</dt>
                      <dd>
                        <span className="font-medium">{service.day}</span>
                        <span className="text-muted-foreground"> · {service.time}</span>
                      </dd>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <MapPinIcon
                        className="text-primary size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <dt className="sr-only">Where</dt>
                      <dd className="text-muted-foreground">{service.location}</dd>
                    </div>

                    {service.leader && (
                      <div className="flex items-center gap-2.5">
                        <UserIcon
                          className="text-primary size-4 shrink-0"
                          aria-hidden="true"
                        />
                        <dt className="sr-only">Led by</dt>
                        <dd className="text-muted-foreground">{service.leader}</dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
