import { z } from 'zod'

/**
 * Login form schema.
 *
 * Client-side validation only catches obvious mistakes before a round trip; the
 * password rule is deliberately just "present". Enforcing the strength pattern
 * here would lock out accounts whose password predates a policy change and would
 * publish the policy to anyone reading the bundle.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Enter your email address.')
    .email('That does not look like a valid email address.')
    .max(255, 'That email address is too long.')
    // Normalise before it reaches the API so trailing whitespace from a password
    // manager or mobile keyboard cannot cause a spurious failure.
    .transform((value) => value.trim().toLowerCase()),
  password: z.string().min(1, 'Enter your password.').max(128, 'That password is too long.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

/** Shared password policy, matching `AuthDtos.PASSWORD_PATTERN` on the server. */
export const passwordSchema = z
  .string()
  .min(10, 'Use at least 10 characters.')
  .max(128, 'That password is too long.')
  .regex(/[a-z]/, 'Include a lowercase letter.')
  .regex(/[A-Z]/, 'Include an uppercase letter.')
  .regex(/\d/, 'Include a number.')

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password.'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your new password.'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Those passwords do not match.',
    path: ['confirmPassword'],
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    message: 'Your new password must be different from your current one.',
    path: ['newPassword'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
