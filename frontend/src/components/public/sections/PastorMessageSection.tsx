import { QuoteIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CloudinaryImage } from '@/components/media/CloudinaryImage'
import { Section } from '@/components/public/Section'
import { pastorsMessage } from '@/config/content'
import { mediaPublicId } from '@/config/media-manifest'

/**
 * A welcome from the pastor.
 *
 * Two columns on desktop, stacked on mobile with the portrait first — a face at the
 * top of the section does more to make the page feel personal than the text does.
 */
export function PastorMessageSection() {
  return (
    <Section id="pastors-message">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
        {/* --- Portrait --------------------------------------------------- */}
        <div className="relative mx-auto w-full max-w-sm lg:mx-0">
          <CloudinaryImage
            publicId={mediaPublicId(pastorsMessage.imageLocalPath) ?? ''}
            alt={`${pastorsMessage.name}, ${pastorsMessage.role}`}
            width={640}
            sizes="(min-width: 1024px) 24rem, 100vw"
            aspectRatio="4 / 5"
            gravity="face"
            containerClassName="rounded-2xl shadow-lifted"
          />

          {/* Decorative accent block behind the portrait. */}
          <div
            aria-hidden="true"
            className="bg-gold-400/25 absolute -bottom-4 -left-4 -z-10 size-32 rounded-2xl"
          />
        </div>

        {/* --- Message --------------------------------------------------- */}
        <div className="flex flex-col gap-5">
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            {pastorsMessage.greeting}
          </span>

          <QuoteIcon className="text-gold-500 size-9" aria-hidden="true" />

          {/* A blockquote, because this genuinely is quoted speech. */}
          <blockquote className="flex flex-col gap-4">
            {pastorsMessage.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-base leading-relaxed sm:text-lg">
                {paragraph}
              </p>
            ))}
          </blockquote>

          <footer className="border-border mt-2 flex flex-col gap-1 border-l-2 pl-4">
            <cite className="text-base font-semibold not-italic">{pastorsMessage.name}</cite>
            <span className="text-muted-foreground text-sm">{pastorsMessage.role}</span>
          </footer>

          <div className="flex flex-col gap-3 pt-2 xs:flex-row">
            <Button asChild size="lg">
              <Link to="/about">Our story</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Get in touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  )
}
