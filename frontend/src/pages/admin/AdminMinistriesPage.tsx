import { useState } from 'react'
import {
  ClockIcon,
  HeartHandshakeIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  UserIcon,
} from 'lucide-react'
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

interface MinistryItem {
  id: string
  name: string
  leaderName: string
  meetingTime: string
  description: string
  published: boolean
}

const INITIAL_MINISTRIES: MinistryItem[] = [
  {
    id: '1',
    name: 'Youth & Young Adults Fellowship',
    leaderName: 'Bro. Brian Kiptoo',
    meetingTime: 'Saturdays @ 2:00 PM',
    description: 'Empowering young people to live passionately for Christ through discipleship and community.',
    published: true,
  },
  {
    id: '2',
    name: 'Women of Faith Ministry',
    leaderName: 'Mama Mary Tanui',
    meetingTime: 'Wednesdays @ 4:00 PM',
    description: 'Nurturing godly women, prayer warriors, and mothers building Christian homes.',
    published: true,
  },
  {
    id: '3',
    name: 'Men of Valor Fellowship',
    leaderName: 'Elder Joseph Cheruiyot',
    meetingTime: '1st Saturday of Month @ 7:00 AM',
    description: 'Equipping men to be spiritual leaders in their homes, church, and society.',
    published: true,
  },
]

export default function AdminMinistriesPage() {
  const [ministries, setMinistries] = useState<MinistryItem[]>(INITIAL_MINISTRIES)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [leaderName, setLeaderName] = useState('')
  const [meetingTime, setMeetingTime] = useState('')
  const [description, setDescription] = useState('')
  const [published, setPublished] = useState(true)

  const handleOpenDialog = (item?: MinistryItem) => {
    if (item) {
      setEditingId(item.id)
      setName(item.name)
      setLeaderName(item.leaderName)
      setMeetingTime(item.meetingTime)
      setDescription(item.description)
      setPublished(item.published)
    } else {
      setEditingId(null)
      setName('')
      setLeaderName('')
      setMeetingTime('')
      setDescription('')
      setPublished(true)
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Ministry name is required')
      return
    }

    if (editingId) {
      setMinistries((prev) =>
        prev.map((m) =>
          m.id === editingId
            ? { ...m, name, leaderName, meetingTime, description, published }
            : m,
        ),
      )
      toast.success('Ministry details updated')
    } else {
      const newMin: MinistryItem = {
        id: String(Date.now()),
        name,
        leaderName,
        meetingTime,
        description,
        published,
      }
      setMinistries((prev) => [newMin, ...prev])
      toast.success('New Ministry registered')
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setMinistries((prev) => prev.filter((m) => m.id !== id))
    toast.success('Ministry removed')
  }

  const filtered = ministries.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.leaderName.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
      <SeoHead title="Ministries Directory" description="Manage church ministry pages, leaders, and meeting times." />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Church Life</span>
              <span>•</span>
              <span className="text-primary font-bold">Ministries Directory</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1 flex items-center gap-2">
              <HeartHandshakeIcon className="size-6 text-primary" />
              Ministries Manager
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage church ministry groups, leaders, meeting schedules, and ministry goals.
            </p>
          </div>

          <Button onClick={() => handleOpenDialog()} className="shrink-0 bg-primary text-primary-foreground">
            <PlusIcon className="mr-2 size-4" />
            Add New Ministry
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search ministries by name or leader..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>

          <CardContent>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <HeartHandshakeIcon className="size-10 mb-3 opacity-40" />
                <p className="font-medium text-foreground">No ministries found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click "Add New Ministry" to register a church department.
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
                      </div>

                      <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{item.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-3 pt-2 border-t border-border/40">
                        {item.leaderName && (
                          <span className="flex items-center gap-1 font-medium text-foreground/90">
                            <UserIcon className="size-3.5 text-primary" />
                            {item.leaderName}
                          </span>
                        )}
                        {item.meetingTime && (
                          <span className="flex items-center gap-1">
                            <ClockIcon className="size-3.5 text-muted-foreground" />
                            {item.meetingTime}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border/50">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item)}>
                        Edit Ministry
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(item.id)}
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

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Ministry' : 'Add New Ministry'}</DialogTitle>
            <DialogDescription>
              Configure details and contact leader for this church ministry.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div>
              <Label htmlFor="min-name">Ministry Name *</Label>
              <Input
                id="min-name"
                placeholder="e.g. Youth & Young Adults Fellowship"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="min-desc">Description</Label>
              <Textarea
                id="min-desc"
                placeholder="Ministry vision and activities..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-leader">Department Leader</Label>
                <Input
                  id="min-leader"
                  placeholder="e.g. Elder Joseph Cheruiyot"
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="min-time">Meeting Schedule</Label>
                <Input
                  id="min-time"
                  placeholder="e.g. Saturdays @ 2:00 PM"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="mt-1"
                />
              </div>
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingId ? 'Save Changes' : 'Register Ministry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
