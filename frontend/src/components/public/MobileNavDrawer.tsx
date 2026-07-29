import { ChevronDownIcon, HeartHandshakeIcon, PhoneIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ChurchLogo } from '@/components/brand/ChurchLogo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { navigation, site } from '@/config/site'
import { cn } from '@/lib/utils'

export interface MobileNavDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Slide-in mobile navigation with collapsible nested sections.
 *
 * Built on the `Sheet` primitive, so the behaviours the specification requires come
 * from Radix rather than hand-rolled listeners: backdrop blur, body scroll lock,
 * Escape to close, click-outside to close, a focus trap while open, and focus
 * returned to the hamburger on close.
 *
 * What is added here is the nesting: a parent with children expands in place rather
 * than pushing to a second screen, so a user never loses sight of where they are.
 */
export function MobileNavDrawer({ open, onOpenChange }: MobileNavDrawerProps) {
  // Which group is expanded. Only one at a time, so the list stays scannable on a
  // short viewport.
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  const close = () => onOpenChange(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        id="mobile-navigation"
        className="flex w-[88vw] max-w-sm flex-col gap-0 p-0"
      >
        <SheetTitle className="sr-only">Site navigation</SheetTitle>

        <div className="border-border flex h-16 shrink-0 items-center border-b px-5">
          <Link to="/" onClick={close} className="flex items-center gap-2.5">
            <ChurchLogo size={32} variant="tile" />
            <span className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight">{site.name}</span>
              <span className="text-muted-foreground text-xs">{site.tagline}</span>
            </span>
          </Link>
        </div>

        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {navigation.map((item) => {
              // --- Leaf link -------------------------------------------------
              if (!item.children) {
                return (
                  <li key={item.label}>
                    <NavLink
                      to={item.to ?? '/'}
                      end={item.to === '/'}
                      onClick={close}
                      className={({ isActive }) =>
                        cn(
                          'flex min-h-11 items-center rounded-lg px-3 text-base font-medium',
                          'focus-visible:ring-ring transition-colors focus-visible:ring-2',
                          'focus-visible:outline-none',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-secondary',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                )
              }

              // --- Group with children ---------------------------------------
              const isExpanded = expandedGroup === item.label
              const panelId = `mobile-nav-${item.label.replace(/\s+/g, '-').toLowerCase()}`

              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => setExpandedGroup(isExpanded ? null : item.label)}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    className={cn(
                      'flex min-h-11 w-full items-center justify-between rounded-lg px-3',
                      'text-base font-medium transition-colors',
                      'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                      isExpanded ? 'bg-secondary' : 'hover:bg-secondary',
                    )}
                  >
                    {item.label}
                    <ChevronDownIcon
                      aria-hidden="true"
                      className={cn(
                        'size-4 shrink-0 transition-transform duration-200',
                        isExpanded && 'rotate-180',
                      )}
                    />
                  </button>

                  {/* grid-rows transition animates height without a fixed pixel
                      value, so the panel works whatever its content length. */}
                  <div
                    id={panelId}
                    className={cn(
                      'grid transition-all duration-300 ease-out',
                      isExpanded
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <ul className="overflow-hidden">
                      <li className="border-border/60 ml-3 flex flex-col border-l pt-1 pl-3">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            onClick={close}
                            // Not focusable while collapsed: a hidden link in the
                            // tab order is a classic keyboard trap.
                            tabIndex={isExpanded ? 0 : -1}
                            className={({ isActive }) =>
                              cn(
                                'flex min-h-10 items-center rounded-lg px-3 text-sm',
                                'focus-visible:ring-ring transition-colors',
                                'focus-visible:ring-2 focus-visible:outline-none',
                                isActive
                                  ? 'text-primary font-medium'
                                  : 'text-muted-foreground hover:text-foreground',
                              )
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </li>
                    </ul>
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-border flex shrink-0 flex-col gap-2 border-t px-5 py-4">
          <Button asChild variant="gold" size="lg" block>
            <Link to="/give" onClick={close}>
              <HeartHandshakeIcon aria-hidden="true" />
              Give Online
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" block>
            <a href={`tel:${site.contact.phoneHref}`}>
              <PhoneIcon aria-hidden="true" />
              {site.contact.phone}
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
