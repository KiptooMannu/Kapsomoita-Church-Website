import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LocationSection } from '@/components/public/sections/LocationSection'
import { Section, SectionHeading } from '@/components/public/Section'
import { SeoHead } from '@/components/seo/SeoHead'
import { contentApi } from '@/features/content/content-api'
import { contactMessagesApi } from '@/features/content/contact-messages-api'
import { prayerRequestsApi } from '@/features/content/prayer-requests-api'
import { usePublicSite } from '@/features/content/use-public-site'
import { serviceTimes as fallbackServiceTimes } from '@/config/site'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'

/**
 * Contact page.
 *
 * Address, phone and email come from Church Settings. Service times come from
 * the admin Service Times screen. Messages and prayer requests are stored for
 * the office to read in admin.
 */
export default function ContactPage() {
  const publicSite = usePublicSite()
  const serviceTimesQuery = useQuery({
    queryKey: queryKeys.public.serviceTimes,
    queryFn: contentApi.publicServiceTimes,
    staleTime: 5 * 60_000,
  })

  const services = (serviceTimesQuery.data && serviceTimesQuery.data.length > 0)
    ? serviceTimesQuery.data.map((service) => ({
        id: service.id,
        name: service.name,
        when: `${service.dayLabel} · ${service.timeLabel}`,
        location: service.location,
      }))
    : fallbackServiceTimes.map((service) => ({
        id: service.name,
        name: service.name,
        when: `${service.day} · ${service.time}`,
        location: service.location,
      }))

  return (
    <>
      <SeoHead
        title="Contact"
        description={`Visit, call or write to ${publicSite.fullName}. Send a message or a prayer request and the church office will receive it.`}
      />

      <header className="bg-brand-950 relative overflow-hidden py-16 text-white sm:py-20">
        <div className="container-page relative">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <Badge variant="gold">Contact</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Get in touch</h1>
            <p className="text-base leading-relaxed text-white/80 sm:text-lg">
              We would love to hear from you. Reach the office directly, or send a message and a prayer request below.
            </p>
          </div>
        </div>
      </header>

      <Section id="contact-details">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <li>
            <Card className="h-full py-6">
              <CardContent className="flex flex-col gap-2">
                <MailIcon className="text-primary size-5" aria-hidden="true" />
                <h2 className="font-semibold">Email</h2>
                <a href={`mailto:${publicSite.contact.email}`} className="text-primary text-sm hover:underline">
                  {publicSite.contact.email}
                </a>
              </CardContent>
            </Card>
          </li>
          <li>
            <Card className="h-full py-6">
              <CardContent className="flex flex-col gap-2">
                <PhoneIcon className="text-primary size-5" aria-hidden="true" />
                <h2 className="font-semibold">Phone</h2>
                <a href={`tel:${publicSite.contact.phoneHref}`} className="text-primary text-sm hover:underline">
                  {publicSite.contact.phone}
                </a>
              </CardContent>
            </Card>
          </li>
          <li>
            <Card className="h-full py-6">
              <CardContent className="flex flex-col gap-2">
                <MapPinIcon className="text-primary size-5" aria-hidden="true" />
                <h2 className="font-semibold">Visit</h2>
                {publicSite.contact.addressLines.map((line) => (
                  <p key={line} className="text-muted-foreground text-sm">{line}</p>
                ))}
              </CardContent>
            </Card>
          </li>
        </ul>
      </Section>

      <Section id="service-schedule" tone="muted">
        <SectionHeading
          eyebrow="When we meet"
          title="Service times"
          description="These times are the ones published by the church office."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.id}>
              <Card className="h-full py-6">
                <CardContent className="flex flex-col gap-2">
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-muted-foreground flex items-center gap-2 text-sm">
                    <ClockIcon className="size-4" aria-hidden="true" />
                    {service.when}
                  </p>
                  <p className="text-muted-foreground text-sm">{service.location}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="write-to-us">
        <div className="grid gap-10 lg:grid-cols-2">
          <MessageForm />
          <PrayerForm />
        </div>
      </Section>

      <LocationSection />
    </>
  )
}

function MessageForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await contactMessagesApi.create({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: subject.trim(),
        message: message.trim(),
      })
      toast.success('Your message is with the church office.')
      setFullName('')
      setEmail('')
      setPhone('')
      setSubject('')
      setMessage('')
    } catch (error) {
      toast.error(normaliseApiError(error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="flex flex-col gap-4">
      <SectionHeading eyebrow="Write to us" title="Send a message" align="left" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" id="contact-name" value={fullName} onChange={setFullName} required />
        <Field label="Email" id="contact-email" type="email" value={email} onChange={setEmail} required />
      </div>
      <Field label="Phone" id="contact-phone" value={phone} onChange={setPhone} />
      <Field label="Subject" id="contact-subject" value={subject} onChange={setSubject} required />
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" required value={message} onChange={(event) => setMessage(event.target.value)} />
      </div>
      <Button type="submit" disabled={submitting} className="w-fit">
        {submitting ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}

function PrayerForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [intention, setIntention] = useState('')
  const [confidential, setConfidential] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await prayerRequestsApi.create({
        requestorName: name.trim() || undefined,
        phone: phone.trim() || undefined,
        intention: intention.trim(),
        confidential,
      })
      toast.success('Your prayer request has been received.')
      setName('')
      setPhone('')
      setIntention('')
    } catch (error) {
      toast.error(normaliseApiError(error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="flex flex-col gap-4">
      <SectionHeading eyebrow="Prayer" title="Ask us to pray" align="left" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" id="prayer-name" value={name} onChange={setName} />
        <Field label="Phone" id="prayer-phone" value={phone} onChange={setPhone} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="prayer-intention">How can we pray?</Label>
        <Textarea
          id="prayer-intention"
          required
          value={intention}
          onChange={(event) => setIntention(event.target.value)}
        />
      </div>
      <label className="text-muted-foreground flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={confidential}
          onChange={(event) => setConfidential(event.target.checked)}
        />
        Keep this request confidential
      </label>
      <Button type="submit" variant="outline" disabled={submitting} className="w-fit">
        {submitting ? 'Sending…' : 'Send prayer request'}
      </Button>
    </form>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
