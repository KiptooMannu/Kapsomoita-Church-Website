import {
  ChurchIcon,
  HandHeartIcon,
  HeartHandshakeIcon,
  PlayCircleIcon,
  UsersIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/public/Reveal'

const PATHS = [
  {
    to: '/contact',
    title: 'Plan your visit',
    body: 'Service times, directions and how to find us on Sunday.',
    icon: ChurchIcon,
  },
  {
    to: '/contact#prayer',
    title: 'Prayer request',
    body: 'Share what you would like the church to pray for.',
    icon: HandHeartIcon,
  },
  {
    to: '/sermons',
    title: 'Sermons',
    body: 'Watch and listen to recent messages.',
    icon: PlayCircleIcon,
  },
  {
    to: '/ministries',
    title: 'Ministries',
    body: 'Find a place to belong and to serve.',
    icon: UsersIcon,
  },
  {
    to: '/give',
    title: 'Give',
    body: 'Support the ministry, mission and building work.',
    icon: HeartHandshakeIcon,
  },
] as const

/**
 * Short paths into the rest of the site, sitting just under the hero.
 * Each card links to a page that already exists.
 */
export function VisitPaths() {
  return (
    <section aria-label="Find your next step" className="bg-background relative">
      <div className="container-page py-8 sm:py-10">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PATHS.map((path, index) => (
            <li key={path.to}>
              <Reveal delay={index * 70}>
                <Link
                  to={path.to}
                  className="interactive-card bg-card border-border group flex h-full flex-col gap-3 rounded-2xl border p-5 shadow-card focus-visible:outline-none"
                >
                  <span className="bg-accent-subtle text-accent-foreground flex size-11 items-center justify-center rounded-xl transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <path.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-base font-semibold">{path.title}</span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{path.body}</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
