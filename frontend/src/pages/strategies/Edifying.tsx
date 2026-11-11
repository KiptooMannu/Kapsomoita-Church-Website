import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  HeartIcon,
  SparklesIcon,
  UsersIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageBanner } from '@/components/public/PageBanner'
import { Section, SectionHeading } from '@/components/public/Section'
import { SeoHead } from '@/components/seo/SeoHead'

const GROWTH_JOURNEY = [
  {
    step: '01',
    title: 'Biblical Foundation',
    description:
      'Grasping the core truths of the Gospel, foundational Christian doctrine, and the life-giving habit of daily Scripture reading.',
  },
  {
    step: '02',
    title: 'Spiritual Disciplines',
    description:
      'Developing perseverance in prayer, fellowship, stewardship, and personal devotion in the rhythm of daily life.',
  },
  {
    step: '03',
    title: 'Christian Maturity',
    description:
      'Cultivating the fruit of the Holy Spirit, discovering spiritual gifts, and serving others within the congregation.',
  },
  {
    step: '04',
    title: 'Kingdom Multiplication',
    description:
      'Discipling newer believers, opening one’s home, and actively shepherding the next generation in Christ.',
  },
] as const

const TARGET_MINISTRIES = [
  {
    title: 'Youth Ministry',
    slug: 'youth',
    audience: 'Ages 13–30',
    description: 'Vibrant worship, deep biblical discussion, and genuine fellowship for students and young adults.',
  },
  {
    title: "Men's Ministry",
    slug: 'men',
    audience: 'Adult Men',
    description: 'Monthly breakfasts, accountability partnerships, and practical service projects.',
  },
  {
    title: "Women's Ministry",
    slug: 'women',
    audience: 'Adult Women',
    description: 'Weekly Bible studies, prayer intercession, and compassionate support for mothers and daughters.',
  },
  {
    title: 'Kids & Sunday School',
    slug: 'kids',
    audience: 'Ages 3–12',
    description: 'Joyful, safe, and engaging Bible storytelling, songs, and memory verse activities.',
  },
] as const

export default function Edifying() {
  return (
    <>
      <SeoHead
        title="Edifying Believers"
        description="Building up the body of Christ through systematic Bible teaching, intentional discipleship, and vibrant community."
      />

      <PageBanner
        eyebrow="Our Strategy · Pillar 3"
        title="E3: Edifying Believers"
        description="Nurturing every believer from newborn faith to robust spiritual maturity through God's infallible Word and mutual love."
        icon={<BookOpenIcon className="size-7" aria-hidden="true" />}
        imageKey="strategyEdifying"
      />

      <Section id="edifying-overview">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/">
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* --- Two Main Arms ----------------------------------------------- */}
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="interactive-card border-border bg-card shadow-card">
            <CardContent className="flex flex-col gap-4 p-8">
              <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                <BookOpenIcon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Bible Study & Teaching</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe scripture is our final authority. We equip members through verse-by-verse
                expository preaching, mid-week Bible classes, and theological foundations.
              </p>
              <ul className="text-muted-foreground mt-2 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Weekly small group Bible fellowships
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Systematic expository preaching
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Foundational doctrine short courses
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Scripture memorization programs
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="interactive-card border-border bg-card shadow-card">
            <CardContent className="flex flex-col gap-4 p-8">
              <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                <UsersIcon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Discipleship Programs</h2>
              <p className="text-muted-foreground leading-relaxed">
                Spiritual growth happens best in community. Our structured tracks pair seasoned
                believers with newer Christians for prayer, accountability, and mutual encouragement.
              </p>
              <ul className="text-muted-foreground mt-2 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> One-on-one spiritual mentorship
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Home fellowship care groups
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Spiritual gifts discovery workshops
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Christian family and marriage guidance
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* --- Discipleship Journey ----------------------------------------- */}
      <Section id="spiritual-growth-journey" tone="muted">
        <SectionHeading
          eyebrow="Pathway"
          title="The Spiritual Growth Journey"
          description="How we foster continuous spiritual development from conversion to multiplying leadership."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GROWTH_JOURNEY.map((item) => (
            <Card key={item.step} className="border-border bg-card shadow-card">
              <CardContent className="flex flex-col gap-3 p-6">
                <Badge variant="outline" className="w-fit text-xs font-mono font-semibold">
                  Stage {item.step}
                </Badge>
                <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* --- Specialized Discipleship Ministries -------------------------- */}
      <Section id="discipleship-ministries">
        <SectionHeading
          eyebrow="Community"
          title="Targeted Ministries for Every Stage of Life"
          description="Connecting you with brothers and sisters walking through the same season of life."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {TARGET_MINISTRIES.map((m) => (
            <Card key={m.slug} className="border-border bg-card">
              <CardContent className="flex flex-col justify-between gap-4 p-6">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{m.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {m.audience}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{m.description}</p>
                </div>
                <Link
                  to={`/ministries/${m.slug}`}
                  className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
                >
                  Explore {m.title}
                  <ArrowRightIcon className="size-3.5" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* --- Call to action ---------------------------------------------- */}
        <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center shadow-lifted sm:p-12">
          <span className="bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl">
            <HeartIcon className="size-7" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Take Your Next Step in Faith
          </h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-base leading-relaxed">
            Whether you are exploring Christianity for the first time or seeking deeper discipleship,
            our church family is ready to welcome and walk with you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/ministries">
                Explore All Ministries
                <ArrowRightIcon className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Talk to a Pastor</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
