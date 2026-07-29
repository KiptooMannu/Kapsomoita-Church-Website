import * as AvatarPrimitive from '@radix-ui/react-avatar'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Avatar({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn('relative flex size-9 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  )
}

export function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full object-cover', className)}
      {...props}
    />
  )
}

/**
 * Shown until the image loads, and permanently if it fails.
 *
 * `delayMs` avoids a flash of initials on a fast connection — without it, the
 * fallback paints and is immediately replaced.
 */
export function AvatarFallback({
  className,
  delayMs = 300,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      delayMs={delayMs}
      className={cn(
        'bg-secondary text-secondary-foreground flex size-full items-center justify-center',
        'rounded-full text-xs font-semibold',
        className,
      )}
      {...props}
    />
  )
}
