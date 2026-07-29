import { QueryClient } from '@tanstack/react-query'
import { normaliseApiError } from '@/lib/api/client'

/**
 * Shared TanStack Query client.
 *
 * Retry policy is the notable choice: 4xx responses are never retried, because a
 * 401, 403, 404 or 422 will fail identically the second time and retrying only
 * delays the error the user needs to see. Genuine transport failures and 5xx
 * responses get two further attempts with backoff.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for a minute: long enough that navigating between
      // admin screens does not refetch everything, short enough to stay current.
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) => {
        const { status, isNetworkError } = normaliseApiError(error)
        if (isNetworkError) return failureCount < 2
        // 4xx is a client-side problem; retrying cannot change the outcome.
        if (status >= 400 && status < 500) return false
        return failureCount < 2
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
      // Refetching on every window focus is noisy for an admin dashboard that is
      // left open alongside other tabs.
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      // Mutations are not idempotent in general, so a blind retry could double a
      // create. Individual mutations opt in where it is safe.
      retry: false,
    },
  },
})

/**
 * Query key factory.
 *
 * Centralised so invalidation cannot drift from the keys actually in use — the
 * usual cause of a list not updating after a create.
 */
export const queryKeys = {
  auth: {
    currentUser: ['auth', 'me'] as const,
  },
  admin: {
    dashboardStats: ['admin', 'dashboard', 'stats'] as const,
    recentActivity: (limit: number) => ['admin', 'dashboard', 'activity', limit] as const,
    users: (params: Record<string, unknown>) => ['admin', 'users', params] as const,
    user: (id: string) => ['admin', 'users', id] as const,
    roles: ['admin', 'roles'] as const,
    permissions: ['admin', 'roles', 'permissions'] as const,
  },
} as const
