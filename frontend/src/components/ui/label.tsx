import * as LabelPrimitive from '@radix-ui/react-label'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Form label. Radix's label handles the click-to-focus association and prevents
 * text selection on double-click, which a bare `<label>` does not.
 */
export function Label({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none',
        // Dim alongside a disabled control, whether it is a sibling or a parent.
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-60',
        'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-60',
        className,
      )}
      {...props}
    />
  )
}
