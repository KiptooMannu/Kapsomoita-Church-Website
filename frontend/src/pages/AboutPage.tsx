import {
  BookOpenIcon,
  CompassIcon,
  HandHeartIcon,
  HeartIcon,
  ScrollTextIcon,
  SparklesIcon,
  TargetIcon,
  UsersIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Section, SectionHeading } from '@/components/public/Section'
import { SeoHead } from '@/components/seo/SeoHead'
import { site } from '@/config/site'
import { cn } from '@/lib/utils'

/**
 * Core values.
 *
 * These are drawn from the church's five-fold strategy, which the site already
 * organises its ministry pages around — so the values and the strategy pages
 * reinforce each other rather than presenting two unrelated frameworks.
 */
const CORE_VALUES = [
  {
    icon: BookOpenIcon,
    title: 'The Word of God',
    body: 'Scripture is our final authority. We teach it plainly and submit to it together.',
  },
  {
    icon: HeartIcon,
    title: 'Genuine worship',
    body: 'We come before God with reverence and joy, in spirit and in truth.',
  },
  {
    icon: UsersIcon,
    title: 'Real community',
    body: 'We are a family, not an audience. We carry one another’s burdens.',
  },
  {
    icon: CompassIcon,
    title: 'Faithful discipleship',
    body: 'We help every believer grow from new faith to maturity in Christ.',
  },
  {
    icon: HandHeartIcon,
    title: 'Practical compassion',
    body: 'We serve our neighbours in tangible ways, not words alone.',
  },
  {
    icon: SparklesIcon,
    title: 'Mission-mindedness',
    body: 'We send and support those taking the Gospel where it has not been heard.',
  },
] as const

/**
 * The church's statement of faith.
 *
 * NOTE: this is a standard evangelical summary consistent with the Africa Gospel
 * Church tradition. **Confirm the wording with your leadership before launch** —
 * a statement of faith is a doctrinal document and should be the church's own, not
 * a template.
 */
const STATEMENT_OF_FAITH = [
  {
    title: 'The Scriptures',
    body: 'We believe the Bible is the inspired, infallible Word of God and the final authority for faith and conduct.',
  },
  {
    title: 'God',
    body: 'We believe in one God, eternally existing in three persons: Father, Son and Holy Spirit.',
  },
  {
    title: 'Jesus Christ',
    body: 'We believe in the deity of Jesus Christ, His virgin birth, sinless life, atoning death, bodily resurrection and coming return.',
  },
  {
    title: 'Salvation',
    body: 'We believe salvation is by God’s grace, received through faith in Jesus Christ alone, and not by works.',
  },
  {
    title: 'The Holy Spirit',
    body: 'We believe the Holy Spirit indwells every believer, enabling holy living and service.',
  },
  {
    title: 'The Church',
    body: 'We believe the Church is the body of Christ, called to worship, discipleship, fellowship and mission.',
  },
] as const

/**
 * Church growth timeline.
 *
 * TODO: these milestones are placeholders. Replace them with the church's real
 * history — the dates and events are the church's own story and should not be
 * invented.
 */
const TIMELINE = [
  {
    year: 'Founding',
    title: 'A small gathering begins',
    body: 'A handful of families begin meeting for prayer and Bible study in Kapsomoita.',
  },
  {
    year: 'Growth',
    title: 'The congregation takes root',
    body: 'Regular Sunday services begin and the first ministries are formed.',
  },
  {
    year: 'Expansion',
    title: 'Ministries multiply',
    body: 'Youth, women’s, men’s and children’s ministries are established.',
  },
  {
    year: 'Today',
    title: 'Serving our community',
    body: 'The church continues to grow, reaching beyond its walls through outreach and missions.',
  },
] as const

