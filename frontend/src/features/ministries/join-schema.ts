import { z } from 'zod'

/**
 * Kenyan mobile number. Mirrors the server pattern in
 * `MinistryApplicationDtos.PHONE_PATTERN` so the two cannot disagree.
 *
 * Deliberately permissive about spacing and prefix: rejecting a real number over a
 * space is a worse outcome than accepting an unusually formatted one.
 */
const phoneRegex = /^(\+?254|0)[\s-]?7\d{2}[\s-]?\d{3}[\s-]?\d{3}$/

/** The 47 Kenyan counties, for the county select. */
export const KENYAN_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', "Murang'a",
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu',
  'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia', 'Turkana',
  'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
] as const

/** Gender options. Values match the server's `Gender` enum. */
export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
] as const

/** Age bands. Values match the server's `AgeGroup` enum. */
export const AGE_GROUP_OPTIONS = [
  { value: 'UNDER_13', label: 'Under 13' },
  { value: 'AGE_13_17', label: '13–17' },
  { value: 'AGE_18_24', label: '18–24' },
  { value: 'AGE_25_34', label: '25–34' },
  { value: 'AGE_35_49', label: '35–49' },
  { value: 'AGE_50_64', label: '50–64' },
  { value: 'AGE_65_PLUS', label: '65+' },
] as const

/** Age bands where a parent or guardian must consent. */
const MINOR_AGE_GROUPS = new Set(['UNDER_13', 'AGE_13_17'])

export function isMinorAgeGroup(ageGroup: string): boolean {
  return MINOR_AGE_GROUPS.has(ageGroup)
}

/**
 * Ministry application form.
 *
 * Only the fields needed to make contact and place someone are required. Everything
 * descriptive is optional, because a long mandatory form is the most effective way to
 * stop people applying at all.
 */
export const joinMinistrySchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Please enter your full name.')
      .max(180, 'That name is too long.')
      .transform((value) => value.trim()),

    email: z
      .string()
      .min(1, 'Please enter your email address.')
      .email('Please enter a valid email address.')
      .max(255)
      .transform((value) => value.trim().toLowerCase()),

    phone: z
      .string()
      .min(1, 'Please enter your phone number.')
      .regex(phoneRegex, 'Enter a valid Kenyan mobile number, e.g. 0712 345 678.'),

    gender: z.string().min(1, 'Please select your gender.'),
    ageGroup: z.string().min(1, 'Please select your age group.'),

    county: z.string().max(80).optional(),
    occupation: z.string().max(120, 'That occupation is too long.').optional(),

    ministrySlug: z.string().min(1, 'Please choose a ministry.'),

    // Radio groups, so the value arrives as a string and is coerced here. Using a
    // plain boolean would make "not answered" indistinguishable from "No".
    churchMember: z.enum(['yes', 'no'], {
      errorMap: () => ({ message: 'Please tell us whether you are a member here.' }),
    }),
    baptized: z.enum(['yes', 'no'], {
      errorMap: () => ({ message: 'Please tell us whether you have been baptised.' }),
    }),

    skills: z.string().max(2000, 'Please keep this under 2000 characters.').optional(),
    previousExperience: z
      .string()
      .max(2000, 'Please keep this under 2000 characters.')
      .optional(),
    availability: z.string().max(1000, 'Please keep this under 1000 characters.').optional(),
    prayerRequest: z.string().max(2000, 'Please keep this under 2000 characters.').optional(),
    additionalNotes: z.string().max(2000, 'Please keep this under 2000 characters.').optional(),

    consentToContact: z.boolean().refine((value) => value, {
      message: 'Please confirm we may contact you about your application.',
    }),

    /** Only required for a minor; enforced by the refinement below. */
    guardianConsent: z.boolean().optional(),
  })
  .refine(
    (values) => !isMinorAgeGroup(values.ageGroup) || values.guardianConsent === true,
    {
      // Safeguarding: an applicant under 18 needs a parent or guardian's agreement
      // before joining a ministry, and the church needs that on record.
      message: 'A parent or guardian must agree before we can accept this application.',
      path: ['guardianConsent'],
    },
  )

export type JoinMinistryFormValues = z.input<typeof joinMinistrySchema>
export type JoinMinistryParsed = z.output<typeof joinMinistrySchema>
