import type { ComponentType } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface StatTileProps {
  label: string
  value: number | string | undefined
  /** Secondary context, e.g. "of 12 total". */
  hint?: string
  icon: ComponentType<{ className?: string }>
  isLoading?: boolean
  className?: string
}

/**
 * A single headline figure.
 *
 * A stat tile rather than a chart, because one number answering "how many" needs no
 * axes — a bar of length one communicates less than the number itself.
 *
 * The value uses proportional figures (the default): tabular figures are for columns
 * that must align vertically, which a standalone number does not.
 */
export function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  isLoading = false,
  className,
}: StatTileProps) {
  return (
    <Card className={cn('py-5', className)}>
      <CardContent className="flex items-start gap-4">
        <span
          className="bg-secondary text-secondary-foreground flex size-11 shrink-0 items-center justify-center rounded-xl"
          aria-hidden="true"
        >
          <Icon className="size-5" />
        </span>

        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-muted-foreground text-sm">{label}</span>

          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <span className="text-2xl leading-none font-bold tracking-tight sm:text-3xl">
              {typeof value === 'number' ? value.toLocaleString() : (value ?? '—')}
            </span>
          )}

          {hint && !isLoading && (
            <span className="text-muted-foreground text-xs">{hint}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
