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
    // Content
    announcements: (params: Record<string, unknown>) => ['admin', 'announcements', params] as const,
    announcement: (id: string) => ['admin', 'announcements', id] as const,
    sermons: (params: Record<string, unknown>) => ['admin', 'sermons', params] as const,
    sermon: (id: string) => ['admin', 'sermons', id] as const,
    events: (params: Record<string, unknown>) => ['admin', 'events', params] as const,
    event: (id: string) => ['admin', 'events', id] as const,
    testimonials: (params: Record<string, unknown>) => ['admin', 'testimonials', params] as const,
    testimonial: (id: string) => ['admin', 'testimonials', id] as const,
    downloads: (params: Record<string, unknown>) => ['admin', 'downloads', params] as const,
    download: (id: string) => ['admin', 'downloads', id] as const,
    livestream: ['admin', 'livestream'] as const,
    // Church Life
    ministries: ['admin', 'ministries'] as const,
    ministryApplications: ['admin', 'ministry-applications'] as const,
    leaders: ['admin', 'leaders'] as const,
    serviceTimes: ['admin', 'service-times'] as const,
    // People
    contactMessages: (params: Record<string, unknown>) => ['admin', 'contact-messages', params] as const,
    contactMessage: (id: string) => ['admin', 'contact-messages', id] as const,
    prayerRequests: (params: Record<string, unknown>) => ['admin', 'prayer-requests', params] as const,
    prayerRequest: (id: string) => ['admin', 'prayer-requests', id] as const,
    donations: (params: Record<string, unknown>) => ['admin', 'donations', params] as const,
    donation: (id: string) => ['admin', 'donations', id] as const,
    donationSummary: (params: Record<string, unknown>) => ['admin', 'donations', 'summary', params] as const,
    // Administration
    churchSettings: (params: Record<string, unknown>) => ['admin', 'settings', params] as const,
    churchSetting: (key: string) => ['admin', 'settings', key] as const,
    auditLog: (params: Record<string, unknown>) => ['admin', 'audit-log', params] as const,
  },
  public: {
    announcements: ['public', 'announcements'] as const,
    sermons: ['public', 'sermons'] as const,
    featuredSermons: ['public', 'sermons', 'featured'] as const,
    sermon: (slug: string) => ['public', 'sermons', slug] as const,
    events: ['public', 'events'] as const,
    featuredEvents: ['public', 'events', 'featured'] as const,
    event: (slug: string) => ['public', 'events', slug] as const,
    downloads: ['public', 'downloads'] as const,
    livestream: ['public', 'livestream'] as const,
    serviceTimes: ['public', 'service-times'] as const,
    leaders: ['public', 'leaders'] as const,
    testimonials: ['public', 'testimonials'] as const,
    prayerRequests: ['public', 'prayer-requests'] as const,
    settings: ['public', 'settings'] as const,
    gallery: (params: Record<string, unknown>) => ['public', 'gallery', params] as const,
    galleryFeatured: (limit: number) => ['public', 'gallery', 'featured', limit] as const,
    galleryCategories: ['public', 'gallery', 'categories'] as const,
    galleryImages: (category: string) => ['public', 'gallery', 'images', category] as const,
  },
} as const
