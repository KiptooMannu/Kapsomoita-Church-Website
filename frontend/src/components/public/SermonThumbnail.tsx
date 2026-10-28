import { PlayCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSiteImages } from '@/features/content/site-images'
import { sermonThumbnailUrl, type SermonResponse } from '@/features/content/sermons-api'

/**
 * Shared sermon artwork for the landing page and the sermons page.
 *
 * An uploaded thumbnail wins. A YouTube link supplies its poster. Anything
 * else, including a URL that fails to load, becomes the same play-icon tile.
 */
export function SermonThumbnail({
  sermon,
}: {
  sermon: Pick<SermonResponse, 'thumbnailUrl' | 'videoUrl' | 'videoAssetUrl'>
}) {
  const src = sermonThumbnailUrl(sermon)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  const photos = useSiteImages()
  const scene = photos.url('sermonScene')

  if (!src || failed) {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-secondary">
        {scene && (
          <img
            src={scene}
            alt=""
            referrerPolicy="no-referrer"
            className="size-full object-cover"
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-brand-950/35 text-white">
          <PlayCircleIcon className="size-10" aria-hidden="true" />
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      className="aspect-video w-full bg-muted object-cover"
      onError={() => setFailed(true)}
    />
  )
}
