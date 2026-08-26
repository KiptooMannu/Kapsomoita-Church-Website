import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ImagesIcon, SearchIcon, XIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { CloudinaryImage } from '@/components/media/CloudinaryImage'
import { Section, SectionHeading } from '@/components/public/Section'
import { SeoHead } from '@/components/seo/SeoHead'
import { publicGalleryApi } from '@/features/media/public-gallery-api'
import type { MediaAsset } from '@/features/media/media-api'
import { cn } from '@/lib/utils'
import { queryKeys } from '@/lib/query-client'

const PAGE_SIZE = 24

/** Sentinel for the "everything" tab, which has no category slug of its own. */
const ALL = '__all__'

/**
 * Public gallery, driven entirely by the API.
 *
 * This replaces the previous page, which generated image paths from a hardcoded
 * count per folder (`{worship: 5, youth: 4, …}`). That approach meant every upload
 * required a code change, filenames had to follow an exact pattern, and a gap in the
 * numbering silently produced broken images. Now a photo uploaded through the admin
 * media library appears here immediately, filed by the category chosen at upload.
 *
 * The "All" tab is assembled client-side from the per-category responses, because the
 * API exposes categories individually — which is the right shape for the category
 * tabs that carry most of the traffic.
 */
export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>(ALL)
  const [search, setSearch] = useState('')
  const [lightboxAsset, setLightboxAsset] = useState<MediaAsset | null>(null)

  const categoriesQuery = useQuery({
    queryKey: queryKeys.public.galleryCategories,
    queryFn: publicGalleryApi.categories,
    staleTime: 10 * 60_000,
  })

  // Only categories holding at least one public image are offered as tabs — an
  // empty tab is a dead end for a visitor.
  const populatedCategories = useMemo(
    () => (categoriesQuery.data ?? []).filter((category) => category.imageCount > 0),
    [categoriesQuery.data],
  )

  const imagesQuery = useQuery({
    queryKey: queryKeys.public.galleryImages(activeCategory),
    queryFn: async () => {
      if (activeCategory !== ALL) {
        const page = await publicGalleryApi.byCategory(activeCategory, 0, PAGE_SIZE)
        return page.content
      }

      // Fetch each populated category in parallel and interleave the results, so
      // the "All" view is not one category followed by the next.
      const pages = await Promise.all(
        populatedCategories.map((category) =>
          publicGalleryApi.byCategory(category.slug, 0, 8).then((page) => page.content),
        ),
      )
      return pages.flat()
    },
    // Wait for the category list before assembling the "All" view, otherwise the
    // first render would fetch nothing and look empty.
    enabled: activeCategory !== ALL || populatedCategories.length > 0,
    staleTime: 5 * 60_000,
  })

  const images = imagesQuery.data ?? []

  const visibleImages = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return images
    return images.filter(
      (image) =>
        image.title.toLowerCase().includes(term) ||
        (image.description ?? '').toLowerCase().includes(term) ||
        (image.categoryLabel ?? '').toLowerCase().includes(term) ||
        image.tags.some((tag) => tag.includes(term)),
    )
  }, [images, search])

  // Escape closes the lightbox, and scrolling is locked while it is open.
  useEffect(() => {
    if (!lightboxAsset) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxAsset(null)
    }
    document.addEventListener('keydown', onKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [lightboxAsset])

  const totalImages = (categoriesQuery.data ?? []).reduce(
    (sum, category) => sum + category.imageCount,
    0,
  )

  return (
    <>
      <SeoHead
        title="Gallery"
        description="Photographs from services, youth events, outreach, baptisms and celebrations at Kapsomoita AGC."
      />

      <Section id="gallery">
        <SectionHeading
          eyebrow="Life together"
          title="Our gallery"
          description="Moments from across the life of the church — services, outreach, baptisms and celebrations."
        />

        {/* --- Filters -------------------------------------------------- */}
        <div className="mt-10 flex flex-col gap-5">
          <div className="mx-auto w-full max-w-md">
            <div className="relative">
              <SearchIcon
                className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search photos…"
                aria-label="Search photos"
                className="pl-9"
              />
            </div>
          </div>

          {categoriesQuery.isPending ? (
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="h-9 w-24 rounded-full" />
              ))}
            </div>
          ) : (
            populatedCategories.length > 0 && (
              // A tablist would demand full arrow-key semantics; these are filter
              // buttons with aria-pressed, which is honest about what they are.
              <div
                role="group"
                aria-label="Filter photos by category"
                className="flex flex-wrap justify-center gap-2"
              >
                <CategoryChip
                  label={`All (${totalImages})`}
                  isActive={activeCategory === ALL}
                  onClick={() => setActiveCategory(ALL)}
                />
                {populatedCategories.map((category) => (
                  <CategoryChip
                    key={category.slug}
                    label={`${category.displayName} (${category.imageCount})`}
                    isActive={activeCategory === category.slug}
                    onClick={() => setActiveCategory(category.slug)}
                  />
                ))}
              </div>
            )
          )}
        </div>

        {/* --- Grid ----------------------------------------------------- */}
        <div className="mt-10">
          {imagesQuery.isPending && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 12 }, (_, index) => (
                  <Skeleton key={index} className="aspect-square rounded-xl" />
                ))}
              </div>
              <span role="status" aria-live="polite" className="sr-only">
                Loading photos…
              </span>
            </>
          )}

          {imagesQuery.isError && (
            <Card className="py-12">
              <CardContent className="flex flex-col items-center gap-3 text-center">
                <ImagesIcon className="text-muted-foreground size-8" aria-hidden="true" />
                <p className="font-medium">We could not load the gallery</p>
                <p className="text-muted-foreground max-w-sm text-sm">
                  Please try again in a moment.
                </p>
                <Button variant="outline" onClick={() => void imagesQuery.refetch()}>
                  Try again
                </Button>
              </CardContent>
            </Card>
          )}

          {imagesQuery.isSuccess && visibleImages.length === 0 && (
            <Card className="py-12">
              <CardContent className="flex flex-col items-center gap-3 text-center">
                <ImagesIcon className="text-muted-foreground size-8" aria-hidden="true" />
                <p className="font-medium">
                  {search ? 'No photos match your search' : 'No photos here yet'}
                </p>
                <p className="text-muted-foreground max-w-sm text-sm">
                  {search
                    ? 'Try a different word, or clear the search to see everything.'
                    : 'Photographs will appear here as they are added.'}
                </p>
                {search && (
                  <Button variant="outline" onClick={() => setSearch('')}>
                    Clear search
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {imagesQuery.isSuccess && visibleImages.length > 0 && (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visibleImages.map((image) => (
                <li key={image.id}>
                  <button
                    type="button"
                    onClick={() => setLightboxAsset(image)}
                    // The button's accessible name describes the photo, so a screen
                    // reader user knows what they are opening.
                    aria-label={`View ${image.title}`}
                    className={cn(
                      'group focus-visible:ring-ring block w-full overflow-hidden rounded-xl',
                      'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    )}
                  >
                    <CloudinaryImage
                      publicId={image.publicId}
                      fallbackSrc={image.secureUrl}
                      alt={image.title}
                      width={512}
                      sizes="(min-width: 1024px) 16rem, (min-width: 640px) 33vw, 50vw"
                      aspectRatio="1 / 1"
                      containerClassName="size-full rounded-xl"
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* --- Lightbox ----------------------------------------------------- */}
      {lightboxAsset && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxAsset.title}
          // Clicking the backdrop closes it; the inner panel stops propagation.
          onClick={() => setLightboxAsset(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setLightboxAsset(null)}
            aria-label="Close photo"
            className={cn(
              'absolute top-4 right-4 flex size-11 items-center justify-center rounded-full',
              'bg-white/15 text-white transition-colors hover:bg-white/25',
              'focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
            )}
          >
            <XIcon className="size-5" aria-hidden="true" />
          </button>

          <figure
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-full w-full max-w-5xl flex-col gap-4"
          >
            <CloudinaryImage
              publicId={lightboxAsset.publicId}
              fallbackSrc={lightboxAsset.secureUrl}
              alt={lightboxAsset.title}
              width={1920}
              sizes="100vw"
              crop="limit"
              priority
              containerClassName="max-h-[75dvh] rounded-xl bg-transparent"
              className="object-contain"
            />

            <figcaption className="flex flex-col gap-2 text-center text-white">
              <span className="text-lg font-semibold">{lightboxAsset.title}</span>
              {lightboxAsset.description && (
                <span className="text-sm text-white/75">{lightboxAsset.description}</span>
              )}
              <span className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {lightboxAsset.categoryLabel && (
                  <Badge variant="gold">{lightboxAsset.categoryLabel}</Badge>
                )}
                <span className="text-xs text-white/55">
                  {format(new Date(lightboxAsset.uploadedAt), 'd MMMM yyyy')}
                </span>
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}

function CategoryChip({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        isActive
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-foreground hover:bg-secondary',
      )}
    >
      {label}
    </button>
  )
}
