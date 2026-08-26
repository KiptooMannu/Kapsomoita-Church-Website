-- ===========================================================================
-- V8 — Add calendar fields and image support to announcements
--
-- Adds event date, location, and image fields to support calendar-style display
-- on the landing page with visual appeal.
-- ===========================================================================

-- Add event date fields for calendar-style display
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS event_date TIMESTAMPTZ;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS event_end_date TIMESTAMPTZ;

-- Add event location
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS event_location VARCHAR(200);

-- Add image support
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS image_url VARCHAR(512);
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS image_id UUID;

-- Add comments to clarify the new fields
COMMENT ON COLUMN announcements.event_date IS 'Main event date for calendar-style display';
COMMENT ON COLUMN announcements.event_end_date IS 'End date for multi-day events';
COMMENT ON COLUMN announcements.event_location IS 'Physical location of the event';
COMMENT ON COLUMN announcements.image_url IS 'URL of the announcement image for visual display';
COMMENT ON COLUMN announcements.image_id IS 'Reference to media asset in the media library';

-- Create index for event date queries
CREATE INDEX IF NOT EXISTS ix_announcements_event_date ON announcements(event_date) WHERE event_date IS NOT NULL;