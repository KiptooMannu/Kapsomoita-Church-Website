import { apiGet } from '@/lib/api/client'
import type { PageResponse } from '@/lib/api/types'
import type { GalleryCategorySummary, MediaAsset } from './media-api'

/**
 * Public gallery endpoints.
 *
 * Unauthenticated — the server filters to `PUBLIC` visibility, so nothing internal
 * or archived can be reached through these.
 */
export const publicGalleryApi = {
  /** Every category with its public image count, including empty ones. */
  categories(): Promise<GalleryCategorySummary[]> {
    return apiGet<GalleryCategorySummary[]>('/gallery/categories')
  },

  byCategory(categorySlug: string, page = 0, size = 24): Promise<PageResponse<MediaAsset>> {
    return apiGet<PageResponse<MediaAsset>>(`/gallery/categories/${categorySlug}`, {
      params: { page, size },
    })
  },

  /** Featured images, for the homepage preview. */
  featured(limit = 12): Promise<MediaAsset[]> {
    return apiGet<MediaAsset[]>('/gallery/featured', { params: { limit } })
  },
}
