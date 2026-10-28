import { PageBanner } from '@/components/public/PageBanner'
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

      <PageBanner
        eyebrow="Serve"
        title="Join a ministry"
        description="Tell us where you would like to serve. Your application goes straight to the ministry team."
        imageKey="serveHeader"
      />

      <Section id="serve-form">
        <div className="mx-auto max-w-3xl">
          <JoinMinistryForm />
        </div>
      </Section>
    </>
  )
}
