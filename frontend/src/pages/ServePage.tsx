import { Badge } from '@/components/ui/badge'
import { Section } from '@/components/public/Section'
import { SeoHead } from '@/components/seo/SeoHead'
import { JoinMinistryForm } from '@/features/ministries/JoinMinistryForm'

/**
 * Public application to serve in a ministry.
 * Submissions land in Admin → Ministry applications.
 */
export default function ServePage() {
  return (
    <>
      <SeoHead
        title="Serve"
        description="Apply to serve in a ministry at Kapsomoita AGC. The church office reviews every application."
      />

      <header className="bg-brand-950 relative overflow-hidden py-16 text-white sm:py-20">
        <div className="container-page relative">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <Badge variant="gold">Serve</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Join a ministry
            </h1>
            <p className="text-base leading-relaxed text-white/80 sm:text-lg">
              Tell us where you would like to serve. Your application goes straight to the ministry team.
            </p>
          </div>
        </div>
      </header>

      <Section id="serve-form">
        <div className="mx-auto max-w-3xl">
          <JoinMinistryForm />
        </div>
      </Section>
    </>
  )
}
