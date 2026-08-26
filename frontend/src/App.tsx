import { lazy, Suspense, type ReactNode } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { FullPageSpinner } from '@/components/feedback/FullPageSpinner'
import { BackToTop } from '@/components/public/BackToTop'
import { SiteFooter } from '@/components/public/SiteFooter'
import { SiteHeader } from '@/components/public/SiteHeader'
import { AdminLayout } from '@/features/admin/AdminLayout'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

// --- Public pages ----------------------------------------------------------
// The homepage is eager: it is the entry point for nearly every visitor, so
// splitting it would only add a round trip before the first paint.
import HomePage from './pages/HomePage'

const AboutPage = lazy(() => import('./pages/AboutPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const GivePage = lazy(() => import('./pages/GivePage'))
const LegalPage = lazy(() => import('./pages/LegalPage'))
const MinistriesIndexPage = lazy(() => import('./pages/MinistriesIndexPage'))
const MinistryPage = lazy(() => import('./pages/MinistryPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Original pages, still JavaScript. Being migrated section by section; they work
// unchanged in the meantime.
const Sermons = lazy(() => import('./pages/Sermons'))
const Contact = lazy(() => import('./pages/Contacts'))
const ServeForm = lazy(() => import('./pages/ServeForm'))
const Evangelizing = lazy(() => import('./pages/strategies/Evangelizing'))
const Establishing = lazy(() => import('./pages/strategies/Establishing'))
const Edifying = lazy(() => import('./pages/strategies/Edifying'))
const Equipping = lazy(() => import('./pages/strategies/Equipping'))
const Compassion = lazy(() => import('./pages/strategies/Compassion'))

// --- Admin, split out entirely --------------------------------------------
// Visitors never download the dashboard, which is the largest win available from
// code-splitting here.
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const NoAccessPage = lazy(() => import('./pages/admin/NoAccessPage'))
const AdminProfilePage = lazy(() => import('./pages/admin/AdminProfilePage'))
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'))
const AdminRolesPage = lazy(() => import('./pages/admin/AdminRolesPage'))
const AdminMediaPage = lazy(() => import('./pages/admin/AdminMediaPage'))
const AdminApplicationsPage = lazy(() => import('./pages/admin/AdminApplicationsPage'))
const AdminAnnouncementsPage = lazy(() => import('./pages/admin/AdminAnnouncementsPage'))
const AdminTestimonialsPage = lazy(() => import('./pages/admin/AdminTestimonialsPage'))
const AdminAuditLogPage = lazy(() => import('./pages/admin/AdminAuditLogPage'))
const AdminSermonsPage = lazy(() => import('./pages/admin/AdminSermonsPage'))
const AdminEventsPage = lazy(() => import('./pages/admin/AdminEventsPage'))
const AdminDownloadsPage = lazy(() => import('./pages/admin/AdminDownloadsPage'))
const AdminMinistriesPage = lazy(() => import('./pages/admin/AdminMinistriesPage'))
const AdminLeadersPage = lazy(() => import('./pages/admin/AdminLeadersPage'))
const AdminContactMessagesPage = lazy(() => import('./pages/admin/AdminContactMessagesPage'))
const AdminPrayerRequestsPage = lazy(() => import('./pages/admin/AdminPrayerRequestsPage'))
const AdminDonationsPage = lazy(() => import('./pages/admin/AdminDonationsPage'))
const AdminServiceTimesPage = lazy(() => import('./pages/admin/AdminServiceTimesPage'))
const AdminLivestreamPage = lazy(() => import('./pages/admin/AdminLivestreamPage'))
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'))
const AdminGenericModulePage = lazy(() =>
  import('./pages/admin/AdminGenericModulePage').then((m) => ({
    default: m.AdminGenericModulePage,
  })),
)

/**
 * Routes that render their own full-bleed header behind the fixed site header and
 * therefore supply their own top spacing. Everything else needs the layout to
 * reserve the header's height, or its first element would be hidden underneath it.
 */
const SELF_SPACED_ROUTES = new Set(['/', '/about', '/privacy', '/terms'])

/** Public site chrome: header, footer and the back-to-top control. */
function PublicLayout({ children, padTop }: { children: ReactNode; padTop: boolean }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <a href="#main-content" className="sr-only-focusable">
        Skip to main content
      </a>

      <SiteHeader />

      {/*
        The header is fixed so the homepage hero can sit behind it. Pages without
        their own hero pad by the header height instead — applying it globally
        would leave a gap above the hero.
      */}
      <main
        id="main-content"
        className={padTop ? 'flex-1 pt-[var(--header-height)]' : 'flex-1'}
      >
        <Suspense fallback={<FullPageSpinner />}>{children}</Suspense>
      </main>

      <SiteFooter />
      <BackToTop />
    </div>
  )
}

export default function App() {
  const location = useLocation()

  // The admin area has its own chrome, so the public header and footer are kept out
  // of it entirely rather than conditionally hidden inside the layout.
  const isAdminRoute = location.pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <>
        <ScrollToTop />
        <Suspense fallback={<FullPageSpinner />}>
          <Routes>
            {/* Outside AdminLayout, so the dashboard shell does not flash before
                the user has signed in. */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            <Route
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/no-access" element={<NoAccessPage />} />
              <Route path="/admin/profile" element={<AdminProfilePage />} />

              <Route
                path="/admin/audit-log"
                element={
                  <ProtectedRoute permissions={['audit:read']}>
                    <AdminAuditLogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/homepage"
                element={
                  <AdminGenericModulePage
                    title="Homepage Manager"
                    description="Manage homepage hero banners, welcome messages, and featured content."
                    category="Content"
                    entityName="Hero Banner"
                  />
                }
              />
              <Route
                path="/admin/announcements"
                element={
                  <ProtectedRoute permissions={['announcement:read']}>
                    <AdminAnnouncementsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/sermons"
                element={
                  <ProtectedRoute permissions={['sermon:read']}>
                    <AdminSermonsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute permissions={['event:read']}>
                    <AdminEventsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/media"
                element={
                  <ProtectedRoute
                    permissions={['gallery:read', 'sermon:read', 'download:read']}
                  >
                    <AdminMediaPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/testimonials"
                element={
                  <ProtectedRoute permissions={['testimonial:read']}>
                    <AdminTestimonialsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/downloads"
                element={
                  <ProtectedRoute permissions={['download:read']}>
                    <AdminDownloadsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/livestream"
                element={
                  <ProtectedRoute>
                    <AdminLivestreamPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/ministries"
                element={
                  <ProtectedRoute permissions={['ministry:read']}>
                    <AdminMinistriesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/ministry-applications"
                element={
                  <ProtectedRoute permissions={['ministry_application:read']}>
                    <AdminApplicationsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/leaders"
                element={
                  <ProtectedRoute permissions={['leader:read']}>
                    <AdminLeadersPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/service-times"
                element={
                  <ProtectedRoute permissions={['service_time:read']}>
                    <AdminServiceTimesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/contact-messages"
                element={
                  <ProtectedRoute permissions={['contact_message:read']}>
                    <AdminContactMessagesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/prayer-requests"
                element={
                  <ProtectedRoute permissions={['prayer_request:read']}>
                    <AdminPrayerRequestsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/donations"
                element={
                  <ProtectedRoute permissions={['donation:read']}>
                    <AdminDonationsPage />
                  </ProtectedRoute>
                }
              />

              {/* Staff and role administration is Super Admin only, matching the
                  route rule enforced in SecurityConfig. */}
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute roles={['SUPER_ADMIN']}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/roles"
                element={
                  <ProtectedRoute roles={['SUPER_ADMIN']}>
                    <AdminRolesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute permissions={['church_setting:read']}>
                    <AdminSettingsPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/admin/*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </>
    )
  }

  return (
    <>
      <ScrollToTop />
      <PublicLayout padTop={!SELF_SPACED_ROUTES.has(location.pathname)}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/sermons" element={<Sermons />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/give" element={<GivePage />} />
          <Route path="/serve" element={<ServeForm />} />

          {/* One template serves all eleven ministries, so the seven that
              previously had no page — Sunday School, Choir, Praise Team, Prayer,
              Evangelism, Missions, Media — now have full pages too. */}
          <Route path="/ministries" element={<MinistriesIndexPage />} />
          <Route path="/ministries/:slug" element={<MinistryPage />} />

          <Route path="/strategies/evangelizing" element={<Evangelizing />} />
          <Route path="/strategies/establishing" element={<Establishing />} />
          <Route path="/strategies/edifying" element={<Edifying />} />
          <Route path="/strategies/equipping" element={<Equipping />} />
          <Route path="/strategies/compassion" element={<Compassion />} />

          <Route path="/privacy" element={<LegalPage variant="privacy" />} />
          <Route path="/terms" element={<LegalPage variant="terms" />} />

          {/* A real 404. The original silently rendered the homepage for every
              unknown path, which hid broken links and let search engines index
              duplicate homepage content under dozens of URLs. */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PublicLayout>
    </>
  )
}
