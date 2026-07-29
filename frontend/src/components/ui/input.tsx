import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Text input.
 *
 * `text-base` on mobile stepping down to `text-sm` from `sm:` is deliberate:
 * iOS Safari zooms the viewport when a focused field's font size is under 16px,
 * which reads as the layout jumping on tap.
 */
export function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-input bg-background text-foreground flex h-10 w-full min-w-0 rounded-lg border px-3 py-2',
        'text-base shadow-sm transition-[color,box-shadow,border-color] outline-none sm:text-sm',
        'placeholder:text-muted-foreground',
        'selection:bg-primary selection:text-primary-foreground',
        // File inputs need their embedded button styled separately.
        'file:text-foreground file:inline-flex file:h-8 file:border-0 file:bg-transparent',
        'file:text-sm file:font-medium',
        'focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-2',
        'disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-60',
        // Driven by aria-invalid so the visual state and the accessible state can
        // never disagree.
        'aria-invalid:border-destructive aria-invalid:ring-destructive/25 aria-invalid:ring-2',
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input bg-background text-foreground flex min-h-20 w-full rounded-lg border px-3 py-2',
        'field-sizing-content text-base shadow-sm transition-[color,box-shadow,border-color]',
        'outline-none sm:text-sm',
        'placeholder:text-muted-foreground',
        'focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-2',
        'disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-60',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/25 aria-invalid:ring-2',
        className,
      )}
      {...props}
    />
  )
}
