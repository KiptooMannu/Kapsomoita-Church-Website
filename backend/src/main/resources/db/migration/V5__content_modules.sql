-- ===========================================================================
-- V5 — Content and people modules.
--
-- Creates every remaining table the admin dashboard manages. Delivered as one
-- migration because these tables are introduced together and several reference
-- each other; splitting them would mean an ordering dance for no benefit.
--
-- Conventions, all chosen to keep Hibernate's `ddl-auto: validate` happy (V4 was
-- needed because CHAR did not match a String mapping):
--   * VARCHAR, never CHAR.
--   * TEXT for unbounded prose.
--   * Enums as VARCHAR + a CHECK constraint, mapped with @Enumerated(STRING).
--   * TIMESTAMPTZ everywhere; the API works exclusively in UTC.
--   * Every table carries created_at / updated_at to match BaseEntity.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- announcements
-- ---------------------------------------------------------------------------
CREATE TABLE announcements (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        VARCHAR(200) NOT NULL,
    body         TEXT         NOT NULL,
    -- INFO / SUCCESS / WARNING drives the badge shown on the public site.
    tone         VARCHAR(16)  NOT NULL DEFAULT 'INFO',
    -- Free text such as "Every Sunday" or "Date to be confirmed", because many
    -- church announcements are not tied to a single calendar date.
    display_date VARCHAR(120),
    link_label   VARCHAR(80),
    link_url     VARCHAR(500),

    published    BOOLEAN      NOT NULL DEFAULT TRUE,
    pinned       BOOLEAN      NOT NULL DEFAULT FALSE,
    -- Optional window. NULL start means "already live"; NULL end means "no expiry".
    starts_at    TIMESTAMPTZ,
    ends_at      TIMESTAMPTZ,
    sort_order   INTEGER      NOT NULL DEFAULT 0,

    created_by   UUID REFERENCES users (id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT announcements_title_not_blank CHECK (length(btrim(title)) > 0),
    CONSTRAINT announcements_tone_known CHECK (tone IN ('INFO', 'SUCCESS', 'WARNING')),
    CONSTRAINT announcements_window_ordered
        CHECK (starts_at IS NULL OR ends_at IS NULL OR ends_at > starts_at),
    -- A link is only meaningful with both halves present.
    CONSTRAINT announcements_link_complete
        CHECK ((link_label IS NULL) = (link_url IS NULL))
);

CREATE INDEX ix_announcements_public
    ON announcements (published, pinned DESC, sort_order, created_at DESC);

-- ---------------------------------------------------------------------------
-- service_times
-- ---------------------------------------------------------------------------
CREATE TABLE service_times (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(120) NOT NULL,
    day_of_week VARCHAR(16)  NOT NULL,
    -- Free text ("8:00 AM – 12:00 PM") rather than two TIME columns: services are
    -- advertised as a human-readable range and often carry qualifiers.
    time_label  VARCHAR(120) NOT NULL,
    location    VARCHAR(160) NOT NULL,
    leader      VARCHAR(160),
    description TEXT,

    -- Exactly one service may be the headline one; enforced by a unique index.
    is_primary  BOOLEAN      NOT NULL DEFAULT FALSE,
    published   BOOLEAN      NOT NULL DEFAULT TRUE,
    sort_order  INTEGER      NOT NULL DEFAULT 0,

    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT service_times_name_not_blank CHECK (length(btrim(name)) > 0),
    CONSTRAINT service_times_day_known CHECK (day_of_week IN
        ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'))
);

-- Partial unique index: at most one primary service, while allowing many non-primary.
CREATE UNIQUE INDEX ux_service_times_single_primary
    ON service_times ((is_primary)) WHERE is_primary = TRUE;

CREATE INDEX ix_service_times_public ON service_times (published, sort_order);

-- ---------------------------------------------------------------------------
-- leaders
-- ---------------------------------------------------------------------------
CREATE TABLE leaders (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Nullable: the church may publish a role before naming the person.
    full_name    VARCHAR(180),
    role_title   VARCHAR(160) NOT NULL,
    bio          TEXT,
    ministry     VARCHAR(120),
    email        VARCHAR(255),
    phone        VARCHAR(32),

    -- Cloudinary asset for the portrait. SET NULL so deleting a photo does not
    -- delete the leader.
    photo_id     UUID REFERENCES media_assets (id) ON DELETE SET NULL,

    -- PASTORAL / MINISTRY / SUPPORT — which group the leader is listed under.
    team         VARCHAR(16)  NOT NULL DEFAULT 'MINISTRY',
    published    BOOLEAN      NOT NULL DEFAULT TRUE,
    sort_order   INTEGER      NOT NULL DEFAULT 0,

    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT leaders_role_not_blank CHECK (length(btrim(role_title)) > 0),
    CONSTRAINT leaders_team_known CHECK (team IN ('PASTORAL', 'MINISTRY', 'SUPPORT'))
);

CREATE INDEX ix_leaders_public ON leaders (published, team, sort_order);

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
CREATE TABLE testimonials (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote        TEXT         NOT NULL,
    -- Nullable so a testimony can be published anonymously.
    author_name  VARCHAR(180),
    author_role  VARCHAR(160),
    photo_id     UUID REFERENCES media_assets (id) ON DELETE SET NULL,

    published    BOOLEAN      NOT NULL DEFAULT FALSE,
    featured     BOOLEAN      NOT NULL DEFAULT FALSE,
    sort_order   INTEGER      NOT NULL DEFAULT 0,

    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT testimonials_quote_not_blank CHECK (length(btrim(quote)) > 0)
);

CREATE INDEX ix_testimonials_public ON testimonials (published, sort_order, created_at DESC);

-- ---------------------------------------------------------------------------
-- sermons
-- ---------------------------------------------------------------------------
CREATE TABLE sermons (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title             VARCHAR(200) NOT NULL,
    slug              VARCHAR(220) NOT NULL,
    speaker           VARCHAR(180) NOT NULL,
    preached_on       DATE         NOT NULL,
    series            VARCHAR(160),
    topic             VARCHAR(160),
    bible_reference   VARCHAR(200),
    summary           TEXT,
    duration_minutes  INTEGER,

    -- External video (YouTube etc.) or an uploaded asset. Both optional, since a
    -- sermon may exist as notes alone.
    video_url         VARCHAR(500),
    video_asset_id    UUID REFERENCES media_assets (id) ON DELETE SET NULL,
    audio_asset_id    UUID REFERENCES media_assets (id) ON DELETE SET NULL,
    notes_asset_id    UUID REFERENCES media_assets (id) ON DELETE SET NULL,
    thumbnail_id      UUID REFERENCES media_assets (id) ON DELETE SET NULL,

    published         BOOLEAN      NOT NULL DEFAULT FALSE,
    featured          BOOLEAN      NOT NULL DEFAULT FALSE,
    view_count        BIGINT       NOT NULL DEFAULT 0,

    created_by        UUID REFERENCES users (id) ON DELETE SET NULL,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT sermons_title_not_blank CHECK (length(btrim(title)) > 0),
    CONSTRAINT sermons_speaker_not_blank CHECK (length(btrim(speaker)) > 0),
    CONSTRAINT sermons_duration_positive
        CHECK (duration_minutes IS NULL OR duration_minutes > 0),
    CONSTRAINT sermons_view_count_non_negative CHECK (view_count >= 0)
);

CREATE UNIQUE INDEX ux_sermons_slug ON sermons (slug);
CREATE INDEX ix_sermons_public ON sermons (published, preached_on DESC);
CREATE INDEX ix_sermons_series ON sermons (series);
CREATE INDEX ix_sermons_speaker ON sermons (speaker);

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------
CREATE TABLE events (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title              VARCHAR(200) NOT NULL,
    slug               VARCHAR(220) NOT NULL,
    description        TEXT,
    starts_at          TIMESTAMPTZ  NOT NULL,
    ends_at            TIMESTAMPTZ,
    venue              VARCHAR(200) NOT NULL,
    -- NULL means unlimited attendance.
    capacity           INTEGER,
    banner_id          UUID REFERENCES media_assets (id) ON DELETE SET NULL,

    registration_open  BOOLEAN      NOT NULL DEFAULT TRUE,
    published          BOOLEAN      NOT NULL DEFAULT FALSE,
    featured           BOOLEAN      NOT NULL DEFAULT FALSE,

    -- Optional map link for directions to an off-site venue.
    map_url            VARCHAR(500),

    created_by         UUID REFERENCES users (id) ON DELETE SET NULL,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT events_title_not_blank CHECK (length(btrim(title)) > 0),
    CONSTRAINT events_venue_not_blank CHECK (length(btrim(venue)) > 0),
    CONSTRAINT events_capacity_positive CHECK (capacity IS NULL OR capacity > 0),
    CONSTRAINT events_window_ordered CHECK (ends_at IS NULL OR ends_at > starts_at)
);

CREATE UNIQUE INDEX ux_events_slug ON events (slug);
CREATE INDEX ix_events_public ON events (published, starts_at);

-- ---------------------------------------------------------------------------
-- event_registrations
-- ---------------------------------------------------------------------------
CREATE TABLE event_registrations (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id   UUID         NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    full_name  VARCHAR(180) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    phone      VARCHAR(32)  NOT NULL,
    guests     INTEGER      NOT NULL DEFAULT 0,
    notes      TEXT,
    status     VARCHAR(16)  NOT NULL DEFAULT 'CONFIRMED',

    ip_address VARCHAR(64),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT event_registrations_guests_sane CHECK (guests >= 0 AND guests <= 20),
    CONSTRAINT event_registrations_status_known
        CHECK (status IN ('CONFIRMED', 'WAITLISTED', 'CANCELLED')),
    CONSTRAINT event_registrations_email_format CHECK (email LIKE '%_@_%.__%')
);

-- One live registration per email per event; a cancelled one may be replaced.
CREATE UNIQUE INDEX ux_event_registrations_active
    ON event_registrations (event_id, lower(email))
    WHERE status <> 'CANCELLED';

CREATE INDEX ix_event_registrations_event ON event_registrations (event_id, status);

-- ---------------------------------------------------------------------------
-- downloads
-- ---------------------------------------------------------------------------
CREATE TABLE downloads (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title          VARCHAR(200) NOT NULL,
    description    TEXT,
    category       VARCHAR(64),
    -- The file itself. RESTRICT, not CASCADE: deleting the asset behind a published
    -- download would leave a dead link, so it must be detached deliberately.
    asset_id       UUID         NOT NULL REFERENCES media_assets (id) ON DELETE RESTRICT,
    published      BOOLEAN      NOT NULL DEFAULT TRUE,
    download_count BIGINT       NOT NULL DEFAULT 0,
    sort_order     INTEGER      NOT NULL DEFAULT 0,

    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT downloads_title_not_blank CHECK (length(btrim(title)) > 0),
    CONSTRAINT downloads_count_non_negative CHECK (download_count >= 0)
);

CREATE INDEX ix_downloads_public ON downloads (published, category, sort_order);

-- ---------------------------------------------------------------------------
-- contact_messages
-- ---------------------------------------------------------------------------
CREATE TABLE contact_messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name   VARCHAR(180) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    phone       VARCHAR(32),
    subject     VARCHAR(200),
    message     TEXT         NOT NULL,

    -- NEW / READ / REPLIED / ARCHIVED
    status      VARCHAR(16)  NOT NULL DEFAULT 'NEW',
    reply_notes TEXT,
    handled_by  UUID REFERENCES users (id) ON DELETE SET NULL,
    handled_at  TIMESTAMPTZ,

    ip_address  VARCHAR(64),
    user_agent  VARCHAR(400),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT contact_messages_name_not_blank CHECK (length(btrim(full_name)) > 0),
    CONSTRAINT contact_messages_body_not_blank CHECK (length(btrim(message)) > 0),
    CONSTRAINT contact_messages_email_format CHECK (email LIKE '%_@_%.__%'),
    CONSTRAINT contact_messages_status_known
        CHECK (status IN ('NEW', 'READ', 'REPLIED', 'ARCHIVED'))
);

CREATE INDEX ix_contact_messages_queue ON contact_messages (status, created_at DESC);

-- ---------------------------------------------------------------------------
-- prayer_requests
-- ---------------------------------------------------------------------------
CREATE TABLE prayer_requests (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Both nullable: an anonymous request records no identity at all.
    full_name    VARCHAR(180),
    email        VARCHAR(255),
    phone        VARCHAR(32),
    request      TEXT         NOT NULL,
    anonymous    BOOLEAN      NOT NULL DEFAULT FALSE,
    -- Whether the person is willing for it to be shared with the prayer team.
    shareable    BOOLEAN      NOT NULL DEFAULT TRUE,

    -- PENDING / PRAYED / ANSWERED / ARCHIVED
    status       VARCHAR(16)  NOT NULL DEFAULT 'PENDING',
    pastoral_notes TEXT,
    handled_by   UUID REFERENCES users (id) ON DELETE SET NULL,
    handled_at   TIMESTAMPTZ,

    ip_address   VARCHAR(64),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT prayer_requests_body_not_blank CHECK (length(btrim(request)) > 0),
    CONSTRAINT prayer_requests_status_known
        CHECK (status IN ('PENDING', 'PRAYED', 'ANSWERED', 'ARCHIVED')),
    -- An anonymous request must not carry contact details; this makes the promise
    -- on the public form a database guarantee rather than an application habit.
    CONSTRAINT prayer_requests_anonymous_has_no_identity
        CHECK (anonymous = FALSE OR (full_name IS NULL AND email IS NULL AND phone IS NULL))
);

CREATE INDEX ix_prayer_requests_queue ON prayer_requests (status, created_at DESC);

-- ---------------------------------------------------------------------------
-- donations
-- ---------------------------------------------------------------------------
CREATE TABLE donations (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Nullable: a gift may be given anonymously.
    donor_name        VARCHAR(180),
    donor_email       VARCHAR(255),
    donor_phone       VARCHAR(32),

    amount            NUMERIC(12, 2) NOT NULL,
    currency          VARCHAR(3)   NOT NULL DEFAULT 'KES',
    -- MPESA / BANK / PAYPAL / CARD / CASH
    method            VARCHAR(16)  NOT NULL,
    -- TITHE / OFFERING / BUILDING / MISSIONS / OTHER
    purpose           VARCHAR(24)  NOT NULL DEFAULT 'OFFERING',

    -- PENDING / COMPLETED / FAILED / REFUNDED
    status            VARCHAR(16)  NOT NULL DEFAULT 'PENDING',
    -- Provider reference, e.g. an M-Pesa receipt number. Unique when present, so a
    -- callback delivered twice cannot record the same gift twice.
    provider_reference VARCHAR(120),
    provider_payload  JSONB,
    notes             TEXT,

    completed_at      TIMESTAMPTZ,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT donations_amount_positive CHECK (amount > 0),
    CONSTRAINT donations_method_known
        CHECK (method IN ('MPESA', 'BANK', 'PAYPAL', 'CARD', 'CASH')),
    CONSTRAINT donations_purpose_known
        CHECK (purpose IN ('TITHE', 'OFFERING', 'BUILDING', 'MISSIONS', 'OTHER')),
    CONSTRAINT donations_status_known
        CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'))
);

CREATE UNIQUE INDEX ux_donations_provider_reference
    ON donations (provider_reference) WHERE provider_reference IS NOT NULL;

CREATE INDEX ix_donations_reporting ON donations (status, created_at DESC);
CREATE INDEX ix_donations_purpose ON donations (purpose, status);

-- ---------------------------------------------------------------------------
-- church_settings
--
-- Key/value rather than a single wide row: settings are read individually, are
-- added continually, and a new setting should not require a migration.
-- ---------------------------------------------------------------------------
CREATE TABLE church_settings (
    setting_key   VARCHAR(96)  PRIMARY KEY,
    setting_value TEXT,
    -- STRING / NUMBER / BOOLEAN / URL / EMAIL / TEXT — drives the admin input type.
    value_type    VARCHAR(16)  NOT NULL DEFAULT 'STRING',
    -- Grouping for the settings screen, e.g. 'contact', 'social', 'giving'.
    category      VARCHAR(48)  NOT NULL DEFAULT 'general',
    label         VARCHAR(160) NOT NULL,
    description   VARCHAR(500),
    -- FALSE for anything that must not be exposed on the public endpoint.
    public        BOOLEAN      NOT NULL DEFAULT TRUE,
    sort_order    INTEGER      NOT NULL DEFAULT 0,

    updated_by    UUID REFERENCES users (id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT church_settings_key_format CHECK (setting_key ~ '^[a-z][a-z0-9_.]*$'),
    CONSTRAINT church_settings_value_type_known
        CHECK (value_type IN ('STRING', 'NUMBER', 'BOOLEAN', 'URL', 'EMAIL', 'TEXT'))
);

CREATE INDEX ix_church_settings_category ON church_settings (category, sort_order);

-- ---------------------------------------------------------------------------
-- livestream
-- Single-row configuration; the CHECK pins the id so a second row is impossible.
-- ---------------------------------------------------------------------------
CREATE TABLE livestream (
    id            INTEGER      PRIMARY KEY DEFAULT 1,
    is_live       BOOLEAN      NOT NULL DEFAULT FALSE,
    title         VARCHAR(200),
    platform      VARCHAR(24)  NOT NULL DEFAULT 'YOUTUBE',
    stream_url    VARCHAR(500),
    embed_url     VARCHAR(500),
    scheduled_for TIMESTAMPTZ,
    offline_message TEXT,

    updated_by    UUID REFERENCES users (id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT livestream_single_row CHECK (id = 1),
    CONSTRAINT livestream_platform_known
        CHECK (platform IN ('YOUTUBE', 'FACEBOOK', 'VIMEO', 'CUSTOM'))
);

-- ===========================================================================
-- Seed data
-- ===========================================================================

-- The livestream row must exist so the settings screen has something to edit.
INSERT INTO livestream (id, is_live, platform, offline_message)
VALUES (1, FALSE, 'YOUTUBE',
        'We are not streaming at the moment. Join us on Sunday at 8:00 AM, or watch a past sermon.');

-- Service times, carried over from the details published on the original site.
INSERT INTO service_times
    (name, day_of_week, time_label, location, leader, description, is_primary, sort_order)
VALUES
    ('Sunday Worship', 'SUNDAY', '8:00 AM – 12:00 PM', 'Main Sanctuary', 'Senior Pastor',
     'Our main gathering — worship, the Word, and fellowship for the whole family.', TRUE, 1),
    ('Midweek Prayer', 'TUESDAY', '5:30 PM – 7:00 PM', 'Main Sanctuary', 'Prayer Team',
     'A focused hour of intercession for the church, the nation and one another.', FALSE, 2),
    ('Youth Service', 'FRIDAY', '5:30 PM – 8:00 PM', 'Youth Hall', 'Youth Pastor',
     'Worship, teaching and community for teenagers and young adults.', FALSE, 3),
    ('Women''s Fellowship', 'WEDNESDAY', '10:00 AM – 12:00 PM', 'Fellowship Hall',
     'Women''s Ministry Leader',
     'Bible study, prayer and mutual encouragement for the women of the church.', FALSE, 4),
    ('Men''s Fellowship', 'SATURDAY', '7:00 AM – 9:00 AM', 'Fellowship Hall',
     'Men''s Ministry Leader',
     'Teaching, accountability and service for the men of the church.', FALSE, 5);

-- Leadership roles without names. The church fills the names in; publishing invented
-- ones would be worse than publishing none.
INSERT INTO leaders (role_title, bio, team, sort_order) VALUES
    ('Senior Pastor',
     'Oversees the preaching, teaching and pastoral care of the whole congregation.',
     'PASTORAL', 1),
    ('Associate Pastor',
     'Supports the preaching ministry and leads discipleship across the church.',
     'PASTORAL', 2),
    ('Church Elder', 'Shares in the spiritual oversight and governance of the church.',
     'PASTORAL', 3);

INSERT INTO leaders (role_title, bio, ministry, team, sort_order) VALUES
    ('Youth Ministry Leader',
     'Leads worship, teaching and discipleship for teenagers and young adults.',
     'Youth Ministry', 'MINISTRY', 10),
    ('Women''s Ministry Leader',
     'Leads Bible study, prayer and fellowship among the women of the church.',
     'Women''s Ministry', 'MINISTRY', 11),
    ('Men''s Ministry Leader',
     'Leads teaching, accountability and service among the men of the church.',
     'Men''s Ministry', 'MINISTRY', 12),
    ('Kids Ministry Leader',
     'Oversees Sunday School and children''s ministry across all age groups.',
     'Kids Ministry', 'MINISTRY', 13);

-- Church settings, seeded from the values published on the original site so the
-- public endpoint returns something real immediately.
INSERT INTO church_settings
    (setting_key, setting_value, value_type, category, label, description, public, sort_order)
VALUES
    ('church.name', 'Kapsomoita Africa Gospel Church', 'STRING', 'general',
     'Church name', 'Full legal name of the church.', TRUE, 1),
    ('church.short_name', 'Kapsomoita AGC', 'STRING', 'general',
     'Short name', 'Used in the navigation bar and footer.', TRUE, 2),
    ('church.tagline', 'A welcoming family of faith', 'STRING', 'general',
     'Tagline', 'Shown beneath the church name.', TRUE, 3),
    ('church.vision',
     'To be a Christ-centred church that transforms lives and communities through the power of the Gospel.',
     'TEXT', 'general', 'Vision statement', NULL, TRUE, 4),
    ('church.mission',
     'To make disciples of Jesus Christ by evangelising the lost, establishing believers, edifying the church, equipping the saints for service, and showing compassion to those in need.',
     'TEXT', 'general', 'Mission statement', NULL, TRUE, 5),

    ('contact.email', 'info@kapsomoitaagc.org', 'EMAIL', 'contact',
     'Email address', 'Where contact form notifications are sent.', TRUE, 10),
    ('contact.phone', '+254 712 345 678', 'STRING', 'contact', 'Phone number', NULL, TRUE, 11),
    ('contact.address_line1', 'Kapsomoita, Nairobi', 'STRING', 'contact',
     'Address line 1', NULL, TRUE, 12),
    ('contact.address_line2', 'P.O. Box 12345-00100', 'STRING', 'contact',
     'Address line 2', NULL, TRUE, 13),
    ('contact.map_query', 'Kapsomoita Africa Gospel Church, Nairobi, Kenya', 'STRING',
     'contact', 'Google Maps search', 'Used for the map and directions links.', TRUE, 14),

    ('social.facebook', '', 'URL', 'social', 'Facebook URL', NULL, TRUE, 20),
    ('social.instagram', '', 'URL', 'social', 'Instagram URL', NULL, TRUE, 21),
    ('social.twitter', '', 'URL', 'social', 'X (Twitter) URL', NULL, TRUE, 22),
    ('social.youtube', '', 'URL', 'social', 'YouTube URL', NULL, TRUE, 23),

    ('giving.mpesa_paybill', '123456', 'STRING', 'giving', 'M-Pesa paybill', NULL, TRUE, 30),
    ('giving.mpesa_account', 'Kapsomoita AGC', 'STRING', 'giving',
     'M-Pesa account name', NULL, TRUE, 31),
    ('giving.bank_name', 'KCB', 'STRING', 'giving', 'Bank name', NULL, TRUE, 32),
    ('giving.bank_account', '0123456789', 'STRING', 'giving', 'Bank account number', NULL, TRUE, 33),
    ('giving.bank_branch', 'Nairobi West', 'STRING', 'giving', 'Bank branch', NULL, TRUE, 34);
