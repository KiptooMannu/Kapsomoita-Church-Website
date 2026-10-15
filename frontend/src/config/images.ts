import { mediaPublicId } from './media-manifest'

/**
 * Every image on the public site, in one place.
 *
 * ## How to change an image
 *
 * Edit the `remote` URL for the slot you want. That is the only step. To use a
 * specific Unsplash photograph, open it on unsplash.com, copy the image address
 * (right-click → Copy image address) and paste it here, e.g.
 *
 * ```ts
 * heroWorship: {
 *   remote: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=2400&q=80',
 *   alt: 'A congregation singing during a service',
 * },
 * ```
 *
 * ## Defaults
 *
 * Until a Cloudinary import or an admin upload replaces a slot, `remote` is a
 * direct Unsplash file. Leader portraits, sermon thumbnails, event banners and
 * homepage images uploaded in the admin always take precedence.
 *
 * ## Resolution order
 *
 * `resolveImage` prefers a Cloudinary asset when one exists for the slot's
 * `localPath` (populated by the media importer), and falls back to `remote`. So
 * once the church's own photographs are uploaded they take over automatically,
 * with no code change here.
 */

export interface ImageSlot {
  /** Remote URL used until a Cloudinary asset exists. Paste any URL here. */
  remote: string
  /**
   * Meaningful alternative text. Required for every slot — a decorative image
   * should use an empty string, which makes that an explicit decision.
   */
  alt: string
  /**
   * Original repository path, if this slot corresponds to a bundled image the
   * media importer will have uploaded.
   */
  localPath?: string
}

/**
 * Direct Unsplash delivery URL.
 *
 * `picsum.photos` only redirects to Unsplash, and that hop is slow and often
 * blocked, which left empty boxes where a photograph should be. These URLs
 * point at the image file itself.
 */
