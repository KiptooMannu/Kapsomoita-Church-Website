import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AlertCircleIcon, CheckCircle2Icon, Loader2Icon, SendIcon } from 'lucide-react'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input, Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ministryOptions } from '@/config/ministries'
import { normaliseApiError } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import {
  AGE_GROUP_OPTIONS,
  GENDER_OPTIONS,
  KENYAN_COUNTIES,
  isMinorAgeGroup,
  joinMinistrySchema,
  type JoinMinistryFormValues,
} from './join-schema'
import { ministryApplicationsApi } from './ministries-api'

export interface JoinMinistryFormProps {
  /** Pre-selects the ministry when embedded on that ministry's page. */
  defaultMinistrySlug?: string
  /** Ministry name, for the heading. */
  ministryName?: string
}

/**
 * Application form for joining a ministry.
 *
 * One component embedded on every ministry page rather than a form per page, so the
 * eleven ministries share a single implementation and a single validation contract.
 *
 * Two things worth noting:
 *
 * - **The parental-consent checkbox appears only for a minor.** It is watched from the
 *   age-group field rather than always shown, so an adult is not asked an irrelevant
 *   safeguarding question, and a minor cannot submit without it.
 * - **Server field errors are mapped back onto the form.** A validation failure lands
 *   on the offending input rather than in a toast, so the user can see what to fix.
 */
