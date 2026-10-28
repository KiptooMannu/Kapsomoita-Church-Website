import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiGet, apiPut } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'

/** A photograph the public site shows in a fixed place. Edited in Admin → Website photos. */
export interface SiteImage {
  slotKey: string
  label: string
  groupName: string
  imageUrl: string | null
  altText: string
  sortOrder: number
}

export const siteImagesApi = {
  list: () => apiGet<SiteImage[]>('/site-images'),
  replace: (slotKey: string, imageUrl: string | null) =>
    apiPut<SiteImage>(`/admin/site-images/${slotKey}`, { imageUrl }),
}

/** Ministry page slug → the photo slot an admin replaces. */
export const MINISTRY_IMAGE_SLOT: Record<string, string> = {
  youth: 'ministryYouth',
  women: 'ministryWomen',
  men: 'ministryMen',
  kids: 'ministryKids',
  'sunday-school': 'ministrySundaySchool',
  choir: 'ministryChoir',
  'praise-team': 'ministryPraise',
  prayer: 'ministryPrayer',
  evangelism: 'ministryEvangelism',
  missions: 'ministryMissions',
  media: 'ministryMedia',
}

export function useSiteImages() {
  const query = useQuery({
    queryKey: queryKeys.public.siteImages,
    queryFn: siteImagesApi.list,
    staleTime: 5 * 60_000,
  })

  const byKey = useMemo(() => {
    const map = new Map<string, SiteImage>()
    for (const image of query.data ?? []) map.set(image.slotKey, image)
    return map
  }, [query.data])

  const url = (slotKey: string) => byKey.get(slotKey)?.imageUrl || null
  const alt = (slotKey: string) => byKey.get(slotKey)?.altText ?? ''

  return { ...query, byKey, url, alt }
}
