import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api/client'
import type { PageResponse } from '@/lib/api/types'

/** Mirrors `SermonDtos.SermonRequest`. */
export interface SermonRequest {
  title: string
  slug: string
  speaker: string
  preachedOn: string
  series?: string
  topic?: string
  bibleReference?: string
  summary?: string
  durationMinutes?: number
  videoUrl?: string
  videoAssetId?: string | null
  audioAssetId?: string | null
  notesAssetId?: string | null
  thumbnailId?: string | null
  published?: boolean
  featured?: boolean
}

/** Mirrors `SermonDtos.SermonResponse`. */
export interface SermonResponse {
  id: string
  title: string
  slug: string
  speaker: string
  preachedOn: string
  series: string | null
  topic: string | null
  bibleReference: string | null
  summary: string | null
  durationMinutes: number | null
  videoUrl: string | null
  videoAssetId: string | null
  videoAssetUrl: string | null
  audioAssetId: string | null
  audioAssetUrl: string | null
  notesAssetId: string | null
  notesAssetUrl: string | null
  thumbnailId: string | null
  thumbnailUrl: string | null
  published: boolean
  featured: boolean
  viewCount: number
  createdByName: string | null
  createdAt: string
  updatedAt: string
}

/** Uploaded thumbnail, or the YouTube poster when the sermon is a YouTube link. */
export function sermonThumbnailUrl(
  sermon: Pick<SermonResponse, 'thumbnailUrl' | 'videoUrl' | 'videoAssetUrl'>,
): string | null {
  if (sermon.thumbnailUrl) return sermon.thumbnailUrl
  const source = sermon.videoUrl || sermon.videoAssetUrl || ''
  const match = source.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|live\/)|v=)([\w-]{11})/,
  )
  return match?.[1] ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null
}

export interface SermonListParams {
  published?: boolean
  search?: string
  page?: number
  size?: number
}

export const sermonsApi = {
  list: (params?: Pick<SermonListParams, 'page' | 'size'>) =>
    apiGet<SermonResponse[]>('/sermons', { params }),
  featured: (params?: Pick<SermonListParams, 'page' | 'size'>) =>
    apiGet<SermonResponse[]>('/sermons/featured', { params }),
  bySlug: (slug: string) => apiGet<SermonResponse>(`/sermons/${slug}`),
  incrementView: (id: string) => apiPost<SermonResponse>(`/sermons/${id}/view`),
  adminList: (params?: SermonListParams) =>
    apiGet<PageResponse<SermonResponse>>('/admin/sermons', { params }),
  adminGet: (id: string) => apiGet<SermonResponse>(`/admin/sermons/${id}`),
  adminCreate: (data: SermonRequest) => apiPost<SermonResponse>('/admin/sermons', data),
  adminUpdate: (id: string, data: SermonRequest) =>
    apiPut<SermonResponse>(`/admin/sermons/${id}`, data),
  adminDelete: (id: string) => apiDelete<void>(`/admin/sermons/${id}`),
}
