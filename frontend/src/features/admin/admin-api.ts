import { apiGet } from '@/lib/api/client'
import type { ActivityEntry, DashboardStats } from '@/lib/api/types'

/** Typed wrappers over the admin dashboard endpoints. */
export const adminApi = {
  dashboardStats(): Promise<DashboardStats> {
    return apiGet<DashboardStats>('/admin/dashboard/stats')
  },

  recentActivity(limit = 15): Promise<ActivityEntry[]> {
    return apiGet<ActivityEntry[]>('/admin/dashboard/activity', { params: { limit } })
  },
}
