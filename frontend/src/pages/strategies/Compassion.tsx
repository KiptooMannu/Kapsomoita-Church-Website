import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  HandHeartIcon,
  HeartIcon,
  ShieldCheckIcon,
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

const COMPASSION_CYCLE = [
  {
    step: '01',
    title: 'See the Need',
    description:
      'Looking past our comfort to notice vulnerable families, struggling orphans, the sick, and marginalized neighbours in our community.',
  },
  {
    step: '02',
    title: 'Feel with Christ',
    description:
      'Cultivating genuine empathy, moved by the same compassion Jesus felt when He looked upon the crowd as sheep without a shepherd.',
  },
  {
    step: '03',
    title: 'Act in Love',
    description:
      'Delivering practical food relief, medical aid, warm shelter, school fees, and legal advocacy directly to those in acute distress.',
  },
  {
    step: '04',
    title: 'Transform for Life',
    description:
      'Equipping families with sustainable skills, livelihood training, and spiritual freedom that breaks intergenerational poverty.',
  },
] as const

const DIRECT_CARE_SERVICES = [
  'Emergency food hampers & nutritional support',
  'Free community medical screening & hygiene clinics',
  'Orphan care, foster support & school supply drives',
  'Elderly home visits & winter warmth initiatives',
  'Confidential crisis counseling & bereavement care',
] as const

const EMPOWERMENT_PROGRAMS = [
  'Vocational skills training & artisan workshops',
  'Small community savings & table banking support',
  'Kitchen gardening & regenerative farming coaching',
  'Young mothers’ empowerment & mentorship',
  'Youth athletic leagues & life skills camps',
] as const

const COMPASSION_STATS = [
  { value: '2,000+', label: 'Vulnerable Families Supported' },
  { value: '500+', label: 'Children Given School Essentials' },
  { value: '15', label: 'Neighbourhoods & Villages Reached' },
] as const

export default function Compassion() {
  return (
    <>
      <SeoHead
        title="Exercising Compassion"
        description="Demonstrating Christ's unconditional love through practical relief, sustainable empowerment, and mercy to those in need."
      />

      <PageBanner
        eyebrow="Our Strategy · Pillar 5"
        title="E5: Exercising Compassion"
        description="Living out the hands and feet of Jesus through practical care, relief for the vulnerable, and lasting community uplift."
        icon={<HandHeartIcon className="size-7" aria-hidden="true" />}
        imageKey="strategyCompassion"
      />

      <Section id="compassion-overview">
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
                <HeartIcon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Community Care & Relief</h2>
              <p className="text-muted-foreground leading-relaxed">
                Faith without deeds is dead. We respond rapidly to emergencies and chronic hardship
                in Kapsomoita with tangible goods, medical supplies, and tender pastoral presence.
              </p>
              <ul className="text-muted-foreground mt-2 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Monthly emergency food distribution
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Medical & dental community clinics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Vulnerable children & orphan support
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Compassionate elderly visitation
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="interactive-card border-border bg-card shadow-card">
            <CardContent className="flex flex-col gap-4 p-8">
              <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                <UsersIcon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Empowerment & Justice</h2>
              <p className="text-muted-foreground leading-relaxed">
                True compassion elevates dignity. We come alongside marginalized families with
                education, vocational training, and financial literacy to help them build resilience.
              </p>
              <ul className="text-muted-foreground mt-2 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Vocational skills & artisan coaching
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Sustainable agriculture training
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Education scholarships for needy youth
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Women’s economic empowerment groups
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* --- The Compassion Process --------------------------------------- */}
      <Section id="compassion-cycle" tone="muted">
        <SectionHeading
          eyebrow="Heartbeat"
          title="The Cycle of Compassion in Action"
          description="How awareness transforms into meaningful action and permanent spiritual restoration."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COMPASSION_CYCLE.map((item) => (
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

      {/* --- Detailed Services -------------------------------------------- */}
      <Section id="compassion-services">
        <SectionHeading
          eyebrow="Ministries of Mercy"
          title="Direct Care & Empowerment Programs"
          description="How our compassion teams serve individuals, households, and communities each week."
        />

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col gap-4 p-8">
              <h3 className="text-xl font-bold tracking-tight">Direct Care Services</h3>
              <ul className="space-y-3 pt-2 text-sm">
                {DIRECT_CARE_SERVICES.map((s) => (
                  <li key={s} className="flex items-start gap-2.5">
                    <CheckCircle2Icon className="text-primary mt-0.5 size-4 shrink-0" />
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="flex flex-col gap-4 p-8">
              <h3 className="text-xl font-bold tracking-tight">Empowerment Initiatives</h3>
              <ul className="space-y-3 pt-2 text-sm">
                {EMPOWERMENT_PROGRAMS.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <CheckCircle2Icon className="text-primary mt-0.5 size-4 shrink-0" />
                    <span className="text-muted-foreground">{p}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* --- Kingdom Fruit Stats ------------------------------------------ */}
      <Section id="compassion-impact" tone="muted">
        <div className="grid gap-6 sm:grid-cols-3">
          {COMPASSION_STATS.map((stat) => (
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
            Join Our Mission of Compassion
          </h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-base leading-relaxed">
            Every act of love points someone to Christ. You can volunteer your time, share your
            skills, or donate toward our benevolence and medical outreach funds.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/serve">
                Volunteer Today
                <ArrowRightIcon className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/give">Donate to Compassion</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
