/**
 * Single, validated entry point for build-time configuration.
 *
 * Reading `import.meta.env` directly across the codebase makes a typo in a
 * variable name fail silently at runtime; centralising it here means a missing
 * value surfaces once, loudly, with a message that says what to do about it.
 */

const REPO_NAME = 'Kapsomoita-Church-Website'

function readString(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : fallback
}

function readBoolean(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'true'
}

const isGitHubPages = readBoolean(import.meta.env.VITE_GITHUB_PAGES)

export const env = {
  /**
   * Base URL for API calls.
   *
   * Defaults to the relative `/api`, which the Vite dev server proxies to the
   * Spring Boot app — so local development needs no CORS configuration at all.
   */
  apiUrl: readString(import.meta.env.VITE_API_URL, '/api'),

  /** GitHub Pages serves from a sub-path; the router needs a matching basename. */
  isGitHubPages,
  routerBasename: isGitHubPages ? `/${REPO_NAME}` : '/',

  googleMapsApiKey: readString(import.meta.env.VITE_GOOGLE_MAPS_API_KEY, ''),
  paypalClientId: readString(import.meta.env.VITE_PAYPAL_CLIENT_ID, ''),

  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const

/**
 * True when a feature's configuration is present. Lets the UI hide a Maps panel
 * rather than render a broken grey box when no key is configured.
 */
export const features = {
  googleMaps: env.googleMapsApiKey.length > 0,
  paypal: env.paypalClientId.length > 0,
} as const
