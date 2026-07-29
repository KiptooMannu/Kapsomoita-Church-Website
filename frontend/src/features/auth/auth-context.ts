import { createContext } from 'react'
import type { CurrentUser, LoginPayload, RoleName } from '@/lib/api/types'

export interface AuthContextValue {
  /** The signed-in account, or null when anonymous. */
  user: CurrentUser | null
  /**
   * True while the stored session is being restored on first load.
   *
   * Route guards must wait for this: rendering a redirect to /login while a valid
   * session is still being validated would sign the user out on every refresh.
   */
  isInitialising: boolean
  /** True while a login request is in flight. */
  isLoggingIn: boolean
  isAuthenticated: boolean

  login: (payload: LoginPayload) => Promise<CurrentUser>
  logout: (options?: { allDevices?: boolean }) => Promise<void>
  /** Re-reads the account, e.g. after an admin changes the user's roles. */
  refreshUser: () => Promise<CurrentUser | null>

  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasRole: (...roles: RoleName[]) => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
