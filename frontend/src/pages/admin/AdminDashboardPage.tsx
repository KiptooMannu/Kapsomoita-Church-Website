import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ActivityIcon, ShieldCheckIcon, UserCheckIcon, UsersIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SeoHead } from '@/components/seo/SeoHead'
import { StatTile } from '@/features/admin/StatTile'
import { adminApi } from '@/features/admin/admin-api'
import { useAuth } from '@/features/auth/useAuth'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'
import { humaniseActionKey } from '@/lib/utils'

const ACTIVITY_LIMIT = 12

/** Failed and blocked sign-ins are worth visually flagging in the activity list. */
function activityTone(action: string): 'default' | 'destructive' | 'warning' {
  if (action.includes('failed') || action.includes('reuse_detected')) return 'destructive'
  if (action.includes('blocked')) return 'warning'
  return 'default'
}

export default function AdminDashboardPage() {
  const { user, hasPermission } = useAuth()

  const statsQuery = useQuery({
    queryKey: queryKeys.admin.dashboardStats,
    queryFn: adminApi.dashboardStats,
  })

  const canReadAudit = hasPermission('audit_log:read')

  const activityQuery = useQuery({
    queryKey: queryKeys.admin.recentActivity(ACTIVITY_LIMIT),
    queryFn: () => adminApi.recentActivity(ACTIVITY_LIMIT),
    // Skip the request entirely rather than letting it 403 and surface an error
    // banner to a user who simply has no audit permission.
    enabled: canReadAudit,
  })

  const stats = statsQuery.data
  const firstName = user?.fullName.split(' ')[0] ?? 'there'

  return (
    <>
      <SeoHead title="Dashboard" noIndex />

      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {firstName}
          </h1>
          <p className="text-muted-foreground text-sm">
            Here is what is happening across the Kapsomoita Church platform.
          </p>
        </header>

        {statsQuery.isError && (
          <Alert variant="destructive">
            <ActivityIcon aria-hidden="true" />
            <AlertTitle>Could not load statistics</AlertTitle>
            <AlertDescription>{normaliseApiError(statsQuery.error).message}</AlertDescription>
          </Alert>
        )}

        {/* --- Headline figures ------------------------------------------- */}
        <section aria-labelledby="stats-heading" className="flex flex-col gap-4">
          <h2 id="stats-heading" className="sr-only">
            Platform statistics
          </h2>

          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 xl:grid-cols-4">
            <StatTile
              label="Staff accounts"
              value={stats?.totalUsers}
              icon={UsersIcon}
              isLoading={statsQuery.isPending}
            />
            <StatTile
              label="Active accounts"
              value={stats?.activeUsers}
              hint={stats ? `of ${stats.totalUsers.toLocaleString()} total` : undefined}
              icon={UserCheckIcon}
              isLoading={statsQuery.isPending}
            />
            <StatTile
              label="Activity (24h)"
              value={stats?.auditEventsLast24h}
              icon={ActivityIcon}
              isLoading={statsQuery.isPending}
            />
            <StatTile
              label="Audit events"
              value={stats?.totalAuditEvents}
              hint="all time"
              icon={ShieldCheckIcon}
              isLoading={statsQuery.isPending}
            />
          </div>
        </section>

        {/* --- Recent activity -------------------------------------------- */}
        {canReadAudit && (
          <section aria-labelledby="activity-heading">
            <Card>
              <CardHeader>
                <CardTitle id="activity-heading" className="text-base">
                  Recent activity
                </CardTitle>
                <CardDescription>
                  The latest recorded actions across the platform.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {activityQuery.isPending && (
                  <div className="flex flex-col gap-3">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Skeleton key={index} className="h-10 w-full" />
                    ))}
                    <span role="status" aria-live="polite" className="sr-only">
                      Loading recent activity…
                    </span>
                  </div>
                )}

                {activityQuery.isError && (
                  <p className="text-muted-foreground text-sm">
                    {normaliseApiError(activityQuery.error).message}
                  </p>
                )}

                {activityQuery.isSuccess && activityQuery.data.length === 0 && (
                  <p className="text-muted-foreground py-6 text-center text-sm">
                    No activity recorded yet.
                  </p>
                )}

                {activityQuery.isSuccess && activityQuery.data.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead className="hidden sm:table-cell">Account</TableHead>
                        <TableHead className="hidden md:table-cell">IP</TableHead>
                        <TableHead className="text-right">When</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityQuery.data.map((entry) => {
                        const tone = activityTone(entry.action)
                        return (
                          <TableRow key={entry.id}>
                            <TableCell>
                              {/* The badge carries text, so the tone colour is
                                  reinforcement rather than the only signal. */}
                              <Badge
                                variant={tone === 'default' ? 'secondary' : tone}
                                className="font-normal"
                              >
                                {humaniseActionKey(entry.action)}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden max-w-48 truncate sm:table-cell">
                              {entry.actorEmail ?? '—'}
                            </TableCell>
                            <TableCell className="text-muted-foreground hidden font-mono text-xs md:table-cell">
                              {entry.ipAddress ?? '—'}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-right text-xs whitespace-nowrap">
                              {formatDistanceToNow(new Date(entry.createdAt), {
                                addSuffix: true,
                              })}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Honest about the current state rather than showing empty tiles for
            modules that do not exist yet. */}
        <Alert variant="info">
          <ActivityIcon aria-hidden="true" />
          <AlertTitle>More modules are on the way</AlertTitle>
          <AlertDescription>
            Authentication, staff accounts and media uploads are live. Sermons, events,
            the gallery browser, announcements and giving are being built — their tiles
            and statistics will appear here as each is completed.
          </AlertDescription>
        </Alert>
      </div>
    </>
  )
}
