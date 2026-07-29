import { ExternalLinkIcon, LogOutIcon, MenuIcon, UserIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/features/theme/ThemeToggle'
import { useAuth } from '@/features/auth/useAuth'
import { primaryRole } from '@/features/auth/permissions'
import { ROLE_LABELS } from '@/lib/api/types'
import { cn, initials } from '@/lib/utils'
import { AdminSidebar } from './AdminSidebar'

/**
 * Admin header: mobile navigation trigger, theme switcher and account menu.
 *
 * The drawer is a `Sheet`, which supplies the behaviour the specification requires of
 * the hamburger menu — backdrop, scroll lock, Escape to close, click-outside to
 * close, focus trap, focus returned to the trigger — without reimplementing any of it.
 */
export function AdminTopbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const role = primaryRole(user)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <header
      className={cn(
        'bg-background/85 border-border sticky top-0 z-30 flex h-16 shrink-0',
        'items-center gap-2 border-b px-3 backdrop-blur-md sm:px-5',
      )}
    >
      {/* --- Mobile navigation ------------------------------------------- */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation menu"
          >
            <MenuIcon aria-hidden="true" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-72 p-0" showCloseButton={false}>
          {/* Radix requires an accessible name; the sidebar shows its own
              branding, so this is for assistive tech only. */}
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
        <Link to="/" target="_blank" rel="noreferrer">
          <ExternalLinkIcon aria-hidden="true" />
          View site
        </Link>
      </Button>

      <ThemeToggle />

      {/* --- Account menu ------------------------------------------------ */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-10 gap-2 px-2" aria-label="Account menu">
            <Avatar className="size-8">
              {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
              <AvatarFallback>{initials(user?.fullName)}</AvatarFallback>
            </Avatar>
            <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
              {user?.fullName}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
          <div className="px-2 pb-2">
            <p className="truncate text-sm font-medium">{user?.fullName}</p>
            <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
            {role && (
              <p className="text-muted-foreground mt-1 text-xs">{ROLE_LABELS[role]}</p>
            )}
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link to="/admin/profile">
              <UserIcon aria-hidden="true" />
              My profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" onSelect={() => void handleLogout()}>
            <LogOutIcon aria-hidden="true" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
