import { ChurchIcon } from 'lucide-react'
import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/features/auth/useAuth'
import { cn } from '@/lib/utils'
import { ADMIN_NAV, type AdminNavSection } from './admin-nav'

export interface AdminSidebarProps {
  /** Called after a navigation, so the mobile drawer can close itself. */
  onNavigate?: () => void
  className?: string
}

/**
 * Admin navigation.
 *
 * Sections and entries the user has no permission for are removed entirely rather
 * than disabled — showing a Volunteer a greyed-out "Donations" link only tells them
 * something exists that they may not see.
 *
 * Entries whose feature is not built yet are shown but not linked, marked "Soon".
 * That is deliberate: it communicates the platform's intended shape without
 * navigating anyone to a blank screen.
 */
export function AdminSidebar({ onNavigate, className }: AdminSidebarProps) {
  const { hasAnyPermission } = useAuth()

  // Filter once per permission change rather than on every render.
  const visibleSections = useMemo<AdminNavSection[]>(
    () =>
      ADMIN_NAV.map((section) => ({
        ...section,
        items: section.items.filter((item) => hasAnyPermission(item.permissions)),
      })).filter((section) => section.items.length > 0),
    [hasAnyPermission],
  )

  return (
    <div
      className={cn(
        'bg-sidebar text-sidebar-foreground flex h-full flex-col',
        className,
      )}
    >
      <div className="border-sidebar-border flex h-16 shrink-0 items-center gap-3 border-b px-5">
        <span
          className={cn(
            'bg-sidebar-primary text-sidebar-primary-foreground flex size-9 shrink-0',
            'items-center justify-center rounded-xl',
          )}
        >
          <ChurchIcon className="size-5" aria-hidden="true" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold">Kapsomoita Church</span>
          <span className="text-sidebar-foreground/60 truncate text-xs">Administration</span>
        </span>
      </div>

      <ScrollArea className="flex-1">
        {/* aria-label distinguishes this from the public site navigation for
            screen-reader landmark lists. */}
        <nav aria-label="Admin sections" className="flex flex-col gap-6 px-3 py-5">
          {visibleSections.map((section) => (
            <div key={section.label} className="flex flex-col gap-1">
              <h2 className="text-sidebar-foreground/50 px-3 pb-1 text-xs font-semibold tracking-wider uppercase">
                {section.label}
              </h2>

              {section.items.map((item) => {
                const Icon = item.icon

                if (item.comingSoon) {
                  return (
                    <span
                      key={item.to}
                      // Not a link and not focusable: there is nothing to activate.
                      aria-disabled="true"
                      className={cn(
                        'text-sidebar-foreground/40 flex items-center gap-3 rounded-lg',
                        'px-3 py-2 text-sm',
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                      <Badge
                        variant="outline"
                        className="border-sidebar-border text-sidebar-foreground/50 ml-auto text-[10px]"
                      >
                        Soon
                      </Badge>
                    </span>
                  )
                }

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    // `end` on the index route only, so /admin does not stay
                    // highlighted while a child route is active.
                    end={item.to === '/admin'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        'focus-visible:ring-sidebar-ring outline-none focus-visible:ring-2',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className="size-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.label}</span>
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="bg-sidebar-primary ml-auto h-4 w-1 rounded-full"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-sidebar-border text-sidebar-foreground/50 border-t px-5 py-3 text-xs">
        Church Management Platform
      </div>
    </div>
  )
}
