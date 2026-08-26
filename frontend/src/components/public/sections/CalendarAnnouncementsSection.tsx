import { CalendarIcon, MapPinIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CalendarAnnouncement {
  id: string
  title: string
  body: string
  eventDate: string | null
  eventEndDate: string | null
  eventLocation: string | null
  imageUrl: string | null
  linkUrl: string | null
  linkLabel: string | null
  tone: string
}

interface CalendarAnnouncementsSectionProps {
  announcements: CalendarAnnouncement[]
}

export function CalendarAnnouncementsSection({
  announcements,
}: CalendarAnnouncementsSectionProps) {
  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'SUCCESS':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
      case 'WARNING':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20'
      default:
        return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    try {
      return format(new Date(dateString), 'MMM d, yyyy')
    } catch {
      return null
    }
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return null
    try {
      return format(new Date(dateString), 'h:mm a')
    } catch {
      return null
    }
  }

  const hasCalendarInfo = announcements.some(
    (a) => a.eventDate || a.eventLocation || a.imageUrl
  )

  if (!hasCalendarInfo) {
    return null // Don't show section if no calendar-style announcements
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container-page">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
            Upcoming Events
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join us for services, events, and activities happening at Kapsomoita Church
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements
            .filter((a) => a.eventDate || a.eventLocation || a.imageUrl)
            .map((announcement) => (
              <Card
                key={announcement.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-border/50"
              >
                {/* Image Section */}
                {announcement.imageUrl && (
                  <div className="relative h-48 bg-muted overflow-hidden">
                    <img
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={cn('backdrop-blur-sm', getToneColor(announcement.tone))}>
                        {announcement.tone}
                      </Badge>
                    </div>
                  </div>
                )}

                <CardContent className="p-5">
                  {/* Date Badge */}
                  {announcement.eventDate && (
                    <div className="flex items-center gap-2 mb-3">
                      <CalendarIcon className="size-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {formatDate(announcement.eventDate)}
                        {announcement.eventEndDate && ` - ${formatDate(announcement.eventEndDate)}`}
                      </span>
                      {formatTime(announcement.eventDate) && (
                        <span className="text-sm text-muted-foreground">
                          at {formatTime(announcement.eventDate)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Location */}
                  {announcement.eventLocation && (
                    <div className="flex items-center gap-2 mb-3">
                      <MapPinIcon className="size-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {announcement.eventLocation}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                    {announcement.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {announcement.body}
                  </p>

                  {/* Action Button */}
                  {announcement.linkUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <a href={announcement.linkUrl} target="_blank" rel="noopener noreferrer">
                        {announcement.linkLabel || 'Learn More'}
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>

        {/* No Events State */}
        {announcements.filter((a) => a.eventDate || a.eventLocation || a.imageUrl).length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="size-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No upcoming events scheduled</p>
          </div>
        )}
      </div>
    </section>
  )
}