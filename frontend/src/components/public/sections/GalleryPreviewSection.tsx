import { useQuery } from '@tanstack/react-query'
import { ImagesIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CloudinaryImage } from '@/components/media/CloudinaryImage'
import { Section, SectionHeading } from '@/components/public/Section'
import { publicGalleryApi } from '@/features/media/public-gallery-api'
import { cn } from '@/lib/utils'

const PREVIEW_LIMIT = 8

/**
 * Homepage gallery preview.
 *
 * The one homepage section already backed by live data — it reads featured images
 * from `/api/gallery/featured`, so uploading a photo in the admin media library and
 * marking it featured makes it appear here with no code change.
 *
 * The section removes itself when there is nothing to show. An empty gallery grid or
 * an error banner on a church homepage looks broken to a visitor, who neither knows
 * nor cares that an API is involved; the Gallery page itself explains the empty state.
 */
export function GalleryPreviewSection() {
  const galleryQuery = useQuery({
    queryKey: ['public', 'gallery', 'featured', PREVIEW_LIMIT],
    queryFn: () => publicGalleryApi.featured(PREVIEW_LIMIT),
    // Photos change rarely; avoid refetching on every homepage visit.
    staleTime: 10 * 60_000,
    // A failed gallery must not retry aggressively on the public homepage.
    retry: 1,
  })

  const images = galleryQuery.data ?? []

  if (galleryQuery.isError || (galleryQuery.isSuccess && images.length === 0)) {
    return null
  }

  return (
    <Section id="gallery">
      <SectionHeading
        eyebrow="Life together"
        title="From our gallery"
        description="Moments from services, outreach and celebrations across the church."
      />

      {galleryQuery.isPending ? (
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: PREVIEW_LIMIT }, (_, index) => (
            <Skeleton key={index} className="aspect-square rounded-xl" />
          ))}
          <span role="status" aria-live="polite" className="sr-only">
            Loading gallery images…
          </span>
        </div>
      ) : (
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <li
              key={image.id}
              className={cn(
                'group overflow-hidden rounded-xl',
                // Give the first image a larger footprint on wide screens, so the
                // grid reads as a composition rather than a uniform contact sheet.
                index === 0 && 'sm:col-span-2 sm:row-span-2',
              )}
            >
              <Link
                to="/gallery"
                className="focus-visible:ring-ring block size-full focus-visible:ring-2 focus-visible:outline-none"
              >
                <CloudinaryImage
                  // The API returns the public ID directly, so no URL parsing is
                  // needed to build a transformed variant.
                  publicId={image.publicId}
                  fallbackSrc={image.secureUrl}
                  alt={image.title}
                  width={index === 0 ? 1024 : 512}
                  sizes={
                    index === 0
                      ? '(min-width: 1024px) 32rem, (min-width: 640px) 66vw, 50vw'
                      : '(min-width: 1024px) 16rem, (min-width: 640px) 33vw, 50vw'
                  }
                  aspectRatio="1 / 1"
                  containerClassName="size-full"
                  className="transition-transform duration-500 group-hover:scale-110"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 flex justify-center">
        <Button asChild size="lg" variant="outline">
          <Link to="/gallery">
            <ImagesIcon aria-hidden="true" />
            View the full gallery
          </Link>
        </Button>
      </div>
    </Section>
  )
}
