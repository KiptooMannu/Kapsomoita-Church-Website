import { useQuery } from '@tanstack/react-query'
import { ArrowRightIcon, CalendarIcon, MegaphoneIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Section, SectionHeading } from '@/components/public/Section'
import { announcements as fallbackAnnouncements } from '@/config/content'
import { contentApi } from '@/features/content/content-api'
import { cn } from '@/lib/utils'

export function AnnouncementsSection() {
  const { data: liveAnnouncements } = useQuery({
    queryKey: ['public', 'announcements'],
    queryFn: contentApi.publicAnnouncements,
    staleTime: 5 * 60_000,
  })

  // Use live data if returned from API, otherwise fallback to default config
  const items = (liveAnnouncements && liveAnnouncements.length > 0)
    ? liveAnnouncements.map((a) => ({
        id: a.id,
        title: a.title,
        body: a.body,
        tone: (a.tone?.toLowerCase() ?? 'info') as 'info' | 'success' | 'warning',
        date: a.displayDate || 'Notice',
        link: a.linkUrl ? { label: a.linkLabel || 'Learn more', to: a.linkUrl } : undefined,
      }))
    : fallbackAnnouncements

  if (items.length === 0) {
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
        {items.map((announcement) => (
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
                    {announcement.tone === 'success'
                      ? 'Good news'
                      : announcement.tone === 'warning'
                      ? 'Important'
                      : 'Notice'}
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
