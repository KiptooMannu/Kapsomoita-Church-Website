import { Loader2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FullPageSpinnerProps {
  label?: string
  className?: string
}

/**
 * Centred loading state for route-level waits — a lazy chunk arriving or a
 * session being validated.
 *
 * The label is visible rather than screen-reader-only: a blank page with a
 * spinner gives a user no idea whether anything is happening.
 */
export function FullPageSpinner({ label = 'Loading…', className }: FullPageSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex min-h-[60dvh] w-full flex-col items-center justify-center gap-4 px-4 text-center',
        className,
      )}
    >
      <Loader2Icon className="text-primary size-8 animate-spin" aria-hidden="true" />
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  )
}
