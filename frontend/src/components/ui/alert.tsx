import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Inline message block.
 *
 * Each variant is expected to be used with an icon and text, so meaning is never
 * carried by colour alone. `destructive` sets `role="alert"` by default, which
 * makes assistive technology announce it immediately — appropriate for an error,
 * disruptive for anything else, which is why the other variants use `role="status"`.
 */
const alertVariants = cva(
  cn(
    'relative grid w-full items-start gap-x-3 gap-y-1 rounded-xl border px-4 py-3 text-sm',
    'has-[>svg]:grid-cols-[auto_1fr] grid-cols-[0_1fr]',
    '[&>svg]:size-5 [&>svg]:translate-y-0.5',
  ),
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground border-border',
        info: 'bg-info/8 text-info border-info/25 [&>svg]:text-info',
        success: 'bg-success/8 text-success border-success/25 [&>svg]:text-success',
        warning:
          'bg-warning/10 text-warning-foreground border-warning/30 dark:text-warning [&>svg]:text-warning',
        destructive:
          'bg-destructive/8 text-destructive border-destructive/25 [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface AlertProps extends ComponentProps<'div'>, VariantProps<typeof alertVariants> {}

export function Alert({ className, variant = 'default', role, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role={role ?? (variant === 'destructive' ? 'alert' : 'status')}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

export function AlertTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 font-semibold tracking-tight', className)}
      {...props}
    />
  )
}

export function AlertDescription({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('col-start-2 text-sm opacity-90 [&_p]:leading-relaxed', className)}
      {...props}
    />
  )
}
