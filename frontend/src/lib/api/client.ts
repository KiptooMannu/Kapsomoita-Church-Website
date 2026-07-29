import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'
import { env } from '@/lib/env'
import { tokenStorage } from './token-storage'
import type { ApiErrorResponse, AuthResponse } from './types'

/** Endpoints that must never trigger a refresh attempt (they are the auth flow). */
const AUTH_FREE_PATHS = ['/auth/login', '/auth/refresh'] as const

/** Marks a request that has already been retried, so a failure cannot loop. */
interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean
}

export const api: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

// ---------------------------------------------------------------------------
// Request: attach the bearer token
// ---------------------------------------------------------------------------
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  const path = config.url ?? ''

  if (token && !AUTH_FREE_PATHS.some((authPath) => path.includes(authPath))) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---------------------------------------------------------------------------
// Response: refresh once on 401, then replay the original request
// ---------------------------------------------------------------------------

/**
 * The in-flight refresh, shared by every request that 401s at the same time.
 *
 * This is the important part: without it, five parallel requests failing together
 * would fire five refreshes. Because the server rotates and revokes on each use,
 * the first would succeed and the rest would present an already-revoked token —
 * which the server correctly treats as a leak and responds to by revoking every
 * session, logging the user out. Sharing one promise avoids that entirely.
 */
let refreshInFlight: Promise<string> | null = null

/** Called when the session cannot be recovered, so the app can react. */
type SessionExpiredHandler = () => void
let onSessionExpired: SessionExpiredHandler | null = null

/**
 * Registers the callback invoked when refreshing fails.
 *
 * Wired by the auth provider rather than navigating from here: this module has no
 * business knowing about the router, and a hard redirect would discard unsaved
 * form state.
 */
export function setSessionExpiredHandler(handler: SessionExpiredHandler | null): void {
  onSessionExpired = handler
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  // A bare axios call, not `api`: using the instance would re-enter these
  // interceptors and could recurse.
  const { data } = await axios.post<AuthResponse>(
    `${env.apiUrl}/auth/refresh`,
    { refreshToken },
    { headers: { 'Content-Type': 'application/json' }, timeout: 30_000 },
  )

  // The server rotates the refresh token, so both values must be stored.
  tokenStorage.set(data.accessToken, data.refreshToken)
  return data.accessToken
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const config = error.config as RetryableConfig | undefined
    const status = error.response?.status
    const path = config?.url ?? ''

    const isRefreshable =
      status === 401 &&
      config !== undefined &&
      !config._retried &&
      !AUTH_FREE_PATHS.some((authPath) => path.includes(authPath)) &&
      tokenStorage.getRefreshToken() !== null

    if (!isRefreshable) {
      return Promise.reject(error)
    }

    config._retried = true

    try {
      // Join the in-flight refresh if one is already running.
      refreshInFlight ??= refreshAccessToken().finally(() => {
        refreshInFlight = null
      })

      const freshToken = await refreshInFlight
      config.headers.Authorization = `Bearer ${freshToken}`
      return api.request(config)
    } catch (refreshFailure) {
      // The refresh token is expired, revoked, or the account was disabled.
      tokenStorage.clear()
      onSessionExpired?.()
      return Promise.reject(refreshFailure)
    }
  },
)

// ---------------------------------------------------------------------------
// Error helpers
// ---------------------------------------------------------------------------

/** A normalised error the UI can render without inspecting axios internals. */
export interface NormalisedApiError {
  status: number
  code: string
  message: string
  fieldErrors: Record<string, string[]>
  /** True for a network failure or timeout, where no response was received. */
  isNetworkError: boolean
}

/**
 * Converts anything thrown by a request into a consistent shape with a message
 * safe to show a user.
 */
export function normaliseApiError(error: unknown): NormalisedApiError {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (!error.response) {
      const timedOut = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
      return {
        status: 0,
        code: timedOut ? 'TIMEOUT' : 'NETWORK_ERROR',
        message: timedOut
          ? 'The server took too long to respond. Please try again.'
          : 'Could not reach the server. Check your connection and try again.',
        fieldErrors: {},
        isNetworkError: true,
      }
    }

    const body = error.response.data
    return {
      status: error.response.status,
      code: body?.code ?? 'UNKNOWN_ERROR',
      message: body?.message ?? 'Something went wrong. Please try again.',
      fieldErrors: body?.fieldErrors ?? {},
      isNetworkError: false,
    }
  }

  return {
    status: 0,
    code: 'UNKNOWN_ERROR',
    message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
    fieldErrors: {},
    isNetworkError: false,
  }
}

// ---------------------------------------------------------------------------
// Typed verb helpers — thin wrappers that unwrap `data`
// ---------------------------------------------------------------------------

export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await api.get<T>(url, config)
  return data
}

export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.post<T>(url, body, config)
  return data
}

export async function apiPut<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.put<T>(url, body, config)
  return data
}

export async function apiPatch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.patch<T>(url, body, config)
  return data
}

export async function apiDelete<T = void>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.delete<T>(url, config)
  return data
}
