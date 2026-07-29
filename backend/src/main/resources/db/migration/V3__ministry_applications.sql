-- ===========================================================================
-- V3 — Ministry membership applications.
--
-- Submitted by visitors from any ministry page, then reviewed by staff. The
-- ministry itself is stored as a slug rather than a foreign key: ministries are
-- currently defined in application config, not in the database, and inventing a
-- ministries table now would mean migrating this column again when the real
-- Ministries CMS module lands.
-- ===========================================================================

CREATE TABLE ministry_applications (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- --- Applicant identity ------------------------------------------------
    full_name           VARCHAR(180) NOT NULL,
    email               VARCHAR(255) NOT NULL,
    phone               VARCHAR(32)  NOT NULL,
    gender              VARCHAR(16)  NOT NULL,
    age_group           VARCHAR(24)  NOT NULL,
    county              VARCHAR(80),
    occupation          VARCHAR(120),

    -- --- The request -------------------------------------------------------
    -- Slug matching MinistryDetail.slug, e.g. 'youth', 'sunday-school'.
    ministry_slug       VARCHAR(64)  NOT NULL,
    -- Denormalised display name, captured at submission. Kept so a historical
    -- application still reads correctly if a ministry is later renamed.
    ministry_name       VARCHAR(120) NOT NULL,

    is_church_member    BOOLEAN      NOT NULL,
    is_baptized         BOOLEAN      NOT NULL,

    skills              TEXT,
    previous_experience TEXT,
    availability        TEXT,
    prayer_request      TEXT,
    additional_notes    TEXT,

    -- --- Review workflow ---------------------------------------------------
    status              VARCHAR(16)  NOT NULL DEFAULT 'PENDING',
    -- Internal notes from the reviewing staff member. Never shown to applicants.
    review_notes        TEXT,
    reviewed_by         UUID REFERENCES users (id) ON DELETE SET NULL,
    reviewed_at         TIMESTAMPTZ,
    -- The leader this applicant was handed to. Free text, since leaders are not
    -- yet database records.
    assigned_leader     VARCHAR(180),

    -- Set once a staff member records that they have made contact.
    contacted_at        TIMESTAMPTZ,

    -- --- Submission provenance --------------------------------------------
    ip_address          VARCHAR(64),
    user_agent          VARCHAR(400),

    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT ministry_applications_name_not_blank CHECK (length(btrim(full_name)) > 0),
    CONSTRAINT ministry_applications_email_format CHECK (email LIKE '%_@_%.__%'),
    CONSTRAINT ministry_applications_phone_not_blank CHECK (length(btrim(phone)) > 0),
    CONSTRAINT ministry_applications_status_known
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED')),
    CONSTRAINT ministry_applications_gender_known
        CHECK (gender IN ('MALE', 'FEMALE', 'PREFER_NOT_TO_SAY')),
    CONSTRAINT ministry_applications_age_group_known
        CHECK (age_group IN ('UNDER_13', 'AGE_13_17', 'AGE_18_24', 'AGE_25_34',
                             'AGE_35_49', 'AGE_50_64', 'AGE_65_PLUS')),
    -- A reviewed application must record who reviewed it and when, so the audit
    -- trail cannot be half-written.
    CONSTRAINT ministry_applications_review_is_complete
        CHECK (
            status = 'PENDING'
            OR (reviewed_at IS NOT NULL)
        )
);

-- The admin queue: pending first, oldest first within a status.
CREATE INDEX ix_ministry_applications_status
    ON ministry_applications (status, created_at DESC);

CREATE INDEX ix_ministry_applications_ministry
    ON ministry_applications (ministry_slug, status);

CREATE INDEX ix_ministry_applications_created_at
    ON ministry_applications (created_at DESC);

-- Supports the duplicate check on submission.
CREATE INDEX ix_ministry_applications_email_lower
    ON ministry_applications (lower(email), ministry_slug);

COMMENT ON TABLE ministry_applications IS
    'Applications from visitors wanting to join a ministry, and their review state.';
COMMENT ON COLUMN ministry_applications.ministry_name IS
    'Display name captured at submission, so renaming a ministry does not rewrite history.';
COMMENT ON COLUMN ministry_applications.review_notes IS
    'Internal staff notes. Never disclosed to the applicant.';
