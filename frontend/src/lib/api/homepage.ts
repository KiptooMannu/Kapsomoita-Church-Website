import { apiDelete, apiGet, apiPost, apiPut } from './client'

export interface HomepageItem {
  id: string
  title: string
  description: string | null
  category: string
  categoryLabel: string
  status: string
  statusLabel: string
  imageUrl: string | null
  linkUrl: string | null
  displayOrder: number
  featured: boolean
  publishedAt: string | null
  scheduledFor: string | null
  createdAt: string
  updatedAt: string
}

export interface HomepageItemRequest {
  title: string
  description?: string
  category: string
  status?: string
  imageUrl?: string
  linkUrl?: string
  displayOrder?: number
  featured?: boolean
  scheduledFor?: string
}

// Public API calls
export async function getPublicHomepageItems(): Promise<HomepageItem[]> {
  return apiGet<HomepageItem[]>('/homepage-items')
}

export async function getFeaturedHomepageItems(): Promise<HomepageItem[]> {
  return apiGet<HomepageItem[]>('/homepage-items/featured')
}

// Admin API calls
export async function getAdminHomepageItems(): Promise<HomepageItem[]> {
  return apiGet<HomepageItem[]>('/admin/content/homepage-items')
}

export async function getAdminHomepageItem(id: string): Promise<HomepageItem> {
  return apiGet<HomepageItem>(`/admin/content/homepage-items/${id}`)
}

export async function createHomepageItem(
  request: HomepageItemRequest,
): Promise<HomepageItem> {
  return apiPost<HomepageItem>('/admin/content/homepage-items', request)
}

export async function updateHomepageItem(
  id: string,
  request: HomepageItemRequest,
): Promise<HomepageItem> {
  return apiPut<HomepageItem>(`/admin/content/homepage-items/${id}`, request)
}

export async function deleteHomepageItem(id: string): Promise<void> {
  return apiDelete<void>(`/admin/content/homepage-items/${id}`)
}