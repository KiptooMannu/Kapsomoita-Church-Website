import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api/client'
import type { PageResponse } from '@/lib/api/types'

/** Mirrors `EventDtos.EventRequest`. */
export interface EventRequest {
  title: string
  slug: string
  description?: string
  startsAt: string
  endsAt?: string
  venue: string
  capacity?: number
  bannerId?: string
  registrationOpen?: boolean
  published?: boolean
  featured?: boolean
  mapUrl?: string
}

/** Mirrors `EventDtos.EventResponse`. */
export interface EventResponse {
  id: string
  title: string
  slug: string
  description: string | null
  startsAt: string
  endsAt: string | null
  venue: string
  capacity: number | null
  bannerId: string | null
  bannerUrl: string | null
  registrationOpen: boolean
  published: boolean
  featured: boolean
  mapUrl: string | null
  createdByName: string | null
  createdAt: string
  updatedAt: string
}

export interface EventListParams {
  published?: boolean
  search?: string
  page?: number
  size?: number
}

export const eventsApi = {
  upcoming: (params?: Pick<EventListParams, 'page' | 'size'>) =>
    apiGet<EventResponse[]>('/events', { params }),
  featured: (params?: Pick<EventListParams, 'page' | 'size'>) =>
    apiGet<EventResponse[]>('/events/featured', { params }),
  bySlug: (slug: string) => apiGet<EventResponse>(`/events/${slug}`),
  adminList: (params?: EventListParams) =>
    apiGet<PageResponse<EventResponse>>('/admin/events', { params }),
  adminGet: (id: string) => apiGet<EventResponse>(`/admin/events/${id}`),
  adminCreate: (data: EventRequest) => apiPost<EventResponse>('/admin/events', data),
  adminUpdate: (id: string, data: EventRequest) =>
    apiPut<EventResponse>(`/admin/events/${id}`, data),
  adminDelete: (id: string) => apiDelete<void>(`/admin/events/${id}`),
}
