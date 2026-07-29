import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  AlertCircleIcon,
  LockOpenIcon,
  SearchIcon,
  Trash2Icon,
  UserPlusIcon,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
import { useAuth } from '@/features/auth/useAuth'
import { usersApi } from '@/features/admin/users-api'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'
import { ROLE_LABELS, type RoleName } from '@/lib/api/types'

const PAGE_SIZE = 20

export default function AdminUsersPage() {
  const queryClient = useQueryClient()
  const { user: currentUser } = useAuth()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const params = { search: search.trim(), page, size: PAGE_SIZE }

  const usersQuery = useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: () => usersApi.list(params),
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })

  const unlockMutation = useMutation({
    mutationFn: (id: string) => usersApi.unlock(id),
    onSuccess: () => {
      toast.success('Account unlocked.')
      void invalidate()
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => {
      toast.success('Account deleted.')
      void invalidate()
    },
    // The server refuses to delete the last Super Admin or your own account; that
    // message is worth surfacing verbatim rather than replacing with a generic one.
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  return (
    <>
      <SeoHead title="Staff accounts" noIndex />

      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Staff accounts</h1>
            <p className="text-muted-foreground text-sm">
              Manage who can sign in to the administration dashboard.
            </p>
          </div>

          {/* Creating accounts needs a form with role selection and password policy;
              that arrives with the user-management slice. Shown disabled so the
              capability is visible without pretending it works. */}
          <Button disabled title="Account creation is coming in the next release">
            <UserPlusIcon aria-hidden="true" />
            New account
          </Button>
        </header>

        <Card className="py-4">
          <CardContent>
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
                placeholder="Search by name or email…"
                className="pl-9"
                aria-label="Search staff accounts"
              />
            </div>
          </CardContent>
        </Card>

        {usersQuery.isError && (
          <Alert variant="destructive">
            <AlertCircleIcon aria-hidden="true" />
            <AlertTitle>Could not load accounts</AlertTitle>
            <AlertDescription>{normaliseApiError(usersQuery.error).message}</AlertDescription>
          </Alert>
        )}

        {usersQuery.isPending && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        )}

        {usersQuery.isSuccess && (
          <>
            <Card className="py-0">
              <CardContent className="px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Roles</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Last sign-in</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersQuery.data.content.map((account) => {
                      const isSelf = account.id === currentUser?.id
                      return (
                        <TableRow key={account.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {account.fullName}
                                {isSelf && (
                                  <span className="text-muted-foreground ml-2 text-xs">
                                    (you)
                                  </span>
                                )}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {account.email}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="hidden md:table-cell">
                            <span className="flex flex-wrap gap-1">
                              {account.roles.map((role) => (
                                <Badge key={role} variant="secondary" className="text-[10px]">
                                  {ROLE_LABELS[role as RoleName] ?? role}
                                </Badge>
                              ))}
                            </span>
                          </TableCell>

                          <TableCell>
                            {/* Text, not colour alone, carries the state. */}
                            {!account.active ? (
                              <Badge variant="destructive">Inactive</Badge>
                            ) : account.locked ? (
                              <Badge variant="warning">Locked</Badge>
                            ) : (
                              <Badge variant="success">Active</Badge>
                            )}
                          </TableCell>

                          <TableCell className="text-muted-foreground hidden text-xs lg:table-cell">
                            {account.lastLoginAt
                              ? format(new Date(account.lastLoginAt), 'd MMM yyyy, HH:mm')
                              : 'Never'}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              {account.locked && (
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => unlockMutation.mutate(account.id)}
                                  disabled={unlockMutation.isPending}
                                  aria-label={`Unlock ${account.fullName}`}
                                  title="Unlock account"
                                >
                                  <LockOpenIcon aria-hidden="true" />
                                </Button>
                              )}

                              <Button
                                variant="ghost"
                                size="icon-sm"
                                // Disabled for your own account: the server rejects it
                                // anyway, so offering the button would only produce an
                                // error the user cannot act on.
                                disabled={isSelf || deleteMutation.isPending}
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Delete the account for ${account.fullName}? This cannot be undone.`,
                                    )
                                  ) {
                                    deleteMutation.mutate(account.id)
                                  }
                                }}
                                aria-label={`Delete ${account.fullName}`}
                                title={isSelf ? 'You cannot delete your own account' : 'Delete account'}
                                className="text-destructive hover:bg-destructive/10"
                              >
                                <Trash2Icon aria-hidden="true" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>

                {usersQuery.data.content.length === 0 && (
                  <p className="text-muted-foreground py-10 text-center text-sm">
                    No accounts match that search.
                  </p>
                )}
              </CardContent>
            </Card>

            {usersQuery.data.totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="flex items-center justify-between gap-4"
              >
                <p className="text-muted-foreground text-sm">
                  Page {usersQuery.data.page + 1} of {usersQuery.data.totalPages} ·{' '}
                  {usersQuery.data.totalElements.toLocaleString()} accounts
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={usersQuery.data.first}
                    onClick={() => setPage((current) => Math.max(0, current - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={usersQuery.data.last}
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
    </>
  )
}