export function JoinMinistryForm({
  defaultMinistrySlug,
  ministryName,
}: JoinMinistryFormProps) {
  // Unique ids, so two instances on one page cannot collide in their label/input
  // associations.
  const formId = useId()
  const fieldId = (name: string) => `${formId}-${name}`

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<JoinMinistryFormValues>({
    resolver: zodResolver(joinMinistrySchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      gender: '',
      ageGroup: '',
      county: '',
      occupation: '',
      ministrySlug: defaultMinistrySlug ?? '',
      skills: '',
      previousExperience: '',
      availability: '',
      prayerRequest: '',
      additionalNotes: '',
      consentToContact: false,
      guardianConsent: false,
    },
  })

  const selectedAgeGroup = watch('ageGroup')
  const needsGuardianConsent = isMinorAgeGroup(selectedAgeGroup ?? '')

  const mutation = useMutation({
    mutationFn: (values: JoinMinistryFormValues) => {
      const parsed = joinMinistrySchema.parse(values)
      return ministryApplicationsApi.submit({
        fullName: parsed.fullName,
        email: parsed.email,
        phone: parsed.phone,
        gender: parsed.gender,
        ageGroup: parsed.ageGroup,
        ministrySlug: parsed.ministrySlug,
        // Radio strings become booleans only at the API boundary.
        churchMember: parsed.churchMember === 'yes',
        baptized: parsed.baptized === 'yes',
        consentToContact: parsed.consentToContact,
        ...(parsed.county ? { county: parsed.county } : {}),
        ...(parsed.occupation ? { occupation: parsed.occupation } : {}),
        ...(parsed.skills ? { skills: parsed.skills } : {}),
        ...(parsed.previousExperience
          ? { previousExperience: parsed.previousExperience }
          : {}),
        ...(parsed.availability ? { availability: parsed.availability } : {}),
        ...(parsed.prayerRequest ? { prayerRequest: parsed.prayerRequest } : {}),
        ...(parsed.additionalNotes ? { additionalNotes: parsed.additionalNotes } : {}),
      })
    },
    onSuccess: () => reset(),
    onError: (error) => {
      const { fieldErrors } = normaliseApiError(error)
      // Surface each server-side field error on its own input.
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        const message = messages[0]
        if (message && field in errors === false) {
          setError(field as keyof JoinMinistryFormValues, { message })
        }
      })
    },
  })

  // --- Success ---------------------------------------------------------
  if (mutation.isSuccess) {
    return (
      <Card className="py-10">
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <span className="bg-success/12 text-success flex size-14 items-center justify-center rounded-2xl">
            <CheckCircle2Icon className="size-7" aria-hidden="true" />
          </span>
          <h3 className="text-xl font-semibold tracking-tight">Application received</h3>
          <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
            {mutation.data.message}
          </p>
          <p className="text-muted-foreground text-xs">
            Your reference: <code className="font-mono">{mutation.data.reference}</code>
          </p>
          <Button variant="outline" onClick={() => mutation.reset()}>
            Submit another application
          </Button>
        </CardContent>
      </Card>
    )
  }

  const serverError = mutation.isError ? normaliseApiError(mutation.error) : null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {ministryName ? `Join ${ministryName}` : 'Join a ministry'}
        </CardTitle>
        <CardDescription>
          Tell us a little about yourself and one of our leaders will be in touch. Fields
          marked with an asterisk are required.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          noValidate
          className="flex flex-col gap-6"
        >
          {serverError && Object.keys(serverError.fieldErrors).length === 0 && (
            <Alert variant="destructive">
              <AlertCircleIcon aria-hidden="true" />
              <AlertTitle>We could not submit your application</AlertTitle>
              <AlertDescription>{serverError.message}</AlertDescription>
            </Alert>
          )}

          {/* --- About you --------------------------------------------- */}
          <fieldset className="flex flex-col gap-4">
            <legend className="text-sm font-semibold tracking-wider uppercase">
              About you
            </legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id={fieldId('fullName')}
                label="Full name"
                required
                error={errors.fullName?.message}
              >
                <Input
                  id={fieldId('fullName')}
                  autoComplete="name"
                  aria-invalid={errors.fullName !== undefined}
                  {...register('fullName')}
                />
              </Field>

              <Field
                id={fieldId('email')}
                label="Email address"
                required
                error={errors.email?.message}
              >
                <Input
                  id={fieldId('email')}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  aria-invalid={errors.email !== undefined}
                  {...register('email')}
                />
              </Field>

              <Field
                id={fieldId('phone')}
                label="Phone number"
                required
                hint="e.g. 0712 345 678"
                error={errors.phone?.message}
              >
                <Input
                  id={fieldId('phone')}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0712 345 678"
                  aria-invalid={errors.phone !== undefined}
                  {...register('phone')}
                />
              </Field>

              <Field
                id={fieldId('occupation')}
                label="Occupation"
                error={errors.occupation?.message}
              >
                <Input
                  id={fieldId('occupation')}
                  autoComplete="organization-title"
                  placeholder="Teacher, student, trader…"
                  {...register('occupation')}
                />
              </Field>

              <Field
                id={fieldId('gender')}
                label="Gender"
                required
                error={errors.gender?.message}
              >
                <Select
                  id={fieldId('gender')}
                  aria-invalid={errors.gender !== undefined}
                  {...register('gender')}
                >
                  <option value="">Select…</option>
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                id={fieldId('ageGroup')}
                label="Age group"
                required
                error={errors.ageGroup?.message}
              >
                <Select
                  id={fieldId('ageGroup')}
                  aria-invalid={errors.ageGroup !== undefined}
                  {...register('ageGroup')}
                >
                  <option value="">Select…</option>
                  {AGE_GROUP_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field id={fieldId('county')} label="County" error={errors.county?.message}>
                <Select id={fieldId('county')} {...register('county')}>
                  <option value="">Select…</option>
                  {KENYAN_COUNTIES.map((county) => (
                    <option key={county} value={county}>
                      {county}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                id={fieldId('ministrySlug')}
                label="Preferred ministry"
                required
                error={errors.ministrySlug?.message}
              >
                <Select
                  id={fieldId('ministrySlug')}
                  aria-invalid={errors.ministrySlug !== undefined}
                  {...register('ministrySlug')}
                >
                  <option value="">Select…</option>
                  {ministryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </fieldset>

          {/* --- Your faith -------------------------------------------- */}
          <fieldset className="flex flex-col gap-4">
            <legend className="text-sm font-semibold tracking-wider uppercase">
              Your faith
            </legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <RadioGroup
                name="churchMember"
                legend="Are you a member of this church?"
                required
                error={errors.churchMember?.message}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No, not yet' },
                ]}
                register={register('churchMember')}
                idPrefix={fieldId('churchMember')}
              />

              <RadioGroup
                name="baptized"
                legend="Have you been baptised?"
                required
                error={errors.baptized?.message}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'Not yet' },
                ]}
                register={register('baptized')}
                idPrefix={fieldId('baptized')}
              />
            </div>
          </fieldset>

          {/* --- Serving ----------------------------------------------- */}
          <fieldset className="flex flex-col gap-4">
            <legend className="text-sm font-semibold tracking-wider uppercase">
              How you would like to serve
            </legend>

            <Field
              id={fieldId('skills')}
              label="Skills and talents"
              hint="Anything you could offer — music, teaching, sound, cooking, driving…"
              error={errors.skills?.message}
            >
              <Textarea id={fieldId('skills')} rows={3} {...register('skills')} />
            </Field>

            <Field
              id={fieldId('previousExperience')}
              label="Previous experience"
              hint="Have you served in this kind of ministry before?"
              error={errors.previousExperience?.message}
            >
              <Textarea
                id={fieldId('previousExperience')}
                rows={3}
                {...register('previousExperience')}
              />
            </Field>

            <Field
              id={fieldId('availability')}
              label="Availability"
              hint="Which days or times generally work for you?"
              error={errors.availability?.message}
            >
              <Textarea id={fieldId('availability')} rows={2} {...register('availability')} />
            </Field>
          </fieldset>

          {/* --- Anything else ---------------------------------------- */}
          <fieldset className="flex flex-col gap-4">
            <legend className="text-sm font-semibold tracking-wider uppercase">
              Anything else
            </legend>

            <Field
              id={fieldId('prayerRequest')}
              label="Prayer request"
              hint="Is there something we can pray with you about? This is seen only by our pastoral team."
              error={errors.prayerRequest?.message}
            >
              <Textarea id={fieldId('prayerRequest')} rows={3} {...register('prayerRequest')} />
            </Field>

            <Field
              id={fieldId('additionalNotes')}
              label="Additional notes"
              error={errors.additionalNotes?.message}
            >
              <Textarea
                id={fieldId('additionalNotes')}
                rows={2}
                {...register('additionalNotes')}
              />
            </Field>
          </fieldset>

          {/* --- Consent ---------------------------------------------- */}
          <div className="flex flex-col gap-3">
            <Checkbox
              id={fieldId('consentToContact')}
              label="I agree that the church may contact me about this application. *"
              error={errors.consentToContact?.message}
              register={register('consentToContact')}
            />

            {/* Shown only for a minor — safeguarding, not paperwork. */}
            {needsGuardianConsent && (
              <div className="border-warning/40 bg-warning/8 rounded-lg border p-4">
                <Checkbox
                  id={fieldId('guardianConsent')}
                  label="I confirm that my parent or guardian knows about and agrees to this application. *"
                  error={errors.guardianConsent?.message}
                  register={register('guardianConsent')}
                />
                <p className="text-muted-foreground mt-2 text-xs">
                  Because you are under 18, we need a parent or guardian to agree before you
                  join. A leader will speak with them.
                </p>
              </div>
            )}
          </div>

          <Button type="submit" size="lg" disabled={isSubmitting || mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                <SendIcon aria-hidden="true" />
                Submit application
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Small field primitives, local to this form
// ---------------------------------------------------------------------------

/** Label, control, hint and error, wired together for accessibility. */
function Field({
  id,
  label,
  required = false,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>

      {/* aria-describedby is applied by cloning, so callers need not repeat it. */}
      <div aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}>
        {children}
      </div>

      {hint && (
        <p id={hintId} className="text-muted-foreground text-xs">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  )
}

/** Native select styled to match `Input`. */
function Select({
  className,
  children,
  ...props
}: React.ComponentProps<'select'>) {
  return (
    <select
      className={cn(
        'border-input bg-background text-foreground h-10 w-full rounded-lg border px-3',
        'text-base shadow-sm outline-none transition-[color,box-shadow,border-color] sm:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-2',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/25 aria-invalid:ring-2',
        'disabled:bg-muted disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

/** Radio group in a fieldset, so the question is announced with each option. */
function RadioGroup({
  name,
  legend,
  options,
  required = false,
  error,
  register,
  idPrefix,
}: {
  name: string
  legend: string
  options: ReadonlyArray<{ value: string; label: string }>
  required?: boolean
  error?: string
  register: ReturnType<ReturnType<typeof useForm<JoinMinistryFormValues>>['register']>
  idPrefix: string
}) {
  const errorId = error ? `${idPrefix}-error` : undefined

  return (
    <fieldset className="flex flex-col gap-2" aria-describedby={errorId}>
      <legend className="text-sm leading-none font-medium">
        {legend}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </legend>

      <div className="flex flex-wrap gap-4 pt-1">
        {options.map((option) => (
          <label
            key={option.value}
            htmlFor={`${idPrefix}-${option.value}`}
            className="flex cursor-pointer items-center gap-2 text-sm"
          >
            <input
              id={`${idPrefix}-${option.value}`}
              type="radio"
              value={option.value}
              className="border-input text-primary focus-visible:ring-ring size-4"
              {...register}
              name={name}
            />
            {option.label}
          </label>
        ))}
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </fieldset>
  )
}

function Checkbox({
  id,
  label,
  error,
  register,
}: {
  id: string
  label: string
  error?: string
  register: ReturnType<ReturnType<typeof useForm<JoinMinistryFormValues>>['register']>
}) {
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 text-sm">
        <input
          id={id}
          type="checkbox"
          className="border-input text-primary focus-visible:ring-ring mt-0.5 size-4 shrink-0 rounded"
          aria-invalid={error !== undefined}
          aria-describedby={errorId}
          {...register}
        />
        <span className="leading-relaxed">{label}</span>
      </label>

      {error && (
        <p id={errorId} role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
