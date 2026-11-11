import { QuoteIcon, UserRoundIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/public/Section'
import { pastorsMessage } from '@/config/content'
import { ScrollFrame } from '@/components/public/ScrollPhoto'
import { contentApi } from '@/features/content/content-api'
import { queryKeys } from '@/lib/query-client'

/**
 * A welcome from the pastor.
 *
 * The first published pastoral leader supplies the portrait, name and bio.
 * The static message remains only until that leader exists.
 */
export function PastorMessageSection() {
  const leadersQuery = useQuery({
    queryKey: queryKeys.public.leaders,
    queryFn: contentApi.publicLeaders,
    staleTime: 5 * 60_000,
  })

  const rawLeaders = Array.isArray(leadersQuery.data) ? leadersQuery.data : []
  const pastor = rawLeaders.find((leader) => leader.team === 'PASTORAL')
  const name = pastor?.fullName || pastor?.roleTitle || pastorsMessage.name
  const role = pastor
    ? [pastor.roleTitle, pastor.ministry].filter(Boolean).join(', ')
    : pastorsMessage.role
  const greeting = pastorsMessage.greeting
  const paragraphs = pastor?.bio
    ? pastor.bio.split(/\n+/).map((paragraph) => paragraph.trim()).filter(Boolean)
    : [...pastorsMessage.body]
  const photoUrl = pastor?.photoUrl
  const [photoFailed, setPhotoFailed] = useState(false)

  useEffect(() => {
    setPhotoFailed(false)
  }, [photoUrl])

  return (
    <Section id="pastors-message">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
        <div className="relative mx-auto w-full max-w-sm lg:mx-0">
          {photoUrl && !photoFailed ? (
            <ScrollFrame index={2} className="rounded-2xl shadow-lifted">
              <img
                src={photoUrl}
                alt={`${name}, ${role}`}
                referrerPolicy="no-referrer"
                className="bg-muted aspect-[4/5] w-full object-cover"
                onError={() => setPhotoFailed(true)}
              />
            </ScrollFrame>
          ) : (
            <div
              className="bg-secondary text-muted-foreground flex aspect-[4/5] w-full items-center justify-center rounded-2xl shadow-lifted"
              aria-hidden="true"
            >
              <UserRoundIcon className="size-16" />
            </div>
          )}

          <div
            aria-hidden="true"
            className="bg-gold-400/25 absolute -bottom-4 -left-4 -z-10 size-32 rounded-2xl"
          />
        </div>

        <div className="flex flex-col gap-5">
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            {greeting}
          </span>

          <QuoteIcon className="text-gold-500 size-9" aria-hidden="true" />

          <blockquote className="flex flex-col gap-4">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-base leading-relaxed sm:text-lg">
                {paragraph}
              </p>
            ))}
          </blockquote>

          <footer className="border-border mt-2 flex flex-col gap-1 border-l-2 pl-4">
            <cite className="text-base font-semibold not-italic">{name}</cite>
            <span className="text-muted-foreground text-sm">{role}</span>
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
