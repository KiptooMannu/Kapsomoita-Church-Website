/**
 * Cloudinary URL construction for delivery.
 *
 * Uploading happens server-side through the API; this module only builds
 * <em>delivery</em> URLs, which need nothing secret — just the cloud name. That is
 * why `VITE_CLOUDINARY_CLOUD_NAME` is safe to expose in the bundle while the API
 * key and secret stay in `backend/.env`.
 *
 * Transformations are applied through the URL rather than by resizing at upload
 * time, so one stored original can serve a 400px thumbnail and a 2560px hero
 * without re-uploading anything.
 */

const CLOUD_NAME = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? '').trim()

/** True when delivery URLs can be built. */
export const isCloudinaryConfigured = CLOUD_NAME.length > 0

export type CloudinaryResourceType = 'image' | 'video' | 'raw'

export interface CloudinaryTransform {
  /** Target width in pixels. */
  width?: number
  /** Target height in pixels. */
  height?: number
  /**
   * How the image fills the box.
   * `fill` crops to the exact size, `limit` never enlarges, `scale` distorts.
   */
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb'
  /** Which part to keep when cropping. `auto` lets Cloudinary find the subject. */
  gravity?: 'auto' | 'face' | 'faces' | 'center'
  /** `auto` lets Cloudinary choose the quality per image. */
  quality?: number | 'auto' | 'auto:best' | 'auto:eco' | 'auto:low'
  /** `auto` serves AVIF or WebP to browsers that accept them, JPEG otherwise. */
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png'
  /** Device pixel ratio, for crisp rendering on high-density screens. */
  dpr?: number | 'auto'
  /** Gaussian blur strength (1–2000). Used for the placeholder. */
  blur?: number
}

/**
 * Serialises a transform into Cloudinary's URL segment.
 *
 * Order is not significant to Cloudinary, but keeping it stable means identical
 * requests produce identical URLs, which is what lets the CDN and the browser
 * cache them.
 */
function serialiseTransform(transform: CloudinaryTransform): string {
  const parts: string[] = []

  if (transform.width !== undefined) parts.push(`w_${Math.round(transform.width)}`)
  if (transform.height !== undefined) parts.push(`h_${Math.round(transform.height)}`)
  if (transform.crop !== undefined) parts.push(`c_${transform.crop}`)
  if (transform.gravity !== undefined) parts.push(`g_${transform.gravity}`)
  if (transform.blur !== undefined) parts.push(`e_blur:${transform.blur}`)
  if (transform.dpr !== undefined) parts.push(`dpr_${transform.dpr}`)

  // Quality and format default to `auto`, which is the single biggest win
  // available here: Cloudinary picks the codec and compression per request.
  parts.push(`q_${transform.quality ?? 'auto'}`)
  parts.push(`f_${transform.format ?? 'auto'}`)

  return parts.join(',')
}

/**
 * Builds a delivery URL for a stored asset.
 *
 * @param publicId Cloudinary public ID, e.g. `church/gallery/youth/camp-abc123`
 * @returns the URL, or an empty string when Cloudinary is not configured
 */
export function cloudinaryUrl(
  publicId: string,
  transform: CloudinaryTransform = {},
  resourceType: CloudinaryResourceType = 'image',
): string {
  if (!isCloudinaryConfigured || !publicId) return ''

  const encodedId = publicId
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return [
    'https://res.cloudinary.com',
    CLOUD_NAME,
    resourceType,
    'upload',
    serialiseTransform(transform),
    encodedId,
  ].join('/')
}

/** Widths offered in a `srcset`, covering phones through to 4K displays. */
export const RESPONSIVE_WIDTHS = [320, 480, 640, 768, 1024, 1280, 1536, 1920, 2560] as const

/**
 * Builds a `srcset` so the browser downloads the smallest sufficient image.
 *
 * Widths above `maxWidth` are dropped: offering a 2560px variant for a 400px
 * thumbnail wastes bandwidth on high-DPR devices, which would otherwise pick it.
 */
export function cloudinarySrcSet(
  publicId: string,
  transform: Omit<CloudinaryTransform, 'width'> = {},
  maxWidth = 2560,
): string {
  if (!isCloudinaryConfigured || !publicId) return ''

  return RESPONSIVE_WIDTHS.filter((width) => width <= maxWidth)
    .map((width) => `${cloudinaryUrl(publicId, { ...transform, width })} ${width}w`)
    .join(', ')
}

/**
 * A tiny, heavily blurred version used as a placeholder while the real image
 * loads. At 32px wide it is a couple of kilobytes, so it arrives almost
 * immediately and prevents the empty-box flash.
 */
export function cloudinaryPlaceholder(publicId: string): string {
  return cloudinaryUrl(publicId, { width: 32, quality: 'auto:low', blur: 400 })
}

/**
 * Extracts the public ID from a full Cloudinary URL.
 *
 * Useful when the API returns `secureUrl` but a transformed variant is wanted.
 * Returns null for a non-Cloudinary URL, so callers can fall back to using it
 * directly.
 */
export function publicIdFromUrl(url: string): string | null {
  const match = /\/(?:image|video|raw)\/upload\/(?:[^/]+\/)?(.+?)(?:\.[a-z0-9]+)?$/i.exec(url)
  return match?.[1] ?? null
}
