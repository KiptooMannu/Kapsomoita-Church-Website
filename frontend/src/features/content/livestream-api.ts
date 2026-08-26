import { apiGet, apiPut } from '@/lib/api/client'

/** Mirrors `LivestreamDtos.LivestreamRequest`. */
export interface LivestreamRequest {
  title?: string
  platform?: string
  streamUrl?: string
  embedUrl?: string
  scheduledFor?: string
  offlineMessage?: string
  isLive?: boolean
}

/** Mirrors `LivestreamDtos.LivestreamResponse`. */
export interface LivestreamResponse {
  id: number
  isLive: boolean
  title: string | null
  platform: string | null
  streamUrl: string | null
  embedUrl: string | null
  scheduledFor: string | null
  offlineMessage: string | null
  updatedByName: string | null
  createdAt: string
  updatedAt: string
}

export const livestreamApi = {
  public: () => apiGet<LivestreamResponse>('/livestream'),
  update: (data: LivestreamRequest) =>
    apiPut<LivestreamResponse>('/admin/livestream', data),
}
