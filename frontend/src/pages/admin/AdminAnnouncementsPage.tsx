import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Loader2Icon,
  MegaphoneIcon,
  PinIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
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
import { contentApi, type Announcement } from '@/features/content/content-api'
import { normaliseApiError } from '@/lib/api/client'

export default function AdminAnnouncementsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tone, setTone] = useState('INFO')
  const [displayDate, setDisplayDate] = useState('')
  const [linkLabel, setLinkLabel] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [published, setPublished] = useState(true)
  const [pinned, setPinned] = useState(false)

  const announcementsQuery = useQuery({
    queryKey: ['admin', 'announcements', search],
    queryFn: () => contentApi.adminListAnnouncements({ search }),
  })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        body,
        tone,
        displayDate: displayDate || undefined,
        linkLabel: linkLabel || undefined,
        linkUrl: linkUrl || undefined,
        published,
        pinned,
      }
      if (editingAnnouncement) {
        return contentApi.adminUpdateAnnouncement(editingAnnouncement.id, payload)
      }
      return contentApi.adminCreateAnnouncement(payload)
    },
    onSuccess: () => {
      toast.success(editingAnnouncement ? 'Announcement updated' : 'Announcement created')
      void queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
      void queryClient.invalidateQueries({ queryKey: ['public', 'announcements'] })
      handleCloseDialog()
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contentApi.adminDeleteAnnouncement(id),
    onSuccess: () => {
      toast.success('Announcement deleted')
      void queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const togglePinMutation = useMutation({
    mutationFn: (item: Announcement) =>
      contentApi.adminUpdateAnnouncement(item.id, {
        title: item.title,
        body: item.body,
        tone: item.tone,
        pinned: !item.pinned,
        published: item.published,
      }),
    onSuccess: () => {
      toast.success('Pinned status updated')
      void queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const togglePublishMutation = useMutation({
    mutationFn: (item: Announcement) =>
      contentApi.adminUpdateAnnouncement(item.id, {
        title: item.title,
        body: item.body,
        tone: item.tone,
        pinned: item.pinned,
        published: !item.published,
      }),
    onSuccess: () => {
      toast.success('Publication status updated')
      void queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const handleOpenDialog = (item?: Announcement) => {
    if (item) {
      setEditingAnnouncement(item)
      setTitle(item.title)
      setBody(item.body)
      setTone(item.tone)
      setDisplayDate(item.displayDate ?? '')
      setLinkLabel(item.linkLabel ?? '')
      setLinkUrl(item.linkUrl ?? '')
      setPublished(item.published)
      setPinned(item.pinned)
    } else {
      setEditingAnnouncement(null)
      setTitle('')
      setBody('')
      setTone('INFO')
      setDisplayDate('')
      setLinkLabel('')
      setLinkUrl('')
      setPublished(true)
      setPinned(false)
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingAnnouncement(null)
  }

  const announcements = announcementsQuery.data?.content ?? []

  return (
    <>
      <SeoHead title="Announcements Manager" description="Manage public church announcements and notice board updates." />

      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Content</span>
              <span>•</span>
              <span className="text-primary">Live Module</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">
              Announcements Manager
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create, edit and publish notice board announcements shown on the homepage.
            </p>
          </div>

          <Button onClick={() => handleOpenDialog()} className="shrink-0 bg-primary text-primary-foreground">
            <PlusIcon className="mr-2 size-4" />
            New Announcement
          </Button>
        </div>

        {/* Filter bar */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search announcements..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {announcementsQuery.isPending ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2Icon className="mr-2 size-5 animate-spin" />
                Loading announcements...
              </div>
            ) : announcements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <MegaphoneIcon className="size-10 mb-3 opacity-40" />
                <p className="font-medium text-foreground">No announcements found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click "New Announcement" above to add your first notice.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border rounded-md border border-border overflow-hidden">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => togglePinMutation.mutate(item)}
                        title={item.pinned ? 'Unpin from top' : 'Pin to top'}
                        className={item.pinned ? 'text-amber-500 hover:text-amber-600' : 'text-muted-foreground'}
                      >
                        <PinIcon className="size-4" />
                      </Button>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground">{item.title}</span>
                          <Badge
                            variant={
                              item.tone === 'WARNING'
                                ? 'destructive'
                                : item.tone === 'SUCCESS'
                                ? 'success'
                                : 'secondary'
                            }
                          >
                            {item.toneLabel || item.tone}
                          </Badge>

                          {item.pinned && (
                            <Badge variant="gold" className="bg-amber-500/15 text-amber-700 dark:text-amber-400">
                              Pinned
                            </Badge>
                          )}

                          <Badge
                            variant={item.published ? 'success' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => togglePublishMutation.mutate(item)}
                          >
                            {item.published ? 'Published' : 'Draft'}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.body}</p>

                        {item.displayDate && (
                          <div className="text-xs text-muted-foreground mt-1">
                            📅 {item.displayDate}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteMutation.mutate(item.id)}
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
            <DialogTitle>
              {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
            </DialogTitle>
            <DialogDescription>
              Fill out the announcement details to present on the church notice board.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div>
              <Label htmlFor="ann-title">Title *</Label>
              <Input
                id="ann-title"
                placeholder="e.g., Annual General Meeting"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="ann-body">Content Body *</Label>
              <Textarea
                id="ann-body"
                placeholder="Write the full announcement text here..."
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ann-tone">Tone / Category</Label>
                <select
                  id="ann-tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors"
                >
                  <option value="INFO">Information (Blue)</option>
                  <option value="SUCCESS">Success / Celebration (Green)</option>
                  <option value="WARNING">Important / Urgent (Red)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="ann-date">Display Date Label</Label>
                <Input
                  id="ann-date"
                  placeholder="e.g., This Sunday at 10:00 AM"
                  value={displayDate}
                  onChange={(e) => setDisplayDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ann-link-label">Link Label (Optional)</Label>
                <Input
                  id="ann-link-label"
                  placeholder="e.g., Register Now"
                  value={linkLabel}
                  onChange={(e) => setLinkLabel(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="ann-link-url">Link URL (Optional)</Label>
                <Input
                  id="ann-link-url"
                  placeholder="https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded border-input text-primary size-4"
                />
                Published Live
              </label>

              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="rounded border-input text-primary size-4"
                />
                Pin to Top
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !title.trim() || !body.trim()}
            >
              {saveMutation.isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              {editingAnnouncement ? 'Save Changes' : 'Create Notice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
