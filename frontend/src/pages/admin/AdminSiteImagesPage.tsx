import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ImageIcon, Loader2Icon } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { SeoHead } from '@/components/seo/SeoHead'
import { siteImagesApi, useSiteImages, type SiteImage } from '@/features/content/site-images'
import { mediaApi } from '@/features/media/media-api'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'

/**
 * Replace every decorative photograph on the public site.
 *
 * Leader portraits are not here — those are uploaded on Leadership and Ministries.
 */
export default function AdminSiteImagesPage() {
  const { data, isPending } = useSiteImages()
  const groups = new Map<string, SiteImage[]>()
  for (const image of data ?? []) {
    const list = groups.get(image.groupName) ?? []
    list.push(image)
    groups.set(image.groupName, list)
  }

  return (
    <>
      <SeoHead
        title="Website photos"
        description="Replace the photographs used across the public website."
      />
      <div className="flex flex-col gap-8 p-6">
        <div className="border-border border-b pb-5">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Content
          </p>
          <h1 className="text-foreground mt-1 flex items-center gap-2 text-2xl font-bold tracking-tight">
            <ImageIcon className="text-primary size-6" />
            Website photos
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            These are the pictures on page banners, ministries, services, strategies and the
            gallery stand-ins. Choose a new file to replace one. Leader portraits are changed
            under Leadership.
          </p>
        </div>

        {isPending ? (
          <div className="text-muted-foreground flex items-center justify-center py-16">
            <Loader2Icon className="mr-2 size-5 animate-spin" />
            Loading photos...
          </div>
        ) : (
          [...groups.entries()].map(([group, images]) => (
            <section key={group} className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold tracking-wider uppercase">{group}</h2>
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {images.map((image) => (
                  <li key={image.slotKey}>
                    <PhotoSlot image={image} />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </>
  )
}

function PhotoSlot({ image }: { image: SiteImage }) {
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.public.siteImages })
  }

  const save = useMutation({
    mutationFn: (imageUrl: string | null) => siteImagesApi.replace(image.slotKey, imageUrl),
    onSuccess: () => {
      toast.success(`${image.label} updated`)
      refresh()
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  async function onFile(file: File) {
    setBusy(true)
    try {
      const uploaded = await mediaApi.upload(file, {
        title: image.label,
        folder: 'HOMEPAGE',
        visibility: 'INTERNAL',
        featured: false,
      })
      await save.mutateAsync(uploaded.secureUrl)
    } catch (error) {
      toast.error(normaliseApiError(error).message)
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <article className="border-border bg-card overflow-hidden rounded-xl border">
      <div className="bg-muted aspect-[16/10]">
        {image.imageUrl ? (
          <img
            src={image.imageUrl}
            alt={image.altText || image.label}
            referrerPolicy="no-referrer"
            className="size-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
            No photo yet
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 p-3">
        <p className="min-w-0 truncate text-sm font-medium">{image.label}</p>
        <div className="flex shrink-0 gap-2">
          {image.imageUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => save.mutate(null)}
            >
              Remove
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? <Loader2Icon className="size-4 animate-spin" /> : image.imageUrl ? 'Replace' : 'Add photo'}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void onFile(file)
            }}
          />
        </div>
      </div>
    </article>
  )
}
