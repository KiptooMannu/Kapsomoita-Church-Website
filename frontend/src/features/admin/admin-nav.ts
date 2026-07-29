import {
  CalendarDaysIcon,
  ChurchIcon,
  ClipboardListIcon,
  CreditCardIcon,
  FileTextIcon,
  HandHeartIcon,
  HeartHandshakeIcon,
  ImagesIcon,
  LayoutDashboardIcon,
  MailIcon,
  MegaphoneIcon,
  MessageSquareQuoteIcon,
  MicVocalIcon,
  RadioIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UsersIcon,
  UsersRoundIcon,
} from 'lucide-react'
import type { ComponentType } from 'react'

export interface AdminNavItem {
  label: string
  to: string
  icon: ComponentType<{ className?: string }>
  /** Grants that reveal this entry. Any one suffices. */
  permissions: string[]
  /**
   * True when the destination is not built yet.
   */
  comingSoon?: boolean
}

export interface AdminNavSection {
  label: string
  items: AdminNavItem[]
}

/**
 * The admin sidebar.
 *
 * Filtering happens in the sidebar against the user's grants, so a Media Team
 * member never sees Donations and an Editor never sees Users.
 */
export const ADMIN_NAV: AdminNavSection[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        to: '/admin',
        icon: LayoutDashboardIcon,
        permissions: ['dashboard:read'],
      },
      {
        label: 'Audit log',
        to: '/admin/audit-log',
        icon: ShieldCheckIcon,
        permissions: ['audit_log:read'],
      },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        label: 'Homepage',
        to: '/admin/homepage',
        icon: ChurchIcon,
        permissions: ['homepage:read', 'homepage:update'],
      },
      {
        label: 'Announcements',
        to: '/admin/announcements',
        icon: MegaphoneIcon,
        permissions: ['announcement:read'],
      },
      {
        label: 'Sermons',
        to: '/admin/sermons',
        icon: MicVocalIcon,
        permissions: ['sermon:read'],
      },
      {
        label: 'Events',
        to: '/admin/events',
        icon: CalendarDaysIcon,
        permissions: ['event:read'],
      },
      {
        label: 'Media library',
        to: '/admin/media',
        icon: ImagesIcon,
        permissions: ['gallery:read', 'sermon:read', 'download:read'],
      },
      {
        label: 'Testimonials',
        to: '/admin/testimonials',
        icon: MessageSquareQuoteIcon,
        permissions: ['testimonial:read'],
      },
      {
        label: 'Downloads',
        to: '/admin/downloads',
        icon: FileTextIcon,
        permissions: ['download:read'],
      },
      {
        label: 'Livestream',
        to: '/admin/livestream',
        icon: RadioIcon,
        permissions: ['livestream:read'],
      },
    ],
  },
  {
    label: 'Church life',
    items: [
      {
        label: 'Ministries',
        to: '/admin/ministries',
        icon: HeartHandshakeIcon,
        permissions: ['ministry:read'],
      },
      {
        label: 'Ministry applications',
        to: '/admin/ministry-applications',
        icon: ClipboardListIcon,
        permissions: ['ministry_application:read'],
      },
      {
        label: 'Leadership',
        to: '/admin/leaders',
        icon: UsersRoundIcon,
        permissions: ['leader:read'],
      },
      {
        label: 'Service times',
        to: '/admin/service-times',
        icon: ScrollTextIcon,
        permissions: ['service_time:read'],
      },
    ],
  },
  {
    label: 'People',
    items: [
      {
        label: 'Contact messages',
        to: '/admin/contact-messages',
        icon: MailIcon,
        permissions: ['contact_message:read'],
      },
      {
        label: 'Prayer requests',
        to: '/admin/prayer-requests',
        icon: HandHeartIcon,
        permissions: ['prayer_request:read'],
      },
      {
        label: 'Donations',
        to: '/admin/donations',
        icon: CreditCardIcon,
        permissions: ['donation:read'],
      },
    ],
  },
  {
    label: 'Administration',
    items: [
      {
        label: 'Staff accounts',
        to: '/admin/users',
        icon: UsersIcon,
        permissions: ['user:read'],
      },
      {
        label: 'Roles & permissions',
        to: '/admin/roles',
        icon: ShieldCheckIcon,
        permissions: ['role:read'],
      },
      {
        label: 'Church settings',
        to: '/admin/settings',
        icon: SettingsIcon,
        permissions: ['church_setting:read', 'church_setting:update'],
      },
    ],
  },
]
