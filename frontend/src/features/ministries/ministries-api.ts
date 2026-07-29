import { api, apiDelete, apiGet, apiPut } from '@/lib/api/client'
import type { PageResponse } from '@/lib/api/types'

/** Mirrors `MinistryApplicationDtos.SubmitApplicationRequest`. */
export interface SubmitApplicationPayload {
  fullName: string
  email: string
  phone: string
  gender: string
  ageGroup: string
  county?: string
  occupation?: string
  ministrySlug: string
  churchMember: boolean
  baptized: boolean
  skills?: string
  previousExperience?: string
  availability?: string
  prayerRequest?: string
  additionalNotes?: string
  consentToContact: boolean
}

/** Mirrors `MinistryApplicationDtos.SubmitApplicationResponse`. */
export interface SubmitApplicationResult {
  reference: string
  message: string
}

/** Mirrors `MinistryApplicationDtos.ApplicationResponse`. */
export interface MinistryApplication {
  id: string
  fullName: string
  email: string
  phone: string
  gender: string
  genderLabel: string
  ageGroup: string
  ageGroupLabel: string
  requiresParentalConsent: boolean
  county: string | null
  occupation: string | null
  ministrySlug: string
  ministryName: string
  churchMember: boolean
  baptized: boolean
  skills: string | null
  previousExperience: string | null
  availability: string | null
  prayerRequest: string | null
  additionalNotes: string | null
  status: string
  statusLabel: string
  reviewNotes: string | null
  reviewedByName: string | null
  reviewedAt: string | null
  assignedLeader: string | null
  contactedAt: string | null
  createdAt: string
}

/** Mirrors `MinistryApplicationDtos.ApplicationStats`. */
export interface ApplicationStats {
  pending: number
  approved: number
  rejected: number
  archived: number
}

export interface ReviewPayload {
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'
  reviewNotes?: string
  assignedLeader?: string
  markContacted?: boolean
}

export interface ApplicationListParams {
  status?: string
  ministry?: string
  search?: string
  page?: number
  size?: number
}

/** Public submission. No authentication required. */
export const ministryApplicationsApi = {
  submit(payload: SubmitApplicationPayload): Promise<SubmitApplicationResult> {
    return api
      .post<SubmitApplicationResult>('/ministry-applications', payload)
      .then((response) => response.data)
  },
}

/** Staff review endpoints. */
export const adminApplicationsApi = {
  list(params: ApplicationListParams): Promise<PageResponse<MinistryApplication>> {
    return apiGet<PageResponse<MinistryApplication>>('/admin/ministry-applications', { params })
  },

  stats(): Promise<ApplicationStats> {
    return apiGet<ApplicationStats>('/admin/ministry-applications/stats')
  },

  review(id: string, payload: ReviewPayload): Promise<MinistryApplication> {
    return apiPut<MinistryApplication>(`/admin/ministry-applications/${id}/review`, payload)
  },

  remove(id: string): Promise<void> {
    return apiDelete<void>(`/admin/ministry-applications/${id}`)
  },

  /**
   * Downloads the CSV export.
   *
   * Requested as a blob and saved via a temporary object URL, because a plain link
   * cannot carry the Authorization header these endpoints require.
   */
  async exportCsv(status?: string): Promise<void> {
    const response = await api.get('/admin/ministry-applications/export', {
      params: status ? { status } : {},
      responseType: 'blob',
    })

    const url = window.URL.createObjectURL(response.data as Blob)
    const link = document.createElement('a')
    link.href = url
    link.download = status
      ? `ministry-applications-${status.toLowerCase()}.csv`
      : 'ministry-applications.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    // Release the blob, or it is retained until the page unloads.
    window.URL.revokeObjectURL(url)
  },
}
