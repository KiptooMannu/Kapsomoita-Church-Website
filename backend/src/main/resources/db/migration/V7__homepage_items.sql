-- ===========================================================================
-- V7 — Homepage content management
--
-- Creates the homepage_items table for managing dynamic content on the
-- landing page through the admin panel.
-- ===========================================================================

CREATE TABLE homepage_items (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        VARCHAR(200)  NOT NULL,
    description  TEXT,
    category     VARCHAR(32)   NOT NULL,
    status       VARCHAR(16)   NOT NULL DEFAULT 'DRAFT',
    image_url    VARCHAR(512),
    link_url     VARCHAR(512),
    display_order INTEGER      NOT NULL DEFAULT 0,
    is_featured  BOOLEAN       NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    scheduled_for TIMESTAMPTZ,
    
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

    CONSTRAINT homepage_items_title_not_blank CHECK (length(btrim(title)) > 0),
    CONSTRAINT homepage_items_category_known 
        CHECK (category IN ('HERO_BANNER', 'ANNOUNCEMENT', 'EVENT', 'MINISTRY', 
                           'SERMON', 'TESTIMONIAL', 'FEATURE')),
    CONSTRAINT homepage_items_status_known 
        CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED'))
);

CREATE INDEX ix_homepage_items_category ON homepage_items (category);
CREATE INDEX ix_homepage_items_status ON homepage_items (status);
CREATE INDEX ix_homepage_items_display_order ON homepage_items (display_order);
CREATE INDEX ix_homepage_items_featured ON homepage_items (is_featured) WHERE is_featured = TRUE;
CREATE INDEX ix_homepage_items_published ON homepage_items (status, display_order) 
    WHERE status = 'PUBLISHED';

COMMENT ON TABLE homepage_items IS 'Dynamic content items for the homepage managed through admin panel';
COMMENT ON COLUMN homepage_items.category IS 'Type of content: hero banner, announcement, event, etc.';
COMMENT ON COLUMN homepage_items.status IS 'Publication status: draft, published, or archived';
COMMENT ON COLUMN homepage_items.display_order IS 'Order for displaying items on the homepage';
COMMENT ON COLUMN homepage_items.is_featured IS 'Whether this item should be highlighted/featured';
COMMENT ON COLUMN homepage_items.published_at IS 'When the item was published';
COMMENT ON COLUMN homepage_items.scheduled_for IS 'When the item is scheduled to be published';