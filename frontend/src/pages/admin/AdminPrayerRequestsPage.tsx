import { useState } from 'react'
import {
  CheckCircle2Icon,
  ClockIcon,
  HandHeartIcon,
  HeartHandshakeIcon,
  LockIcon,
  SearchIcon,
  Trash2Icon,
  UserIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SeoHead } from '@/components/seo/SeoHead'

interface PrayerRequestItem {
  id: string
  requestorName?: string
  phone?: string
  intention: string
  isConfidential: boolean
  status: 'PENDING' | 'PRAYING' | 'ANSWERED'
  createdAt: string
}

const INITIAL_REQUESTS: PrayerRequestItem[] = [
  {
    id: '1',
    requestorName: 'Sister Grace',
    phone: '+254 701 111 222',
    intention: 'Please pray for healing and quick recovery for my brother in hospital.',
    isConfidential: true,
    status: 'PRAYING',
    createdAt: '2026-07-29T16:00:00Z',
  },
  {
    id: '2',
    requestorName: 'Anonymous',
    intention: 'Praying for open doors and employment for university graduates in our church.',
    isConfidential: false,
    status: 'PENDING',
    createdAt: '2026-07-28T09:30:00Z',
  },
]

export default function AdminPrayerRequestsPage() {
  const [requests, setRequests] = useState<PrayerRequestItem[]>(INITIAL_REQUESTS)
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState<PrayerRequestItem | null>(null)

  const handleUpdateStatus = (id: string, newStatus: 'PENDING' | 'PRAYING' | 'ANSWERED') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    )
    toast.success(`Prayer request status updated to ${newStatus}`)
    if (selectedItem) {
      setSelectedItem((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  const handleDelete = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id))
    toast.success('Prayer request removed')
    setSelectedItem(null)
  }

  const filtered = requests.filter(
    (r) =>
      (r.requestorName ?? '').toLowerCase().includes(search.toLowerCase()) ||
      r.intention.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
      <SeoHead title="Prayer Requests" description="Review prayer requests submitted by church members." />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>People</span>
              <span>•</span>
              <span className="text-primary font-bold">Intercession</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1 flex items-center gap-2">
              <HandHeartIcon className="size-6 text-primary" />
              Prayer Requests & Intercession
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review confidential and public prayer requests for pastoral care and intercession.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search prayer requests by name or intention..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>

          <CardContent>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <HandHeartIcon className="size-10 mb-3 opacity-40" />
                <p className="font-medium text-foreground">No prayer requests found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Prayer intentions submitted via the website will appear here.
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
                        <Badge
                          variant={
                            item.status === 'ANSWERED'
                              ? 'success'
                              : item.status === 'PRAYING'
                                ? 'secondary'
                                : 'warning'
                          }
                        >
                          {item.status}
                        </Badge>

                        {item.isConfidential && (
                          <Badge variant="outline" className="flex items-center gap-1 border-amber-500/40 text-amber-600">
                            <LockIcon className="size-3" />
                            Confidential
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-foreground/90 font-serif italic border-l-2 border-primary/40 pl-3 py-1 my-2">
                        "{item.intention}"
                      </p>

                      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mt-3 pt-2 border-t border-border/40">
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          <UserIcon className="size-3.5 text-primary" />
                          {item.requestorName || 'Anonymous'}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="size-3" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(item.id, 'PRAYING')}
                          className="text-xs text-primary hover:bg-primary/10"
                        >
                          <HeartHandshakeIcon className="mr-1 size-3.5" />
                          Praying
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(item.id, 'ANSWERED')}
                          className="text-xs text-emerald-600 hover:bg-emerald-500/10"
                        >
                          <CheckCircle2Icon className="mr-1 size-3.5" />
                          Answered
                        </Button>
                      </div>

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
    </>
  )
}
