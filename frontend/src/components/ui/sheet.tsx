import * as SheetPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Slide-in panel, used for the mobile navigation drawer and the admin sidebar on
 * small screens.
 *
 * Built on Radix Dialog, which supplies the behaviour the specification demands
 * of the hamburger menu and which is genuinely hard to get right by hand:
 * body-scroll lock, focus trap, focus restored to the trigger on close, Escape
 * to dismiss, click-outside to dismiss, and `aria-modal` semantics.
 */
export const Sheet = SheetPrimitive.Root
export const SheetTrigger = SheetPrimitive.Trigger
export const SheetClose = SheetPrimitive.Close
export const SheetPortal = SheetPrimitive.Portal

export function SheetOverlay({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/45 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  )
}

export interface SheetContentProps extends ComponentProps<typeof SheetPrimitive.Content> {
  /** Edge the panel slides in from. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Set false when the panel provides its own close control. */
  showCloseButton?: boolean
}

export function SheetContent({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          'bg-background fixed z-50 flex flex-col gap-4 shadow-lifted',
          'transition ease-in-out data-[state=open]:duration-300 data-[state=closed]:duration-200',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          side === 'right' &&
            cn(
              'inset-y-0 right-0 h-full w-[85vw] max-w-sm border-l',
              'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
            ),
          side === 'left' &&
            cn(
              'inset-y-0 left-0 h-full w-[85vw] max-w-sm border-r',
              'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
            ),
          side === 'top' &&
            cn(
              'inset-x-0 top-0 h-auto max-h-[85dvh] border-b',
              'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
            ),
          side === 'bottom' &&
            cn(
              'inset-x-0 bottom-0 h-auto max-h-[85dvh] border-t',
              'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
            ),
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            className={cn(
              'ring-offset-background absolute top-4 right-4 rounded-lg p-1.5 opacity-70',
              'transition-opacity hover:opacity-100',
              'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2',
              'disabled:pointer-events-none',
            )}
          >
            <XIcon className="size-5" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

export function SheetHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('border-border flex flex-col gap-1.5 border-b px-5 py-4', className)}
      {...props}
    />
  )
}

export function SheetFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('border-border mt-auto flex flex-col gap-2 border-t px-5 py-4', className)}
      {...props}
    />
  )
}

/**
 * Required by Radix for an accessible name. When the design calls for no visible
 * title, keep the component and add `className="sr-only"` rather than omitting it
 * — Radix logs a warning and screen readers announce an unlabelled dialog.
 */
export function SheetTitle({ className, ...props }: ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('text-foreground text-base font-semibold', className)}
      {...props}
    />
  )
}

export function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}
