import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api/client'
import type { PageResponse } from '@/lib/api/types'

/** Mirrors `DonationDtos.DonationRequest`. */
export interface DonationRequest {
  donorName?: string
  donorEmail?: string
  donorPhone?: string
  amount: number
  currency?: string
  method: string
  purpose?: string
  status?: string
  providerReference?: string
  providerPayload?: string
  notes?: string
}

/** Mirrors `DonationDtos.DonationResponse`. */
export interface DonationResponse {
  id: string
  donorName: string | null
  donorEmail: string | null
  donorPhone: string | null
  amount: number
  currency: string | null
  method: string
  purpose: string | null
  status: string
  providerReference: string | null
  notes: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

/** Mirrors `DonationDtos.DonationSummaryResponse`. */
export interface DonationSummaryResponse {
  totalAmount: number
  totalCount: number
}

export interface DonationListParams {
  status?: string
  purpose?: string
  startDate?: number
  endDate?: number
  page?: number
  size?: number
}

export interface DonationSummaryParams {
  purpose?: string
  startDate?: number
  endDate?: number
}

export const donationsApi = {
  create: (data: DonationRequest) => apiPost<DonationResponse>('/donations', data),
  adminList: (params?: DonationListParams) =>
    apiGet<PageResponse<DonationResponse>>('/admin/donations', { params }),
  adminSummary: (params?: DonationSummaryParams) =>
    apiGet<DonationSummaryResponse>('/admin/donations/summary', { params }),
  adminGet: (id: string) => apiGet<DonationResponse>(`/admin/donations/${id}`),
  adminUpdate: (id: string, data: DonationRequest) =>
    apiPut<DonationResponse>(`/admin/donations/${id}`, data),
  adminDelete: (id: string) => apiDelete<void>(`/admin/donations/${id}`),
}
