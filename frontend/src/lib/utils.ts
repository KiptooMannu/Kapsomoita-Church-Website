import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges class names, with later Tailwind utilities beating earlier ones.
 *
 * `clsx` flattens conditionals and arrays; `twMerge` then resolves genuine
 * conflicts, so `cn('p-2', 'p-4')` yields `p-4` rather than both. A plain join
 * would emit both and leave the winner to CSS source order — which is why
 * variant overrides on a component silently fail without this.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Clamps a number into an inclusive range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Turns a title into a URL-safe slug.
 * Strips diacritics first so "Kapsomoita Église" yields "kapsomoita-eglise".
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Initials for an avatar fallback, at most two letters. */
export function initials(fullName: string | null | undefined): string {
  if (!fullName) return '?'
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0]?.charAt(0) ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : ''
  return (first + last).toUpperCase()
}

/** Formats a byte count for display, e.g. `2.4 MB`. */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB'] as const
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / Math.pow(1024, exponent)
  return `${value.toFixed(exponent === 0 ? 0 : decimals)} ${units[exponent]}`
}

/**
 * Turns a dotted audit action key into readable text,
 * e.g. `auth.login.success` → `Auth · Login · Success`.
 */
export function humaniseActionKey(action: string): string {
  return action
    .split('.')
    .map((segment) => segment.replace(/_/g, ' '))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' · ')
}
