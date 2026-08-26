import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api/client'

/** Mirrors `DownloadDtos.DownloadRequest`. */
export interface DownloadRequest {
  title: string
  description?: string
  category?: string
  assetId: string
  published?: boolean
  sortOrder?: number
}

/** Mirrors `DownloadDtos.DownloadResponse`. */
export interface DownloadResponse {
  id: string
  title: string
  description: string | null
  category: string | null
  assetId: string
  assetUrl: string | null
  assetFileName: string | null
  downloadCount: number
  published: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface DownloadListParams {
  published?: boolean
  category?: string
}

export const downloadsApi = {
  publicList: () => apiGet<DownloadResponse[]>('/downloads'),
  incrementDownload: (id: string) => apiPost<DownloadResponse>(`/downloads/${id}/download`),
  adminList: (params?: DownloadListParams) =>
    apiGet<DownloadResponse[]>('/admin/downloads', { params }),
  adminGet: (id: string) => apiGet<DownloadResponse>(`/admin/downloads/${id}`),
  adminCreate: (data: DownloadRequest) =>
    apiPost<DownloadResponse>('/admin/downloads', data),
  adminUpdate: (id: string, data: DownloadRequest) =>
    apiPut<DownloadResponse>(`/admin/downloads/${id}`, data),
  adminDelete: (id: string) => apiDelete<void>(`/admin/downloads/${id}`),
}
