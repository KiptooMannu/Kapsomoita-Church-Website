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
  videoAssetId?: string
  audioAssetId?: string
  notesAssetId?: string
  thumbnailId?: string
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
