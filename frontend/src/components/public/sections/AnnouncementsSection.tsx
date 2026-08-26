import { useQuery } from '@tanstack/react-query'
import {
  ArrowRightIcon,
  BellIcon,
  CalendarIcon,
  CheckCircle2Icon,
  MegaphoneIcon,
  PinIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Section, SectionHeading } from '@/components/public/Section'
import { queryKeys } from '@/lib/query-client'
import { announcements as fallbackAnnouncements } from '@/config/content'
import { contentApi } from '@/features/content/content-api'
import { cn } from '@/lib/utils'

export function AnnouncementsSection() {
  const { data: liveAnnouncements, isPending } = useQuery({
    queryKey: queryKeys.public.announcements,
    queryFn: contentApi.publicAnnouncements,
    staleTime: 2 * 60_000,
  })

  const items =
    liveAnnouncements !== undefined
      ? liveAnnouncements.map((a) => ({
          id: a.id,
          title: a.title,
          body: a.body,
          tone: (a.tone?.toLowerCase() ?? 'info') as 'info' | 'success' | 'warning',
          date: a.displayDate || new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
          link: a.linkUrl ? { label: a.linkLabel || 'Learn More', to: a.linkUrl } : undefined,
          pinned: a.pinned,
        }))
      : fallbackAnnouncements.map((fa) => ({
          ...fa,
          pinned: false,
        }))

  if (!isPending && items.length === 0) {
    return null
  }

  return (
    <Section id="announcements" className="relative overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background py-16 md:py-24">
      {/* Background Decorative Gradient Orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute top-0 right-1/4 -z-10 size-72 rounded-full bg-primary/5 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/4 -z-10 size-72 rounded-full bg-gold-500/5 blur-3xl" />

      <SectionHeading
        eyebrow="Church Bulletin & Updates"
        title="Latest Announcements"
        description="Stay informed about upcoming events, ministry opportunities, and community updates."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((announcement) => {
          const isWarning = announcement.tone === 'warning'
          const isSuccess = announcement.tone === 'success'

          return (
            <Card
              key={announcement.id}
              className={cn(
                'group relative flex h-full flex-col justify-between overflow-hidden border border-border/80 bg-card/80 p-6 backdrop-blur-sm',
                'transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl',
                announcement.pinned && 'ring-2 ring-primary/40 bg-gradient-to-br from-card via-card to-primary/5',
              )}
            >
              {/* Pinned Indicator Ribbon */}
              {announcement.pinned && (
                <div className="absolute top-0 right-0 flex items-center gap-1 rounded-bl-lg bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm">
                  <PinIcon className="size-3" />
                  <span>Pinned Notice</span>
                </div>
              )}

              <div>
                {/* Header Icon + Tone Badge */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                      isSuccess
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : isWarning
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-primary/10 text-primary',
                    )}
                  >
                    {isSuccess ? (
                      <CheckCircle2Icon className="size-5" />
                    ) : isWarning ? (
                      <BellIcon className="size-5 animate-pulse" />
                    ) : (
                      <MegaphoneIcon className="size-5" />
                    )}
                  </span>

                  <Badge
                    variant={
                      isSuccess
                        ? 'success'
                        : isWarning
                          ? 'warning'
                          : 'secondary'
                    }
                    className="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5"
                  >
                    {isSuccess ? 'Good News' : isWarning ? 'Important' : 'Notice'}
                  </Badge>
                </div>

                {/* Announcement Title */}
                <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {announcement.title}
                </h3>

                {/* Body Text */}
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {announcement.body}
                </p>
              </div>

              {/* Card Footer: Date & Link */}
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/50 pt-4 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                  <CalendarIcon className="size-3.5 text-primary" />
                  {announcement.date}
                </span>

                {announcement.link && (
                  <Link
                    to={announcement.link.to}
                    className={cn(
                      'inline-flex items-center gap-1.5 font-semibold text-primary transition-all hover:gap-2 hover:underline',
                    )}
                  >
                    <span>{announcement.link.label}</span>
                    <ArrowRightIcon className="size-3.5" />
                  </Link>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </Section>
  )
}
