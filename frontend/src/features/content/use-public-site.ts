import { useQuery } from '@tanstack/react-query'
import { site } from '@/config/site'
import { churchSettingsApi } from '@/features/content/church-settings-api'
import { queryKeys } from '@/lib/query-client'

/**
 * Public church details, with the admin Church Settings record winning over
 * the static fallback in `config/site.ts`.
 *
 * Settings that have not been saved yet keep the fallback, so a missing key
 * never blanks the header or the giving page.
 */
export function usePublicSite() {
  const settingsQuery = useQuery({
    queryKey: queryKeys.public.settings,
    queryFn: churchSettingsApi.public,
    staleTime: 5 * 60_000,
  })

  const values = new Map(
    (settingsQuery.data?.settings ?? []).map((setting) => [
      setting.settingKey,
      setting.settingValue?.trim() ?? '',
    ]),
  )

  const text = (key: string, fallback: string) => {
    if (!settingsQuery.isSuccess) return fallback
    const value = values.get(key)
    return value ? value : fallback
  }

  const social = (key: string) => {
    if (!settingsQuery.isSuccess) return ''
    const value = values.get(key) ?? ''
    return /^https?:\/\//i.test(value) ? value : ''
  }

  const phone = text('contact.phone', site.contact.phone)
  const addressLine1 = text('contact.address_line1', site.contact.addressLines[0] ?? '')
  const addressLine2 = text('contact.address_line2', site.contact.addressLines[1] ?? '')

  return {
    isReady: settingsQuery.isSuccess,
    name: text('church.short_name', site.name),
    fullName: text('church.name', site.fullName),
    tagline: text('church.tagline', site.tagline),
    vision: text('church.vision', site.vision),
    mission: text('church.mission', site.mission),
    contact: {
      email: text('contact.email', site.contact.email),
      phone,
      phoneHref: phone.replace(/[^\d+]/g, '') || site.contact.phoneHref,
      addressLines: [addressLine1, addressLine2].filter((line) => line.length > 0),
    },
    location: {
      searchQuery: text('contact.map_query', site.location.searchQuery),
      parkingNote: text('contact.parking_note', site.location.parkingNote),
      landmarkNote: text('contact.landmark_note', site.location.landmarkNote),
    },
    social: {
      facebook: social('social.facebook'),
      instagram: social('social.instagram'),
      twitter: social('social.twitter'),
      youtube: social('social.youtube'),
    },
    giving: {
      mpesa: {
        paybill: text('giving.mpesa_paybill', site.giving.mpesa.paybill),
        accountName: text('giving.mpesa_account', site.giving.mpesa.accountName),
      },
      bank: {
        name: text('giving.bank_name', site.giving.bank.name),
        accountNumber: text('giving.bank_account', site.giving.bank.accountNumber),
        branch: text('giving.bank_branch', site.giving.bank.branch),
      },
    },
  }
}

export type PublicSite = ReturnType<typeof usePublicSite>
