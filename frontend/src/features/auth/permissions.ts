import type { CurrentUser, RoleName } from '@/lib/api/types'

/**
 * Client-side permission checks.
 *
 * These drive what the UI *shows*. They are not a security boundary — every
 * endpoint is independently authorised server-side by `@PreAuthorize`. Hiding a
 * button the user cannot use is a courtesy; the server is what makes it safe.
 */

/** Super Admin implicitly holds every permission. */
function isSuperAdmin(user: CurrentUser | null): boolean {
  return user?.roles.includes('SUPER_ADMIN') ?? false
}

/** True when the user holds the given `resource:action` grant. */
export function hasPermission(user: CurrentUser | null, permission: string): boolean {
  if (!user) return false
  if (isSuperAdmin(user)) return true
  return user.permissions.includes(permission)
}

/** True when the user holds at least one of the given grants. */
export function hasAnyPermission(user: CurrentUser | null, permissions: string[]): boolean {
  if (!user) return false
  if (isSuperAdmin(user)) return true
  return permissions.some((permission) => user.permissions.includes(permission))
}

/** True when the user holds every one of the given grants. */
export function hasAllPermissions(user: CurrentUser | null, permissions: string[]): boolean {
  if (!user) return false
  if (isSuperAdmin(user)) return true
  return permissions.every((permission) => user.permissions.includes(permission))
}

/**
 * True when the user holds one of the given roles.
 *
 * Prefer {@link hasPermission}: role checks harden the UI against the role
 * definitions, so adjusting a role's grants server-side would not be reflected
 * here. Reserve this for genuinely role-shaped decisions.
 */
export function hasRole(user: CurrentUser | null, ...roles: RoleName[]): boolean {
  if (!user) return false
  return roles.some((role) => user.roles.includes(role))
}

/** The user's most privileged role, for display in the account menu. */
export function primaryRole(user: CurrentUser | null): RoleName | null {
  if (!user || user.roles.length === 0) return null
  const precedence: RoleName[] = [
    'SUPER_ADMIN',
    'PASTOR',
    'SECRETARY',
    'MEDIA_TEAM',
    'EDITOR',
    'VOLUNTEER',
  ]
  return precedence.find((role) => user.roles.includes(role)) ?? null
}
