import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  THEME_STORAGE_KEY,
  ThemeContext,
  type ResolvedTheme,
  type ThemeContextValue,
  type ThemePreference,
} from './theme-context'

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

/** Reads the stored preference, tolerating a disabled or full localStorage. */
function readStoredPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isThemePreference(stored) ? stored : 'system'
  } catch {
    // Safari in private mode throws on localStorage access.
    return 'system'
  }
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_MEDIA_QUERY).matches ? 'dark' : 'light'
}

function resolve(preference: ThemePreference): ResolvedTheme {
  return preference === 'system' ? systemTheme() : preference
}

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * Applies the theme by toggling `.dark` on `<html>`, which is what the
 * `@custom-variant dark` rule in index.css keys off.
 *
 * The initial value is read during the first render rather than in an effect, so
 * the very first paint is already correct. The inline script in index.html covers
 * the same ground before React boots, which is what actually prevents the
 * light-mode flash on a dark-theme reload.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemePreference>(readStoredPreference)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolve(theme))

  // Apply the resolved theme to the document and tell the browser, so native
  // controls (scrollbars, form widgets) match.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
    root.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  // Track the OS preference, but only while the user has chosen `system`.
  useEffect(() => {
    if (theme !== 'system') {
      setResolvedTheme(theme)
      return
    }

    const mediaQuery = window.matchMedia(DARK_MEDIA_QUERY)
    const sync = () => setResolvedTheme(mediaQuery.matches ? 'dark' : 'light')

    sync()
    mediaQuery.addEventListener('change', sync)
    return () => mediaQuery.removeEventListener('change', sync)
  }, [theme])

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Preference is lost on reload but the session still works.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    // Resolve `system` first, so one click always visibly changes something
    // rather than appearing to do nothing when the OS already matches.
    setTheme(resolve(theme) === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  // Keep the theme consistent across tabs of the same site.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY && isThemePreference(event.newValue)) {
        setThemeState(event.newValue)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
