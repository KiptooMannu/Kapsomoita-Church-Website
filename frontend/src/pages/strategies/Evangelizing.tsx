import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CompassIcon,
  GlobeIcon,
  HeartHandshakeIcon,
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
import { ScrollPhoto } from '@/components/public/ScrollPhoto'

const APPROACH_STEPS = [
  {
    step: '01',
    title: 'Relationship Building',
    description:
      'Meeting people where they are, listening with genuine humility, and earning trust through honest friendship and compassionate presence.',
  },
  {
    step: '02',
    title: 'Gospel Presentation',
    description:
      'Sharing the Good News of Jesus Christ with theological clarity, cultural sensitivity, and deep spiritual conviction.',
  },
  {
    step: '03',
    title: 'Follow-up & Discipleship',
    description:
      'Walking beside new believers, providing immediate pastoral care, and helping them integrate into the church family.',
  },
] as const

const OUTREACH_INITIATIVES = [
  {
    title: 'Weekly Community Outreach',
    description:
      'Teams visit local neighbourhoods, markets, and transit centres across Kapsomoita to offer prayer, conversation, and the Gospel.',
  },
  {
    title: 'Compassion Health Clinics',
    description:
      'Partnering with Christian healthcare workers to provide basic screenings and first aid alongside spiritual counseling.',
  },
  {
    title: 'Youth & School Ministries',
    description:
      'Reaching teenagers and university students through peer fellowships, mentorship, and faith-building events.',
  },
  {
    title: 'Prison & Hospital Visitation',
    description:
      'Taking hope, practical essentials, and God’s unchanging promises to those who feel forgotten.',
  },
] as const

export default function Evangelizing() {
  return (
    <>
      <SeoHead
        title="Evangelizing the Lost"
        description="Reaching our community and beyond with God's love, practical compassion, and the message of hope in Jesus Christ."
      />

      <PageBanner
        eyebrow="Our Strategy · Pillar 1"
        title="E1: Evangelizing the Lost"
        description="Reaching out with God's transformative love to bring hope, dignity, and salvation to those who need it most."
        icon={<HeartHandshakeIcon className="size-7" aria-hidden="true" />}
        imageKey="strategyEvangelizing"
      />

      <Section id="evangelizing-overview">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/">
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* --- Two Primary Wings ------------------------------------------ */}
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="interactive-card border-border bg-card shadow-card">
            <CardContent className="flex flex-col gap-4 p-8">
              <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                <UsersIcon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Community Outreach</h2>
              <p className="text-muted-foreground leading-relaxed">
                We actively engage with our surrounding towns and rural centres through personal
                evangelism, community events, and home-to-home ministry to share Christ’s love.
              </p>
              <ul className="text-muted-foreground mt-2 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Weekly neighbourhood visitation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Community wellness and aid programs
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Targeted youth and student outreach
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Hospital and prison visitation teams
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="interactive-card border-border bg-card shadow-card">
            <CardContent className="flex flex-col gap-4 p-8">
              <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                <GlobeIcon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Global Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our heart for the lost extends beyond borders. We partner with cross-cultural
                mission agencies and church planters to bring the Gospel to unreached peoples.
              </p>
              <ul className="text-muted-foreground mt-2 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Cross-cultural mission partnerships
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Rural church planting and support
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Missionary sending and financial care
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Regional evangelistic conferences
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* --- Methodology -------------------------------------------------- */}
      <Section id="evangelism-approach" tone="muted">
        <SectionHeading
          eyebrow="Methodology"
          title="Our Approach to Evangelism"
          description="How we shepherd every relationship from first contact to mature discipleship."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {APPROACH_STEPS.map((item) => (
            <Card key={item.step} className="border-border bg-card shadow-card">
              <CardContent className="flex flex-col gap-3 p-6 text-center sm:text-left">
                <Badge variant="outline" className="w-fit text-xs font-mono font-semibold">
                  Step {item.step}
                </Badge>
                <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* --- Active Initiatives ------------------------------------------- */}
      <Section id="outreach-initiatives">
        <SectionHeading
          eyebrow="On the Ground"
          title="Active Outreach Initiatives"
          description="Ongoing avenues where church members put faith into direct action."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {OUTREACH_INITIATIVES.map((item) => (
            <Card key={item.title} className="border-border bg-card">
              <CardContent className="flex flex-col gap-2 p-6">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* --- Call to action ---------------------------------------------- */}
        <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center shadow-lifted sm:p-12">
          <span className="bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl">
            <SparklesIcon className="size-7" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Join Our Evangelistic Mission
          </h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-base leading-relaxed">
            Be part of fulfilling the Great Commission. Whether on the streets, in prayer, or
            supporting missions financially, there is a vital place for you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/serve">
                Get Involved
                <ArrowRightIcon className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/give">Support Missions</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
