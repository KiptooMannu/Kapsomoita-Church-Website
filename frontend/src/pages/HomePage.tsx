import { SeoHead } from '@/components/seo/SeoHead'
import { AnnouncementsSection } from '@/components/public/sections/AnnouncementsSection'
import { EventsSection } from '@/components/public/sections/EventsSection'
import { GalleryPreviewSection } from '@/components/public/sections/GalleryPreviewSection'
import { HeroSection } from '@/components/public/sections/HeroSection'
import { LeadershipSection } from '@/components/public/sections/LeadershipSection'
import { LocationSection } from '@/components/public/sections/LocationSection'
import { MinistriesSection } from '@/components/public/sections/MinistriesSection'
import { NewsletterSection } from '@/components/public/sections/NewsletterSection'
import { PastorMessageSection } from '@/components/public/sections/PastorMessageSection'
import { SermonsSection } from '@/components/public/sections/SermonsSection'
import { ServicesSection } from '@/components/public/sections/ServicesSection'
import { TestimonialsSection } from '@/components/public/sections/TestimonialsSection'
import { VerseOfTheDaySection } from '@/components/public/sections/VerseOfTheDaySection'
import { site } from '@/config/site'

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
  return (
    <>
      <SeoHead
        title={site.tagline}
        absoluteTitle={false}
        description={`${site.fullName} — join us for worship in Kapsomoita. Sunday services, ministries for every age, sermons and community outreach.`}
        // Structured data so search engines can show service times and location
        // directly in results.
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Church',
          name: site.fullName,
          alternateName: site.name,
          description: site.vision,
          telephone: site.contact.phone,
          email: site.contact.email,
          address: {
            '@type': 'PostalAddress',
            streetAddress: site.contact.addressLines[0],
            addressLocality: 'Nairobi',
            addressCountry: 'KE',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: site.location.latitude,
            longitude: site.location.longitude,
          },
          sameAs: [
            site.social.facebook,
            site.social.instagram,
            site.social.twitter,
            site.social.youtube,
          ],
        }}
      />

      <HeroSection />
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
      <NewsletterSection />
      <LocationSection />
    </>
  )
}
