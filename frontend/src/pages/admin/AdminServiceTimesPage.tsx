import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ClockIcon,
  CrownIcon,
  Loader2Icon,
  MapPinIcon,
  PlusIcon,
  StarIcon,
  Trash2Icon,
  UserIcon,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input, Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SeoHead } from '@/components/seo/SeoHead'
import { contentApi, type ServiceTime } from '@/features/content/content-api'
import { normaliseApiError } from '@/lib/api/client'

export default function AdminServiceTimesPage() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceTime | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState('SUNDAY')
  const [timeLabel, setTimeLabel] = useState('')
  const [location, setLocation] = useState('Main Sanctuary')
  const [leader, setLeader] = useState('')
  const [description, setDescription] = useState('')
  const [primary, setPrimary] = useState(false)
  const [published, setPublished] = useState(true)

  const serviceTimesQuery = useQuery({
    queryKey: ['admin', 'service-times'],
    queryFn: () => contentApi.adminListServiceTimes(),
  })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name,
        dayOfWeek,
        timeLabel,
        location,
        leader: leader || undefined,
        description: description || undefined,
        primary,
        published,
      }
      if (editingService) {
        return contentApi.adminUpdateServiceTime(editingService.id, payload)
      }
      return contentApi.adminCreateServiceTime(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'service-times'] })
      queryClient.invalidateQueries({ queryKey: ['public', 'service-times'] })
      toast.success(editingService ? 'Service schedule updated' : 'Service schedule created')
      closeDialog()
    },
    onError: (err) => {
      toast.error('Failed to save service time', {
        description: normaliseApiError(err).message,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contentApi.adminDeleteServiceTime(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'service-times'] })
      queryClient.invalidateQueries({ queryKey: ['public', 'service-times'] })
      toast.success('Service time deleted')
    },
    onError: (err) => {
      toast.error('Failed to delete service time', {
        description: normaliseApiError(err).message,
      })
    },
  })

  const setPrimaryMutation = useMutation({
    mutationFn: (id: string) => contentApi.adminSetPrimaryServiceTime(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'service-times'] })
      queryClient.invalidateQueries({ queryKey: ['public', 'service-times'] })
      toast.success('Primary main service updated')
    },
    onError: (err) => {
      toast.error('Failed to set primary service', {
        description: normaliseApiError(err).message,
      })
    },
  })

  const openNewDialog = () => {
    setEditingService(null)
    setName('')
    setDayOfWeek('SUNDAY')
    setTimeLabel('10:00 AM - 12:30 PM')
    setLocation('Main Sanctuary')
    setLeader('')
    setDescription('')
    setPrimary(false)
    setPublished(true)
    setIsDialogOpen(true)
  }

  const openEditDialog = (item: ServiceTime) => {
    setEditingService(item)
    setName(item.name)
    setDayOfWeek(item.dayOfWeek || 'SUNDAY')
    setTimeLabel(item.timeLabel)
    setLocation(item.location)
    setLeader(item.leader || '')
    setDescription(item.description || '')
    setPrimary(item.primary)
    setPublished(item.published)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingService(null)
  }

  const serviceTimes = serviceTimesQuery.data ?? []

  return (
    <div className="space-y-6">
      <SeoHead title="Service Times Administration — Kapsomoita AGC" />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Service Schedules</h1>
          <p className="text-sm text-muted-foreground">
            Manage main Sunday services, mid-week prayer meetings, and special fellowship times.
          </p>
        </div>
        <Button onClick={openNewDialog} className="gap-2 shrink-0">
          <PlusIcon className="size-4" />
          Add Service Schedule
        </Button>
      </div>

      {/* List */}
      {serviceTimesQuery.isPending ? (
        <div className="flex justify-center p-12">
          <Loader2Icon className="size-8 animate-spin text-primary" />
        </div>
      ) : serviceTimes.length === 0 ? (
        <Card className="p-8 text-center">
          <ClockIcon className="mx-auto size-10 text-muted-foreground/60 mb-2" />
          <h3 className="font-semibold text-lg">No service schedules found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Get started by adding your first service schedule or gathering time.
          </p>
          <Button onClick={openNewDialog} variant="outline" className="gap-2">
            <PlusIcon className="size-4" /> Add Schedule
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {serviceTimes.map((service) => (
            <Card key={service.id} className="relative flex flex-col justify-between p-5">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-foreground">{service.name}</h3>
                      {service.primary && (
                        <Badge variant="gold" className="text-[10px] gap-1 px-1.5 py-0.5">
                          <CrownIcon className="size-3" /> Main Service
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs font-medium text-primary mt-0.5">{service.dayLabel}</p>
                  </div>
                  <Badge variant={service.published ? 'success' : 'secondary'} className="text-[10px]">
                    {service.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground my-3">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <ClockIcon className="size-4 text-primary shrink-0" />
                    <span>{service.timeLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="size-4 text-muted-foreground shrink-0" />
                    <span>{service.location}</span>
                  </div>
                  {service.leader && (
                    <div className="flex items-center gap-2 text-xs">
                      <UserIcon className="size-3.5 text-muted-foreground shrink-0" />
                      <span>Led by: {service.leader}</span>
                    </div>
                  )}
                  {service.description && (
                    <p className="text-xs leading-relaxed text-muted-foreground pt-1 border-t border-border/40">
                      {service.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                {!service.primary && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs h-8 gap-1"
                    onClick={() => setPrimaryMutation.mutate(service.id)}
                    disabled={setPrimaryMutation.isPending}
                  >
                    <StarIcon className="size-3.5" /> Make Primary
                  </Button>
                )}
                <div className="flex items-center gap-1 ml-auto">
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => openEditDialog(service)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm(`Delete service schedule "${service.name}"?`)) {
                        deleteMutation.mutate(service.id)
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog for Create/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Service Schedule' : 'New Service Schedule'}</DialogTitle>
            <DialogDescription>
              Service times created here will immediately appear on the public website and footer.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              saveMutation.mutate()
            }}
            className="space-y-4 py-2"
          >
            <div className="space-y-1.5">
              <Label htmlFor="service-name">Service Name *</Label>
              <Input
                id="service-name"
                required
                placeholder="e.g. Sunday Main Service"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="day-of-week">Day of Week *</Label>
                <select
                  id="day-of-week"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                >
                  <option value="SUNDAY">Sunday</option>
                  <option value="MONDAY">Monday</option>
                  <option value="TUESDAY">Tuesday</option>
                  <option value="WEDNESDAY">Wednesday</option>
                  <option value="THURSDAY">Thursday</option>
                  <option value="FRIDAY">Friday</option>
                  <option value="SATURDAY">Saturday</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="time-label">Time Schedule *</Label>
                <Input
                  id="time-label"
                  required
                  placeholder="e.g. 10:00 AM - 12:30 PM"
                  value={timeLabel}
                  onChange={(e) => setTimeLabel(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                required
                placeholder="e.g. Main Sanctuary"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="leader">Leader / Speaker (Optional)</Label>
              <Input
                id="leader"
                placeholder="e.g. Rev. Kiptoo"
                value={leader}
                onChange={(e) => setLeader(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                rows={2}
                placeholder="Brief summary of worship, teaching or fellowship."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                Published
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={primary}
                  onChange={(e) => setPrimary(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                Primary Main Service
              </label>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                {editingService ? 'Update Schedule' : 'Create Schedule'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
