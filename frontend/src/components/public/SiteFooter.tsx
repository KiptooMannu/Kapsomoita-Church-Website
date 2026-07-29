import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  TwitterIcon,
  YoutubeIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ChurchLogo } from '@/components/brand/ChurchLogo'
import { footerLinks, serviceTimes, site } from '@/config/site'
import { cn } from '@/lib/utils'

const SOCIAL_LINKS = [
  { href: site.social.facebook, label: 'Facebook', icon: FacebookIcon },
  { href: site.social.instagram, label: 'Instagram', icon: InstagramIcon },
  { href: site.social.twitter, label: 'X (Twitter)', icon: TwitterIcon },
  { href: site.social.youtube, label: 'YouTube', icon: YoutubeIcon },
] as const

/**
 * Site footer.
 *
 * Rebuilt from the original, which had two problems worth naming: it presented the
 * Men's Ministry vision as the whole church's vision, and its giving details sat
 * above the main content where they dominated the footer. Both are addressed —
 * vision and mission now come from the church-level values in `config/site.ts`, and
 * giving is one column among several.
 *
 * Every link target here exists as a route. The original linked to `/about`, which
 * was never a route, so it silently fell through to the homepage.
 */
export function SiteFooter() {
  return (
    <footer className="bg-brand-950 text-white">
      {/* --- Vision & mission -------------------------------------------- */}
      <div className="border-b border-white/10">
        <div className="container-page grid gap-8 py-12 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h2 className="text-gold-400 text-sm font-semibold tracking-wider uppercase">
              Our vision
            </h2>
            <p className="text-sm leading-relaxed text-white/80">{site.vision}</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-gold-400 text-sm font-semibold tracking-wider uppercase">
              Our mission
            </h2>
            <p className="text-sm leading-relaxed text-white/80">{site.mission}</p>
          </div>
        </div>
      </div>

      {/* --- Main columns ------------------------------------------------- */}
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand + social */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Link to="/" className="flex items-center gap-3">
            <ChurchLogo size={44} className="text-white" />
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-bold">{site.name}</span>
              <span className="text-xs text-white/60">{site.tagline}</span>
            </span>
            <span className="sr-only">{site.fullName} — home</span>
          </Link>

          <p className="max-w-sm text-sm leading-relaxed text-white/70">
            Bringing hope and transformation through the Gospel of Jesus Christ. Whoever you
            are, wherever you have been — you are welcome here.
          </p>

          <ul className="flex gap-2 pt-1">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  // The icon alone is meaningless to a screen reader, so the
                  // accessible name comes from aria-label.
                  aria-label={`${site.name} on ${label}`}
                  className={cn(
                    'flex size-10 items-center justify-center rounded-lg bg-white/10',
                    'transition-colors hover:bg-white/20',
                    'focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <nav aria-labelledby="footer-main-heading" className="flex flex-col gap-3">
          <h2 id="footer-main-heading" className="text-sm font-semibold">
            Quick links
          </h2>
          <ul className="flex flex-col gap-2">
            {footerLinks.main.map((link) => (
              <li key={link.to}>
                <FooterLink to={link.to}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Ministries + strategies */}
        <nav aria-labelledby="footer-ministries-heading" className="flex flex-col gap-3">
          <h2 id="footer-ministries-heading" className="text-sm font-semibold">
            Ministries
          </h2>
          <ul className="flex flex-col gap-2">
            {footerLinks.ministries.map((link) => (
              <li key={link.to}>
                <FooterLink to={link.to}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>

          <h2 className="mt-4 text-sm font-semibold">Our strategy</h2>
          <ul className="flex flex-col gap-2">
            {footerLinks.strategies.map((link) => (
              <li key={link.to}>
                <FooterLink to={link.to}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact + service times */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Contact us</h2>
            <address className="flex flex-col gap-2.5 text-sm not-italic">
              <span className="flex items-start gap-2.5 text-white/70">
                <MapPinIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span className="flex flex-col">
                  {site.contact.addressLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              </span>

              <a
                href={`tel:${site.contact.phoneHref}`}
                className="flex items-center gap-2.5 text-white/70 transition-colors hover:text-white"
              >
                <PhoneIcon className="size-4 shrink-0" aria-hidden="true" />
                {site.contact.phone}
              </a>

              <a
                href={`mailto:${site.contact.email}`}
                className="flex items-center gap-2.5 break-all text-white/70 transition-colors hover:text-white"
              >
                <MailIcon className="size-4 shrink-0" aria-hidden="true" />
                {site.contact.email}
              </a>
            </address>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <ClockIcon className="size-4" aria-hidden="true" />
              Service times
            </h2>
            <ul className="flex flex-col gap-1.5 text-sm">
              {/* The three weekly gatherings; the fellowships are listed on the
                  homepage rather than crowding the footer. */}
              {serviceTimes.slice(0, 3).map((service) => (
                <li key={service.name} className="flex flex-col text-white/70">
                  <span className="font-medium text-white/90">{service.day}</span>
                  <span className="text-xs">{service.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* --- Giving ------------------------------------------------------ */}
      <div className="border-t border-white/10">
        <div className="container-page grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-gold-400 text-xs font-semibold tracking-wider uppercase">
              Give by M-Pesa
            </h2>
            <p className="text-sm text-white/75">
              Paybill <span className="font-semibold text-white">{site.giving.mpesa.paybill}</span>
            </p>
            <p className="text-sm text-white/75">
              Account{' '}
              <span className="font-semibold text-white">{site.giving.mpesa.accountName}</span>
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 className="text-gold-400 text-xs font-semibold tracking-wider uppercase">
              Give by bank transfer
            </h2>
            <p className="text-sm text-white/75">
              {site.giving.bank.name} ·{' '}
              <span className="font-semibold text-white">{site.giving.bank.accountNumber}</span>
            </p>
            <p className="text-sm text-white/75">{site.giving.bank.branch} branch</p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <h2 className="text-gold-400 text-xs font-semibold tracking-wider uppercase">
              Give online
            </h2>
            <FooterLink to="/give">See all giving options →</FooterLink>
          </div>
        </div>
      </div>

      {/* --- Legal ------------------------------------------------------- */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center gap-3 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-white/55">
            © {new Date().getFullYear()} {site.fullName}. All rights reserved.
          </p>
          <ul className="flex items-center gap-5">
            <li>
              <FooterLink to="/privacy" className="text-xs">
                Privacy Policy
              </FooterLink>
            </li>
            <li>
              <FooterLink to="/terms" className="text-xs">
                Terms of Use
              </FooterLink>
            </li>
            <li>
              {/* Deliberately findable but unadvertised: staff need it, visitors
                  do not. */}
              <FooterLink to="/admin/login" className="text-xs">
                Staff Login
              </FooterLink>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({
  to,
  children,
  className,
}: {
  to: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      to={to}
      className={cn(
        'text-sm text-white/70 transition-colors hover:text-white',
        'rounded focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
        className,
      )}
    >
      {children}
    </Link>
  )
}
