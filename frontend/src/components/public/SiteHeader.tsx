import { ChevronDownIcon, HeartHandshakeIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChurchLogo, ChurchWordmark } from '@/components/brand/ChurchLogo'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/features/theme/ThemeToggle'
import { useIsScrolled, useScrollProgressVar } from '@/hooks/useScrollPosition'
import { navigation, site } from '@/config/site'
import { cn } from '@/lib/utils'
import { HamburgerButton } from './HamburgerButton'
import { MobileNavDrawer } from './MobileNavDrawer'

/**
 * Public site header.
 *
 * Transparent over the homepage hero, turning into a frosted-glass bar once
 * scrolled — which is why it needs to know both the route and the scroll position.
 * A solid bar is used on every other route, since those pages have no hero image
 * behind the header and transparent text would sit on a plain background.
 *
 * Desktop dropdowns open on hover *and* on click/keyboard. Hover alone is
 * unreachable by keyboard and unusable on a touch-capable laptop, so the click
 * handling is not redundant.
 */
export function SiteHeader() {
  const location = useLocation()

  // Two separate concerns, deliberately. `isScrolled` re-renders only when it
  // flips; the progress bar is driven by a CSS variable so it never re-renders
  // React at all. Combining them made the header re-render ~60×/second, which is
  // what made tapping the hamburger feel unresponsive.
  const isScrolled = useIsScrolled(32)
  const headerRef = useRef<HTMLElement>(null)
  useScrollProgressVar(headerRef)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const isHomepage = location.pathname === '/'
  // Only the homepage has a hero for the header to float over.
  const isTransparent = isHomepage && !isScrolled

  // Close the dropdown when the route changes, otherwise it stays open over the
  // page the user just navigated to.
  useEffect(() => {
    setOpenDropdown(null)
  }, [location.pathname])

  // Escape closes an open dropdown, matching the drawer's behaviour.
  useEffect(() => {
    if (openDropdown === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenDropdown(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openDropdown])

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed top-0 right-0 left-0 z-40 transition-colors duration-300',
          isTransparent
            ? 'bg-transparent'
            : 'glass-panel border-border/60 border-b shadow-soft',
        )}
      >
        {/*
          Scroll progress, driven entirely by the --scroll-progress custom property
          the hook writes. scaleX on a composited layer costs nothing per frame,
          whereas re-rendering this from React state cost a full header render.
        */}
        <div
          aria-hidden="true"
          className={cn(
            'from-brand-500 to-gold-500 absolute inset-x-0 bottom-0 h-0.5 origin-left',
            'bg-gradient-to-r will-change-transform',
          )}
          style={{ transform: 'scaleX(var(--scroll-progress, 0))' }}
        />

        <div className="container-page flex h-[var(--header-height)] items-center gap-3">
          {/* --- Brand --------------------------------------------------- */}
          <Link
            to="/"
            className={cn(
              'flex shrink-0 items-center gap-2.5 rounded-lg',
              'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
            )}
          >
            {/* A real inline SVG mark. The old /AGC-logo.png was a 0-byte file, so
                the logo never rendered at all. */}
            <ChurchLogo
              size={40}
              variant={isTransparent ? 'plain' : 'tile'}
              className={cn(isTransparent && 'text-white')}
            />
            <ChurchWordmark
              name={site.name}
              tagline={site.tagline}
              onDark={isTransparent}
            />
            {/* The link's accessible name; the mark and wordmark are presentational. */}
            <span className="sr-only">{site.fullName} — home</span>
          </Link>

          {/* --- Desktop navigation --------------------------------------- */}
          <nav aria-label="Main navigation" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {navigation.map((item) => {
                const linkTone = isTransparent
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'text-foreground/80 hover:text-primary hover:bg-secondary'

                // --- Leaf link ---------------------------------------------
                if (!item.children) {
                  return (
                    <li key={item.label}>
                      <NavLink
                        to={item.to ?? '/'}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                          cn(
                            'relative flex h-10 items-center rounded-lg px-3 text-sm font-medium',
                            'focus-visible:ring-ring transition-colors',
                            'focus-visible:ring-2 focus-visible:outline-none',
                            linkTone,
                            isActive &&
                              (isTransparent
                                ? 'text-white after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-white'
                                : 'text-primary after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-primary'),
                          )
                        }
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  )
                }

                // --- Dropdown ----------------------------------------------
                const isOpen = openDropdown === item.label
                const menuId = `nav-menu-${item.label.replace(/\s+/g, '-').toLowerCase()}`

                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                      aria-expanded={isOpen}
                      aria-controls={menuId}
                      aria-haspopup="true"
                      className={cn(
                        'flex h-10 items-center gap-1 rounded-lg px-3 text-sm font-medium',
                        'focus-visible:ring-ring transition-colors',
                        'focus-visible:ring-2 focus-visible:outline-none',
                        linkTone,
                      )}
                    >
                      {item.label}
                      <ChevronDownIcon
                        aria-hidden="true"
                        className={cn(
                          'size-3.5 transition-transform duration-200',
                          isOpen && 'rotate-180',
                        )}
                      />
                    </button>

                    {/* Mega menu. `invisible` rather than unmounted so the fade
                        can animate both ways; pointer-events are removed too, so
                        a hidden panel never swallows clicks. */}
                    <div
                      id={menuId}
                      className={cn(
                        'absolute top-full left-0 pt-2 transition-all duration-200',
                        isOpen
                          ? 'visible translate-y-0 opacity-100'
                          : 'invisible -translate-y-1 opacity-0',
                      )}
                    >
                      <ul
                        className={cn(
                          'bg-popover border-border shadow-lifted w-80 rounded-xl border p-2',
                        )}
                      >
                        {item.children.map((child) => (
                          <li key={child.to}>
                            <Link
                              to={child.to}
                              tabIndex={isOpen ? 0 : -1}
                              onClick={() => setOpenDropdown(null)}
                              className={cn(
                                'hover:bg-secondary focus-visible:ring-ring block rounded-lg',
                                'px-3 py-2.5 transition-colors focus-visible:ring-2',
                                'focus-visible:outline-none',
                              )}
                            >
                              <span className="text-popover-foreground block text-sm font-medium">
                                {child.label}
                              </span>
                              {child.description && (
                                <span className="text-muted-foreground mt-0.5 block text-xs">
                                  {child.description}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* --- Actions -------------------------------------------------- */}
          <div className="ml-auto flex items-center gap-1 lg:ml-3">
            <ThemeToggle
              compact
              className={cn(isTransparent && 'text-white hover:bg-white/10 hover:text-white')}
            />

            <Button asChild variant="gold" size="sm" className="hidden sm:inline-flex">
              <Link to="/give">
                <HeartHandshakeIcon aria-hidden="true" />
                Give
              </Link>
            </Button>

            <HamburgerButton
              isOpen={drawerOpen}
              onClick={() => setDrawerOpen((open) => !open)}
              controls="mobile-navigation"
              className={cn('lg:hidden', isTransparent && 'text-white hover:bg-white/10')}
            />
          </div>
        </div>
      </header>

      <MobileNavDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  )
}
