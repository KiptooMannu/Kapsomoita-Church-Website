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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SeoHead } from '@/components/seo/SeoHead'
import { contentApi, type Leader } from '@/features/content/content-api'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'

export default function AdminLeadersPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null)

  // Form state
  const [fullName, setFullName] = useState('')
  const [roleTitle, setRoleTitle] = useState('')
  const [bio, setBio] = useState('')
  const [ministry, setMinistry] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [team, setTeam] = useState('PASTORAL')
  const [published, setPublished] = useState(true)

  const leadersQuery = useQuery({
    queryKey: queryKeys.admin.leaders,
    queryFn: () => contentApi.adminListLeaders(),
  })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        fullName: fullName || undefined,
        roleTitle,
        bio: bio || undefined,
        ministry: ministry || undefined,
        email: email || undefined,
        phone: phone || undefined,
        team,
        published,
      }
      if (editingLeader) {
        return contentApi.adminUpdateLeader(editingLeader.id, payload)
      }
      return contentApi.adminCreateLeader(payload)
    },
    onSuccess: () => {
      toast.success(editingLeader ? 'Leader profile updated' : 'Leader profile added')
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.leaders })
      void queryClient.invalidateQueries({ queryKey: queryKeys.public.leaders })
      handleCloseDialog()
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
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

  const handleOpenDialog = (item?: Leader) => {
    if (item) {
      setEditingLeader(item)
      setFullName(item.fullName ?? '')
      setRoleTitle(item.roleTitle)
      setBio(item.bio ?? '')
      setMinistry(item.ministry ?? '')
      setEmail(item.email ?? '')
      setPhone(item.phone ?? '')
      setTeam(item.team || 'PASTORAL')
      setPublished(item.published)
    } else {
      setEditingLeader(null)
      setFullName('')
      setRoleTitle('')
      setBio('')
      setMinistry('')
      setEmail('')
      setPhone('')
      setTeam('PASTORAL')
      setPublished(true)
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingLeader(null)
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

          <Button onClick={() => handleOpenDialog()} className="shrink-0 bg-primary text-primary-foreground">
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
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant={item.published ? 'success' : 'outline'}>
                          {item.published ? 'Published' : 'Draft'}
                        </Badge>
                        <Badge variant="secondary">{item.teamLabel || item.team}</Badge>
                      </div>

                      <h3 className="font-semibold text-lg text-foreground">
                        {item.displayHeading}
                      </h3>
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
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item)}>
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

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingLeader ? 'Edit Leader Profile' : 'New Leader Profile'}</DialogTitle>
            <DialogDescription>
              Add pastoral and ministry leaders to showcase on the website.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lead-name">Full Name</Label>
                <Input
                  id="lead-name"
                  placeholder="e.g., Rev. John Tanui"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="lead-role">Role Title *</Label>
                <Input
                  id="lead-role"
                  placeholder="e.g., Senior Pastor"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="lead-bio">Biography</Label>
              <Textarea
                id="lead-bio"
                placeholder="Brief background and calling..."
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lead-email">Email</Label>
                <Input
                  id="lead-email"
                  placeholder="pastor@kapsomoitachurch.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="lead-phone">Phone</Label>
                <Input
                  id="lead-phone"
                  placeholder="+254 700 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="lead-team">Team Category</Label>
              <select
                id="lead-team"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="PASTORAL">Pastoral Team</option>
                <option value="MINISTRY">Ministry Leaders</option>
                <option value="SUPPORT">Support & Board</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-input text-primary size-4"
              />
              Publish Live on Website
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !roleTitle.trim()}
            >
              {saveMutation.isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              {editingLeader ? 'Save Changes' : 'Add Profile'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
