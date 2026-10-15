import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { BookOpenIcon, ClockIcon, DownloadIcon, PlayCircleIcon, SearchIcon, UserIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { LivestreamBanner } from '@/components/public/sections/LivestreamBanner'
import { Section, SectionHeading } from '@/components/public/Section'
import { SeoHead } from '@/components/seo/SeoHead'
import { downloadsApi } from '@/features/content/downloads-api'
import { SermonThumbnail } from '@/components/public/SermonThumbnail'
import { sermonsApi } from '@/features/content/sermons-api'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'

/**
 * Sermon library, livestream and downloadable resources.
 * All three are published from the admin Sermons, Livestream and Downloads screens.
 */
export default function SermonsPage() {
  const [search, setSearch] = useState('')
  const [series, setSeries] = useState('All')

  const sermonsQuery = useQuery({
    queryKey: queryKeys.public.sermons,
    queryFn: () => sermonsApi.list({ size: 50 }),
  })

  const downloadsQuery = useQuery({
    queryKey: queryKeys.public.downloads,
    queryFn: downloadsApi.publicList,
  })

  const sermons = sermonsQuery.data ?? []
  const seriesOptions = useMemo(() => {
    const names = new Set(sermons.map((sermon) => sermon.series).filter((name): name is string => Boolean(name)))
    return ['All', ...names]
  }, [sermons])

  const visible = sermons.filter((sermon) => {
    const haystack = `${sermon.title} ${sermon.speaker} ${sermon.topic ?? ''} ${sermon.bibleReference ?? ''}`.toLowerCase()
    const matchesSearch = haystack.includes(search.trim().toLowerCase())
    const matchesSeries = series === 'All' || sermon.series === series
    return matchesSearch && matchesSeries
  })

  return (
    <>
      <SeoHead
        title="Sermons"
        description="Watch and listen to recent sermons, join the livestream, and download notes from Kapsomoita AGC."
      />

      <header className="bg-brand-950 relative overflow-hidden py-16 text-white sm:py-20">
        <div className="container-page relative">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <Badge variant="gold">Teaching</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Sermons</h1>
            <p className="text-base leading-relaxed text-white/80 sm:text-lg">
              Missed a Sunday, or want to hear it again? Every published sermon from the church office appears here.
            </p>
          </div>
        </div>
      </header>

      <LivestreamBanner />

      <Section id="sermon-library">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Library"
            title="Recent messages"
            description="Search by title, speaker or scripture."
          />
          <div className="relative w-full sm:max-w-xs">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" aria-hidden="true" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search sermons"
              aria-label="Search sermons"
              className="pl-9"
            />
          </div>
        </div>

        {seriesOptions.length > 1 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {seriesOptions.map((option) => (
              <Button
                key={option}
                type="button"
                size="sm"
                variant={series === option ? 'default' : 'outline'}
                onClick={() => setSeries(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        )}

        {sermonsQuery.isPending && (
          <p className="text-muted-foreground mt-10 text-center">Loading sermons…</p>
        )}
        {sermonsQuery.isError && (
          <p className="text-destructive mt-10 text-center">{normaliseApiError(sermonsQuery.error).message}</p>
        )}
        {sermonsQuery.isSuccess && visible.length === 0 && (
          <p className="text-muted-foreground mt-10 text-center">
            {sermons.length === 0
              ? 'No sermons have been published yet.'
              : 'No sermons match that search.'}
          </p>
        )}

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((sermon) => {
            return (
              <li key={sermon.id}>
                <Card className="h-full overflow-hidden py-0">
                  <SermonThumbnail sermon={sermon} />
                  <CardContent className="flex h-full flex-col gap-4 py-6">
                    <div className="flex items-start justify-between gap-3">
                      {sermon.series && <Badge variant="secondary">{sermon.series}</Badge>}
                      {sermon.durationMinutes != null && (
                        <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
                          <ClockIcon className="size-3.5" aria-hidden="true" />
                          {sermon.durationMinutes} min
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-lg font-semibold tracking-tight">{sermon.title}</h2>
                      {sermon.summary && (
                        <p className="text-muted-foreground text-sm leading-relaxed">{sermon.summary}</p>
                      )}
                    </div>
                    <dl className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2.5">
                        <UserIcon className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                        <dd className="text-muted-foreground">{sermon.speaker}</dd>
                      </div>
                      {sermon.bibleReference && (
                        <div className="flex items-center gap-2.5">
                          <BookOpenIcon className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                          <dd className="text-muted-foreground">{sermon.bibleReference}</dd>
                        </div>
                      )}
                    </dl>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                      <time dateTime={sermon.preachedOn} className="text-muted-foreground text-xs">
                        {format(new Date(sermon.preachedOn), 'd MMMM yyyy')}
                      </time>
                      <div className="flex gap-2">
                        {sermon.notesAssetUrl && (
                          <Button asChild size="sm" variant="ghost">
                            <a href={sermon.notesAssetUrl} target="_blank" rel="noreferrer">
                              Notes
                            </a>
                          </Button>
                        )}
                        {sermon.videoUrl ? (
                          <Button asChild size="sm" variant="outline">
                            <a href={sermon.videoUrl} target="_blank" rel="noreferrer">
                              <PlayCircleIcon aria-hidden="true" />
                              Watch
                            </a>
                          </Button>
                        ) : sermon.audioAssetUrl ? (
                          <Button asChild size="sm" variant="outline">
                            <a href={sermon.audioAssetUrl} target="_blank" rel="noreferrer">
                              Listen
                            </a>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-xs">Recording coming soon</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section id="downloads" tone="muted">
        <SectionHeading
          eyebrow="Resources"
          title="Downloads"
          description="Notes, bulletins and other files published by the church office."
        />

        {downloadsQuery.isPending && (
          <p className="text-muted-foreground mt-8 text-center">Loading downloads…</p>
        )}
        {downloadsQuery.isSuccess && downloadsQuery.data.length === 0 && (
          <p className="text-muted-foreground mt-8 text-center">No files have been published yet.</p>
        )}

        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {(downloadsQuery.data ?? []).map((file) => (
            <li key={file.id}>
              <Card className="py-5">
                <CardContent className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    {file.category && <Badge variant="outline">{file.category}</Badge>}
                    <h3 className="font-semibold">{file.title}</h3>
                    {file.description && (
                      <p className="text-muted-foreground text-sm">{file.description}</p>
                    )}
                  </div>
                  {file.assetUrl && (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        void downloadsApi.incrementDownload(file.id).catch(() => undefined)
                      }}
                    >
                      <a href={file.assetUrl} target="_blank" rel="noreferrer">
                        <DownloadIcon aria-hidden="true" />
                        Download
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
