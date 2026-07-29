import { InfoIcon, MailIcon, UserRoundIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CloudinaryImage } from '@/components/media/CloudinaryImage'
import { Section, SectionHeading } from '@/components/public/Section'
import { mediaPublicId } from '@/config/media-manifest'
import {
  hasNamedLeaders,
  ministryLeaders,
  pastoralTeam,
  type LeadershipMember,
} from '@/config/leadership'
import { env } from '@/lib/env'
import { cn } from '@/lib/utils'

export interface LeadershipSectionProps {
  /** Show every leader (About page) rather than a trimmed set (landing page). */
  full?: boolean
}

/**
 * Church leadership.
 *
 * Each card falls back to the role as its heading while a name is unconfirmed, so
 * the section is presentable before the church has supplied its details and needs no
 * change once it has. A development-only notice points that out to whoever is
 * building the site, without showing anything to visitors.
 */
export function LeadershipSection({ full = false }: LeadershipSectionProps) {
  // The landing page shows the pastoral team plus the four leaders who have
  // photographs; the About page shows everyone.
  const leaders = full
    ? ministryLeaders
    : ministryLeaders.filter((member) => member.imageLocalPath !== undefined)

  return (
    <Section id="leadership" tone="muted">
      <SectionHeading
        eyebrow="Our leaders"
        title="Meet the team"
        description="The pastors and ministry leaders who shepherd and serve this church family."
      />

      {/*
        Shown only in development. It reminds whoever is building the site to fill in
        the real names, and never appears to a visitor in production.
      */}
      {env.isDevelopment && !hasNamedLeaders && (
        <Alert variant="info" className="mx-auto mt-8 max-w-2xl">
          <InfoIcon aria-hidden="true" />
          <AlertTitle>Leadership names are not filled in</AlertTitle>
          <AlertDescription>
            Add the real names, biographies and photographs in{' '}
            <code className="font-mono text-xs">src/config/leadership.ts</code>. Until then
            each card shows only the role. This notice is hidden in production.
          </AlertDescription>
        </Alert>
      )}

      {/* --- Pastoral team ---------------------------------------------- */}
      <div className="mt-12 flex flex-col gap-6">
        <h3 className="text-center text-sm font-semibold tracking-wider uppercase">
          Pastoral team
        </h3>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pastoralTeam.map((member) => (
            <li key={member.id}>
              <LeaderCard member={member} />
            </li>
          ))}
        </ul>
      </div>

      {/* --- Ministry leaders -------------------------------------------- */}
      {leaders.length > 0 && (
        <div className="mt-12 flex flex-col gap-6">
          <h3 className="text-center text-sm font-semibold tracking-wider uppercase">
            Ministry leaders
          </h3>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((member) => (
              <li key={member.id}>
                <LeaderCard member={member} compact />
              </li>
            ))}
          </ul>
        </div>
      )}

      {!full && (
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/about#leadership">Meet the whole team</Link>
          </Button>
        </div>
      )}
    </Section>
  )
}

function LeaderCard({
  member,
  compact = false,
}: {
  member: LeadershipMember
  compact?: boolean
}) {
  // The name when known, otherwise the role — so a card is never blank or fake.
  const heading = member.name.trim() || member.role
  const showRoleAsSubtitle = member.name.trim().length > 0

  const publicId = member.imageLocalPath ? (mediaPublicId(member.imageLocalPath) ?? '') : ''

  return (
    <Card className="h-full overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted">
      {member.imageLocalPath ? (
        <CloudinaryImage
          publicId={publicId}
          alt={heading}
          width={512}
          sizes="(min-width: 1024px) 16rem, (min-width: 640px) 50vw, 100vw"
          aspectRatio={compact ? '1 / 1' : '4 / 5'}
          gravity="face"
          containerClassName="w-full"
        />
      ) : (
        // A neutral placeholder rather than a stock photograph of someone who is
        // not actually a leader here.
        <div
          className={cn(
            'bg-secondary text-muted-foreground flex items-center justify-center',
            compact ? 'aspect-square' : 'aspect-[4/5]',
          )}
          aria-hidden="true"
        >
          <UserRoundIcon className="size-12" />
        </div>
      )}

      <CardContent className="flex flex-1 flex-col gap-2 pb-6">
        <h4 className="text-base font-semibold tracking-tight">{heading}</h4>

        {showRoleAsSubtitle && (
          <p className="text-primary text-sm font-medium">{member.role}</p>
        )}

        {member.ministry && (
          <Badge variant="secondary" className="w-fit text-[10px]">
            {member.ministry}
          </Badge>
        )}

        {member.bio && (
          <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
        )}

        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="text-primary mt-auto inline-flex items-center gap-1.5 pt-1 text-sm hover:underline"
          >
            <MailIcon className="size-3.5" aria-hidden="true" />
            Contact
          </a>
        )}
      </CardContent>
    </Card>
  )
}
