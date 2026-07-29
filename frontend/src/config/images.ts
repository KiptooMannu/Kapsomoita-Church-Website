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
 * ## Why the defaults are Lorem Picsum
 *
 * The placeholders below use `picsum.photos`, which serves Unsplash photography
 * from a stable, seeded URL. Hard-coding Unsplash `photo-…` IDs I could not verify
 * would risk shipping broken images, whereas a seeded Picsum URL always resolves
 * and looks the same on every load. Replace them with the church's real
 * photographs — or specific Unsplash links — whenever you are ready.
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

/** Seeded Unsplash-backed placeholder. Deterministic, so it never changes on reload. */
function placeholder(seed: string, width = 1600, height = 900): string {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}

export const images = {
  // --- Homepage hero carousel ------------------------------------------
  hero1: {
    remote: placeholder('kapsomoita-worship-1', 2400, 1350),
    alt: '',
    localPath: 'src/assets/hero/church1.jpg',
  },
  hero2: {
    remote: placeholder('kapsomoita-worship-2', 2400, 1350),
    alt: '',
    localPath: 'src/assets/hero/church2.jpg',
  },
  hero3: {
    remote: placeholder('kapsomoita-worship-3', 2400, 1350),
    alt: '',
    localPath: 'src/assets/hero/church3.jpg',
  },
  hero4: {
    remote: placeholder('kapsomoita-worship-4', 2400, 1350),
    alt: '',
    localPath: 'src/assets/hero/church4.jpg',
  },
  hero5: {
    remote: placeholder('kapsomoita-worship-5', 2400, 1350),
    alt: '',
    localPath: 'src/assets/hero/church5.jpg',
  },

  // --- Pastor ------------------------------------------------------------
  pastorPortrait: {
    remote: placeholder('kapsomoita-pastor', 900, 1125),
    alt: 'Our senior pastor',
    localPath: 'src/assets/leaders/youth-leader1.jpg',
  },

  // --- Ministries --------------------------------------------------------
  ministryYouth: {
    remote: placeholder('kapsomoita-youth', 1200, 900),
    alt: 'Young people gathered for youth ministry',
    localPath: 'src/assets/youth-ministry.jpg',
  },
  ministryWomen: {
    remote: placeholder('kapsomoita-women', 1200, 900),
    alt: 'Women meeting together for Bible study',
    localPath: 'src/assets/women-ministry.jpg',
  },
  ministryMen: {
    remote: placeholder('kapsomoita-men', 1200, 900),
    alt: 'Men meeting together for fellowship',
    localPath: 'src/assets/men-ministry.jpg',
  },
  ministryKids: {
    remote: placeholder('kapsomoita-kids', 1200, 900),
    alt: 'Children in a Sunday School class',
    localPath: 'src/assets/kids-ministry.jpg',
  },
  ministrySundaySchool: {
    remote: placeholder('kapsomoita-sunday-school', 1200, 900),
    alt: 'A Sunday School class in progress',
  },
  ministryChoir: {
    remote: placeholder('kapsomoita-choir', 1200, 900),
    alt: 'The church choir singing',
  },
  ministryPraise: {
    remote: placeholder('kapsomoita-praise', 1200, 900),
    alt: 'Musicians leading worship',
  },
  ministryPrayer: {
    remote: placeholder('kapsomoita-prayer', 1200, 900),
    alt: 'People praying together',
  },
  ministryEvangelism: {
    remote: placeholder('kapsomoita-evangelism', 1200, 900),
    alt: 'Church members sharing the Gospel in the community',
  },
  ministryMissions: {
    remote: placeholder('kapsomoita-missions', 1200, 900),
    alt: 'Mission work in the field',
  },
  ministryMedia: {
    remote: placeholder('kapsomoita-media', 1200, 900),
    alt: 'The media team operating sound and cameras',
  },

  // --- Events ------------------------------------------------------------
  eventYouthCamp: {
    remote: placeholder('kapsomoita-youth-camp', 1200, 750),
    alt: 'Youth camp',
    localPath: 'src/assets/events/youth-camp.jpg',
  },
  eventWomensRetreat: {
    remote: placeholder('kapsomoita-women-retreat', 1200, 750),
    alt: "Women's retreat",
    localPath: 'src/assets/events/women-retreat.jpg',
  },
  eventConference: {
    remote: placeholder('kapsomoita-conference', 1200, 750),
    alt: 'Annual conference',
    localPath: 'src/assets/events/conference.jpg',
  },

  // --- Page headers ------------------------------------------------------
  aboutHeader: {
    remote: placeholder('kapsomoita-about', 2400, 1000),
    alt: '',
  },
  giveHeader: {
    remote: placeholder('kapsomoita-give', 2400, 1000),
    alt: '',
  },
  galleryHeader: {
    remote: placeholder('kapsomoita-gallery', 2400, 1000),
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
