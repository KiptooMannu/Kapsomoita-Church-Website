import { useQuery } from '@tanstack/react-query'
import {
  ActivityIcon,
  ClockIcon,
  CodeIcon,
  FilterIcon,
  GlobeIcon,
  Loader2Icon,
  RefreshCwIcon,
  SearchIcon,
  ShieldCheckIcon,
  UserIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { SeoHead } from '@/components/seo/SeoHead'
import { auditApi, type AuditLogEntry } from '@/features/admin/audit-api'

const COMMON_ACTION_FILTERS = [
  { label: 'All Actions', value: '' },
  { label: 'Auth Logins', value: 'auth.login' },
  { label: 'User Changes', value: 'user' },
  { label: 'Content Audits', value: 'content' },
]

export default function AdminAuditLogPage() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [page, setPage] = useState(0)
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null)

  const { data, isPending, isFetching, refetch } = useQuery({
    queryKey: ['admin', 'audit-logs', search, actionFilter, page],
    queryFn: () =>
      auditApi.adminListAuditLogs({
        search: search || undefined,
        action: actionFilter || undefined,
        page,
        size: 20,
      }),
  })

  const logs = data?.content ?? []
  const totalPages = data?.totalPages ?? 0

  const formatDetails = (rawDetails?: string | null) => {
    if (!rawDetails) return null
    try {
      const parsed = JSON.parse(rawDetails)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return rawDetails
    }
  }

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('login.failed') || action.includes('deleted') || action.includes('blocked')) {
      return 'destructive'
    }
    if (action.includes('success') || action.includes('created')) {
      return 'success'
    }
    if (action.includes('updated') || action.includes('changed')) {
      return 'secondary'
    }
    return 'outline'
  }

  return (
    <>
      <SeoHead
        title="System Audit Log"
        description="View administrative activity, security events, and audit trails."
      />

      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Security</span>
              <span>•</span>
              <span className="text-primary font-bold">System Compliance</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1 flex items-center gap-2">
              <ShieldCheckIcon className="size-6 text-primary" />
              Audit Log & Activity History
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive log of user logins, role modifications, and administrative operations.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="shrink-0"
          >
            <RefreshCwIcon className={`mr-2 size-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh Trail
          </Button>
        </div>

        {/* Filter Bar */}
        <Card className="bg-card/50 shadow-sm">
          <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by action name, actor email, resource type or IP..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(0)
                }}
                className="pl-9 bg-background"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 overflow-x-auto pb-1 md:pb-0">
              <FilterIcon className="size-4 text-muted-foreground hidden sm:block" />
              {COMMON_ACTION_FILTERS.map((f) => (
                <Button
                  key={f.value}
                  variant={actionFilter === f.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setActionFilter(f.value)
                    setPage(0)
                  }}
                  className="text-xs h-8 whitespace-nowrap"
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Log Feed */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ActivityIcon className="size-4 text-primary" />
              Audit Stream Records
            </CardTitle>
            {data && (
              <span className="text-xs text-muted-foreground font-mono">
                {data.totalElements} total entries
              </span>
            )}
          </CardHeader>

          <CardContent>
            {isPending ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Loader2Icon className="size-8 animate-spin mb-2 text-primary" />
                <p className="text-sm">Fetching security audit logs...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <ShieldCheckIcon className="size-12 mb-3 opacity-30 text-primary" />
                <p className="font-semibold text-foreground text-base">No Audit Records Found</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  {search || actionFilter
                    ? 'No entries match your search criteria. Try clearing the filter.'
                    : 'System activity will appear here as administrative actions occur.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {logs.map((entry) => (
                  <div
                    key={entry.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 px-3 rounded-lg transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                        <ActivityIcon className="size-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge variant={getActionBadgeVariant(entry.action)} className="font-mono text-xs">
                            {entry.action}
                          </Badge>
                          {entry.resourceType && (
                            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                              {entry.resourceType} {entry.resourceId ? `#${entry.resourceId.slice(0, 8)}` : ''}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1 font-medium text-foreground/90">
                            <UserIcon className="size-3.5 text-muted-foreground" />
                            {entry.actorEmail || entry.actorName || 'System / Anonymous'}
                          </span>

                          {entry.ipAddress && (
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              <GlobeIcon className="size-3 text-muted-foreground" />
                              {entry.ipAddress}
                            </span>
                          )}

                          <span className="flex items-center gap-1">
                            <ClockIcon className="size-3 text-muted-foreground" />
                            {new Date(entry.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {entry.details && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEntry(entry)}
                          className="h-8 text-xs gap-1.5"
                        >
                          <CodeIcon className="size-3.5" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 border-t border-border pt-4 mt-4">
                <span className="text-xs text-muted-foreground">
                  Page {page + 1} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details JSON Inspector Dialog */}
      <Dialog open={selectedEntry !== null} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CodeIcon className="size-5 text-primary" />
              Audit Entry Details
            </DialogTitle>
            <DialogDescription>
              Action: <span className="font-mono font-semibold">{selectedEntry?.action}</span>
            </DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="flex flex-col gap-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-xs bg-muted/40 p-3 rounded-lg">
                <div>
                  <span className="text-muted-foreground block">Actor Email:</span>
                  <span className="font-semibold">{selectedEntry.actorEmail || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Timestamp:</span>
                  <span className="font-semibold">{new Date(selectedEntry.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">IP Address:</span>
                  <span className="font-mono">{selectedEntry.ipAddress || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Resource:</span>
                  <span className="font-mono">{selectedEntry.resourceType || 'None'}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-foreground mb-1 block">Context Payload (JSON):</span>
                <pre className="p-3 bg-zinc-950 text-zinc-100 rounded-lg text-xs font-mono overflow-x-auto max-h-64 border border-zinc-800">
                  {formatDetails(selectedEntry.details) || '// No additional payload'}
                </pre>
              </div>

              {selectedEntry.userAgent && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground mb-0.5 block">User Agent:</span>
                  <p className="text-xs font-mono text-muted-foreground break-all bg-muted p-2 rounded">
                    {selectedEntry.userAgent}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
