import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  AlertCircleIcon,
  ArchiveIcon,
  CheckCircle2Icon,
  DownloadIcon,
  Loader2Icon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  ShieldAlertIcon,
  XCircleIcon,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input, Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { RoleGate } from '@/features/auth/RoleGate'
import {
  adminApplicationsApi,
  type MinistryApplication,
  type ReviewPayload,
} from '@/features/ministries/ministries-api'
import { ministryDetails } from '@/config/ministries'
import { normaliseApiError } from '@/lib/api/client'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 20

const STATUS_TABS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ARCHIVED', label: 'Archived' },
  { value: '', label: 'All' },
] as const

/** Badge variant per status. Text always accompanies the colour. */
function statusVariant(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'success' as const
    case 'REJECTED':
      return 'destructive' as const
    case 'ARCHIVED':
      return 'secondary' as const
    default:
      return 'warning' as const
  }
}

/**
 * Review queue for ministry applications.
 *
 * The backend for this was already complete — submit, list, review, assign a leader,
 * mark contacted, CSV export — so this screen is what turns it into something the
 * church can actually use.
 *
 * Defaults to the Pending tab, because the only reason to open this page is to deal
 * with applications nobody has looked at yet.
 */
export default function AdminApplicationsPage() {
  const queryClient = useQueryClient()

  const [status, setStatus] = useState<string>('PENDING')
  const [ministry, setMinistry] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [reviewing, setReviewing] = useState<MinistryApplication | null>(null)

  const params = {
    ...(status ? { status } : {}),
    ...(ministry ? { ministry } : {}),
    ...(search.trim() ? { search: search.trim() } : {}),
    page,
    size: PAGE_SIZE,
  }

  const statsQuery = useQuery({
    queryKey: ['admin', 'applications', 'stats'],
    queryFn: adminApplicationsApi.stats,
  })

  const listQuery = useQuery({
    queryKey: ['admin', 'applications', 'list', params],
    queryFn: () => adminApplicationsApi.list(params),
  })

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'applications'] })
  }

  const exportMutation = useMutation({
    mutationFn: () => adminApplicationsApi.exportCsv(status || undefined),
    onSuccess: () => toast.success('Export downloaded.'),
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  return (
    <>
      <SeoHead title="Ministry applications" noIndex />

      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ministry applications
            </h1>
            <p className="text-muted-foreground text-sm">
              People who have asked to join a ministry. Review, approve and hand them to a
              leader.
            </p>
          </div>

          <RoleGate permissions={['ministry_application:export']}>
            <Button
              variant="outline"
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending}
            >
              {exportMutation.isPending ? (
                <Loader2Icon className="animate-spin" aria-hidden="true" />
              ) : (
                <DownloadIcon aria-hidden="true" />
              )}
              Export CSV
            </Button>
          </RoleGate>
        </header>

        {/* --- Counts --------------------------------------------------- */}
        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 xl:grid-cols-4">
          <StatTile
            label="Pending"
            value={statsQuery.data?.pending}
            hint="awaiting review"
            icon={ShieldAlertIcon}
            isLoading={statsQuery.isPending}
          />
          <StatTile
            label="Approved"
            value={statsQuery.data?.approved}
            icon={CheckCircle2Icon}
            isLoading={statsQuery.isPending}
          />
          <StatTile
            label="Rejected"
            value={statsQuery.data?.rejected}
            icon={XCircleIcon}
            isLoading={statsQuery.isPending}
          />
          <StatTile
            label="Archived"
            value={statsQuery.data?.archived}
            icon={ArchiveIcon}
            isLoading={statsQuery.isPending}
          />
        </div>

        {/* --- Filters -------------------------------------------------- */}
        <Card className="py-4">
          <CardContent className="flex flex-col gap-4">
            <div
              role="group"
              aria-label="Filter by status"
              className="flex flex-wrap gap-2"
            >
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={status === tab.value}
                  onClick={() => {
                    setStatus(tab.value)
                    setPage(0)
                  }}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                    status === tab.value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:bg-secondary',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="relative">
                <SearchIcon
                  className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(0)
                  }}
                  placeholder="Search name, email or phone…"
                  aria-label="Search applications"
                  className="pl-9"
                />
              </div>

              <select
                value={ministry}
                onChange={(event) => {
                  setMinistry(event.target.value)
                  setPage(0)
                }}
                aria-label="Filter by ministry"
                className={cn(
                  'border-input bg-background h-10 w-full rounded-lg border px-3 text-sm',
                  'focus-visible:border-ring focus-visible:ring-ring/40 outline-none',
                  'focus-visible:ring-2',
                )}
              >
                <option value="">All ministries</option>
                {ministryDetails.map((entry) => (
                  <option key={entry.slug} value={entry.slug}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* --- Queue ---------------------------------------------------- */}
        {listQuery.isError && (
          <Alert variant="destructive">
            <AlertCircleIcon aria-hidden="true" />
            <AlertTitle>Could not load applications</AlertTitle>
            <AlertDescription>{normaliseApiError(listQuery.error).message}</AlertDescription>
          </Alert>
        )}

        {listQuery.isPending && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        )}

        {listQuery.isSuccess && (
          <>
            <Card className="py-0">
              <CardContent className="px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead className="hidden md:table-cell">Ministry</TableHead>
                      <TableHead className="hidden lg:table-cell">Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listQuery.data.content.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="flex items-center gap-2 font-medium">
                              {application.fullName}
                              {/* Safeguarding flag: a minor needs guardian consent
                                  before a leader contacts them. */}
                              {application.requiresParentalConsent && (
                                <Badge variant="warning" className="text-[10px]">
                                  Minor
                                </Badge>
                              )}
                            </span>
                            <span className="text-muted-foreground flex flex-wrap gap-x-3 text-xs">
                              <a
                                href={`mailto:${application.email}`}
                                className="hover:text-foreground inline-flex items-center gap-1"
                              >
                                <MailIcon className="size-3" aria-hidden="true" />
                                {application.email}
                              </a>
                              <a
                                href={`tel:${application.phone}`}
                                className="hover:text-foreground inline-flex items-center gap-1"
                              >
                                <PhoneIcon className="size-3" aria-hidden="true" />
                                {application.phone}
                              </a>
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm">{application.ministryName}</span>
                        </TableCell>

                        <TableCell className="text-muted-foreground hidden text-xs lg:table-cell">
                          {format(new Date(application.createdAt), 'd MMM yyyy, HH:mm')}
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col items-start gap-1">
                            <Badge variant={statusVariant(application.status)}>
                              {application.statusLabel}
                            </Badge>
                            {application.contactedAt && (
                              <span className="text-muted-foreground text-[10px]">
                                Contacted
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setReviewing(application)}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {listQuery.data.content.length === 0 && (
                  <p className="text-muted-foreground py-12 text-center text-sm">
                    {status === 'PENDING'
                      ? 'No applications waiting for review. '
                      : 'No applications match these filters.'}
                  </p>
                )}
              </CardContent>
            </Card>

            {listQuery.data.totalPages > 1 && (
              <nav aria-label="Pagination" className="flex items-center justify-between gap-4">
                <p className="text-muted-foreground text-sm">
                  Page {listQuery.data.page + 1} of {listQuery.data.totalPages} ·{' '}
                  {listQuery.data.totalElements.toLocaleString()} applications
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={listQuery.data.first}
                    onClick={() => setPage((current) => Math.max(0, current - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={listQuery.data.last}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Next
                  </Button>
                </div>
              </nav>
            )}
          </>
        )}
      </div>

      <ReviewDialog
        application={reviewing}
        onClose={() => setReviewing(null)}
        onReviewed={invalidate}
      />
    </>
  )
}

/** Full application detail with the review controls. */
function ReviewDialog({
  application,
  onClose,
  onReviewed,
}: {
  application: MinistryApplication | null
  onClose: () => void
  onReviewed: () => void
}) {
  const [notes, setNotes] = useState('')
  const [leader, setLeader] = useState('')
  const [markContacted, setMarkContacted] = useState(false)

  const reviewMutation = useMutation({
    mutationFn: (payload: ReviewPayload) => {
      if (!application) throw new Error('No application selected')
      return adminApplicationsApi.review(application.id, payload)
    },
    onSuccess: (updated) => {
      toast.success(`Application ${updated.statusLabel.toLowerCase()}.`)
      onReviewed()
      onClose()
      setNotes('')
      setLeader('')
      setMarkContacted(false)
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const decide = (status: ReviewPayload['status']) =>
    reviewMutation.mutate({
      status,
      ...(notes.trim() ? { reviewNotes: notes.trim() } : {}),
      ...(leader.trim() ? { assignedLeader: leader.trim() } : {}),
      markContacted,
    })

  return (
    <Dialog open={application !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        {application && (
          <>
            <DialogHeader>
              <DialogTitle>{application.fullName}</DialogTitle>
              <DialogDescription>
                Applying to {application.ministryName} ·{' '}
                {format(new Date(application.createdAt), 'd MMMM yyyy')}
              </DialogDescription>
            </DialogHeader>

            {application.requiresParentalConsent && (
              <Alert variant="warning">
                <ShieldAlertIcon aria-hidden="true" />
                <AlertTitle>This applicant is a minor</AlertTitle>
                <AlertDescription>
                  They confirmed a parent or guardian agreed. Please speak with the guardian
                  before they begin serving.
                </AlertDescription>
              </Alert>
            )}

            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <Detail label="Email" value={application.email} />
              <Detail label="Phone" value={application.phone} />
              <Detail label="Gender" value={application.genderLabel} />
              <Detail label="Age group" value={application.ageGroupLabel} />
              <Detail label="County" value={application.county} />
              <Detail label="Occupation" value={application.occupation} />
              <Detail label="Church member" value={application.churchMember ? 'Yes' : 'No'} />
              <Detail label="Baptised" value={application.baptized ? 'Yes' : 'No'} />
            </dl>

            <div className="flex flex-col gap-3 text-sm">
              <LongDetail label="Skills and talents" value={application.skills} />
              <LongDetail label="Previous experience" value={application.previousExperience} />
              <LongDetail label="Availability" value={application.availability} />
              <LongDetail label="Prayer request" value={application.prayerRequest} />
              <LongDetail label="Additional notes" value={application.additionalNotes} />
            </div>

            {application.reviewNotes && (
              <div className="bg-muted/50 flex flex-col gap-1 rounded-lg p-3 text-sm">
                <span className="text-muted-foreground text-xs font-medium">
                  Previous review notes
                  {application.reviewedByName && ` · ${application.reviewedByName}`}
                </span>
                <span>{application.reviewNotes}</span>
              </div>
            )}

            <RoleGate
              permissions={['ministry_application:update']}
              fallback={
                <p className="text-muted-foreground text-sm">
                  Your role can view applications but not decide on them.
                </p>
              }
            >
              <div className="flex flex-col gap-4 border-t pt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="assigned-leader">Assign to leader (optional)</Label>
                  <Input
                    id="assigned-leader"
                    value={leader}
                    onChange={(event) => setLeader(event.target.value)}
                    placeholder="e.g. the Youth Ministry Leader"
                    defaultValue={application.assignedLeader ?? ''}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="review-notes">Internal notes (optional)</Label>
                  <Textarea
                    id="review-notes"
                    rows={3}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Not shown to the applicant."
                  />
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={markContacted}
                    onChange={(event) => setMarkContacted(event.target.checked)}
                    className="border-input text-primary size-4 rounded"
                  />
                  I have already contacted this person
                </label>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => decide('ARCHIVED')}
                  disabled={reviewMutation.isPending}
                >
                  <ArchiveIcon aria-hidden="true" />
                  Archive
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => decide('REJECTED')}
                  disabled={reviewMutation.isPending}
                >
                  <XCircleIcon aria-hidden="true" />
                  Reject
                </Button>
                <Button
                  variant="success"
                  onClick={() => decide('APPROVED')}
                  disabled={reviewMutation.isPending}
                >
                  {reviewMutation.isPending ? (
                    <Loader2Icon className="animate-spin" aria-hidden="true" />
                  ) : (
                    <CheckCircle2Icon aria-hidden="true" />
                  )}
                  Approve
                </Button>
              </DialogFooter>
            </RoleGate>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="font-medium break-words">{value || '—'}</dd>
    </div>
  )
}

/** Longer free-text answer. Omitted entirely when the applicant left it blank. */
function LongDetail({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <p className="leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  )
}
