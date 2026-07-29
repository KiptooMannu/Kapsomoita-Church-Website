import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api/client'
import type {
  AdminPermission,
  AdminRole,
  AdminUser,
  MessageResponse,
  PageResponse,
} from '@/lib/api/types'

export interface UserListParams {
  search?: string
  role?: string
  active?: boolean
  page?: number
  size?: number
  sort?: string
  direction?: 'asc' | 'desc'
}

export interface CreateUserPayload {
  email: string
  fullName: string
  password: string
  phone?: string
  roles: string[]
  active?: boolean
}

export interface UpdateUserPayload {
  email: string
  fullName: string
  phone?: string | null
  avatarUrl?: string | null
  active?: boolean
}

/** Typed wrappers over the staff administration endpoints. */
export const usersApi = {
  list(params: UserListParams): Promise<PageResponse<AdminUser>> {
    return apiGet<PageResponse<AdminUser>>('/admin/users', { params })
  },

  get(id: string): Promise<AdminUser> {
    return apiGet<AdminUser>(`/admin/users/${id}`)
  },

  create(payload: CreateUserPayload): Promise<AdminUser> {
    return apiPost<AdminUser>('/admin/users', payload)
  },

  update(id: string, payload: UpdateUserPayload): Promise<AdminUser> {
    return apiPut<AdminUser>(`/admin/users/${id}`, payload)
  },

  /** Roles change through their own endpoint so the action is separately audited. */
  updateRoles(id: string, roles: string[]): Promise<AdminUser> {
    return apiPut<AdminUser>(`/admin/users/${id}/roles`, { roles })
  },

  resetPassword(id: string, newPassword: string): Promise<MessageResponse> {
    return apiPost<MessageResponse>(`/admin/users/${id}/reset-password`, { newPassword })
  },

  /** Clears a failed-login lockout without changing the password. */
  unlock(id: string): Promise<AdminUser> {
    return apiPost<AdminUser>(`/admin/users/${id}/unlock`)
  },

  remove(id: string): Promise<void> {
    return apiDelete<void>(`/admin/users/${id}`)
  },
}

export const rolesApi = {
  list(): Promise<AdminRole[]> {
    return apiGet<AdminRole[]>('/admin/roles')
  },

  permissions(): Promise<AdminPermission[]> {
    return apiGet<AdminPermission[]>('/admin/roles/permissions')
  },
}
