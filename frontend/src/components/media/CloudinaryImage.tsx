import { useState } from 'react'
import {
  cloudinaryPlaceholder,
  cloudinarySrcSet,
  cloudinaryUrl,
  isCloudinaryConfigured,
  type CloudinaryTransform,
} from '@/lib/cloudinary'
import { cn } from '@/lib/utils'

export interface CloudinaryImageProps {
  /** Cloudinary public ID, e.g. `church/hero/church1-abc123`. */
  publicId: string
  /**
   * Alternative text.
   *
   * Required, and intentionally not optional: a decorative image should pass an
   * empty string explicitly, which makes the decision visible in review rather
   * than looking like an oversight.
   */
  alt: string
  /** Fallback URL used when Cloudinary is not configured — e.g. a bundled asset. */
  fallbackSrc?: string
  /** Rendered width, driving the largest variant offered in the srcset. */
  width?: number
  height?: number
  /** `sizes` attribute. Without it the browser assumes 100vw and over-fetches. */
  sizes?: string
  className?: string
  /** Wrapper class. The wrapper exists to host the blurred placeholder. */
  containerClassName?: string
  /**
   * Set for the one image visible at the top of the page. It disables lazy
   * loading and raises fetch priority; using it on more than one image slows the
   * page down by competing for bandwidth.
   */
  priority?: boolean
  crop?: CloudinaryTransform['crop']
  gravity?: CloudinaryTransform['gravity']
  /** Aspect ratio applied to the wrapper, e.g. `'16 / 9'`, to reserve layout space. */
  aspectRatio?: string
}

/**
 * Responsive Cloudinary image with a blurred placeholder.
 *
 * Three things it gets right that a bare `<img>` does not:
 *
 * 1. **No layout shift.** The wrapper reserves space via `aspect-ratio`, so text
 *    below never jumps when the image arrives.
 * 2. **Right-sized downloads.** A `srcset`/`sizes` pair lets the browser fetch a
 *    480px file on a phone instead of the 2560px original.
 * 3. **A visible placeholder.** A 32px blurred copy paints almost immediately,
 *    so the space is never an empty grey box.
 *
 * Falls back to `fallbackSrc` when Cloudinary is unconfigured, which keeps local
 * development working before the media import has run.
 */
export function CloudinaryImage({
  publicId,
  alt,
  fallbackSrc,
  width = 1280,
  height,
  sizes = '100vw',
  className,
  containerClassName,
  priority = false,
  crop = 'fill',
  gravity = 'auto',
  aspectRatio,
}: CloudinaryImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasFailed, setHasFailed] = useState(false)

  const transform: CloudinaryTransform = { crop, gravity, ...(height ? { height } : {}) }

  const usable = isCloudinaryConfigured && publicId && !hasFailed
  const src = usable ? cloudinaryUrl(publicId, { ...transform, width }) : (fallbackSrc ?? '')
  const srcSet = usable ? cloudinarySrcSet(publicId, transform, width) : undefined
  const placeholder = usable ? cloudinaryPlaceholder(publicId) : undefined

  if (!src) {
    // Nothing to show. Render the reserved box rather than a broken image icon.
    return (
      <div
        className={cn('bg-muted', containerClassName)}
        style={aspectRatio ? { aspectRatio } : undefined}
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      className={cn('bg-muted relative overflow-hidden', containerClassName)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Blurred placeholder, faded out once the real image paints. */}
      {placeholder && !isLoaded && (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full scale-110 object-cover blur-lg"
        />
      )}

      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        // Above-the-fold images must not be lazy: deferring them delays the
        // largest contentful paint, which is the opposite of the intent.
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setIsLoaded(true)}
        // A failed Cloudinary fetch falls back to the bundled asset if given one.
        onError={() => setHasFailed(true)}
        className={cn(
          'relative size-full object-cover transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
      />
    </div>
  )
}
