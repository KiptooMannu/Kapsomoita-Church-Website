import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChurchIcon,
  HandHeartIcon,
  MapPinIcon,
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

const ESTABLISHMENT_PROCESS = [
  {
    step: '01',
    title: 'Survey & Assess',
    description:
      'Identifying unreached or underserved communities through demographic analysis, prayer walks, and local community dialogue.',
  },
  {
    step: '02',
    title: 'Plant & Nurture',
    description:
      'Gathering an initial core group for worship and teaching, securing a gathering space, and embedding deep pastoral roots.',
  },
  {
    step: '03',
    title: 'Train Local Leaders',
    description:
      'Discipling indigenous elders, deacons, Sunday School teachers, and youth leaders to shepherd their own congregation.',
  },
  {
    step: '04',
    title: 'Establish Independence',
    description:
      'Guiding the plant into a self-governing, self-sustaining church that in turn plants new daughter congregations.',
  },
] as const

const NETWORK_STATS = [
  { value: '25+', label: 'Churches Planted & Established' },
  { value: '50+', label: 'Local Pastors & Ministers Trained' },
  { value: '5,000+', label: 'Families & Believers Impacted' },
] as const

export default function Establishing() {
  return (
    <>
      <SeoHead
        title="Establishing Churches"
        description="Building strong, sustainable, self-governing church communities that serve as beacons of faith and Gospel transformation."
      />

      <PageBanner
        eyebrow="Our Strategy · Pillar 2"
        title="E2: Establishing Churches"
        description="Planting and nurturing healthy, Bible-anchored congregations that bless their communities and multiply across generations."
        icon={<ChurchIcon className="size-7" aria-hidden="true" />}
        imageKey="strategyEstablishing"
      />

      <Section id="establishing-overview">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/">
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* --- Two Core Focus Areas --------------------------------------- */}
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="interactive-card border-border bg-card shadow-card">
            <CardContent className="flex flex-col gap-4 p-8">
              <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                <ChurchIcon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Church Planting</h2>
              <p className="text-muted-foreground leading-relaxed">
                We strategically plant new congregations in towns and villages that need a vibrant
                Gospel presence, focusing on durable spiritual foundations rather than quick numbers.
              </p>
              <ul className="text-muted-foreground mt-2 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Strategic community needs assessment
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Core pioneer team development
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Sanctuary setup & community outreach
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Sustainable financial stewardship
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="interactive-card border-border bg-card shadow-card">
            <CardContent className="flex flex-col gap-4 p-8">
              <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                <UsersIcon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Leadership Development</h2>
              <p className="text-muted-foreground leading-relaxed">
                Every newly planted church needs godly, servant-hearted leaders. We invest heavily
                in formal theological grounding, mentorship, and practical church management skills.
              </p>
              <ul className="text-muted-foreground mt-2 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Pastoral apprenticeships & mentoring
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Elder & deacon biblical training
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Ministry team formation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Long-term leadership succession planning
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* --- Process ------------------------------------------------------ */}
      <Section id="establishment-process" tone="muted">
        <SectionHeading
          eyebrow="Lifecycle"
          title="The Church Establishment Process"
          description="A proven pathway from the first prayer meeting to an autonomous daughter congregation."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ESTABLISHMENT_PROCESS.map((item) => (
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

      {/* --- Network Impact ----------------------------------------------- */}
      <Section id="network-impact">
        <SectionHeading
          eyebrow="Kingdom Fruit"
          title="Our Church Network Impact"
          description="By God’s grace, decades of faithful planting continue to produce lasting fruit."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {NETWORK_STATS.map((stat) => (
            <Card key={stat.label} className="border-border bg-card text-center shadow-card">
              <CardContent className="flex flex-col gap-2 p-8">
                <span className="text-primary text-4xl font-extrabold tracking-tight sm:text-5xl">
                  {stat.value}
                </span>
                <span className="text-muted-foreground text-sm font-medium">{stat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* --- Call to action ---------------------------------------------- */}
        <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center shadow-lifted sm:p-12">
          <span className="bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl">
            <HandHeartIcon className="size-7" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Support Church Planting
          </h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-base leading-relaxed">
            Partner with us to establish new spiritual homes in communities that urgently need the
            transformative hope of Jesus Christ.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/give">
                Partner With Us
                <ArrowRightIcon className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/serve">Join a Plant Team</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
