import { ArrowLeftIcon, ShieldXIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SeoHead } from '@/components/seo/SeoHead'
import { useAuth } from '@/features/auth/useAuth'
import { primaryRole } from '@/features/auth/permissions'
import { ROLE_LABELS } from '@/lib/api/types'

/**
 * Shown when a signed-in user reaches a route their role does not permit.
 *
 * Distinct from the login page on purpose: this is an authorisation outcome, not an
 * authentication one. Redirecting here to /login would imply the credentials were
 * wrong and produce a loop, because signing in again grants nothing new.
 */
export default function NoAccessPage() {
  const { user } = useAuth()
  const role = primaryRole(user)

  return (
    <>
      <SeoHead title="No access" noIndex />

      <div className="mx-auto flex max-w-lg flex-col items-center py-12 text-center">
        <span className="bg-destructive/10 text-destructive mb-6 flex size-16 items-center justify-center rounded-2xl">
          <ShieldXIcon className="size-8" aria-hidden="true" />
        </span>

        <h1 className="text-2xl font-bold tracking-tight">You do not have access</h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Your account does not have permission to view this section. If you believe you
          should, ask a Super Admin to review your role.
        </p>

        {role && (
          <Card className="mt-6 w-full py-4">
            <CardContent className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">Signed in as</span>
              <span className="font-medium">
                {user?.fullName} · {ROLE_LABELS[role]}
              </span>
            </CardContent>
          </Card>
        )}

        <Button asChild variant="outline" className="mt-8">
          <Link to="/admin">
            <ArrowLeftIcon aria-hidden="true" />
            Back to dashboard
          </Link>
        </Button>
      </div>
    </>
  )
}