export default function AboutPage() {
  return (
    <>
      <SeoHead
        title="About us"
        description={`Learn about ${site.fullName} — our history, vision, mission, core values and statement of faith.`}
      />

      {/* --- Page header ------------------------------------------------- */}
      <header className="bg-brand-950 relative overflow-hidden pt-[calc(var(--header-height)+4rem)] pb-16 text-white sm:pb-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="bg-gold-500/12 absolute -top-20 right-1/4 size-72 rounded-full blur-3xl" />
          <div className="bg-brand-400/12 absolute -bottom-20 left-1/4 size-72 rounded-full blur-3xl" />
        </div>

        <div className="container-page relative">
          <div className="flex max-w-3xl flex-col gap-4">
            <Badge variant="gold" className="w-fit">
              About us
            </Badge>
            {/* The only h1 on this page. */}
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {site.fullName}
            </h1>
            <p className="text-base leading-relaxed text-white/80 sm:text-lg">
              An ordinary family of believers in Kapsomoita, learning together what it means
              to follow Jesus faithfully — in our homes, our church and our community.
            </p>
          </div>
        </div>
      </header>

      {/* --- Vision & mission -------------------------------------------- */}
      <Section id="vision-mission">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="py-8">
            <CardContent className="flex flex-col gap-4">
              <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                <TargetIcon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Our vision</h2>
              <p className="text-muted-foreground leading-relaxed">{site.vision}</p>
            </CardContent>
          </Card>

          <Card className="py-8">
            <CardContent className="flex flex-col gap-4">
              <span className="bg-accent-subtle text-accent-foreground flex size-12 items-center justify-center rounded-xl">
                <CompassIcon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Our mission</h2>
              <p className="text-muted-foreground leading-relaxed">{site.mission}</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* --- Core values ------------------------------------------------- */}
      <Section id="values" tone="muted">
        <SectionHeading
          eyebrow="What we hold to"
          title="Our core values"
          description="Six commitments that shape how we worship, teach and serve."
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_VALUES.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <Card className="h-full py-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted">
                <CardContent className="flex flex-col gap-3">
                  <span className="bg-secondary text-secondary-foreground flex size-11 items-center justify-center rounded-xl">
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

      {/* --- Timeline ---------------------------------------------------- */}
      <Section id="history">
        <SectionHeading
          eyebrow="Our journey"
          title="How we got here"
          description="The story of this church, from a handful of families to the congregation you see today."
        />

        {/* An ordered list, because the sequence carries meaning. */}
        <ol className="relative mx-auto mt-12 flex max-w-3xl flex-col gap-8">
          {/* The connecting line, decorative only. */}
          <span
            aria-hidden="true"
            className="bg-border absolute top-2 bottom-2 left-[15px] w-px sm:left-[19px]"
          />

          {TIMELINE.map((entry) => (
            <li key={entry.year} className="relative flex gap-5 pl-0">
              <span
                aria-hidden="true"
                className={cn(
                  'bg-primary text-primary-foreground relative z-10 flex size-8 shrink-0',
                  'items-center justify-center rounded-full sm:size-10',
                )}
              >
                <SparklesIcon className="size-4" />
              </span>

              <div className="flex flex-col gap-1 pt-1">
                <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                  {entry.year}
                </span>
                <h3 className="text-lg font-semibold tracking-tight">{entry.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{entry.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* --- Statement of faith ------------------------------------------ */}
      <Section id="statement-of-faith" tone="muted">
        <SectionHeading
          eyebrow="What we believe"
          title="Statement of faith"
          description="The doctrinal convictions we hold in common as a congregation."
        />

        <dl className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
          {STATEMENT_OF_FAITH.map((article) => (
            <Card key={article.title} className="py-6">
              <CardContent className="flex flex-col gap-2">
                <dt className="flex items-center gap-2 text-base font-semibold tracking-tight">
                  <ScrollTextIcon className="text-primary size-4 shrink-0" aria-hidden="true" />
                  {article.title}
                </dt>
                <dd className="text-muted-foreground text-sm leading-relaxed">{article.body}</dd>
              </CardContent>
            </Card>
          ))}
        </dl>
      </Section>

      {/* --- Leadership -------------------------------------------------- */}
      <Section id="leadership">
        <SectionHeading
          eyebrow="Our leaders"
          title="Church leadership"
          description="The pastors and leaders who serve this congregation."
        />

        {/*
          Deliberately not populated with invented people. Leadership profiles come
          from the Leadership admin module, which is not built yet — inventing names
          and photographs for a real church's leadership page would be worse than an
          honest placeholder.
        */}
        <Card className="mx-auto mt-12 max-w-2xl py-10">
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <span className="bg-secondary text-secondary-foreground flex size-14 items-center justify-center rounded-xl">
              <UsersIcon className="size-7" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-semibold">Leadership profiles coming soon</h3>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              We are preparing profiles for our pastors and ministry leaders. In the meantime,
              you are very welcome to visit on a Sunday and meet them in person.
            </p>
          </CardContent>
        </Card>
      </Section>
    </>
  )
}
