import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { FullPageSpinner } from '@/components/feedback/FullPageSpinner'
import { AdminSidebar } from './AdminSidebar'
import { AdminTopbar } from './AdminTopbar'

/**
 * Shell for every authenticated admin route.
 *
 * The sidebar is permanently visible from `lg` upward and collapses into the
 * topbar's drawer below that. Two instances of `AdminSidebar` are rendered — one
 * here for desktop, one inside the drawer — rather than moving a single element
 * between containers, which would remount it and lose its scroll position on every
 * breakpoint change.
 */
export function AdminLayout() {
  return (
    <div className="bg-background flex min-h-dvh">
      {/* Skip link: the first tab stop, so keyboard users can bypass the nav. */}
      <a href="#admin-content" className="sr-only-focusable">
        Skip to main content
      </a>

      <aside className="border-sidebar-border hidden w-72 shrink-0 border-r lg:block">
        {/* Sticky rather than fixed, so it participates in the flex layout and
            cannot overlap the content at narrow desktop widths. */}
        <div className="sticky top-0 h-dvh">
          <AdminSidebar />
        </div>
      </aside>

      {/* min-w-0 is what stops a wide table inside from forcing the whole page
          to scroll horizontally — a flex child defaults to min-width:auto. */}
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />

        <main id="admin-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Suspense fallback={<FullPageSpinner label="Loading section…" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
