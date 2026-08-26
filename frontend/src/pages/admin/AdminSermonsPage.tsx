import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  PlayIcon,
  CalendarIcon,
  Loader2Icon,
  UserIcon,
} from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SeoHead } from '@/components/seo/SeoHead'
import { sermonsApi, type SermonResponse } from '@/features/content/sermons-api'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function AdminSermonsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [speaker, setSpeaker] = useState('')
  const [series, setSeries] = useState('')
  const [scripture, setScripture] = useState('')
  const [date, setDate] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [published, setPublished] = useState(true)

  const sermonsQuery = useQuery({
    queryKey: queryKeys.admin.sermons({ search }),
    queryFn: () => sermonsApi.adminList({ search: search.trim() || undefined }),
  })

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = { title, slug: slugify(title), speaker, preachedOn: date, series: series || undefined, bibleReference: scripture || undefined, videoUrl: videoUrl || undefined, published, featured: false }
      return editingId ? sermonsApi.adminUpdate(editingId, payload) : sermonsApi.adminCreate(payload)
    },
    onSuccess: () => {
      toast.success(editingId ? 'Sermon updated successfully' : 'Sermon published successfully')
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.sermons({}) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.public.sermons })
      setIsDialogOpen(false)
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => sermonsApi.adminDelete(id),
    onSuccess: () => {
      toast.success('Sermon removed')
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.sermons({}) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.public.sermons })
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const handleOpenDialog = (item?: SermonResponse) => {
    if (item) {
      setEditingId(item.id)
      setTitle(item.title)
      setSpeaker(item.speaker)
      setSeries(item.series ?? '')
      setScripture(item.bibleReference ?? '')
      setDate(item.preachedOn)
      setVideoUrl(item.videoUrl ?? '')
      setPublished(item.published)
    } else {
      setEditingId(null)
      setTitle('')
      setSpeaker('Pastor John Tanui')
      setSeries('')
      setScripture('')
      setDate(new Date().toISOString().split('T')[0] ?? '')
      setVideoUrl('')
      setPublished(true)
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!title.trim() || !speaker.trim()) {
      toast.error('Title and Speaker are required')
      return
    }

    saveMutation.mutate()
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const sermons = sermonsQuery.data?.content ?? []

  return (
    <>
      <SeoHead title="Sermons Management" description="Upload and manage church sermons and sermon series." />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Content</span>
              <span>•</span>
              <span className="text-primary">Sermons Library</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">
              Sermons Manager
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Upload, edit and organize Sunday messages and sermon series.
            </p>
          </div>

          <Button onClick={() => handleOpenDialog()} className="shrink-0 bg-primary text-primary-foreground">
            <PlusIcon className="mr-2 size-4" />
            Add New Sermon
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search sermons by title, speaker or series..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {sermonsQuery.isPending ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2Icon className="mr-2 size-5 animate-spin" />Loading sermons...</div>
            ) : sermonsQuery.isError ? (
              <div className="py-12 text-center text-destructive">{normaliseApiError(sermonsQuery.error).message}</div>
            ) : sermons.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">No sermons found</div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sermons.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant={item.published ? 'success' : 'outline'}>
                        {item.published ? 'Published' : 'Draft'}
                      </Badge>
                      {item.series && (
                        <Badge variant="secondary" className="font-normal">
                          {item.series}
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <UserIcon className="size-3.5" />
                        {item.speaker}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="size-3.5" />
                        {item.preachedOn}
                      </span>
                    </div>

                    {item.bibleReference && (
                      <p className="text-xs text-muted-foreground font-mono mt-2 bg-muted/40 px-2 py-1 rounded w-fit">
                        📖 {item.bibleReference}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-border/50">
                    {item.videoUrl ? (
                      <a
                        href={item.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                      >
                        <PlayIcon className="size-3.5 fill-primary" />
                        Watch Stream
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">No media link</span>
                    )}

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item)}>
                        Edit
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
                </div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Sermon' : 'Add New Sermon'}</DialogTitle>
            <DialogDescription>
              Enter sermon details to make it available on the public sermons page.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div>
              <Label htmlFor="sermon-title">Sermon Title *</Label>
              <Input
                id="sermon-title"
                placeholder="e.g. Walking in Victory"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sermon-speaker">Speaker / Preacher *</Label>
                <Input
                  id="sermon-speaker"
                  placeholder="e.g. Pastor John Tanui"
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="sermon-date">Preached Date *</Label>
                <Input
                  id="sermon-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sermon-series">Series Name</Label>
                <Input
                  id="sermon-series"
                  placeholder="e.g. Grace & Truth"
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="sermon-scripture">Scripture Reference</Label>
                <Input
                  id="sermon-scripture"
                  placeholder="e.g. John 3:16-21"
                  value={scripture}
                  onChange={(e) => setScripture(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="sermon-video">YouTube / Video Stream Link</Label>
              <Input
                id="sermon-video"
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="mt-1"
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-input text-primary size-4"
              />
              Publish Live on Website
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {editingId ? 'Save Changes' : 'Publish Sermon'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
