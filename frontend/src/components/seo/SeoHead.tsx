import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Kapsomoita Church'
const DEFAULT_DESCRIPTION =
  'Kapsomoita Church — a welcoming family of faith. Join us for worship, explore our ministries, watch sermons and grow with us.'

export interface SeoHeadProps {
  /** Page title. Suffixed with the site name unless `absoluteTitle` is set. */
  title?: string
  description?: string
  /** Absolute URL of a social preview image. */
  image?: string
  /** Canonical URL for this page. */
  canonical?: string
  /** `article` for sermons and posts; `website` otherwise. */
  type?: 'website' | 'article'
  /** Keeps the page out of search results. Use for every admin route. */
  noIndex?: boolean
  /** Use `title` verbatim, without the site-name suffix. */
  absoluteTitle?: boolean
  /** JSON-LD structured data, serialised into a script tag. */
  jsonLd?: Record<string, unknown>
}

/**
 * Per-page document head.
 *
 * Admin routes must pass `noIndex`: they are behind auth, so a crawler would only
 * ever index the login screen, and having the dashboard's URLs in a search index
 * is pointless at best.
 */
export function SeoHead({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  canonical,
  type = 'website',
  noIndex = false,
  absoluteTitle = false,
  jsonLd,
}: SeoHeadProps) {
  const resolvedTitle = title
    ? absoluteTitle
      ? title
      : `${title} · ${SITE_NAME}`
    : `${SITE_NAME} · A welcoming family of faith`

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={description} />

      {canonical && <link rel="canonical" href={canonical} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph — link previews in WhatsApp, Facebook and most chat apps. */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {canonical && <meta property="og:url" content={canonical} />}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  )
}
