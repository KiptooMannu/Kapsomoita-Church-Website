import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  DownloadIcon,
  FileTextIcon,
  Loader2Icon,
  SearchIcon,
  Trash2Icon,
  UploadIcon,
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
import { downloadsApi, type DownloadResponse } from '@/features/content/downloads-api'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'

export default function AdminDownloadsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Bulletin')
  const [fileUrl, setFileUrl] = useState('')
  const [assetId, setAssetId] = useState('')
  const [fileSize, setFileSize] = useState('1.0 MB')
  const [published, setPublished] = useState(true)

  const downloadsQuery = useQuery({
    queryKey: queryKeys.admin.downloads({ search }),
    queryFn: () => downloadsApi.adminList(),
  })

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = { title, description: description || undefined, category: category || undefined, assetId: assetId || fileUrl.trim(), published }
      return editingId ? downloadsApi.adminUpdate(editingId, payload) : downloadsApi.adminCreate(payload)
    },
    onSuccess: () => {
      toast.success(editingId ? 'Document updated successfully' : 'Document uploaded successfully')
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.downloads({}) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.public.downloads })
      setIsDialogOpen(false)
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => downloadsApi.adminDelete(id),
    onSuccess: () => {
      toast.success('Document deleted')
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.downloads({}) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.public.downloads })
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const handleOpenDialog = (item?: DownloadResponse) => {
    if (item) {
      setEditingId(item.id)
      setTitle(item.title)
      setDescription(item.description ?? '')
      setCategory(item.category ?? 'Bulletin')
      setAssetId(item.assetId)
      setFileUrl(item.assetUrl ?? '')
      setFileSize('1.0 MB')
      setPublished(item.published)
    } else {
      setEditingId(null)
      setTitle('')
      setDescription('')
      setCategory('Bulletin')
      setFileUrl('')
      setAssetId('')
      setFileSize('1.0 MB')
      setPublished(true)
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Document title is required')
      return
    }

    if (!editingId && !fileUrl.trim()) {
      toast.error('Document URL / PDF Path is required')
      return
    }
    saveMutation.mutate()
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const filtered = (downloadsQuery.data ?? []).filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.category ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
      <SeoHead title="Downloads & Bulletins" description="Manage church documents, weekly bulletins, and study resources." />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Content</span>
              <span>•</span>
              <span className="text-primary font-bold">Document Library</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1 flex items-center gap-2">
              <FileTextIcon className="size-6 text-primary" />
              Downloads & Bulletins Manager
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Upload weekly service bulletins, ministry guides, and official church publications.
            </p>
          </div>

          <Button onClick={() => handleOpenDialog()} className="shrink-0 bg-primary text-primary-foreground">
            <UploadIcon className="mr-2 size-4" />
            Upload Document
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents by title or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>

          <CardContent>
            {downloadsQuery.isPending ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2Icon className="mr-2 size-5 animate-spin" />Loading documents...</div>
            ) : downloadsQuery.isError ? (
              <div className="py-12 text-center text-destructive">{normaliseApiError(downloadsQuery.error).message}</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <FileTextIcon className="size-10 mb-3 opacity-40" />
                <p className="font-medium text-foreground">No documents uploaded</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click "Upload Document" to make resources available to church members.
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
                        <Badge variant="secondary" className="font-normal">
                          {item.category}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3 pt-2 border-t border-border/40 font-mono">
                        <span>Size: N/A</span>
                        <span className="flex items-center gap-1">
                          <DownloadIcon className="size-3 text-primary" />
                          {item.downloadCount} downloads
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border/50">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item)}>
                        Edit Details
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

      {/* Upload/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Document' : 'Upload New Document'}</DialogTitle>
            <DialogDescription>
              Provide document details and download link for site visitors.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div>
              <Label htmlFor="doc-title">Document Title *</Label>
              <Input
                id="doc-title"
                placeholder="e.g. Weekly Bulletin - August 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="doc-desc">Description</Label>
              <Textarea
                id="doc-desc"
                placeholder="Brief summary of file contents..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="doc-cat">Category</Label>
                <Input
                  id="doc-cat"
                  placeholder="e.g. Bulletin, Report, Form"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="doc-size">File Size</Label>
                <Input
                  id="doc-size"
                  placeholder="e.g. 2.4 MB"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="doc-url">Document URL / PDF Path</Label>
              <Input
                id="doc-url"
                placeholder="https://res.cloudinary.com/... or /documents/bulletin.pdf"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="mt-1 font-mono text-xs"
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-input text-primary size-4"
              />
              Publish Download Live
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {editingId ? 'Save Changes' : 'Publish Document'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
