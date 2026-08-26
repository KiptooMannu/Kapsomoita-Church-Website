import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  CalendarDaysIcon,
  ClockIcon,
  Loader2Icon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  TagIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SeoHead } from '@/components/seo/SeoHead'
import { eventsApi, type EventResponse } from '@/features/content/events-api'
import { mediaApi } from '@/features/media/media-api'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const displayDate = (value: string) => value.slice(0, 10)
const displayTime = (value: string) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const eventStart = (date: string, time: string) => {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
  if (!match) return new Date(`${date}T09:00:00`).toISOString()
  let hour = Number(match[1])
  if (match[3]?.toUpperCase() === 'PM' && hour < 12) hour += 12
  if (match[3]?.toUpperCase() === 'AM' && hour === 12) hour = 0
  const [year = 0, month = 1, day = 1] = date.split('-').map(Number)
  return new Date(year, month - 1, day, hour, Number(match[2])).toISOString()
}

const tomorrow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0] ?? ''
}

export default function AdminEventsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [bannerId, setBannerId] = useState<string | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('Service')
  const [published, setPublished] = useState(true)

  const eventsQuery = useQuery({
    queryKey: queryKeys.admin.events({ search }),
    queryFn: () => eventsApi.adminList({ search: search.trim() || undefined }),
  })

  const saveMutation = useMutation({
    mutationFn: async () => {
      let nextBannerId = bannerId ?? undefined
      if (bannerFile) {
        const uploadedBanner = await mediaApi.upload(bannerFile, {
          title: `${title.trim()} banner`,
          folder: 'EVENT_BANNER',
          description: description.trim() || undefined,
        })
        nextBannerId = uploadedBanner.id
      }

      const payload = {
        title,
        slug: slugify(title),
        description: description || undefined,
        startsAt: eventStart(date, time),
        venue: location,
        bannerId: nextBannerId,
        registrationOpen: false,
        published,
        featured: false,
      }
      return editingId ? eventsApi.adminUpdate(editingId, payload) : eventsApi.adminCreate(payload)
    },
    onSuccess: () => {
      toast.success(editingId ? 'Event updated successfully' : 'Event created successfully')
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.events({}) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.public.events })
      setIsDialogOpen(false)
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventsApi.adminDelete(id),
    onSuccess: () => {
      toast.success('Event deleted')
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.events({}) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.public.events })
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const handleOpenDialog = (item?: EventResponse) => {
    if (item) {
      setEditingId(item.id)
      setBannerId(item.bannerId)
      setBannerFile(null)
      setTitle(item.title)
      setDescription(item.description ?? '')
      setDate(displayDate(item.startsAt))
      setTime(displayTime(item.startsAt))
      setLocation(item.venue)
      setCategory('Service')
      setPublished(item.published)
    } else {
      setEditingId(null)
      setBannerId(null)
      setBannerFile(null)
      setTitle('')
      setDescription('')
      setDate(tomorrow())
      setTime('09:00 AM')
      setLocation('Main Sanctuary')
      setCategory('Service')
      setPublished(true)
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!title.trim() || !date) {
      toast.error('Title and Date are required')
      return
    }

    saveMutation.mutate()
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const events = eventsQuery.data?.content ?? []

  return (
    <>
      <SeoHead title="Events Management" description="Schedule and publish upcoming church services and community events." />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Content</span>
              <span>•</span>
              <span className="text-primary font-bold">Church Calendar</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1 flex items-center gap-2">
              <CalendarDaysIcon className="size-6 text-primary" />
              Events & Services Manager
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Schedule, publish, and organize special services, fellowship meetings, and outreach programs.
            </p>
          </div>

          <Button onClick={() => handleOpenDialog()} className="shrink-0 bg-primary text-primary-foreground">
            <PlusIcon className="mr-2 size-4" />
            Schedule New Event
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events by title, category, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>

          <CardContent>
            {eventsQuery.isPending ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2Icon className="mr-2 size-5 animate-spin" />Loading events...</div>
            ) : eventsQuery.isError ? (
              <div className="py-12 text-center text-destructive">{normaliseApiError(eventsQuery.error).message}</div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <CalendarDaysIcon className="size-10 mb-3 opacity-40" />
                <p className="font-medium text-foreground">No events found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click "Schedule New Event" to add an event to the church calendar.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant={item.published ? 'success' : 'outline'}>
                          {item.published ? 'Published' : 'Draft'}
                        </Badge>
                        <Badge variant="secondary" className="font-normal flex items-center gap-1">
                          <TagIcon className="size-3" />
                          Service
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-3 pt-2 border-t border-border/40">
                        <span className="flex items-center gap-1 font-medium">
                          <CalendarDaysIcon className="size-3.5 text-primary" />
                          {displayDate(item.startsAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="size-3.5 text-muted-foreground" />
                          {displayTime(item.startsAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="size-3.5 text-muted-foreground" />
                          {item.venue}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border/50">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item)}>
                        Edit Event
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Event' : 'Schedule New Event'}</DialogTitle>
            <DialogDescription>
              Set details to publish this event to the public website calendar.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div>
              <Label htmlFor="evt-title">Event Title *</Label>
              <Input
                id="evt-title"
                placeholder="e.g. Annual Youth Conference"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="evt-desc">Description</Label>
              <Textarea
                id="evt-desc"
                placeholder="Event summary and details..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="evt-banner">Event image</Label>
              <Input
                id="evt-banner"
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
                className="mt-1"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {bannerFile
                  ? `Selected: ${bannerFile.name}`
                  : bannerId
                    ? 'Current event image will be kept unless you select a new one.'
                    : 'Choose an image to display on the landing page.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="evt-date">Date *</Label>
                <Input
                  id="evt-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="evt-time">Time</Label>
                <Input
                  id="evt-time"
                  placeholder="e.g. 09:00 AM - 01:00 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="evt-loc">Location</Label>
                <Input
                  id="evt-loc"
                  placeholder="e.g. Main Sanctuary"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="evt-cat">Category</Label>
                <Input
                  id="evt-cat"
                  placeholder="e.g. Youth, Prayer, Service"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-input text-primary size-4"
              />
              Publish Live on Calendar
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {editingId ? 'Save Changes' : 'Schedule Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
