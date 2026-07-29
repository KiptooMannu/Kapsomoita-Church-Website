import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

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
