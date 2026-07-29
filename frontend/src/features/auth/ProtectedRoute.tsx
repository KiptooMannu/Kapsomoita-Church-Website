import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { FullPageSpinner } from '@/components/feedback/FullPageSpinner'
import type { RoleName } from '@/lib/api/types'
import { useAuth } from './useAuth'

export interface ProtectedRouteProps {
  children: ReactNode
  /** Grants required to enter. Any one of them suffices. */
  permissions?: string[]
  /** Roles required to enter. Any one of them suffices. */
  roles?: RoleName[]
  /** Where to send an unauthenticated visitor. */
  redirectTo?: string
}

/**
 * Gates a route on authentication and, optionally, authorisation.
 *
 * Three states, kept deliberately distinct:
 *
 * 1. **Still initialising** — render a spinner. Redirecting here would sign the
 *    user out on every page reload, because the stored session has not been
 *    validated yet.
 * 2. **Not signed in** — redirect to login, recording the attempted location so
 *    the user lands where they were going rather than on a generic dashboard.
 * 3. **Signed in but not permitted** — redirect to a "no access" screen, *not* to
 *    login. Sending them to login implies bad credentials and produces a loop,
 *    since signing in again changes nothing.
 */
export function ProtectedRoute({
  children,
  permissions,
  roles,
  redirectTo = '/admin/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isInitialising, hasAnyPermission, hasRole } = useAuth()
  const location = useLocation()

  if (isInitialising) {
    return <FullPageSpinner label="Checking your session…" />
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  const permitted =
    (permissions === undefined || permissions.length === 0 || hasAnyPermission(permissions)) &&
    (roles === undefined || roles.length === 0 || hasRole(...roles))

  if (!permitted) {
    return <Navigate to="/admin/no-access" state={{ from: location }} replace />
  }

  return <>{children}</>
}
