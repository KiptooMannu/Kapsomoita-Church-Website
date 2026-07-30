import { useState } from 'react'
import {
  CalendarDaysIcon,
  ClockIcon,
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

interface EventItem {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  published: boolean
}

const INITIAL_EVENTS: EventItem[] = [
  {
    id: '1',
    title: 'Annual Youth Conference 2026',
    description: 'Empowering the next generation with divine purpose and leadership skills.',
    date: '2026-08-15',
    time: '09:00 AM - 04:00 PM',
    location: 'Main Sanctuary',
    category: 'Youth',
    published: true,
  },
  {
    id: '2',
    title: 'Community Outreach & Free Medical Camp',
    description: 'Serving our neighbors with compassionate healthcare and prayer support.',
    date: '2026-08-22',
    time: '08:00 AM - 02:00 PM',
    location: 'Kapsomoita Church Grounds',
    category: 'Outreach',
    published: true,
  },
]

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('Service')
  const [published, setPublished] = useState(true)

  const handleOpenDialog = (item?: EventItem) => {
    if (item) {
      setEditingId(item.id)
      setTitle(item.title)
      setDescription(item.description)
      setDate(item.date)
      setTime(item.time)
      setLocation(item.location)
      setCategory(item.category)
      setPublished(item.published)
    } else {
      setEditingId(null)
      setTitle('')
      setDescription('')
      setDate(new Date().toISOString().split('T')[0] ?? '')
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

    if (editingId) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? { ...e, title, description, date, time, location, category, published }
            : e,
        ),
      )
      toast.success('Event updated successfully')
    } else {
      const newEvent: EventItem = {
        id: String(Date.now()),
        title,
        description,
        date,
        time,
        location,
        category,
        published,
      }
      setEvents((prev) => [newEvent, ...prev])
      toast.success('Event created successfully')
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    toast.success('Event deleted')
  }

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()),
  )

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
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <CalendarDaysIcon className="size-10 mb-3 opacity-40" />
                <p className="font-medium text-foreground">No events found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click "Schedule New Event" to add an event to the church calendar.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((item) => (
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
                          {item.category}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-3 pt-2 border-t border-border/40">
                        <span className="flex items-center gap-1 font-medium">
                          <CalendarDaysIcon className="size-3.5 text-primary" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="size-3.5 text-muted-foreground" />
                          {item.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="size-3.5 text-muted-foreground" />
                          {item.location}
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
            <Button onClick={handleSave}>
              {editingId ? 'Save Changes' : 'Schedule Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
