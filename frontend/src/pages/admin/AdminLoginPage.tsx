import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon, EyeIcon, EyeOffIcon, Loader2Icon, LockIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FullPageSpinner } from '@/components/feedback/FullPageSpinner'
import { SeoHead } from '@/components/seo/SeoHead'
import { ThemeToggle } from '@/features/theme/ThemeToggle'
import { useAuth } from '@/features/auth/useAuth'
import { loginSchema, type LoginFormValues } from '@/features/auth/login-schema'
import { normaliseApiError } from '@/lib/api/client'
import { cn } from '@/lib/utils'

/** Where to land after a successful sign-in when there is no recorded origin. */
const DEFAULT_DESTINATION = '/admin'

interface LocationState {
  from?: { pathname?: string }
}

export default function AdminLoginPage() {
  const { login, isAuthenticated, isInitialising, isLoggingIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [formError, setFormError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  // Wait for the stored session to be validated before deciding anything —
  // otherwise a reload on /admin/login would show the form to a signed-in user.
  if (isInitialising) {
    return <FullPageSpinner label="Checking your session…" />
  }

  if (isAuthenticated) {
    const intended = (location.state as LocationState | null)?.from?.pathname
    return <Navigate to={intended ?? DEFAULT_DESTINATION} replace />
  }

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null)
    try {
      await login(values)
      const intended = (location.state as LocationState | null)?.from?.pathname
      navigate(intended ?? DEFAULT_DESTINATION, { replace: true })
    } catch (error) {
      const { code, message, fieldErrors } = normaliseApiError(error)

      // Map server-side field errors back onto the form so they appear inline.
      const emailErrors = fieldErrors.email
      const passwordErrors = fieldErrors.password
      if (emailErrors?.[0]) setError('email', { message: emailErrors[0] })
      if (passwordErrors?.[0]) setError('password', { message: passwordErrors[0] })

      // A locked or disabled account is not a credentials problem, so it is shown
      // as its own message rather than the generic "invalid email or password".
      if (code === 'ACCOUNT_LOCKED' || code === 'ACCOUNT_DISABLED') {
        setFormError(message)
      } else if (!emailErrors && !passwordErrors) {
        setFormError(message)
      }
    }
  }

  return (
    <>
      <SeoHead
        title="Admin sign in"
        description="Sign in to manage the Kapsomoita Church website."
        noIndex
      />

      <div className="bg-background relative flex min-h-dvh flex-col">
        {/* Decorative brand wash. aria-hidden: it carries no information. */}
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 overflow-hidden',
            'bg-gradient-to-br from-brand-50 via-background to-gold-50',
            'dark:from-brand-950 dark:via-background dark:to-neutral-950',
          )}
        >
          <div className="bg-brand-400/15 absolute -top-32 -left-32 size-96 rounded-full blur-3xl" />
          <div className="bg-gold-400/15 absolute -right-32 -bottom-32 size-96 rounded-full blur-3xl" />
        </div>

        <header className="relative flex items-center justify-end px-4 py-4 sm:px-6">
          <ThemeToggle />
        </header>

        <main className="relative flex flex-1 items-center justify-center px-4 pb-16 sm:px-6">
          <div className="w-full max-w-md">
            <div className="mb-8 flex flex-col items-center text-center">
              <div
                className={cn(
                  'bg-primary text-primary-foreground shadow-card mb-4 flex size-14',
                  'items-center justify-center rounded-2xl',
                )}
              >
                <LockIcon className="size-6" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Kapsomoita Church
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">Administration dashboard</p>
            </div>

            <Card className="shadow-lifted">
              <CardHeader>
                <CardTitle className="text-xl">Sign in</CardTitle>
                <CardDescription>
                  Enter your church staff credentials to continue.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* noValidate: react-hook-form + Zod own validation, so the
                    browser's own bubbles would duplicate and conflict with it. */}
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
                  {formError && (
                    <Alert variant="destructive">
                      <AlertCircleIcon aria-hidden="true" />
                      <AlertTitle>Unable to sign in</AlertTitle>
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="username"
                      autoFocus
                      placeholder="you@example.com"
                      aria-invalid={errors.email !== undefined}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      {...register('email')}
                    />
                    {errors.email && (
                      <p id="email-error" role="alert" className="text-destructive text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••••"
                        className="pr-11"
                        aria-invalid={errors.password !== undefined}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                        {...register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        className={cn(
                          'text-muted-foreground hover:text-foreground absolute top-1/2 right-1',
                          'focus-visible:ring-ring -translate-y-1/2 rounded-md p-2',
                          'transition-colors focus-visible:ring-2 focus-visible:outline-none',
                        )}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        // The input already announces its own state; keep this
                        // control out of the tab-order narrative as a toggle.
                        aria-pressed={showPassword}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="size-4" aria-hidden="true" />
                        ) : (
                          <EyeIcon className="size-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p id="password-error" role="alert" className="text-destructive text-sm">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" size="lg" block disabled={isLoggingIn}>
                    {isLoggingIn ? (
                      <>
                        <Loader2Icon className="animate-spin" aria-hidden="true" />
                        Signing in…
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <p className="text-muted-foreground mt-6 text-center text-xs">
              Trouble signing in? Contact your church administrator.
            </p>
          </div>
        </main>
      </div>
    </>
  )
}
