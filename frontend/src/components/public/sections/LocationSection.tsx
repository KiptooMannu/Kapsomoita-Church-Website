import { CarIcon, ExternalLinkIcon, LandmarkIcon, MapPinIcon, NavigationIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Section, SectionHeading } from '@/components/public/Section'
import { site } from '@/config/site'
import { env, features } from '@/lib/env'

/**
 * Where to find us, with an interactive map.
 *
 * The map uses the Google Maps **Embed API**, not the JavaScript SDK. That choice
 * matters: the embed is a single iframe needing no script download and no map
 * instance to manage, so it costs far less on a mobile connection than loading the
 * full SDK to render one pin.
 *
 * When no API key is configured the iframe is replaced with a link-out card rather
 * than Google's grey "for development purposes only" watermark, which looks broken
 * to a visitor.
 */
export function LocationSection() {
  const query = encodeURIComponent(site.location.searchQuery)
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`
  const viewUrl = `https://www.google.com/maps/search/?api=1&query=${query}`
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${env.googleMapsApiKey}&q=${query}&zoom=15`

  return (
    <Section id="location" tone="muted">
      <SectionHeading
        eyebrow="Visit us"
        title="Find your way here"
        description="We would love to meet you this Sunday. Here is everything you need to get to us."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_minmax(0,22rem)]">
        {/* --- Map ------------------------------------------------------- */}
        <Card className="overflow-hidden py-0">
          {features.googleMaps ? (
            <iframe
              // A descriptive title is the accessible name for an iframe; without
              // it a screen reader announces only "frame".
              title={`Map showing the location of ${site.fullName}`}
              src={embedUrl}
              loading="lazy"
              // The map is well below the fold, so deferring it keeps it off the
              // critical path entirely.
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="aspect-[4/3] w-full border-0 lg:aspect-auto lg:h-full lg:min-h-[26rem]"
            />
          ) : (
            <CardContent className="flex aspect-[4/3] flex-col items-center justify-center gap-4 py-10 text-center lg:aspect-auto lg:min-h-[26rem]">
              <span className="bg-secondary text-secondary-foreground flex size-14 items-center justify-center rounded-xl">
                <MapPinIcon className="size-7" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-semibold">{site.fullName}</p>
                {site.contact.addressLines.map((line) => (
                  <p key={line} className="text-muted-foreground text-sm">
                    {line}
                  </p>
                ))}
              </div>
              <Button asChild variant="outline">
                <a href={viewUrl} target="_blank" rel="noreferrer">
                  <ExternalLinkIcon aria-hidden="true" />
                  Open in Google Maps
                </a>
              </Button>
            </CardContent>
          )}
        </Card>

        {/* --- Practical details ---------------------------------------- */}
        <div className="flex flex-col gap-4">
          <Card className="py-5">
            <CardContent className="flex flex-col gap-3">
              <h3 className="flex items-center gap-2 text-base font-semibold">
                <MapPinIcon className="text-primary size-4" aria-hidden="true" />
                Our address
              </h3>
              <address className="text-muted-foreground flex flex-col gap-0.5 text-sm not-italic">
                {site.contact.addressLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </CardContent>
          </Card>

          <Card className="py-5">
            <CardContent className="flex flex-col gap-3">
              <h3 className="flex items-center gap-2 text-base font-semibold">
                <CarIcon className="text-primary size-4" aria-hidden="true" />
                Parking
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {site.location.parkingNote}
              </p>
            </CardContent>
          </Card>

          <Card className="py-5">
            <CardContent className="flex flex-col gap-3">
              <h3 className="flex items-center gap-2 text-base font-semibold">
                <LandmarkIcon className="text-primary size-4" aria-hidden="true" />
                Nearby landmarks
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {site.location.landmarkNote}
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button asChild size="lg" block>
              <a href={directionsUrl} target="_blank" rel="noreferrer">
                <NavigationIcon aria-hidden="true" />
                Get directions
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" block>
              <a href={viewUrl} target="_blank" rel="noreferrer">
                <ExternalLinkIcon aria-hidden="true" />
                Open in Google Maps
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  )
}
