import { PlayCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
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

  if (!src || failed) {
    return (
      <div className="bg-secondary text-primary flex aspect-video w-full items-center justify-center">
        <PlayCircleIcon className="size-10" aria-hidden="true" />
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
