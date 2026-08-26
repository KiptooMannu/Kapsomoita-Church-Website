import { apiDelete, apiGet, apiPost, apiPut } from './client'

export interface Announcement {
  id: string
  title: string
  body: string
  tone: string
  toneLabel: string
  displayDate: string | null
  eventDate: string | null
  eventEndDate: string | null
  eventLocation: string | null
  imageUrl: string | null
  imageId: string | null
  linkLabel: string | null
  linkUrl: string | null
  published: boolean
  pinned: boolean
  currentlyVisible: boolean
  startsAt: string | null
  endsAt: string | null
  sortOrder: number
  createdByName: string | null
  createdAt: string
  updatedAt: string
}

export interface AnnouncementRequest {
  title: string
  body: string
  tone?: string
  displayDate?: string
  eventDate?: string
  eventEndDate?: string
  eventLocation?: string
  imageUrl?: string
  imageId?: string
  linkLabel?: string
  linkUrl?: string
  published?: boolean
  pinned?: boolean
  startsAt?: string
  endsAt?: string
  sortOrder?: number
}

// Public API calls
export async function getPublicAnnouncements(): Promise<Announcement[]> {
  return apiGet<Announcement[]>('/announcements')
}

// Admin API calls
export async function getAdminAnnouncements(params?: {
  published?: boolean
  search?: string
}): Promise<Announcement[]> {
  return apiGet<Announcement[]>('/admin/content/announcements', { params })
}

export async function getAdminAnnouncement(id: string): Promise<Announcement> {
  return apiGet<Announcement>(`/admin/content/announcements/${id}`)
}

export async function createAnnouncement(
  request: AnnouncementRequest,
): Promise<Announcement> {
  return apiPost<Announcement>('/admin/content/announcements', request)
}

export async function updateAnnouncement(
  id: string,
  request: AnnouncementRequest,
): Promise<Announcement> {
  return apiPut<Announcement>(`/admin/content/announcements/${id}`, request)
}

export async function deleteAnnouncement(id: string): Promise<void> {
  return apiDelete<void>(`/admin/content/announcements/${id}`)
}