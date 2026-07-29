import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { KeyRoundIcon, Loader2Icon, SaveIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SeoHead } from '@/components/seo/SeoHead'
import { authApi } from '@/features/auth/auth-api'
import { useAuth } from '@/features/auth/useAuth'
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '@/features/auth/login-schema'
import { ROLE_LABELS, type RoleName } from '@/lib/api/types'
import { normaliseApiError } from '@/lib/api/client'

const profileSchema = z.object({
  fullName: z.string().min(1, 'Your name is required.').max(180, 'That name is too long.'),
  phone: z.string().max(32, 'That phone number is too long.').optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function AdminProfilePage() {
  const { user, refreshUser, logout } = useAuth()

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    // Populated from the loaded user; the page only renders once auth resolved.
    defaultValues: { fullName: user?.fullName ?? '', phone: user?.phone ?? '' },
  })

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const profileMutation = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      authApi.updateProfile({
        fullName: values.fullName,
        phone: values.phone?.trim() ? values.phone.trim() : null,
      }),
    onSuccess: async () => {
      await refreshUser()
      toast.success('Profile updated.')
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const passwordMutation = useMutation({
    mutationFn: (values: ChangePasswordFormValues) =>
      authApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: async () => {
      passwordForm.reset()
      // The server revokes every other session on a password change. This one's
      // refresh token is revoked too, so signing out here is the honest outcome
      // rather than waiting for the next refresh to fail confusingly.
      toast.success('Password changed. Please sign in again.')
      await logout()
    },
    onError: (error) => {
      const { message, fieldErrors } = normaliseApiError(error)
      const currentPasswordError = fieldErrors.currentPassword?.[0]
      if (currentPasswordError) {
        passwordForm.setError('currentPassword', { message: currentPasswordError })
      } else {
        toast.error(message)
      }
    },
  })

  return (
    <>
      <SeoHead title="My profile" noIndex />

      <div className="flex max-w-2xl flex-col gap-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My profile</h1>
          <p className="text-muted-foreground text-sm">
            Update your details and change your password.
          </p>
        </header>

        {/* --- Account summary --------------------------------------------- */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
            <CardDescription>Your email and roles are set by a Super Admin.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Email</span>
              <span className="truncate font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Roles</span>
              <span className="flex flex-wrap justify-end gap-1.5">
                {user?.roles.map((role) => (
                  <Badge key={role} variant="secondary">
                    {ROLE_LABELS[role as RoleName] ?? role}
                  </Badge>
                ))}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* --- Details ----------------------------------------------------- */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your details</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              noValidate
              className="flex flex-col gap-5"
              onSubmit={profileForm.handleSubmit((values) => profileMutation.mutate(values))}
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  autoComplete="name"
                  aria-invalid={profileForm.formState.errors.fullName !== undefined}
                  {...profileForm.register('fullName')}
                />
                {profileForm.formState.errors.fullName && (
                  <p role="alert" className="text-destructive text-sm">
                    {profileForm.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+254 7XX XXX XXX"
                  aria-invalid={profileForm.formState.errors.phone !== undefined}
                  {...profileForm.register('phone')}
                />
                {profileForm.formState.errors.phone && (
                  <p role="alert" className="text-destructive text-sm">
                    {profileForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={profileMutation.isPending} className="self-start">
                {profileMutation.isPending ? (
                  <>
                    <Loader2Icon className="animate-spin" aria-hidden="true" />
                    Saving…
                  </>
                ) : (
                  <>
                    <SaveIcon aria-hidden="true" />
                    Save changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* --- Password ---------------------------------------------------- */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Change password</CardTitle>
            <CardDescription>
              You will be signed out on every device, including this one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              noValidate
              className="flex flex-col gap-5"
              onSubmit={passwordForm.handleSubmit((values) => passwordMutation.mutate(values))}
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={passwordForm.formState.errors.currentPassword !== undefined}
                  {...passwordForm.register('currentPassword')}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p role="alert" className="text-destructive text-sm">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={passwordForm.formState.errors.newPassword !== undefined}
                  aria-describedby="password-requirements"
                  {...passwordForm.register('newPassword')}
                />
                <p id="password-requirements" className="text-muted-foreground text-xs">
                  At least 10 characters, with an uppercase letter, a lowercase letter and a
                  number.
                </p>
                {passwordForm.formState.errors.newPassword && (
                  <p role="alert" className="text-destructive text-sm">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={passwordForm.formState.errors.confirmPassword !== undefined}
                  {...passwordForm.register('confirmPassword')}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p role="alert" className="text-destructive text-sm">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="outline"
                disabled={passwordMutation.isPending}
                className="self-start"
              >
                {passwordMutation.isPending ? (
                  <>
                    <Loader2Icon className="animate-spin" aria-hidden="true" />
                    Changing…
                  </>
                ) : (
                  <>
                    <KeyRoundIcon aria-hidden="true" />
                    Change password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
