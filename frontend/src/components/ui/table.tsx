import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Data table primitives.
 *
 * The wrapper scrolls horizontally so a wide table never widens the page — the
 * specification forbids horizontal page scrolling, and an unwrapped table is the
 * most common cause of it. `tabindex=0` on the wrapper keeps that scroll region
 * reachable by keyboard.
 */
export function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div
      data-slot="table-container"
      tabIndex={0}
      className="focus-visible:ring-ring/40 relative w-full overflow-x-auto rounded-lg focus-visible:ring-2"
    >
      <table
        data-slot="table"
        className={cn('w-full caption-bottom border-collapse text-sm', className)}
        {...props}
      />
    </div>
  )
}

export function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('[&_tr]:border-border [&_tr]:border-b', className)}
      {...props}
    />
  )
}

export function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

export function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn('bg-muted/50 border-border border-t font-medium', className)}
      {...props}
    />
  )
}

export function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-border hover:bg-muted/40 data-[state=selected]:bg-muted border-b transition-colors',
        className,
      )}
      {...props}
    />
  )
}

export function TableHead({ className, ...props }: ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'text-muted-foreground h-11 px-3 text-left align-middle',
        'text-xs font-semibold tracking-wide uppercase whitespace-nowrap',
        '[&:has([role=checkbox])]:w-0 [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  )
}

export function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'px-3 py-3 align-middle',
        '[&:has([role=checkbox])]:w-0 [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  )
}

export function TableCaption({ className, ...props }: ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('text-muted-foreground mt-4 text-sm', className)}
      {...props}
    />
  )
}
