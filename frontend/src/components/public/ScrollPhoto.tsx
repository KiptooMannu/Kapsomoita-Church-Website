import type { ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'
import { useSiteImages } from '@/features/content/site-images'
import { cn } from '@/lib/utils'

const MOTIONS = ['rise', 'slide-left', 'zoom', 'slide-right', 'unfold', 'tilt'] as const

export type ScrollMotion = (typeof MOTIONS)[number]

/** A different entrance for each image in a row, repeating after six. */
export function motionForIndex(index: number): ScrollMotion {
  return MOTIONS[Math.abs(index) % MOTIONS.length]!
}

export interface ScrollFrameProps {
  children: ReactNode
  /** Position in a list. Neighbouring images use different motions. */
  index?: number
  className?: string
}

/**
 * Wraps a photograph so it enters when it reaches the viewport.
 * The motion depends on `index`, so a row does not all pop the same way.
 */
export function ScrollFrame({ children, index = 0, className }: ScrollFrameProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px',
  })

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <div
        data-motion={motionForIndex(index)}
        data-inview={inView ? 'true' : 'false'}
        className="scroll-photo"
      >
        {children}
      </div>
    </div>
  )
}

export interface ScrollPhotoProps {
  /** Slot edited in Admin → Website photos. */
  imageKey: string
  index?: number
  className?: string
  aspectRatio?: string
}

/** A website photograph, with a scroll entrance. The URL comes from the admin. */
export function ScrollPhoto({
  imageKey,
  index = 0,
  className,
  aspectRatio = '16 / 10',
}: ScrollPhotoProps) {
  const photos = useSiteImages()
  const src = photos.url(imageKey)

  return (
    <ScrollFrame index={index} className={className}>
      {src ? (
        <img
          src={src}
          alt={photos.alt(imageKey)}
          referrerPolicy="no-referrer"
          className="size-full object-cover"
          style={{ aspectRatio }}
        />
      ) : (
        <div className="bg-muted size-full" style={{ aspectRatio }} />
      )}
    </ScrollFrame>
  )
}
