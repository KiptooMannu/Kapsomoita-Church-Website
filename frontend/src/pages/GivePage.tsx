import {
  BuildingIcon,
  CheckIcon,
  CopyIcon,
  CreditCardIcon,
  HandHeartIcon,
  HeartIcon,
  InfoIcon,
  SmartphoneIcon,
  SproutIcon,
  UsersIcon,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { donationsApi } from '@/features/content/donations-api'
import { usePublicSite } from '@/features/content/use-public-site'
import { normaliseApiError } from '@/lib/api/client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Section, SectionHeading } from '@/components/public/Section'
import { SeoHead } from '@/components/seo/SeoHead'
import { features } from '@/lib/env'
import { cn } from '@/lib/utils'

/** What giving supports. Concrete rather than abstract, so the ask is credible. */
const GIVING_SUPPORTS = [
  {
    icon: UsersIcon,
    title: 'Ministry to people',
    body: 'Youth work, children’s ministry, women’s and men’s fellowships, and pastoral care.',
  },
  {
    icon: SproutIcon,
    title: 'Mission and outreach',
    body: 'Evangelism in our community and support for partner missionaries further afield.',
  },
  {
    icon: BuildingIcon,
    title: 'The church building',
    body: 'Maintaining the sanctuary and halls, and the ongoing building project.',
  },
  {
    icon: HandHeartIcon,
    title: 'Compassion ministry',
    body: 'Practical help for families in hardship, and hospital and home visitation.',
  },
] as const

/**
 * Giving page.
 *
 * Rebuilt to the shared design system: the same `Section`, `Card`, `Badge` and
 * `Button` primitives as the rest of the site, with the dark brand header the About
 * and Ministries pages use.
 *
 * M-Pesa and bank details are shown with copy buttons rather than as plain text. A
 * mistyped paybill or account number is the single most likely way a gift goes
 * astray, so copying it should not depend on selecting text accurately on a phone.
 */
export default function GivePage() {
  const publicSite = usePublicSite()

  return (
    <>
      <SeoHead
        title="Give"
        description={`Support the work of ${publicSite.fullName} through M-Pesa, bank transfer or in person. Every gift goes toward ministry, mission and compassion.`}
      />

      {/* --- Page header ------------------------------------------------- */}
      <header className="bg-brand-950 relative overflow-hidden py-16 text-white sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="bg-gold-500/15 absolute -top-24 left-1/3 size-80 rounded-full blur-3xl" />
          <div className="bg-brand-400/12 absolute -bottom-24 right-1/3 size-80 rounded-full blur-3xl" />
        </div>

        <div className="container-page relative">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <span className="bg-gold-500/15 text-gold-300 flex size-14 items-center justify-center rounded-2xl">
              <HeartIcon className="size-7" aria-hidden="true" />
            </span>
            <Badge variant="gold">Giving</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Give to the work of God
            </h1>
            <p className="text-base leading-relaxed text-white/80 sm:text-lg">
              Everything we do is made possible by the generosity of this church family.
              Thank you for giving cheerfully and faithfully.
            </p>
          </div>
        </div>
      </header>

      {/* --- Scripture --------------------------------------------------- */}
      <Section id="giving-verse" className="py-12 sm:py-14">
        <figure className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
          <blockquote className="text-lg leading-relaxed text-balance italic sm:text-xl">
            “Each of you should give what you have decided in your heart to give, not
            reluctantly or under compulsion, for God loves a cheerful giver.”
          </blockquote>
          <figcaption className="text-primary text-sm font-semibold">
            2 Corinthians 9:7
          </figcaption>
        </figure>
      </Section>

      {/* --- How to give -------------------------------------------------- */}
      <Section id="how-to-give" tone="muted">
        <SectionHeading
          eyebrow="How to give"
          title="Ways to give"
          description="Choose whichever is easiest for you. Every method reaches the same church account."
        />

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          {/* --- M-Pesa ------------------------------------------------- */}
          <Card className="flex flex-col py-6">
            <CardContent className="flex flex-1 flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="bg-success/12 text-success flex size-12 items-center justify-center rounded-xl">
                  <SmartphoneIcon className="size-6" aria-hidden="true" />
                </span>
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold tracking-tight">M-Pesa</h3>
                  <p className="text-muted-foreground text-xs">Most people give this way</p>
                </div>
              </div>

              <dl className="flex flex-col gap-3">
                <CopyableDetail label="Paybill number" value={publicSite.giving.mpesa.paybill} />
                <CopyableDetail label="Account name" value={publicSite.giving.mpesa.accountName} />
              </dl>

              <ol className="text-muted-foreground flex flex-col gap-1.5 text-sm">
                <li>1. Open M-Pesa and choose Lipa na M-Pesa.</li>
                <li>2. Select Pay Bill.</li>
                <li>3. Enter the paybill number above.</li>
                <li>4. Enter the account name above.</li>
                <li>5. Enter your amount and confirm.</li>
              </ol>
            </CardContent>
          </Card>

          {/* --- Bank --------------------------------------------------- */}
          <Card className="flex flex-col py-6">
            <CardContent className="flex flex-1 flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="bg-info/12 text-info flex size-12 items-center justify-center rounded-xl">
                  <BuildingIcon className="size-6" aria-hidden="true" />
                </span>
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold tracking-tight">Bank transfer</h3>
                  <p className="text-muted-foreground text-xs">
                    For standing orders and larger gifts
                  </p>
                </div>
              </div>

              <dl className="flex flex-col gap-3">
                <CopyableDetail label="Bank" value={publicSite.giving.bank.name} />
                <CopyableDetail label="Account number" value={publicSite.giving.bank.accountNumber} />
                <CopyableDetail label="Branch" value={publicSite.giving.bank.branch} />
              </dl>

              <p className="text-muted-foreground text-sm leading-relaxed">
                Please use your name as the transfer reference so the church office can
                acknowledge your gift.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* --- Card / online ------------------------------------------- */}
        <div className="mx-auto mt-6 max-w-5xl">
          <Card className="py-6">
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="bg-secondary text-secondary-foreground flex size-12 shrink-0 items-center justify-center rounded-xl">
                <CreditCardIcon className="size-6" aria-hidden="true" />
              </span>
              <div className="flex flex-1 flex-col gap-1">
                <h3 className="text-base font-semibold tracking-tight">
                  Card and online giving
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {features.paypal
                    ? 'Online card giving is available. Choose your amount and you will be taken to a secure payment page.'
                    : 'Online card giving is not switched on yet. In the meantime, please use M-Pesa or a bank transfer above — both reach the church directly.'}
                </p>
              </div>
              {/* Honest state: the button is only offered when it would actually work.
                  A live-looking button that goes nowhere costs trust on a giving page
                  more than on any other. */}
              <Badge variant={features.paypal ? 'success' : 'secondary'} className="shrink-0">
                {features.paypal ? 'Available' : 'Coming soon'}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* --- What your giving supports ----------------------------------- */}
      <Section id="what-it-supports">
        <SectionHeading
          eyebrow="Where it goes"
          title="What your giving supports"
          description="Your generosity is put to work in four main areas."
        />

        <ul className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
          {GIVING_SUPPORTS.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <Card className="h-full py-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted">
                <CardContent className="flex flex-col gap-3">
                  <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold tracking-tight">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <GiftNoticeSection />

      {/* --- Accountability ---------------------------------------------- */}
      <Section id="accountability" tone="muted" className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <Alert variant="info">
            <InfoIcon aria-hidden="true" />
            <AlertTitle>Accountability</AlertTitle>
            <AlertDescription>
              The church keeps proper records of all income and expenditure, reported to the
              congregation. If you would like a receipt for your gift, or have a question
              about how funds are used, contact the church office at{' '}
              <a
                href={`mailto:${publicSite.contact.email}`}
                className="font-medium underline underline-offset-2"
              >
                {publicSite.contact.email}
              </a>
              .
            </AlertDescription>
          </Alert>
        </div>
      </Section>
    </>
  )
}

