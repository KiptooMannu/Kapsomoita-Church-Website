import { MailIcon, UserRoundIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollFrame } from '@/components/public/ScrollPhoto'
import { Section, SectionHeading } from '@/components/public/Section'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { contentApi } from '@/features/content/content-api'
import { queryKeys } from '@/lib/query-client'

interface LeadershipMember {
  id: string
  role: string
  name: string
  bio: string
  photoUrl?: string
  ministry?: string
  email?: string
  phone?: string
}

export interface LeadershipSectionProps {
  /** Show every leader (About page) rather than a trimmed set (landing page). */
  full?: boolean
}

export function LeadershipSection({ full = false }: LeadershipSectionProps) {
  const { data: liveLeaders } = useQuery({
    queryKey: queryKeys.public.leaders,
    queryFn: contentApi.publicLeaders,
    staleTime: 5 * 60_000,
  })

  const toMember = (leader: NonNullable<typeof liveLeaders>[number]): LeadershipMember => ({
    id: leader.id,
    name: leader.fullName || '',
    role: leader.roleTitle,
    bio: leader.bio || '',
    email: leader.email || undefined,
    phone: leader.phone || undefined,
    ministry: leader.ministry || undefined,
    photoUrl: leader.photoUrl || undefined,
  })

  const activePastoralTeam = (liveLeaders ?? [])
    .filter((leader) => leader.team === 'PASTORAL')
    .map(toMember)
  const ministryLeaders = (liveLeaders ?? [])
    .filter((leader) => leader.team !== 'PASTORAL')
    .map(toMember)
  const leaders = full ? ministryLeaders : ministryLeaders.slice(0, 4)

  return (
    <Section id="leadership" tone="muted">
      <SectionHeading
        eyebrow="Our leaders"
        title="Meet the team"
        description="The pastors and ministry leaders who shepherd and serve this church family."
      />

      {/* --- Pastoral team ---------------------------------------------- */}
      {activePastoralTeam.length > 0 && (
      <div className="mt-12 flex flex-col gap-6">
        <h3 className="text-center text-sm font-semibold tracking-wider uppercase">
          Pastoral team
        </h3>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activePastoralTeam.map((member) => (
            <li key={member.id}>
              <LeaderCard member={member} />
            </li>
          ))}
        </ul>
      </div>
      )}

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

  return (
    <Card className="interactive-card h-full overflow-hidden py-0">
      {member.photoUrl ? (
        <ScrollFrame index={compact ? 1 : 0}>
          <img
            src={member.photoUrl}
            alt={heading}
            referrerPolicy="no-referrer"
            className={cn('bg-muted w-full object-cover', compact ? 'aspect-square' : 'aspect-[4/5]')}
          />
        </ScrollFrame>
      ) : (
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
