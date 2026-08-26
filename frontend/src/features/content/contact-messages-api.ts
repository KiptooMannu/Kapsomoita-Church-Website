import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api/client'
import type { PageResponse } from '@/lib/api/types'

/** Mirrors `ContactDtos.ContactMessageRequest`. */
export interface ContactMessageRequest {
  fullName: string
  email: string
  phone?: string
  subject?: string
  message: string
}

/** Mirrors `ContactDtos.ContactMessageResponse`. */
export interface ContactMessageResponse {
  id: string
  fullName: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: string
  createdAt: string
}

/** Mirrors `ContactDtos.UpdateContactMessageRequest`. */
export interface UpdateContactMessageRequest {
  status?: string
  replyNotes?: string
}

export interface ContactMessageListParams { search?: string; page?: number; size?: number }

export const contactMessagesApi = {
  create: (data: ContactMessageRequest) =>
    apiPost<ContactMessageResponse>('/contact', data),
  adminList: (params?: ContactMessageListParams) =>
    apiGet<PageResponse<ContactMessageResponse>>('/admin/outreach/contact-messages', { params }),
  adminUpdateStatus: (id: string, status: string) =>
    apiPut<ContactMessageResponse>(`/admin/outreach/contact-messages/${id}/status`, { status }),
  adminDelete: (id: string) => apiDelete<void>(`/admin/outreach/contact-messages/${id}`),
}
