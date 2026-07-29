import { ArrowLeftIcon, SearchXIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { SeoHead } from '@/components/seo/SeoHead'

/**
 * 404 page.
 *
 * Replaces the previous behaviour, where an unknown path silently rendered the
 * homepage. That hid broken links from everyone — visitors could not tell they had
 * mistyped, and search engines indexed duplicate homepage content under every wrong
 * URL.
 */
export default function NotFoundPage() {
  return (
    <>
      <SeoHead title="Page not found" noIndex />

      <div className="container-page flex min-h-[70dvh] flex-col items-center justify-center py-16 text-center">
        <span className="bg-secondary text-secondary-foreground mb-6 flex size-16 items-center justify-center rounded-2xl">
          <SearchXIcon className="size-8" aria-hidden="true" />
        </span>

        <p className="text-primary text-sm font-semibold">404</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          We could not find that page
        </h1>
        <p className="text-muted-foreground mt-3 max-w-md text-sm">
          The page may have been moved or the link may be incorrect. Let us help you find
          your way back.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link to="/">
              <ArrowLeftIcon aria-hidden="true" />
              Back to homepage
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
