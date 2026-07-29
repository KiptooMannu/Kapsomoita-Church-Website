import { useContext } from 'react'
import { ThemeContext, type ThemeContextValue } from './theme-context'

/**
 * Access the current theme and the setters for it.
 *
 * @throws when called outside `<ThemeProvider>`, which is a wiring bug rather
 *   than a runtime condition worth handling at every call site.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a <ThemeProvider>.')
  }
  return context
}
