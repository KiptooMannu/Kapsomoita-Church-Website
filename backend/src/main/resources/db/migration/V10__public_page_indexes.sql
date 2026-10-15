-- Partial indexes for the public landing page.
-- Each one matches a query that always filters to published (or public gallery) rows
-- and then sorts, so Postgres can read the page in index order.

CREATE INDEX IF NOT EXISTS ix_homepage_items_published_category
    ON homepage_items (category, display_order)
    WHERE status = 'PUBLISHED';

CREATE INDEX IF NOT EXISTS ix_announcements_live
    ON announcements (pinned DESC, sort_order, created_at DESC)
    WHERE published = TRUE;

CREATE INDEX IF NOT EXISTS ix_service_times_published
    ON service_times (sort_order)
    WHERE published = TRUE;

CREATE INDEX IF NOT EXISTS ix_events_upcoming
    ON events (starts_at)
    WHERE published = TRUE;

CREATE INDEX IF NOT EXISTS ix_events_featured_upcoming
    ON events (starts_at)
    WHERE published = TRUE AND featured = TRUE;

CREATE INDEX IF NOT EXISTS ix_sermons_published_recent
    ON sermons (preached_on DESC, created_at DESC)
    WHERE published = TRUE;

CREATE INDEX IF NOT EXISTS ix_sermons_featured_recent
    ON sermons (preached_on DESC)
    WHERE published = TRUE AND featured = TRUE;

CREATE INDEX IF NOT EXISTS ix_leaders_published
    ON leaders (team, sort_order)
    WHERE published = TRUE;

CREATE INDEX IF NOT EXISTS ix_testimonials_published_order
    ON testimonials (featured DESC, sort_order, created_at DESC)
    WHERE published = TRUE;

CREATE INDEX IF NOT EXISTS ix_downloads_published
    ON downloads (category, sort_order, created_at DESC)
    WHERE published = TRUE;

CREATE INDEX IF NOT EXISTS ix_media_assets_gallery_featured
    ON media_assets (uploaded_at DESC)
    WHERE media_folder = 'GALLERY'
      AND featured = TRUE
      AND visibility = 'PUBLIC';

CREATE INDEX IF NOT EXISTS ix_media_assets_gallery_public
    ON media_assets (gallery_category, sort_order, uploaded_at DESC)
    WHERE visibility = 'PUBLIC'
      AND gallery_category IS NOT NULL;
