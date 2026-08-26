import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api/client'

/** Mirrors `SettingsDtos.ChurchSettingRequest`. */
export interface ChurchSettingRequest {
  settingKey: string
  settingValue?: string
  valueType: string
  category?: string
  label: string
  description?: string
  publicSetting?: boolean
  sortOrder?: number
}

/** Mirrors `SettingsDtos.ChurchSettingResponse`. */
export interface ChurchSettingResponse {
  settingKey: string
  settingValue: string | null
  valueType: string
  category: string
  label: string
  description: string | null
  publicSetting: boolean
  sortOrder: number
  updatedByName: string | null
  createdAt: string
  updatedAt: string
}

/** Mirrors `SettingsDtos.PublicSettingsResponse`. */
export interface PublicSettingsResponse {
  settings: ChurchSettingResponse[]
}

export interface ChurchSettingListParams {
  category?: string
}

export const churchSettingsApi = {
  public: () => apiGet<PublicSettingsResponse>('/settings'),
  adminList: (params?: ChurchSettingListParams) =>
    apiGet<ChurchSettingResponse[]>('/admin/settings', { params }),
  adminGet: (settingKey: string) =>
    apiGet<ChurchSettingResponse>(`/admin/settings/${settingKey}`),
  adminCreate: (data: ChurchSettingRequest) =>
    apiPost<ChurchSettingResponse>('/admin/settings', data),
  adminUpdate: (settingKey: string, data: ChurchSettingRequest) =>
    apiPut<ChurchSettingResponse>(`/admin/settings/${settingKey}`, data),
  adminDelete: (settingKey: string) =>
    apiDelete<void>(`/admin/settings/${settingKey}`),
}
