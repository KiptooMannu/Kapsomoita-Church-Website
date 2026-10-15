import { RadioIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { livestreamApi } from '@/features/content/livestream-api'
import { queryKeys } from '@/lib/query-client'

function embedSrc(url: string | null | undefined) {
  if (!url) return null
  const trimmed = url.trim()
  if (!trimmed) return null
  const youtube = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|live\/))([\w-]{11})/)
  if (youtube?.[1]) return `https://www.youtube.com/embed/${youtube[1]}`
  return trimmed
}

/**
 * Live broadcast on the landing page and sermons page.
 *
 * A configured stream plays in the player. When nothing is broadcasting, the
 * section stays visible as an offline camera rather than disappearing or
 * showing a still photograph labelled as live.
 */
export function LivestreamBanner() {
  const livestreamQuery = useQuery({
    queryKey: queryKeys.public.livestream,
    queryFn: livestreamApi.public,
    staleTime: 60_000,
  })

  const stream = livestreamQuery.data
  if (livestreamQuery.isPending) {
    return (
      <section className="bg-brand-950 text-white" aria-label="Livestream">
        <div className="container-page py-10 text-sm text-white/70 lg:py-14">Loading the livestream…</div>
      </section>
    )
  }

  const frame = embedSrc(stream?.embedUrl || stream?.streamUrl)
  const watchUrl = stream?.streamUrl || stream?.embedUrl
  const isLive = Boolean(stream?.isLive && frame)

  return (
    <section className="bg-brand-950 text-white" aria-label="Livestream">
      <div className="container-page grid items-center gap-8 py-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:py-14">
        <div className="flex flex-col gap-4">
          <span
            className={
              isLive
                ? 'inline-flex w-fit items-center gap-2 rounded-full bg-destructive px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase'
                : 'bg-gold-500/15 text-gold-300 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase'
            }
          >
            <span
              className={isLive ? 'relative flex size-2.5' : 'hidden'}
              aria-hidden="true"
            >
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-white" />
            </span>
            <RadioIcon className="size-3.5" aria-hidden="true" />
            {isLive ? 'Live' : 'Live camera'}
          </span>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {isLive
              ? stream?.title || 'We are live'
              : stream?.title || 'Church livestream'}
          </h2>
          <p className="text-sm leading-relaxed text-white/75 sm:text-base">
            {isLive
              ? 'The service is broadcasting now. Press play to join from wherever you are.'
              : stream?.offlineMessage || 'The camera is off. The next service will appear here when the church goes live.'}
          </p>
          {stream?.scheduledFor && !isLive && (
            <p className="text-sm text-white/70">
              Next broadcast: {new Date(stream.scheduledFor).toLocaleString()}
            </p>
          )}
          {watchUrl && (
            <Button asChild variant="gold" className="w-fit">
              <a href={watchUrl} target="_blank" rel="noreferrer">
                {isLive ? 'Watch live' : 'Open stream page'}
              </a>
            </Button>
          )}
        </div>

        {isLive && frame ? (
          <div className="relative overflow-hidden rounded-2xl bg-black shadow-lifted ring-2 ring-destructive">
            <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-2 rounded-full bg-destructive px-3 py-1 text-xs font-bold tracking-wider text-white uppercase">
              <span className="relative flex size-2.5" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-white" />
              </span>
              Live
            </span>
            <iframe
              title={stream?.title || 'Church livestream'}
              src={frame}
              className="aspect-video w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/25 bg-black/40 px-6 text-center">
            <span className="flex size-16 items-center justify-center rounded-full border border-white/20 bg-white/5">
              <RadioIcon className="size-8 text-white/80" aria-hidden="true" />
            </span>
            <p className="text-lg font-semibold">Camera off</p>
            <p className="max-w-sm text-sm text-white/70">
              {frame
                ? 'A stream is saved. It plays here only while the church marks it live in Admin → Livestream.'
                : 'No live video is configured. Add the stream link in Admin → Livestream.'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
