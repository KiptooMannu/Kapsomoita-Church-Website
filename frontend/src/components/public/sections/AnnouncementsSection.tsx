import { ArrowRightIcon, CalendarIcon, MegaphoneIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Section, SectionHeading } from '@/components/public/Section'
import { announcements } from '@/config/content'
import { cn } from '@/lib/utils'

/** Tone maps to a badge variant; each badge always carries text as well. */
const TONE_LABEL = {
  info: 'Notice',
  success: 'Good news',
  warning: 'Important',
} as const

/**
 * Church announcements.
 *
 * Currently reads from `config/content.ts`. Once the Announcements admin module
 * lands this switches to a query against `/api/announcements` — the card markup
 * stays as-is, only the data source changes.
 */
export function AnnouncementsSection() {
  if (announcements.length === 0) {
    return null
  }

  return (
    <Section id="announcements">
      <SectionHeading
        eyebrow="Latest news"
        title="Announcements"
        description="What is happening around the church this season."
      />

      <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {announcements.map((announcement) => (
          <li key={announcement.id}>
            <Card className="h-full py-6 transition-shadow duration-300 hover:shadow-lifted">
              <CardContent className="flex h-full flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      'bg-secondary text-secondary-foreground flex size-9 shrink-0',
                      'items-center justify-center rounded-lg',
                    )}
                    aria-hidden="true"
                  >
                    <MegaphoneIcon className="size-4" />
                  </span>
                  <Badge
                    variant={
                      announcement.tone === 'info'
                        ? 'secondary'
                        : announcement.tone === 'success'
                          ? 'success'
                          : 'warning'
                    }
                  >
                    {TONE_LABEL[announcement.tone]}
                  </Badge>
                </div>

                <h3 className="text-base font-semibold tracking-tight">
                  {announcement.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {announcement.body}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <CalendarIcon className="size-3.5" aria-hidden="true" />
                    {announcement.date}
                  </span>

                  {announcement.link && (
                    <Link
                      to={announcement.link.to}
                      className={cn(
                        'text-primary inline-flex items-center gap-1 rounded text-sm font-medium',
                        'focus-visible:ring-ring hover:underline focus-visible:ring-2',
                        'focus-visible:outline-none',
                      )}
                    >
                      {announcement.link.label}
                      <ArrowRightIcon className="size-3.5" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  )
}
