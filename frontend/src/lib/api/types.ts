/**
 * Types mirroring the Spring Boot API contract.
 *
 * Kept hand-written rather than generated so the shape stays reviewable, but they
 * must be updated alongside the corresponding Java DTO. Each type notes its
 * counterpart.
 */

/** Mirrors `ApiErrorResponse`. The single error shape every endpoint returns. */
export interface ApiErrorResponse {
  timestamp: string
  status: number
  /** Stable machine-readable key, e.g. `ACCOUNT_LOCKED`. Prefer this over `message`. */
  code: string
  message: string
  path: string
  /** Present only for `VALIDATION_FAILED`; keyed by field name. */
  fieldErrors?: Record<string, string[]>
}

/** Mirrors `AuthDtos.CurrentUser`. */
export interface CurrentUser {
  id: string
  email: string
  fullName: string
  phone: string | null
  avatarUrl: string | null
  active: boolean
  /** Role names without the `ROLE_` prefix, e.g. `['PASTOR']`. */
  roles: string[]
  /** Flattened `resource:action` grants across all of the user's roles. */
  permissions: string[]
  lastLoginAt: string | null
  createdAt: string
}

/** Mirrors `AuthDtos.AuthResponse`. */
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresInSeconds: number
  user: CurrentUser
}

/** Mirrors `AuthDtos.MessageResponse`. */
export interface MessageResponse {
  message: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface UpdateProfilePayload {
  fullName: string
  phone?: string | null
  avatarUrl?: string | null
}

/** Mirrors `UserDtos.UserResponse`. */
export interface AdminUser {
  id: string
  email: string
  fullName: string
  phone: string | null
  avatarUrl: string | null
  active: boolean
  /** True while a failed-login lockout is in force. */
  locked: boolean
  roles: string[]
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

/** Mirrors `UserDtos.RoleResponse`. */
export interface AdminRole {
  id: string
  name: string
  displayName: string
  description: string | null
  system: boolean
  permissions: string[]
  userCount: number
}

/** Mirrors `UserDtos.PermissionResponse`. */
export interface AdminPermission {
  id: string
  name: string
  resource: string
  action: string
  description: string | null
}

/** Mirrors `UserDtos.PageResponse`. `page` is zero-based. */
export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

/** Mirrors `DashboardController.DashboardStats`. */
export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalAuditEvents: number
  auditEventsLast24h: number
}

/** Mirrors `DashboardController.ActivityEntry`. */
export interface ActivityEntry {
  id: string
  action: string
  actorEmail: string | null
  resourceType: string | null
  resourceId: string | null
  ipAddress: string | null
  createdAt: string
}

/** The six system roles. Mirrors the `RoleName` enum. */
export const ROLE_NAMES = [
  'SUPER_ADMIN',
  'PASTOR',
  'SECRETARY',
  'MEDIA_TEAM',
  'EDITOR',
  'VOLUNTEER',
] as const

export type RoleName = (typeof ROLE_NAMES)[number]

/** Human-readable labels, matching `roles.display_name` seeded in migration V1. */
export const ROLE_LABELS: Record<RoleName, string> = {
  SUPER_ADMIN: 'Super Admin',
  PASTOR: 'Pastor',
  SECRETARY: 'Secretary',
  MEDIA_TEAM: 'Media Team',
  EDITOR: 'Editor',
  VOLUNTEER: 'Volunteer',
}
