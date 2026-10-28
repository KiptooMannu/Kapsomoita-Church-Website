import type { ReactNode } from 'react'
import { useSiteImages } from '@/features/content/site-images'
import { cn } from '@/lib/utils'

export interface PageBannerProps {
  eyebrow?: string
  title: string
  description?: string
  /** Small icon tile above the title. */
  icon?: ReactNode
  align?: 'center' | 'left'
  children?: ReactNode
  className?: string
  /** Background photograph. Replaced in Admin → Website photos. */
  imageKey?: string
}

/**
 * Shared interior-page header.
 *
 * Every public page that is not the homepage opens with this banner, so About,
 * sermons, ministries and the rest share one height, type scale and gold accent.
 * The top padding includes the fixed header, so the layout must not add it again.
 */
export function PageBanner({
  eyebrow,
  title,
  description,
  icon,
  align = 'center',
  children,
  className,
  imageKey,
}: PageBannerProps) {
  const centered = align === 'center'
  const photos = useSiteImages()
  const imageUrl = imageKey ? photos.url(imageKey) : null

  return (
    <header
      className={cn(
        'bg-brand-950 relative overflow-hidden text-white',
        'pt-[calc(var(--header-height)+3.25rem)] pb-16 sm:pb-20',
        className,
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="ken-burns absolute inset-0 size-full object-cover"
          />
        )}
        <div
          className={cn(
            'absolute inset-0',
            imageUrl ? 'bg-brand-950/72' : 'bg-transparent',
          )}
        />
        <div className="bg-gold-500/15 absolute -top-24 right-[18%] size-80 rounded-full blur-3xl" />
        <div className="bg-brand-400/20 absolute -bottom-28 left-[12%] size-72 rounded-full blur-3xl" />
      </div>

      <div className={cn('container-page relative', centered && 'text-center')}>
        <div
          className={cn(
            'flex max-w-3xl flex-col gap-4',
            centered && 'mx-auto items-center',
          )}
        >
          {icon && (
            <span className="bg-gold-500/15 text-gold-300 flex size-14 items-center justify-center rounded-2xl">
              {icon}
            </span>
          )}
          {eyebrow && (
            <p className="text-gold-300 text-xs font-semibold tracking-[0.22em] uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </header>
  )
}
