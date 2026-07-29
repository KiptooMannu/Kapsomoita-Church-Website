/**
 * Where the session tokens live.
 *
 * ## Why localStorage
 *
 * The honest trade-off: `localStorage` is readable by any script on the origin,
 * so a successful XSS can exfiltrate the tokens. The alternative — `HttpOnly`
 * cookies — is immune to that but reintroduces CSRF, requires the API to run on
 * the same site (it does not; the frontend is on Vercel/Pages and the API is
 * separate), and cannot be read by the client to schedule a proactive refresh.
 *
 * Given a cross-origin API, bearer tokens in `localStorage` are the standard
 * choice. The mitigations that matter are therefore: a short access-token
 * lifetime (15 minutes), refresh-token rotation with reuse detection server-side,
 * and disciplined avoidance of `dangerouslySetInnerHTML`.
 *
 * The access token is additionally mirrored in memory so the request interceptor
 * does not touch `localStorage` on every call.
 */

const ACCESS_TOKEN_KEY = 'kapsomoita.accessToken'
const REFRESH_TOKEN_KEY = 'kapsomoita.refreshToken'

/** In-memory mirror; also the sole store when localStorage is unavailable. */
let accessTokenCache: string | null = null

/** Safari private mode and hardened browser settings can throw on access. */
function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // The in-memory cache keeps the current tab working; the session simply does
    // not survive a reload.
  }
}

function safeRemove(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* nothing useful to do */
  }
}

export const tokenStorage = {
  getAccessToken(): string | null {
    if (accessTokenCache !== null) return accessTokenCache
    accessTokenCache = safeGet(ACCESS_TOKEN_KEY)
    return accessTokenCache
  },

  getRefreshToken(): string | null {
    return safeGet(REFRESH_TOKEN_KEY)
  },

  set(accessToken: string, refreshToken: string): void {
    accessTokenCache = accessToken
    safeSet(ACCESS_TOKEN_KEY, accessToken)
    safeSet(REFRESH_TOKEN_KEY, refreshToken)
  },

  clear(): void {
    accessTokenCache = null
    safeRemove(ACCESS_TOKEN_KEY)
    safeRemove(REFRESH_TOKEN_KEY)
  },

  /** True when a refresh token is present, so a session is worth restoring. */
  hasSession(): boolean {
    return this.getRefreshToken() !== null
  },

  /** Key names, so a cross-tab `storage` listener can watch for sign-out. */
  keys: { access: ACCESS_TOKEN_KEY, refresh: REFRESH_TOKEN_KEY } as const,
}
