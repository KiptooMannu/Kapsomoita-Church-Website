import { createContext } from 'react'

/** The three settings a user can choose. `system` follows the OS preference. */
export type ThemePreference = 'light' | 'dark' | 'system'

/** What is actually painted. `system` always resolves to one of these two. */
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeContextValue {
  /** The user's stored choice, including `system`. */
  theme: ThemePreference
  /** The theme currently applied to the document. */
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemePreference) => void
  /** Flips between light and dark, resolving `system` to its opposite first. */
  toggleTheme: () => void
}

/**
 * Undefined by default so `useTheme` can tell "no provider" apart from a
 * legitimately-light theme and throw a useful error instead of silently
 * rendering the wrong colours.
 */
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

/** localStorage key. Exported so the pre-paint inline script can reuse it. */
export const THEME_STORAGE_KEY = 'kapsomoita-theme'
