import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  CreditCardIcon,
  DollarSignIcon,
  DownloadIcon,
  Loader2Icon,
  SearchIcon,
  TagIcon,
  Trash2Icon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SeoHead } from '@/components/seo/SeoHead'
import { donationsApi } from '@/features/content/donations-api'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'

export default function AdminDonationsPage() {
  const queryClient = useQueryClient()
  const donationsQuery = useQuery({
    queryKey: queryKeys.admin.donations({ page: 0, size: 100 }),
    queryFn: () => donationsApi.adminList({ page: 0, size: 100 }),
  })
  const summaryQuery = useQuery({
    queryKey: queryKeys.admin.donationSummary({}),
    queryFn: () => donationsApi.adminSummary(),
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => donationsApi.adminDelete(id),
    onSuccess: () => {
      toast.success('Donation record removed')
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.donations({}) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.donationSummary({}) })
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })
  const [search, setSearch] = useState('')
  const donations = donationsQuery.data?.content ?? []

  const filtered = donations.filter(
    (d) =>
      (d.donorName ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (d.purpose ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (d.providerReference ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  const totalAmount = summaryQuery.data?.totalAmount ?? 0

  return (
    <>
      <SeoHead title="Donations & Giving" description="Track church tithes, offerings, building fund, and giving logs." />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>People</span>
              <span>•</span>
              <span className="text-primary font-bold">Stewardship</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1 flex items-center gap-2">
              <CreditCardIcon className="size-6 text-primary" />
              Donations & Tithes Ledger
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              View online giving records, M-Pesa transactions, and building fund receipts.
            </p>
          </div>

          <Button variant="outline" disabled title="The backend does not provide a donations export endpoint" className="shrink-0">
            <DownloadIcon className="mr-2 size-4" />
            Export unavailable
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase">Total Giving Recorded</span>
                <h3 className="text-2xl font-bold text-foreground mt-0.5">
                  KES {totalAmount.toLocaleString()}
                </h3>
              </div>
              <DollarSignIcon className="size-8 text-primary opacity-80" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase">Completed Transactions</span>
                <h3 className="text-2xl font-bold text-foreground mt-0.5">
                  {donations.filter((d) => d.status === 'COMPLETED').length}
                </h3>
              </div>
              <CreditCardIcon className="size-8 text-muted-foreground opacity-60" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase">Primary Channel</span>
                <h3 className="text-2xl font-bold text-foreground mt-0.5">M-PESA / Paybill</h3>
              </div>
              <TagIcon className="size-8 text-emerald-600 opacity-80" />
            </CardContent>
          </Card>
        </div>

        {/* Giving Log */}
        <Card>
          <CardHeader className="pb-3">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by donor name, category, or M-Pesa ref..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>

          <CardContent>
            {donationsQuery.isPending || summaryQuery.isPending ? (
              <div className="flex justify-center py-12"><Loader2Icon className="size-6 animate-spin text-primary" /></div>
            ) : donationsQuery.isError || summaryQuery.isError ? (
              <div className="py-12 text-center text-destructive">Unable to load donation records: {normaliseApiError(donationsQuery.error ?? summaryQuery.error).message}</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <CreditCardIcon className="size-10 mb-3 opacity-40" />
                <p className="font-medium text-foreground">No giving records found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Online tithes and offerings will populate here automatically.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 px-3 rounded-lg transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-600 shrink-0 mt-0.5">
                        <CreditCardIcon className="size-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground text-sm">{item.donorName}</h3>
                          <Badge variant="success" className="text-[10px]">
                            {item.status}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px]">
                            {item.purpose || 'Unspecified'}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1 font-mono text-foreground font-semibold">
                            Ref: {item.providerReference || 'Not provided'}
                          </span>
                          <span className="flex items-center gap-1">
                            Via: {item.method}
                          </span>
                          <span>{new Date(item.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right shrink-0">
                      <span className="text-lg font-bold text-foreground">
                        {item.currency || 'KES'} {item.amount.toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => deleteMutation.mutate(item.id)}
                        disabled={deleteMutation.isPending}
                        aria-label="Delete donation record"
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
