import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Loader2Icon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  UserRoundIcon,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { LeaderProfileDialog } from '@/components/admin/LeaderProfileDialog'
import { SeoHead } from '@/components/seo/SeoHead'
import { contentApi, type Leader } from '@/features/content/content-api'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'

export default function AdminLeadersPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [dialogLeader, setDialogLeader] = useState<Leader | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const leadersQuery = useQuery({
    queryKey: queryKeys.admin.leaders,
    queryFn: () => contentApi.adminListLeaders(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contentApi.adminDeleteLeader(id),
    onSuccess: () => {
      toast.success('Leader profile deleted')
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.leaders })
      void queryClient.invalidateQueries({ queryKey: queryKeys.public.leaders })
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const openDialog = (item?: Leader) => {
    setDialogLeader(item ?? null)
    setDialogOpen(true)
  }

  const leaders = leadersQuery.data ?? []
  const filtered = leaders.filter(
    (l) =>
      (l.fullName ?? '').toLowerCase().includes(search.toLowerCase()) ||
      l.roleTitle.toLowerCase().includes(search.toLowerCase()) ||
      (l.ministry ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
      <SeoHead title="Leadership Directory" description="Manage pastoral team profiles, board members and department heads." />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Church Life</span>
              <span>•</span>
              <span className="text-primary font-bold">Pastoral Team</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1 flex items-center gap-2">
              <UserRoundIcon className="size-6 text-primary" />
              Leadership Directory Manager
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage profiles, titles, contact information, and biographies for pastors and leaders.
            </p>
          </div>

          <Button onClick={() => openDialog()} className="shrink-0">
            <PlusIcon className="mr-2 size-4" />
            Add Leader Profile
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search leaders by name, role or ministry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>

          <CardContent>
            {leadersQuery.isPending ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2Icon className="mr-2 size-5 animate-spin" />
                Loading leadership profiles...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <UserRoundIcon className="size-10 mb-3 opacity-40" />
                <p className="font-medium text-foreground">No leadership profiles found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click "Add Leader Profile" above to register a team member.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                  >
                    <div>
                      <div className="mb-3 flex items-center gap-3">
                        {item.photoUrl ? (
                          <img
                            src={item.photoUrl}
                            alt=""
                            className="size-14 rounded-full object-cover"
                          />
                        ) : (
                          <span className="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-full">
                            <UserRoundIcon className="size-6" aria-hidden="true" />
                          </span>
                        )}
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-semibold text-foreground">
                            {item.displayHeading}
                          </h3>
                          <p className="text-primary truncate text-sm">{item.roleTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant={item.published ? 'success' : 'outline'}>
                          {item.published ? 'Published' : 'Draft'}
                        </Badge>
                        <Badge variant="secondary">{item.teamLabel || item.team}</Badge>
                      </div>

                      {item.bio && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.bio}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-3 pt-2 border-t border-border/40">
                        {item.email && (
                          <span className="flex items-center gap-1">
                            <MailIcon className="size-3 text-primary" />
                            {item.email}
                          </span>
                        )}
                        {item.phone && (
                          <span className="flex items-center gap-1">
                            <PhoneIcon className="size-3 text-muted-foreground" />
                            {item.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border/50">
                      <Button variant="outline" size="sm" onClick={() => openDialog(item)}>
                        Edit Profile
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteMutation.mutate(item.id)}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <LeaderProfileDialog
        open={dialogOpen}
        leader={dialogLeader}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
