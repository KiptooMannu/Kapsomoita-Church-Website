import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { InfoIcon } from 'lucide-react'
import { Section } from '@/components/public/Section'
import { SeoHead } from '@/components/seo/SeoHead'
import { site } from '@/config/site'

export interface LegalPageProps {
  variant: 'privacy' | 'terms'
}

/** One headed block of legal copy. */
interface LegalSection {
  heading: string
  paragraphs: readonly string[]
}

/**
 * Privacy Policy and Terms of Use.
 *
 * One component for both, since their structure is identical and only the content
 * differs — two near-identical files would drift.
 *
 * **These are plain-language starting points, not legal advice.** They describe what
 * the site actually does with data, which is the honest and useful part; a lawyer
 * should review them before launch, and the banner says so to the reader too.
 */
export default function LegalPage({ variant }: LegalPageProps) {
  const isPrivacy = variant === 'privacy'

  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Use'
  // Widened to a common type: a union of two readonly tuples is not callable with
  // `.map`, because TypeScript cannot reconcile the two signatures.
  const sections: LegalSection[] = isPrivacy ? [...PRIVACY_SECTIONS] : [...TERMS_SECTIONS]

  return (
    <>
      <SeoHead
        title={title}
        description={`${title} for the ${site.fullName} website.`}
        // Legal boilerplate has no search value and competes with real pages.
        noIndex
      />

      <header className="bg-muted/40 pt-[calc(var(--header-height)+3rem)] pb-12">
        <div className="container-page flex max-w-3xl flex-col gap-3">
          <Badge variant="secondary" className="w-fit">
            Legal
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="text-muted-foreground text-sm">
            Last updated {new Date().toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </header>

      <Section>
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          <Alert variant="warning">
            <InfoIcon aria-hidden="true" />
            <AlertTitle>This document needs legal review</AlertTitle>
            <AlertDescription>
              This is a plain-language draft describing how the site currently works. Please
              have it reviewed by a qualified adviser and adjusted for Kenyan data protection
              law before publishing.
            </AlertDescription>
          </Alert>

          {sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-muted-foreground text-sm leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold tracking-tight">Contact us</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              For any question about this document, or to ask us to correct or delete
              information we hold about you, contact us at{' '}
              <a
                href={`mailto:${site.contact.email}`}
                className="text-primary font-medium hover:underline"
              >
                {site.contact.email}
              </a>{' '}
              or {site.contact.phone}.
            </p>
          </section>
        </div>
      </Section>
    </>
  )
}

/** Describes what the site genuinely collects, rather than generic boilerplate. */
const PRIVACY_SECTIONS = [
  {
    heading: 'What we collect',
    paragraphs: [
      'When you send us a message, submit a prayer request, register for an event or apply to join a ministry, we collect the details you choose to enter — typically your name, email address, phone number and the content of your message.',
      'If you subscribe to our newsletter we store your email address so we can send you church updates.',
      'Church staff who sign in to the administration dashboard have an account holding their name, email address and role.',
    ],
  },
  {
    heading: 'Why we collect it',
    paragraphs: [
      'We use your details only to respond to you, to pray for you where you have asked us to, to administer the events and ministries you have joined, and to send you the updates you have asked for.',
      'We do not sell your information, and we do not share it with third parties for marketing.',
    ],
  },
  {
    heading: 'Prayer requests',
    paragraphs: [
      'Prayer requests may be submitted anonymously. When you do so we record no name or contact details alongside your request.',
      'Requests that are not anonymous are seen only by the pastoral and prayer teams, and are never published without your explicit permission.',
    ],
  },
  {
    heading: 'Photographs',
    paragraphs: [
      'We sometimes publish photographs from services, events and outreach on this website and our social media pages.',
      'If you would prefer not to appear in a published photograph, please tell any member of the media team or email us, and we will remove it.',
    ],
  },
  {
    heading: 'How your information is stored',
    paragraphs: [
      'Information you submit is stored in a hosted database, and photographs and documents are stored with a hosted media provider. Both are accessed over encrypted connections.',
      'Access to the administration dashboard requires an individual account and is limited by role, so staff can only reach the information their responsibilities require.',
    ],
  },
  {
    heading: 'Your rights',
    paragraphs: [
      'You may ask us what information we hold about you, ask us to correct it, or ask us to delete it. We will act on such a request promptly.',
      'You can unsubscribe from our newsletter at any time using the link in any email we send.',
    ],
  },
] as const

const TERMS_SECTIONS = [
  {
    heading: 'Using this website',
    paragraphs: [
      'This website is provided by the church for the benefit of our congregation and community. You are welcome to browse it, share links to it, and use the information on it for personal and non-commercial purposes.',
    ],
  },
  {
    heading: 'Content and copyright',
    paragraphs: [
      'Sermons, written material, photographs and recordings on this site belong to the church or to their respective owners.',
      'You may share and quote our sermons and articles freely for personal, devotional or teaching use, with attribution. Please ask before reproducing them commercially.',
    ],
  },
  {
    heading: 'Submissions',
    paragraphs: [
      'When you submit a message, prayer request, testimony or ministry application, you confirm the information you provide is accurate and that you have the right to share it.',
      'Please do not submit content that is unlawful, abusive or that discloses someone else’s private information without their consent.',
    ],
  },
  {
    heading: 'Giving',
    paragraphs: [
      'Donations made through this site or the payment details published on it go to the church. Gifts are made voluntarily and, as a general rule, are not refundable.',
      'If you believe a gift was made in error, contact us and we will do our best to put it right.',
    ],
  },
  {
    heading: 'Accuracy and availability',
    paragraphs: [
      'We work to keep service times, event details and other information current, but we cannot guarantee that everything is free of error at every moment. If you spot a mistake, please tell us.',
      'We may need to take the site offline occasionally for maintenance.',
    ],
  },
  {
    heading: 'External links',
    paragraphs: [
      'This site links to other websites, including social media and video platforms. We are not responsible for their content or their handling of your data.',
    ],
  },
] as const
