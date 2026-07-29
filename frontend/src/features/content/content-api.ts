import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api/client'
import type { PageResponse } from '@/lib/api/types'

export interface Announcement {
  id: string
  title: string
  body: string
  tone: 'INFO' | 'SUCCESS' | 'WARNING'
  toneLabel: string
  displayDate?: string | null
  linkLabel?: string | null
  linkUrl?: string | null
  published: boolean
  pinned: boolean
  currentlyVisible: boolean
  startsAt?: string | null
  endsAt?: string | null
  sortOrder: number
  createdByName?: string | null
  createdAt: string
  updatedAt: string
}

export interface AnnouncementRequest {
  title: string
  body: string
  tone?: string
  displayDate?: string
  linkLabel?: string
  linkUrl?: string
  published?: boolean
  pinned?: boolean
  startsAt?: string | null
  endsAt?: string | null
  sortOrder?: number
}

export interface Testimonial {
  id: string
  quote: string
  authorName?: string | null
  displayAuthor: string
  authorRole?: string | null
  photoId?: string | null
  photoUrl?: string | null
  photoPublicId?: string | null
  published: boolean
  featured: boolean
  sortOrder: number
  createdAt: string
}

export interface TestimonialRequest {
  quote: string
  authorName?: string
  authorRole?: string
  photoId?: string | null
  published?: boolean
  featured?: boolean
  sortOrder?: number
}

export interface ServiceTime {
  id: string
  name: string
  dayOfWeek: string
  dayLabel: string
  timeLabel: string
  location: string
  leader?: string | null
  description?: string | null
  primary: boolean
  published: boolean
  sortOrder: number
}

export interface ServiceTimeRequest {
  name: string
  dayOfWeek: string
  timeLabel: string
  location: string
  leader?: string
  description?: string
  primary?: boolean
  published?: boolean
  sortOrder?: number
}

export interface Leader {
  id: string
  fullName?: string | null
  roleTitle: string
  displayHeading: string
  bio?: string | null
  ministry?: string | null
  email?: string | null
  phone?: string | null
  photoId?: string | null
  photoUrl?: string | null
  photoPublicId?: string | null
  team: 'PASTORAL' | 'MINISTRY' | 'SUPPORT'
  teamLabel: string
  published: boolean
  sortOrder: number
}

export interface LeaderRequest {
  fullName?: string
  roleTitle: string
  bio?: string
  ministry?: string
  email?: string
  phone?: string
  photoId?: string | null
  team?: string
  published?: boolean
  sortOrder?: number
}

export const contentApi = {
  // Public
  publicAnnouncements: () => apiGet<Announcement[]>('/announcements'),
  publicServiceTimes: () => apiGet<ServiceTime[]>('/service-times'),
  publicLeaders: () => apiGet<Leader[]>('/leaders'),
  publicTestimonials: () => apiGet<Testimonial[]>('/testimonials'),

  // Admin Announcements
  adminListAnnouncements: (params?: { published?: boolean; search?: string; page?: number; size?: number }) =>
    apiGet<PageResponse<Announcement>>('/admin/content/announcements', { params }),

  adminCreateAnnouncement: (data: AnnouncementRequest) =>
    apiPost<Announcement>('/admin/content/announcements', data),

  adminUpdateAnnouncement: (id: string, data: AnnouncementRequest) =>
    apiPut<Announcement>(`/admin/content/announcements/${id}`, data),

  adminDeleteAnnouncement: (id: string) =>
    apiDelete<void>(`/admin/content/announcements/${id}`),

  // Admin Testimonials
  adminListTestimonials: (params?: { published?: boolean; page?: number; size?: number }) =>
    apiGet<PageResponse<Testimonial>>('/admin/content/testimonials', { params }),

  adminCreateTestimonial: (data: TestimonialRequest) =>
    apiPost<Testimonial>('/admin/content/testimonials', data),

  adminUpdateTestimonial: (id: string, data: TestimonialRequest) =>
    apiPut<Testimonial>(`/admin/content/testimonials/${id}`, data),

  adminDeleteTestimonial: (id: string) =>
    apiDelete<void>(`/admin/content/testimonials/${id}`),

  // Admin Service Times
  adminListServiceTimes: () =>
    apiGet<ServiceTime[]>('/admin/content/service-times'),

  adminCreateServiceTime: (data: ServiceTimeRequest) =>
    apiPost<ServiceTime>('/admin/content/service-times', data),

  adminUpdateServiceTime: (id: string, data: ServiceTimeRequest) =>
    apiPut<ServiceTime>(`/admin/content/service-times/${id}`, data),

  adminSetPrimaryServiceTime: (id: string) =>
    apiPost<ServiceTime>(`/admin/content/service-times/${id}/primary`),

  adminDeleteServiceTime: (id: string) =>
    apiDelete<void>(`/admin/content/service-times/${id}`),

  // Admin Leaders
  adminListLeaders: () =>
    apiGet<Leader[]>('/admin/content/leaders'),

  adminCreateLeader: (data: LeaderRequest) =>
    apiPost<Leader>('/admin/content/leaders', data),

  adminUpdateLeader: (id: string, data: LeaderRequest) =>
    apiPut<Leader>(`/admin/content/leaders/${id}`, data),

  adminDeleteLeader: (id: string) =>
    apiDelete<void>(`/admin/content/leaders/${id}`),
}
