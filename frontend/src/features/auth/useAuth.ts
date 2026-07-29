import { useContext } from 'react'
import { AuthContext, type AuthContextValue } from './auth-context'

/**
 * Access the current session and its actions.
 *
 * @throws when used outside `<AuthProvider>` — a wiring bug, surfaced loudly
 *   rather than silently treated as "signed out".
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an <AuthProvider>.')
  }
  return context
}
