import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon, CheckIcon, UsersIcon } from 'lucide-react'
import { Fragment, useMemo } from 'react'
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
import { rolesApi } from '@/features/admin/users-api'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'
import type { AdminRole } from '@/lib/api/types'
import { cn } from '@/lib/utils'

/** Column order for the matrix, so the table is stable across renders. */
const ROLE_ORDER = [
  'SUPER_ADMIN',
  'PASTOR',
  'SECRETARY',
  'MEDIA_TEAM',
  'EDITOR',
  'VOLUNTEER',
] as const

/**
 * Read-only view of the RBAC configuration.
 *
 * Editing grants is deliberately not offered yet. The six system roles cover the
 * specification's requirements, and a partially-built grant editor is an efficient
 * way for an administrator to remove their own access.
 */
export default function AdminRolesPage() {
  const rolesQuery = useQuery({ queryKey: queryKeys.admin.roles, queryFn: rolesApi.list })
  const permissionsQuery = useQuery({
    queryKey: queryKeys.admin.permissions,
    queryFn: rolesApi.permissions,
  })

  /** Permissions grouped by resource, which is how the matrix reads best. */
  const groupedPermissions = useMemo(() => {
    if (!permissionsQuery.data) return []
    const groups = new Map<string, string[]>()
    permissionsQuery.data.forEach((permission) => {
      const existing = groups.get(permission.resource)
      if (existing) {
        existing.push(permission.name)
      } else {
        groups.set(permission.resource, [permission.name])
      }
    })
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [permissionsQuery.data])

  /** Grant lookup by role name, for O(1) cell checks. */
  const grantsByRole = useMemo(() => {
    const map = new Map<string, Set<string>>()
    rolesQuery.data?.forEach((role) => map.set(role.name, new Set(role.permissions)))
    return map
  }, [rolesQuery.data])

  // Typed against AdminRole explicitly rather than `NonNullable<typeof role>`,
  // which resolves circularly inside its own type predicate.
  const orderedRoles = useMemo<AdminRole[]>(() => {
    const roles = rolesQuery.data
    if (!roles) return []
    return ROLE_ORDER.flatMap((name) => {
      const match = roles.find((role) => role.name === name)
      return match ? [match] : []
    })
  }, [rolesQuery.data])

  const isPending = rolesQuery.isPending || permissionsQuery.isPending
  const error = rolesQuery.error ?? permissionsQuery.error

  return (
    <>
      <SeoHead title="Roles & permissions" noIndex />

      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Roles &amp; permissions
          </h1>
          <p className="text-muted-foreground text-sm">
            What each role can do. Assign roles to people from Staff accounts.
          </p>
        </header>

        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon aria-hidden="true" />
            <AlertTitle>Could not load roles</AlertTitle>
            <AlertDescription>{normaliseApiError(error).message}</AlertDescription>
          </Alert>
        )}

        {isPending && (
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="h-28 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
        )}

        {!isPending && !error && (
          <>
            {/* --- Role cards ---------------------------------------------- */}
            <section aria-labelledby="roles-heading" className="flex flex-col gap-4">
              <h2 id="roles-heading" className="text-base font-semibold">
                The six roles
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {orderedRoles.map((role) => (
                  <Card key={role.id} className="py-5">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-base">{role.displayName}</CardTitle>
                        <Badge variant="secondary" className="shrink-0">
                          <UsersIcon aria-hidden="true" />
                          {role.userCount}
                        </Badge>
                      </div>
                      {role.description && (
                        <CardDescription>{role.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-xs">
                        {role.permissions.length.toLocaleString()} permission
                        {role.permissions.length === 1 ? '' : 's'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* --- Permission matrix -------------------------------------- */}
            <section aria-labelledby="matrix-heading" className="flex flex-col gap-4">
              <h2 id="matrix-heading" className="text-base font-semibold">
                Permission matrix
              </h2>

              <Card className="py-0">
                <CardContent className="px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 bg-card">Permission</TableHead>
                        {orderedRoles.map((role) => (
                          <TableHead key={role.id} className="text-center">
                            {role.displayName}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedPermissions.map(([resource, permissionNames]) => (
                        // A keyed Fragment: a shorthand <> cannot take a key, and
                        // without one React warns and loses row identity on re-render.
                        <Fragment key={resource}>
                          <TableRow className="bg-muted/40">
                            <TableCell
                              colSpan={orderedRoles.length + 1}
                              className="text-xs font-semibold tracking-wide uppercase"
                            >
                              {resource.replace(/_/g, ' ')}
                            </TableCell>
                          </TableRow>

                          {permissionNames.map((permissionName) => (
                            <TableRow key={permissionName}>
                              <TableCell className="bg-card sticky left-0 font-mono text-xs">
                                {permissionName}
                              </TableCell>
                              {orderedRoles.map((role) => {
                                const granted =
                                  grantsByRole.get(role.name)?.has(permissionName) ?? false
                                return (
                                  <TableCell key={role.id} className="text-center">
                                    {/* A tick plus an accessible label, so the
                                        state is never conveyed by a glyph alone. */}
                                    {granted ? (
                                      <>
                                        <CheckIcon
                                          className="text-success mx-auto size-4"
                                          aria-hidden="true"
                                        />
                                        <span className="sr-only">
                                          {role.displayName} has {permissionName}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span
                                          className={cn('text-muted-foreground/40')}
                                          aria-hidden="true"
                                        >
                                          —
                                        </span>
                                        <span className="sr-only">
                                          {role.displayName} does not have {permissionName}
                                        </span>
                                      </>
                                    )}
                                  </TableCell>
                                )
                              })}
                            </TableRow>
                          ))}
                        </Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </div>
    </>
  )
}
