import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  GraduationCapIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
  UsersIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageBanner } from '@/components/public/PageBanner'
import { Section, SectionHeading } from '@/components/public/Section'
import { SeoHead } from '@/components/seo/SeoHead'

const EQUIPPING_TRACK = [
  {
    step: '01',
    title: 'Identify & Discern',
    description:
      'Recognizing leadership potential, godly character, and spiritual giftings within the local assembly.',
  },
  {
    step: '02',
    title: 'Equip & Train',
    description:
      'Providing rigorous theological grounding, hermeneutics, pastoral care ethics, and ministry skills.',
  },
  {
    step: '03',
    title: 'Deploy & Entrust',
    description:
      'Placing emerging leaders into real responsibilities under the protective covering of senior pastoral mentorship.',
  },
  {
    step: '04',
    title: 'Sustain & Support',
    description:
      'Continuous coaching, peer accountability cohorts, sabbath rest rhythms, and ongoing ministry support.',
  },
] as const

const CORE_COMPETENCIES = [
  'Biblical theology, hermeneutics & sound doctrine',
  'Pastoral counseling, grief ministry & home care',
  'Expository preaching & dynamic teaching',
  'Financial stewardship & church administration',
  'Peacemaking & biblical conflict resolution',
] as const

const CHARACTER_STANDARDS = [
  'Devoted prayer life & personal holiness',
  'Uncompromising integrity & transparent accountability',
  'Christ-like servant leadership & humility',
  'Cultural wisdom & cross-generational sensitivity',
  'Faithful marital & family stewardship',
] as const

const IMPACT_NUMBERS = [
  { value: '150+', label: 'Church & Ministry Leaders Trained' },
  { value: '75', label: 'Pastors Active in Ministry' },
  { value: '30+', label: 'Local Lay Leaders & Deacons' },
] as const

export default function Equipping() {
  return (
    <>
      <SeoHead
        title="Equipping Leaders"
        description="Preparing and empowering servant leaders to advance God's kingdom with biblical integrity, skill, and spiritual passion."
      />

      <PageBanner
        eyebrow="Our Strategy · Pillar 4"
        title="E4: Equipping Leaders"
        description="Developing humble, competent, and Christ-like servant leaders for the local church and the worldwide mission of God."
        icon={<GraduationCapIcon className="size-7" aria-hidden="true" />}
        imageKey="strategyEquipping"
      />

      <Section id="equipping-overview">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/">
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* --- Two Major Branches ------------------------------------------ */}
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="interactive-card border-border bg-card shadow-card">
            <CardContent className="flex flex-col gap-4 p-8">
              <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                <GraduationCapIcon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Leadership Training</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe every Christian is called to minister, and leaders are called to equip the
                saints. Our institutes focus on solid doctrine and practical competency.
              </p>
              <ul className="text-muted-foreground mt-2 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Pastor & preacher preparation courses
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Elder & deacon governance training
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Youth leadership development camps
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Women’s ministry leadership workshops
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="interactive-card border-border bg-card shadow-card">
            <CardContent className="flex flex-col gap-4 p-8">
              <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                <UsersIcon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Mentorship & Apprenticeship</h2>
              <p className="text-muted-foreground leading-relaxed">
                Classrooms inform, but real life transforms. We pair rising leaders alongside seasoned
                pastors and ministry directors for hands-on, day-to-day ministry experience.
              </p>
              <ul className="text-muted-foreground mt-2 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Intentional one-on-one pastoral mentoring
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Real-world ministry apprenticeships
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Peer leader reflection and prayer circles
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Continuous leadership renewal retreats
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* --- Track -------------------------------------------------------- */}
      <Section id="equipping-track" tone="muted">
        <SectionHeading
          eyebrow="Curriculum"
          title="The Leadership Development Track"
          description="A clear pathway taking members from initial gifts assessment to seasoned leadership."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {EQUIPPING_TRACK.map((item) => (
            <Card key={item.step} className="border-border bg-card shadow-card">
              <CardContent className="flex flex-col gap-3 p-6">
                <Badge variant="outline" className="w-fit text-xs font-mono font-semibold">
                  Phase {item.step}
                </Badge>
                <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* --- Standards ---------------------------------------------------- */}
      <Section id="leadership-standards">
        <SectionHeading
          eyebrow="Standards"
          title="Excellence in Calling & Character"
          description="We hold competence and character in equal high regard for all who shepherd."
        />

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col gap-4 p-8">
              <div className="flex items-center gap-3">
                <TargetIcon className="text-primary size-6" aria-hidden="true" />
                <h3 className="text-xl font-bold tracking-tight">Ministry Competencies</h3>
              </div>
              <ul className="space-y-3 pt-2 text-sm">
                {CORE_COMPETENCIES.map((c) => (
                  <li key={c} className="flex items-start gap-2.5">
                    <CheckCircle2Icon className="text-primary mt-0.5 size-4 shrink-0" />
                    <span className="text-muted-foreground">{c}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="flex flex-col gap-4 p-8">
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="text-primary size-6" aria-hidden="true" />
                <h3 className="text-xl font-bold tracking-tight">Character Formation</h3>
              </div>
              <ul className="space-y-3 pt-2 text-sm">
                {CHARACTER_STANDARDS.map((c) => (
                  <li key={c} className="flex items-start gap-2.5">
                    <CheckCircle2Icon className="text-primary mt-0.5 size-4 shrink-0" />
                    <span className="text-muted-foreground">{c}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* --- Impact ------------------------------------------------------- */}
      <Section id="leadership-impact" tone="muted">
        <div className="grid gap-6 sm:grid-cols-3">
          {IMPACT_NUMBERS.map((stat) => (
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
            <SparklesIcon className="size-7" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Step Into Your God-Given Calling
          </h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-base leading-relaxed">
            Do you feel God stirring you toward leadership, teaching, or pastoral ministry? Join
            our training programs and let us invest in your spiritual future.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/serve">
                Apply for Ministry Training
                <ArrowRightIcon className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Speak with the Pastoral Team</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
