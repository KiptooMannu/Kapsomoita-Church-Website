import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api/client'

/** Mirrors `PrayerDtos.PrayerRequestRequest`. */
export interface PrayerRequestRequest {
  requestorName?: string
  phone?: string
  intention: string
  confidential?: boolean
}

/** Mirrors `PrayerDtos.PrayerRequestResponse`. */
export interface PrayerRequestResponse {
  id: string
  requestorName: string | null
  phone: string | null
  intention: string
  confidential: boolean
  status: string
  pastoralNotes: string | null
  handledByName: string | null
  handledAt: string | null
  ipAddress: string | null
  createdAt: string
  updatedAt: string
}

/** Mirrors `PrayerDtos.UpdatePrayerRequestRequest`. */
export interface UpdatePrayerRequestRequest {
  status?: string
  pastoralNotes?: string
}

export interface PrayerRequestListParams {
  status?: string
}

export const prayerRequestsApi = {
  create: (data: PrayerRequestRequest) =>
    apiPost<PrayerRequestResponse>('/prayer-requests', data),
  publicList: () => apiGet<PrayerRequestResponse[]>('/prayer-requests'),
  adminList: (params?: PrayerRequestListParams) =>
    apiGet<PrayerRequestResponse[]>('/admin/prayer-requests', { params }),
  adminGet: (id: string) =>
    apiGet<PrayerRequestResponse>(`/admin/prayer-requests/${id}`),
  adminUpdate: (id: string, data: UpdatePrayerRequestRequest) =>
    apiPut<PrayerRequestResponse>(`/admin/prayer-requests/${id}`, data),
  adminDelete: (id: string) => apiDelete<void>(`/admin/prayer-requests/${id}`),
}
