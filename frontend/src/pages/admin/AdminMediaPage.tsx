import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  CloudUploadIcon,
  FileIcon,
  Loader2Icon,
  Trash2Icon,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input, Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { SeoHead } from '@/components/seo/SeoHead'
import { RoleGate } from '@/features/auth/RoleGate'
import { mediaApi, type MediaAsset } from '@/features/media/media-api'
import { normaliseApiError } from '@/lib/api/client'
import { cn, formatBytes } from '@/lib/utils'

/**
 * Media library: upload files and browse what has been uploaded.
 *
 * The upload form is driven entirely by the server's folder map — destinations,
 * size limits and accepted extensions are all fetched, never hardcoded here. That
 * keeps the single source of truth in `MediaFolder` on the backend: adding a
 * destination there makes it appear in this form with no frontend change.
 */
export default function AdminMediaPage() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [folder, setFolder] = useState('')
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [featured, setFeatured] = useState(false)
  const [progress, setProgress] = useState(0)

  const foldersQuery = useQuery({
    queryKey: ['admin', 'media', 'folders'],
    queryFn: mediaApi.folders,
    // The folder map only changes on deploy, so it need not be revalidated often.
    staleTime: 30 * 60_000,
  })

  const categoriesQuery = useQuery({
    queryKey: ['admin', 'media', 'gallery-categories'],
    queryFn: mediaApi.galleryCategories,
    staleTime: 5 * 60_000,
  })

  const listQuery = useQuery({
    queryKey: ['admin', 'media', 'list', { folder, category }],
    queryFn: () =>
      mediaApi.list({
        size: 24,
        ...(folder ? { folder } : {}),
        ...(category ? { category } : {}),
      }),
  })

  const selectedFolder = useMemo(
    () => foldersQuery.data?.find((entry) => entry.name === folder),
    [foldersQuery.data, folder],
  )

  const acceptAttribute = useMemo(
    () =>
      selectedFolder?.allowedExtensions.map((extension) => `.${extension}`).join(',') ??
      undefined,
    [selectedFolder],
  )

  const resetForm = () => {
    setSelectedFiles([])
    setTitle('')
    setDescription('')
    setTagsInput('')
    setFeatured(false)
    setProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const tags = tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)

      const metadata = {
        title: title.trim(),
        folder,
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(selectedFolder?.requiresCategory ? { category } : {}),
        ...(tags.length > 0 ? { tags } : {}),
        featured,
      }

      // A single file uses the single endpoint so a failure surfaces as a plain
      // error; several use the batch endpoint, which reports per-file outcomes.
      if (selectedFiles.length === 1) {
        const file = selectedFiles[0]
        if (!file) throw new Error('No file selected')
        const asset = await mediaApi.upload(file, metadata, setProgress)
        return { uploaded: [asset], failed: [], successCount: 1, failureCount: 0 }
      }
      return mediaApi.uploadBatch(selectedFiles, metadata, setProgress)
    },
    onSuccess: (result) => {
      if (result.successCount > 0) {
        toast.success(
          result.successCount === 1
            ? 'File uploaded.'
            : `${result.successCount} files uploaded.`,
        )
      }
      // Partial success is reported explicitly rather than silently swallowed.
      result.failed.forEach((failure) => {
        toast.error(`${failure.filename}: ${failure.message}`)
      })

      void queryClient.invalidateQueries({ queryKey: ['admin', 'media', 'list'] })
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'media', 'gallery-categories'],
      })
      if (result.failureCount === 0) resetForm()
    },
    onError: (error) => {
      toast.error(normaliseApiError(error).message)
      setProgress(0)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => mediaApi.remove(id),
    onSuccess: () => {
      toast.success('File deleted.')
      void queryClient.invalidateQueries({ queryKey: ['admin', 'media', 'list'] })
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const canSubmit =
    selectedFiles.length > 0 &&
    folder !== '' &&
    title.trim() !== '' &&
    (!selectedFolder?.requiresCategory || category !== '') &&
    !uploadMutation.isPending

  const oversizedFile = selectedFolder
    ? selectedFiles.find((file) => file.size > selectedFolder.maxBytes)
    : undefined

  return (
    <>
      <SeoHead title="Media library" noIndex />

      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Media library</h1>
          <p className="text-muted-foreground text-sm">
            Upload images, video, audio and documents. Folders are created automatically
            — there is nothing to set up in Cloudinary first.
          </p>
        </header>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,26rem)_1fr]">
          {/* --- Upload form -------------------------------------------- */}
          <RoleGate
            permissions={['gallery:create', 'sermon:create', 'download:create']}
            fallback={
              <Alert variant="info">
                <AlertCircleIcon aria-hidden="true" />
                <AlertTitle>View only</AlertTitle>
                <AlertDescription>
                  Your role can browse the media library but not upload to it.
                </AlertDescription>
              </Alert>
            }
          >
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base">Upload media</CardTitle>
                <CardDescription>
                  Choose a destination and the file is filed there automatically.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form
                  className="flex flex-col gap-5"
                  onSubmit={(event) => {
                    event.preventDefault()
                    uploadMutation.mutate()
                  }}
                >
                  {/* --- Destination --------------------------------------- */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="folder">Destination</Label>
                    <select
                      id="folder"
                      required
                      value={folder}
                      onChange={(event) => {
                        setFolder(event.target.value)
                        setCategory('')
                      }}
                      className={cn(
                        'border-input bg-background h-10 w-full rounded-lg border px-3',
                        'text-base shadow-sm outline-none sm:text-sm',
                        'focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-2',
                      )}
                    >
                      <option value="">Select a destination…</option>
                      {foldersQuery.data?.map((entry) => (
                        <option key={entry.name} value={entry.name}>
                          {entry.relativePath} ({entry.expectedKind.toLowerCase()})
                        </option>
                      ))}
                    </select>
                    {selectedFolder && (
                      <p className="text-muted-foreground text-xs">
                        Files go to <code className="font-mono">{selectedFolder.absoluteFolder}</code>{' '}
                        · max {formatBytes(selectedFolder.maxBytes, 0)} ·{' '}
                        {selectedFolder.allowedExtensions.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* --- Gallery category (only when required) ------------- */}
                  {selectedFolder?.requiresCategory && (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="category">Gallery category</Label>
                      <select
                        id="category"
                        required
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className={cn(
                          'border-input bg-background h-10 w-full rounded-lg border px-3',
                          'text-base shadow-sm outline-none sm:text-sm',
                          'focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-2',
                        )}
                      >
                        <option value="">Select a category…</option>
                        {categoriesQuery.data?.map((entry) => (
                          <option key={entry.name} value={entry.name}>
                            {entry.displayName} ({entry.imageCount})
                          </option>
                        ))}
                      </select>
                      <p className="text-muted-foreground text-xs">
                        Choosing a category files the image into the matching gallery page
                        automatically.
                      </p>
                    </div>
                  )}

                  {/* --- File picker -------------------------------------- */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="files">File(s)</Label>
                    <Input
                      id="files"
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={acceptAttribute}
                      disabled={!selectedFolder}
                      onChange={(event) =>
                        setSelectedFiles(Array.from(event.target.files ?? []))
                      }
                    />
                    {selectedFiles.length > 0 && (
                      <ul className="text-muted-foreground flex flex-col gap-1 text-xs">
                        {selectedFiles.map((file) => (
                          <li key={file.name} className="flex items-center gap-2">
                            <FileIcon className="size-3 shrink-0" aria-hidden="true" />
                            <span className="truncate">{file.name}</span>
                            <span
                              className={cn(
                                'ml-auto shrink-0',
                                selectedFolder && file.size > selectedFolder.maxBytes &&
                                  'text-destructive font-medium',
                              )}
                            >
                              {formatBytes(file.size)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {/* Caught client-side too, so the user is not made to wait for a
                        long upload that the server will reject. */}
                    {oversizedFile && (
                      <p role="alert" className="text-destructive text-xs">
                        “{oversizedFile.name}” exceeds the{' '}
                        {formatBytes(selectedFolder?.maxBytes ?? 0, 0)} limit.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      required
                      maxLength={200}
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Youth camp 2026"
                    />
                    {selectedFiles.length > 1 && (
                      <p className="text-muted-foreground text-xs">
                        Each file is numbered, e.g. “{title || 'Title'} (1)”.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      rows={3}
                      maxLength={5000}
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="tags">Tags (optional)</Label>
                    <Input
                      id="tags"
                      value={tagsInput}
                      onChange={(event) => setTagsInput(event.target.value)}
                      placeholder="baptism, outdoor, 2026"
                    />
                    <p className="text-muted-foreground text-xs">Separate with commas.</p>
                  </div>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(event) => setFeatured(event.target.checked)}
                      className="border-input text-primary focus-visible:ring-ring size-4 rounded"
                    />
                    Feature on the homepage
                  </label>

                  {uploadMutation.isPending && progress > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full transition-[width] duration-200"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p
                        className="text-muted-foreground text-xs"
                        role="status"
                        aria-live="polite"
                      >
                        Uploading… {progress}%
                      </p>
                    </div>
                  )}

                  <Button type="submit" size="lg" block disabled={!canSubmit}>
                    {uploadMutation.isPending ? (
                      <>
                        <Loader2Icon className="animate-spin" aria-hidden="true" />
                        Uploading…
                      </>
                    ) : (
                      <>
                        <CloudUploadIcon aria-hidden="true" />
                        Upload
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </RoleGate>

          {/* --- Library ------------------------------------------------- */}
          <section aria-labelledby="library-heading" className="flex flex-col gap-4">
            <h2 id="library-heading" className="text-base font-semibold">
              Uploaded media
              {listQuery.data && (
                <span className="text-muted-foreground ml-2 text-sm font-normal">
                  {listQuery.data.totalElements.toLocaleString()} total
                </span>
              )}
            </h2>

            {listQuery.isPending && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 8 }, (_, index) => (
                  <Skeleton key={index} className="aspect-square rounded-xl" />
                ))}
              </div>
            )}

            {listQuery.isError && (
              <Alert variant="destructive">
                <AlertCircleIcon aria-hidden="true" />
                <AlertTitle>Could not load the library</AlertTitle>
                <AlertDescription>
                  {normaliseApiError(listQuery.error).message}
                </AlertDescription>
              </Alert>
            )}

            {listQuery.isSuccess && listQuery.data.content.length === 0 && (
              <Card className="py-12">
                <CardContent className="flex flex-col items-center gap-3 text-center">
                  <CloudUploadIcon
                    className="text-muted-foreground size-8"
                    aria-hidden="true"
                  />
                  <p className="text-muted-foreground text-sm">
                    Nothing uploaded yet. Your first upload will appear here.
                  </p>
                </CardContent>
              </Card>
            )}

            {listQuery.isSuccess && listQuery.data.content.length > 0 && (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 2xl:grid-cols-4">
                {listQuery.data.content.map((asset) => (
                  <MediaCard
                    key={asset.id}
                    asset={asset}
                    onDelete={() => deleteMutation.mutate(asset.id)}
                    isDeleting={
                      deleteMutation.isPending && deleteMutation.variables === asset.id
                    }
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  )
}

interface MediaCardProps {
  asset: MediaAsset
  onDelete: () => void
  isDeleting: boolean
}

function MediaCard({ asset, onDelete, isDeleting }: MediaCardProps) {
  const isImage = asset.resourceType === 'image'

  return (
    <li className="group border-border bg-card relative overflow-hidden rounded-xl border">
      <div className="bg-muted aspect-square overflow-hidden">
        {isImage ? (
          <img
            src={asset.secureUrl}
            // The title is the closest thing to a description the uploader gave;
            // it is far better than an empty or filename-based alt.
            alt={asset.title}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground flex size-full flex-col items-center justify-center gap-2">
            <FileIcon className="size-8" aria-hidden="true" />
            <span className="text-xs uppercase">{asset.format ?? asset.resourceType}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 p-3">
        <p className="truncate text-sm font-medium" title={asset.title}>
          {asset.title}
        </p>
        <p className="text-muted-foreground truncate text-xs" title={asset.folder}>
          {asset.folder}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {asset.categoryLabel && (
            <Badge variant="secondary" className="text-[10px]">
              {asset.categoryLabel}
            </Badge>
          )}
          {asset.featured && (
            <Badge variant="gold" className="text-[10px]">
              <CheckCircle2Icon aria-hidden="true" />
              Featured
            </Badge>
          )}
          <span className="text-muted-foreground ml-auto text-[10px]">
            {formatBytes(asset.bytes)}
          </span>
        </div>
      </div>

      <RoleGate permissions={['gallery:delete', 'sermon:delete', 'download:delete']}>
        <Button
          variant="destructive"
          size="icon-sm"
          onClick={onDelete}
          disabled={isDeleting}
          // Hidden until hover on pointer devices, but always present for keyboard
          // users via focus-visible, so it never becomes unreachable.
          className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          aria-label={`Delete ${asset.title}`}
        >
          {isDeleting ? (
            <Loader2Icon className="animate-spin" aria-hidden="true" />
          ) : (
            <Trash2Icon aria-hidden="true" />
          )}
        </Button>
      </RoleGate>
    </li>
  )
}
