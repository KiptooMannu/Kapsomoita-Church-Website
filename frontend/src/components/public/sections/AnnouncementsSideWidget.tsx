import { useQuery } from '@tanstack/react-query'
import { ArrowRightIcon, MegaphoneIcon, PinIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { contentApi } from '@/features/content/content-api'

export function AnnouncementsSideWidget() {
  const { data: liveAnnouncements } = useQuery({
    queryKey: ['public', 'announcements'],
    queryFn: contentApi.publicAnnouncements,
    staleTime: 2 * 60_000,
  })

  if (!liveAnnouncements || liveAnnouncements.length === 0) {
    return null
  }

  // Take up to 3 top live announcements
  const topAnnouncements = liveAnnouncements.slice(0, 3)

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-black/40 p-5 backdrop-blur-md shadow-2xl text-white">
      <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
        <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-gold-400">
          <MegaphoneIcon className="size-4 animate-bounce" />
          <span>Live Church Bulletins</span>
        </div>
        <Badge variant="gold" className="text-[10px] px-2 py-0.5 bg-gold-500/20 text-gold-300 border-gold-400/30">
          {liveAnnouncements.length} Active
        </Badge>
      </div>

      <div className="flex flex-col gap-3">
        {topAnnouncements.map((a) => (
          <div
            key={a.id}
            className="group relative flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 p-3.5 transition-all hover:bg-white/10 hover:border-gold-400/50"
          >
            {a.pinned && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-gold-300">
                <PinIcon className="size-3" /> Pinned Notice
              </span>
            )}
            <h4 className="text-sm font-semibold text-white group-hover:text-gold-300 transition-colors line-clamp-1">
              {a.title}
            </h4>
            <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
              {a.body}
            </p>
            {a.linkUrl && (
              <Link
                to={a.linkUrl}
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-gold-300 hover:underline"
              >
                {a.linkLabel || 'Read notice'}
                <ArrowRightIcon className="size-3" />
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/15 flex justify-end">
        <a
          href="#announcements"
          className="text-xs font-semibold text-white/90 hover:text-gold-300 flex items-center gap-1 transition-colors"
        >
          View all announcements
          <ArrowRightIcon className="size-3" />
        </a>
      </div>
    </div>
  )
}
