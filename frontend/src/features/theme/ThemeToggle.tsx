import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useTheme } from './useTheme'
import type { ThemePreference } from './theme-context'

const OPTIONS: ReadonlyArray<{
  value: ThemePreference
  label: string
  icon: typeof SunIcon
}> = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'system', label: 'System', icon: MonitorIcon },
]

export interface ThemeToggleProps {
  className?: string
  /** Renders a plain icon button that flips light/dark without opening a menu. */
  compact?: boolean
}

/**
 * Theme switcher offering all three settings, so a user can return to following
 * their OS after making an explicit choice — a plain two-way toggle traps them.
 */
export function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={className}
        // The icon alone conveys nothing to a screen reader, and the label states
        // the outcome rather than the current state, which is what a user needs.
        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {resolvedTheme === 'dark' ? (
          <MoonIcon aria-hidden="true" />
        ) : (
          <SunIcon aria-hidden="true" />
        )}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className} aria-label="Change theme">
          {resolvedTheme === 'dark' ? (
            <MoonIcon aria-hidden="true" />
          ) : (
            <SunIcon aria-hidden="true" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-40">
        {OPTIONS.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => setTheme(value)}
            className={cn(theme === value && 'bg-secondary/60')}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
            {theme === value && <CheckIcon className="ml-auto size-4" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
