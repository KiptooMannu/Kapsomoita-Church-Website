import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Loading placeholder with the shimmer treatment from the design system.
 *
 * Marked `aria-hidden` and paired with a visually-hidden live message by the
 * screens that use it, so assistive tech announces "loading" once rather than
 * reading out a wall of empty boxes.
 */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn('shimmer-surface rounded-md', className)}
      {...props}
    />
  )
}

/** Announces a loading state to assistive technology. */
export function LoadingAnnouncement({ label = 'Loading…' }: { label?: string }) {
  return (
    <span role="status" aria-live="polite" className="sr-only">
      {label}
    </span>
  )
}
