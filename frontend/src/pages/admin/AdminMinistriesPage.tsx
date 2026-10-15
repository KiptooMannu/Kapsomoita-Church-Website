import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HeartHandshakeIcon, ImagePlusIcon, Loader2Icon, Trash2Icon, UserRoundIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { LeaderProfileDialog } from '@/components/admin/LeaderProfileDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SeoHead } from '@/components/seo/SeoHead'
import { ministryDetails, type MinistryDetail } from '@/config/ministries'
import { contentApi, type Leader } from '@/features/content/content-api'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'

interface DialogState {
  leader: Leader | null
  ministryName: string
  team: string
  role: string
}

function matchesMinistry(leader: Leader, ministry: MinistryDetail) {
  const assigned = (leader.ministry ?? '').trim().toLowerCase()
  const role = leader.roleTitle.trim().toLowerCase()
  return assigned === ministry.name.toLowerCase() || role === ministry.leaderRole.toLowerCase()
}

export default function AdminMinistriesPage() {
  const queryClient = useQueryClient()
  const [dialog, setDialog] = useState<DialogState | null>(null)

  const leadersQuery = useQuery({
    queryKey: queryKeys.admin.leaders,
    queryFn: () => contentApi.adminListLeaders(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contentApi.adminDeleteLeader(id),
    onSuccess: () => {
      toast.success('Leader removed')
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.leaders })
      void queryClient.invalidateQueries({ queryKey: queryKeys.public.leaders })
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const leaders = leadersQuery.data ?? []
  const pastoral = leaders.filter((leader) => leader.team === 'PASTORAL')

  return (
    <>
      <SeoHead title="Ministries" description="Add a profile photo for every ministry leader." />
      <div className="flex flex-col gap-6 p-6">
        <div className="border-border border-b pb-5">
          <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
            <span>Church life</span>
            <span>•</span>
            <span className="text-primary font-bold">Ministries</span>
          </div>
          <h1 className="text-foreground mt-1 flex items-center gap-2 text-2xl font-bold tracking-tight">
            <HeartHandshakeIcon className="text-primary size-6" />
            Ministry leaders
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            Each ministry has its own leaders. Upload a profile photo here and it appears on that ministry page, the leadership section, and — for the pastoral team — the pastor&apos;s message. These photos stay out of the media gallery.
          </p>
        </div>

        {leadersQuery.isPending ? (
          <div className="text-muted-foreground flex items-center justify-center py-16">
            <Loader2Icon className="mr-2 size-5 animate-spin" />
            Loading leaders…
          </div>
        ) : leadersQuery.isError ? (
          <p className="text-destructive text-sm">{normaliseApiError(leadersQuery.error).message}</p>
        ) : (
          <div className="flex flex-col gap-6">
            <LeaderGroup
              title="Pastoral team"
              description="The first published pastor supplies the portrait and message on the landing page."
              leaders={pastoral}
              onAdd={() => setDialog({ leader: null, ministryName: '', team: 'PASTORAL', role: 'Senior Pastor' })}
              onEdit={(leader) => setDialog({ leader, ministryName: leader.ministry ?? '', team: leader.team, role: leader.roleTitle })}
              onDelete={(id) => deleteMutation.mutate(id)}
            />

            {ministryDetails.map((ministry) => (
              <LeaderGroup
                key={ministry.slug}
                title={ministry.name}
                description={`${ministry.leaderRole}. ${ministry.tagline}`}
                leaders={leaders.filter((leader) => leader.team !== 'PASTORAL' && matchesMinistry(leader, ministry))}
                onAdd={() => setDialog({
                  leader: null,
                  ministryName: ministry.name,
                  team: 'MINISTRY',
                  role: ministry.leaderRole,
                })}
                onEdit={(leader) => setDialog({
                  leader,
                  ministryName: leader.ministry || ministry.name,
                  team: leader.team,
                  role: leader.roleTitle,
                })}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>

      <LeaderProfileDialog
        open={dialog !== null}
        leader={dialog?.leader}
        defaultMinistry={dialog?.ministryName}
        defaultTeam={dialog?.team}
        defaultRole={dialog?.role}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
      />
    </>
  )
}

function LeaderGroup({
  title,
  description,
  leaders,
  onAdd,
  onEdit,
  onDelete,
}: {
  title: string
  description: string
  leaders: Leader[]
  onAdd: () => void
  onEdit: (leader: Leader) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
          <Button type="button" onClick={onAdd} className="shrink-0">
            <ImagePlusIcon className="size-4" aria-hidden="true" />
            Add leader photo
          </Button>
        </div>

        {leaders.length === 0 ? (
          <div className="border-border bg-muted/40 text-muted-foreground flex items-center gap-3 rounded-lg border border-dashed px-4 py-5 text-sm">
            <UserRoundIcon className="size-5 shrink-0" aria-hidden="true" />
            No photo yet. Add a leader to show a portrait on the public page.
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {leaders.map((leader) => (
              <li key={leader.id} className="border-border flex items-center gap-3 rounded-lg border p-3">
                {leader.photoUrl ? (
                  <img src={leader.photoUrl} alt="" className="bg-muted size-16 rounded-full object-cover" />
                ) : (
                  <span className="bg-secondary text-primary flex size-16 items-center justify-center rounded-full">
                    <UserRoundIcon className="size-6" aria-hidden="true" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{leader.displayHeading}</p>
                  <p className="text-muted-foreground truncate text-xs">{leader.roleTitle}</p>
                  <Badge variant={leader.published ? 'success' : 'outline'} className="mt-2">
                    {leader.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1">
                  <Button type="button" size="sm" variant="outline" onClick={() => onEdit(leader)}>
                    {leader.photoUrl ? 'Replace' : 'Add photo'}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete(leader.id)}
                  >
                    <Trash2Icon className="size-4" aria-hidden="true" />
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