/**
 * Lets a giver tell the office they have sent a gift. This does not move money;
 * it creates a pending donation the finance team can confirm in admin.
 */
function GiftNoticeSection() {
  const [donorName, setDonorName] = useState('')
  const [donorPhone, setDonorPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('MPESA')
  const [purpose, setPurpose] = useState('TITHE')
  const [reference, setReference] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsedAmount = Number(amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error('Enter the amount you gave.')
      return
    }

    setSubmitting(true)
    try {
      await donationsApi.create({
        donorName: donorName.trim() || undefined,
        donorPhone: donorPhone.trim() || undefined,
        amount: parsedAmount,
        currency: 'KES',
        method,
        purpose,
        providerReference: reference.trim() || undefined,
        status: 'PENDING',
        notes: 'Recorded from the public giving page.',
      })
      toast.success('Thank you. The church office has your gift notice.')
      setDonorName('')
      setDonorPhone('')
      setAmount('')
      setReference('')
    } catch (error) {
      toast.error(normaliseApiError(error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Section id="record-gift">
      <SectionHeading
        eyebrow="After you give"
        title="Tell the office"
        description="Sending this does not take payment. It lets the church match your M-Pesa or bank gift and acknowledge it."
      />

      <form onSubmit={(event) => void submit(event)} className="mx-auto mt-10 grid max-w-2xl gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="gift-name">Your name</Label>
            <Input id="gift-name" value={donorName} onChange={(event) => setDonorName(event.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="gift-phone">Phone</Label>
            <Input id="gift-phone" value={donorPhone} onChange={(event) => setDonorPhone(event.target.value)} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="gift-amount">Amount (KES)</Label>
            <Input
              id="gift-amount"
              inputMode="decimal"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="gift-reference">M-Pesa or bank reference</Label>
            <Input id="gift-reference" value={reference} onChange={(event) => setReference(event.target.value)} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="gift-method">How you gave</Label>
            <select
              id="gift-method"
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
            >
              <option value="MPESA">M-Pesa</option>
              <option value="BANK">Bank transfer</option>
              <option value="CASH">Cash</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="gift-purpose">Purpose</Label>
            <select
              id="gift-purpose"
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
              className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
            >
              <option value="TITHE">Tithe</option>
              <option value="OFFERING">Offering</option>
              <option value="BUILDING">Building fund</option>
              <option value="MISSIONS">Missions</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <Button type="submit" disabled={submitting} className="w-fit">
          {submitting ? 'Sending…' : 'Send gift notice'}
        </Button>
      </form>
    </Section>
  )
}

/**
 * A label and value with a copy button.
 *
 * Copying matters here specifically: a paybill or account number typed by hand on a
 * phone is easy to get wrong, and a wrong number sends the gift somewhere else.
 */
function CopyableDetail({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success(`${label} copied.`)
      // Revert the icon after a moment so the button reads as reusable.
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access is blocked on insecure origins and in some browsers.
      toast.error('Could not copy automatically — please select and copy the number.')
    }
  }

  return (
    <div className="bg-muted/50 flex items-center justify-between gap-3 rounded-lg px-3 py-2.5">
      <div className="flex min-w-0 flex-col">
        <dt className="text-muted-foreground text-xs">{label}</dt>
        <dd className="truncate font-mono text-base font-semibold">{value}</dd>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => void copy()}
        aria-label={`Copy ${label}`}
        className={cn('shrink-0', copied && 'text-success')}
      >
        {copied ? (
          <CheckIcon aria-hidden="true" />
        ) : (
          <CopyIcon aria-hidden="true" />
        )}
      </Button>
    </div>
  )
}
