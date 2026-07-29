import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Wrap the app (or a subtree) once. `delayDuration` of 200ms is short enough to
 * feel responsive without firing on every incidental pointer pass.
 */
export function TooltipProvider({
  delayDuration = 200,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
}

export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * Tooltips are invisible to touch users and to some screen readers, so they may
 * only ever carry supplementary detail. Anything essential — the meaning of an
 * icon-only button — belongs in an `aria-label` or visible text as well.
 */
export function TooltipContent({
  className,
  sideOffset = 6,
  children,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'bg-foreground text-background z-50 w-fit max-w-xs rounded-md px-2.5 py-1.5',
          'text-xs font-medium text-balance shadow-md',
          'origin-(--radix-tooltip-content-transform-origin)',
          'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95',
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2 rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}
