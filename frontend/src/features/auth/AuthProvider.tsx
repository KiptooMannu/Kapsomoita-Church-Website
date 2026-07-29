import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { normaliseApiError, setSessionExpiredHandler } from '@/lib/api/client'
import { tokenStorage } from '@/lib/api/token-storage'
import type { CurrentUser, LoginPayload, RoleName } from '@/lib/api/types'
import { authApi } from './auth-api'
import { AuthContext, type AuthContextValue } from './auth-context'
import {
  hasAnyPermission as checkAnyPermission,
  hasPermission as checkPermission,
  hasRole as checkRole,
} from './permissions'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Owns the authentication state for the app.
 *
 * The session is held in React state and the tokens in `tokenStorage`; on first
 * mount, a stored refresh token triggers a `/auth/me` call to validate it and
 * rehydrate the user. That call is what makes a page reload keep the user signed
 * in, and its failure is what signs them out.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient()

  const [user, setUser] = useState<CurrentUser | null>(null)
  // Start initialising only when there is a session worth restoring; otherwise
  // the login page would flash a loading state for anonymous visitors.
  const [isInitialising, setIsInitialising] = useState(() => tokenStorage.hasSession())
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  /** Clears all client-side session state. Does not call the server. */
  const clearSession = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
    // Drop every cached query: they may hold data this user should not see, and
    // leaving them would leak it to the next account signed in on this device.
    queryClient.clear()
  }, [queryClient])

  // --- Restore a stored session on first load ---------------------------
  useEffect(() => {
    if (!tokenStorage.hasSession()) {
      setIsInitialising(false)
      return
    }

    let cancelled = false

    void (async () => {
      try {
        const restored = await authApi.me()
        if (!cancelled) setUser(restored)
      } catch (error) {
        // The axios interceptor has already tried to refresh by this point, so a
        // failure here means the session is genuinely unrecoverable.
        if (!cancelled) {
          const { isNetworkError } = normaliseApiError(error)
          if (isNetworkError) {
            // The API is unreachable, which says nothing about token validity —
            // keep the tokens so a retry can succeed once it is back.
            toast.error('Could not reach the server. Some features may be unavailable.')
          } else {
            clearSession()
          }
        }
      } finally {
        if (!cancelled) setIsInitialising(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [clearSession])

  // --- React to an unrecoverable refresh failure ------------------------
  useEffect(() => {
    setSessionExpiredHandler(() => {
      clearSession()
      toast.error('Your session has expired. Please sign in again.')
    })
    return () => setSessionExpiredHandler(null)
  }, [clearSession])

  // --- Keep tabs in sync -------------------------------------------------
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      // Signing out in one tab should sign out the others, rather than leaving a
      // stale dashboard rendered with no usable tokens.
      if (event.key === tokenStorage.keys.refresh && event.newValue === null) {
        setUser(null)
        queryClient.clear()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [queryClient])

  // --- Actions -----------------------------------------------------------

  const login = useCallback(
    async (payload: LoginPayload): Promise<CurrentUser> => {
      setIsLoggingIn(true)
      try {
        const response = await authApi.login(payload)
        tokenStorage.set(response.accessToken, response.refreshToken)
        setUser(response.user)
        return response.user
      } finally {
        setIsLoggingIn(false)
      }
    },
    [],
  )

  const logout = useCallback(
    async (options?: { allDevices?: boolean }) => {
      const refreshToken = tokenStorage.getRefreshToken()
      try {
        await authApi.logout(refreshToken, options?.allDevices ?? false)
      } catch {
        // Sign-out must always succeed locally. If the server call fails the
        // token stays valid until it expires, which is preferable to trapping the
        // user in a session they asked to leave.
      } finally {
        clearSession()
      }
    },
    [clearSession],
  )

  const refreshUser = useCallback(async (): Promise<CurrentUser | null> => {
    if (!tokenStorage.hasSession()) return null
    try {
      const fresh = await authApi.me()
      setUser(fresh)
      return fresh
    } catch {
      return null
    }
  }, [])

  // --- Permission helpers bound to the current user ---------------------

  const hasPermission = useCallback(
    (permission: string) => checkPermission(user, permission),
    [user],
  )

  const hasAnyPermission = useCallback(
    (permissions: string[]) => checkAnyPermission(user, permissions),
    [user],
  )

  const hasRole = useCallback((...roles: RoleName[]) => checkRole(user, ...roles), [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isInitialising,
      isLoggingIn,
      isAuthenticated: user !== null,
      login,
      logout,
      refreshUser,
      hasPermission,
      hasAnyPermission,
      hasRole,
    }),
    [
      user,
      isInitialising,
      isLoggingIn,
      login,
      logout,
      refreshUser,
      hasPermission,
      hasAnyPermission,
      hasRole,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
