/// <reference types="vite/client" />

/**
 * Typed view of the environment variables this app reads.
 *
 * Every value here is inlined into the public bundle at build time, so nothing
 * secret may be added. Secrets belong in backend/.env.
 */
interface ImportMetaEnv {
  /** Base URL of the Spring Boot API, e.g. http://localhost:8080/api */
  readonly VITE_API_URL?: string
  /** 'true' when building for GitHub Pages (affects the router basename). */
  readonly VITE_GITHUB_PAGES?: string
  /** Public, referrer-restricted Google Maps browser key. */
  readonly VITE_GOOGLE_MAPS_API_KEY?: string
  /**
   * Cloudinary cloud name, used to build delivery URLs. Delivery needs no
   * credentials, so this is safe in the bundle; the API key and secret are
   * server-side only.
   */
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string
  /** Public PayPal client id. */
  readonly VITE_PAYPAL_CLIENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
