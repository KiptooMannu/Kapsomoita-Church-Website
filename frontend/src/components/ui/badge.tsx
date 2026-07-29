import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Compact status label.
 *
 * The status variants (`success`, `warning`, `destructive`) are for state, and
 * are always paired with text — never colour alone — so they remain readable
 * under colour-vision deficiency and in forced-colors mode.
 */
const badgeVariants = cva(
  cn(
    'inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden',
    'rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
    'transition-colors focus-visible:ring-ring/50 focus-visible:ring-2',
    '[&>svg]:pointer-events-none [&>svg]:size-3',
  ),
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'border-border text-foreground',
        success: 'border-transparent bg-success/12 text-success',
        warning: 'border-transparent bg-warning/15 text-warning-foreground dark:text-warning',
        destructive: 'border-transparent bg-destructive/12 text-destructive',
        info: 'border-transparent bg-info/12 text-info',
        gold: 'border-transparent bg-accent-subtle text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends ComponentProps<'span'>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

export function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Component = asChild ? Slot : 'span'
  return (
    <Component
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { badgeVariants }
