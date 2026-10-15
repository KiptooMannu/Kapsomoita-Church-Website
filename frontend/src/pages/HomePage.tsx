import { useEffect, useMemo, useState } from 'react'
import { SeoHead } from '@/components/seo/SeoHead'
import { AnnouncementsSection } from '@/components/public/sections/AnnouncementsSection'
import { EventsSection } from '@/components/public/sections/EventsSection'
import { GalleryPreviewSection } from '@/components/public/sections/GalleryPreviewSection'
import { HeroSection } from '@/components/public/sections/HeroSection'
import { LeadershipSection } from '@/components/public/sections/LeadershipSection'
import { LocationSection } from '@/components/public/sections/LocationSection'
import { MinistriesSection } from '@/components/public/sections/MinistriesSection'
import { PastorMessageSection } from '@/components/public/sections/PastorMessageSection'
import { SermonsSection } from '@/components/public/sections/SermonsSection'
import { ServicesSection } from '@/components/public/sections/ServicesSection'
import { TestimonialsSection } from '@/components/public/sections/TestimonialsSection'
import { VerseOfTheDaySection } from '@/components/public/sections/VerseOfTheDaySection'
import { LivestreamBanner } from '@/components/public/sections/LivestreamBanner'
import { usePublicSite } from '@/features/content/use-public-site'
import { getPublicHomepageItems, type HomepageItem } from '@/lib/api/homepage'

/**
 * Homepage.
 *
 * Section order follows what a first-time visitor needs, in order: who we are (hero),
 * when to come (services), what's happening (announcements, events), how to get
 * involved (ministries), what we teach (sermons), who leads us (pastor), then the
 * softer material, and finally how to reach us.
 *
 * Tones alternate between sections so adjacent blocks separate visually without
 * needing divider rules.
 */
export default function HomePage() {
  const publicSite = usePublicSite()
  const [homepageItems, setHomepageItems] = useState<HomepageItem[]>([])

  useEffect(() => {
    void getPublicHomepageItems()
      .then((items) => {
        setHomepageItems(items.filter((item) => item.status === 'PUBLISHED'))
      })
      .catch(() => setHomepageItems([]))
  }, [])

  const heroItems = useMemo(
    () => homepageItems.filter((item) => item.category === 'HERO_BANNER').slice(0, 8),
    [homepageItems],
  )

  const featureItems = useMemo(
    () => homepageItems.filter((item) => item.category === 'FEATURE').slice(0, 6),
    [homepageItems],
  )

  return (
    <>
      <SeoHead
        title={publicSite.tagline}
        absoluteTitle={false}
        description={`${publicSite.fullName} — join us for worship in Kapsomoita. Sunday services, ministries for every age, sermons and community outreach.`}
        // Structured data so search engines can show service times and location
        // directly in results.
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Church',
          name: publicSite.fullName,
          alternateName: publicSite.name,
          description: publicSite.vision,
          telephone: publicSite.contact.phone,
          email: publicSite.contact.email,
          address: {
            '@type': 'PostalAddress',
            streetAddress: publicSite.contact.addressLines[0],
            addressLocality: 'Kapsomoita',
            addressCountry: 'KE',
          },
          sameAs: [
            publicSite.social.facebook,
            publicSite.social.instagram,
            publicSite.social.twitter,
            publicSite.social.youtube,
          ].filter(Boolean),
        }}
      />

      <HeroSection slides={heroItems} />
      <LivestreamBanner />
      {featureItems.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featureItems.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt="" className="h-44 w-full object-cover" />
                )}
                <div className="space-y-2 p-5">
                  <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                  {item.linkUrl && (
                    <a href={item.linkUrl} className="inline-block text-sm font-medium text-primary hover:underline">
                      Read more
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      <ServicesSection />
      <AnnouncementsSection />
      <EventsSection />
      <MinistriesSection />
      <SermonsSection />
      <PastorMessageSection />
      {/* Leadership sits after the pastor's message: the personal welcome earns the
          visitor's attention, then the team answers "who are these people?". */}
      <LeadershipSection />
      <VerseOfTheDaySection />
      <TestimonialsSection />
      <GalleryPreviewSection />
      <LocationSection />
    </>
  )
}
