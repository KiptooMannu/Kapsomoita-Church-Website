import { apiGet } from '@/lib/api/client'
import type { PageResponse } from '@/lib/api/types'

export interface AuditLogEntry {
  id: string
  action: string
  actorEmail?: string | null
  actorId?: string | null
  actorName?: string | null
  resourceType?: string | null
  resourceId?: string | null
  details?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: string
}

export const auditApi = {
  adminListAuditLogs: (params?: { search?: string; action?: string; page?: number; size?: number }) =>
    apiGet<PageResponse<AuditLogEntry>>('/admin/audit-logs', { params }),
}
