-- ===========================================================================
-- V6 — Fix prayer_requests schema to match Java entity
--
-- The Java entity was updated with different field names and added a confidential
-- column, but the database wasn't migrated. This adds the missing column and
-- aligns the schema with the entity expectations.
-- ===========================================================================

-- Add the missing confidential column (this is what's causing the startup failure)
ALTER TABLE prayer_requests ADD COLUMN IF NOT EXISTS confidential BOOLEAN NOT NULL DEFAULT FALSE;

-- Rename columns to match Java entity field names
ALTER TABLE prayer_requests RENAME COLUMN full_name TO requestor_name;
ALTER TABLE prayer_requests RENAME COLUMN request TO intention;

-- Drop columns that are no longer in the Java entity to avoid validation errors
ALTER TABLE prayer_requests DROP COLUMN IF EXISTS shareable;
ALTER TABLE prayer_requests DROP COLUMN IF EXISTS anonymous;
ALTER TABLE prayer_requests DROP COLUMN IF EXISTS email;
ALTER TABLE prayer_requests DROP COLUMN IF EXISTS pastoral_notes;
ALTER TABLE prayer_requests DROP COLUMN IF EXISTS handled_by;
ALTER TABLE prayer_requests DROP COLUMN IF EXISTS handled_at;
ALTER TABLE prayer_requests DROP COLUMN IF EXISTS ip_address;

-- Update constraints to match the new schema
ALTER TABLE prayer_requests DROP CONSTRAINT IF EXISTS prayer_requests_anonymous_has_no_identity;
ALTER TABLE prayer_requests DROP CONSTRAINT IF EXISTS prayer_requests_body_not_blank;

-- Add new constraint for the intention field
ALTER TABLE prayer_requests ADD CONSTRAINT prayer_requests_intention_not_blank 
    CHECK (length(btrim(intention)) > 0);

-- Update status constraint to match Java enum (PENDING, PRAYING, ANSWERED)
-- First update any existing status values that don't match the new enum
UPDATE prayer_requests SET status = 'PENDING' WHERE status NOT IN ('PENDING', 'PRAYING', 'ANSWERED');

ALTER TABLE prayer_requests DROP CONSTRAINT IF EXISTS prayer_requests_status_known;
ALTER TABLE prayer_requests ADD CONSTRAINT prayer_requests_status_known
    CHECK (status IN ('PENDING', 'PRAYING', 'ANSWERED'));