function unsplash(photoId: string, width = 1600, height = 900): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`
}

export const images = {
  // --- Homepage hero carousel ------------------------------------------
  hero1: {
    remote: unsplash('photo-1438032005730-c779502df39b', 2400, 1350),
    alt: '',
    localPath: 'src/assets/hero/church1.jpg',
  },
  hero2: {
    remote: unsplash('photo-1438232992991-995b7058bbb3', 2400, 1350),
    alt: '',
    localPath: 'src/assets/hero/church2.jpg',
  },
  hero3: {
    remote: unsplash('photo-1507692049790-de58290a4334', 2400, 1350),
    alt: '',
    localPath: 'src/assets/hero/church3.jpg',
  },
  hero4: {
    remote: unsplash('photo-1478144592103-25e218a04891', 2400, 1350),
    alt: '',
    localPath: 'src/assets/hero/church4.jpg',
  },
  hero5: {
    remote: unsplash('photo-1511632765486-a01980e01a18', 2400, 1350),
    alt: '',
    localPath: 'src/assets/hero/church5.jpg',
  },

  // --- Pastor ------------------------------------------------------------
  pastorPortrait: {
    remote: unsplash('photo-1438032005730-c779502df39b', 900, 1125),
    alt: '',
  },

  // --- Ministries --------------------------------------------------------
  ministryYouth: {
    remote: unsplash('photo-1529156069898-49953e39b3ac', 1200, 900),
    alt: 'Young people gathered for youth ministry',
    localPath: 'src/assets/youth-ministry.jpg',
  },
  ministryWomen: {
    remote: unsplash('photo-1529070538774-1843cb3265df', 1200, 900),
    alt: 'Women meeting together for Bible study',
    localPath: 'src/assets/women-ministry.jpg',
  },
  ministryMen: {
    remote: unsplash('photo-1517486808906-6ca8b3f04846', 1200, 900),
    alt: 'Men meeting together for fellowship',
    localPath: 'src/assets/men-ministry.jpg',
  },
  ministryKids: {
    remote: unsplash('photo-1503454537195-1dcabb73ffb9', 1200, 900),
    alt: 'Children in a Sunday School class',
    localPath: 'src/assets/kids-ministry.jpg',
  },
  ministrySundaySchool: {
    remote: unsplash('photo-1503676260728-1c00da094a0b', 1200, 900),
    alt: 'A Sunday School class in progress',
  },
  ministryChoir: {
    remote: unsplash('photo-1516450360452-9312f5e86fc7', 1200, 900),
    alt: 'The church choir singing',
  },
  ministryPraise: {
    remote: unsplash('photo-1493225457124-a3eb161ffa5f', 1200, 900),
    alt: 'Musicians leading worship',
  },
  ministryPrayer: {
    remote: unsplash('photo-1504052434569-70ad5836ab65', 1200, 900),
    alt: 'People praying together',
  },
  ministryEvangelism: {
    remote: unsplash('photo-1469571486292-0ba58a3f068b', 1200, 900),
    alt: 'Church members sharing the Gospel in the community',
  },
  ministryMissions: {
    remote: unsplash('photo-1488521787991-ed7bbaae773c', 1200, 900),
    alt: 'Mission work in the field',
  },
  ministryMedia: {
    remote: unsplash('photo-1492691527719-9d1e07e534b4', 1200, 900),
    alt: 'The media team operating sound and cameras',
  },

  // --- Events ------------------------------------------------------------
  eventYouthCamp: {
    remote: unsplash('photo-1529156069898-49953e39b3ac', 1200, 750),
    alt: 'Youth camp',
    localPath: 'src/assets/events/youth-camp.jpg',
  },
  eventWomensRetreat: {
    remote: unsplash('photo-1529070538774-1843cb3265df', 1200, 750),
    alt: "Women's retreat",
    localPath: 'src/assets/events/women-retreat.jpg',
  },
  eventConference: {
    remote: unsplash('photo-1511578314322-379afb476865', 1200, 750),
    alt: 'Annual conference',
    localPath: 'src/assets/events/conference.jpg',
  },

  // --- Page headers ------------------------------------------------------
  aboutHeader: {
    remote: unsplash('photo-1438032005730-c779502df39b', 2400, 1000),
    alt: '',
  },
  giveHeader: {
    remote: unsplash('photo-1532629345422-7515f3d16bb6', 2400, 1000),
    alt: '',
  },
  galleryHeader: {
    remote: unsplash('photo-1511632765486-a01980e01a18', 2400, 1000),
    alt: '',
  },
} as const satisfies Record<string, ImageSlot>

export type ImageKey = keyof typeof images

/** A resolved image, ready to pass to `CloudinaryImage`. */
export interface ResolvedImage {
  /** Cloudinary public ID, or an empty string when none exists yet. */
  publicId: string
  /** URL used when there is no Cloudinary asset. */
  fallbackSrc: string
  alt: string
}

/**
 * Resolves a slot, preferring the church's own uploaded photograph.
 *
 * Once the media importer has run, `mediaPublicId` returns a real ID and Cloudinary
 * serves the image with responsive sizing and format negotiation. Until then the
 * `remote` URL is used, so every page looks complete from the first render.
 */
export function resolveImage(key: ImageKey): ResolvedImage {
  // Annotated as ImageSlot so `localPath` reads as optional. Without it, `as const`
  // narrows each entry to its own literal shape and the ones with no localPath make
  // the property absent from the union rather than optional.
  const slot: ImageSlot = images[key]
  const publicId = slot.localPath ? (mediaPublicId(slot.localPath) ?? '') : ''

  return { publicId, fallbackSrc: slot.remote, alt: slot.alt }
}

/**
 * Resolves a repository path such as `src/assets/youth-ministry.jpg`.
 *
 * Callers that only know the path still get the remote URL, so a missing
 * Cloudinary import does not leave an empty box.
 */
export function resolveImagePath(localPath?: string | null): ResolvedImage | null {
  if (!localPath) return null
  const match = (Object.keys(images) as ImageKey[]).find(
    (key) => (images[key] as ImageSlot).localPath === localPath,
  )
  return match ? resolveImage(match) : null
}
