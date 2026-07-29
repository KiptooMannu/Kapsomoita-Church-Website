import type { ReactNode } from 'react'
import type { RoleName } from '@/lib/api/types'
import { useAuth } from './useAuth'

export interface RoleGateProps {
  children: ReactNode
  /** Any one of these grants permits rendering. */
  permissions?: string[]
  /** Any one of these roles permits rendering. */
  roles?: RoleName[]
  /** Rendered instead when the check fails. Defaults to nothing. */
  fallback?: ReactNode
}

/**
 * Conditionally renders part of a page based on the user's grants.
 *
 * For hiding controls the user cannot use — a delete button, a menu entry — rather
 * than for guarding routes (use `ProtectedRoute` for that). Purely cosmetic: the
 * endpoint behind any hidden control is still authorised server-side, so this
 * omission is a courtesy, not a defence.
 */
export function RoleGate({ children, permissions, roles, fallback = null }: RoleGateProps) {
  const { hasAnyPermission, hasRole } = useAuth()

  const permitted =
    (permissions === undefined || permissions.length === 0 || hasAnyPermission(permissions)) &&
    (roles === undefined || roles.length === 0 || hasRole(...roles))

  return <>{permitted ? children : fallback}</>
}
