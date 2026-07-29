-- ===========================================================================
-- V1 — Identity, RBAC and audit foundation.
--
-- Design notes:
--   * UUID primary keys via the built-in gen_random_uuid() (PG13+), so no
--     extension is required on Neon and IDs are safe to expose in URLs.
--   * Emails are stored as-written but uniqueness is enforced case-insensitively
--     through a functional index, avoiding a dependency on the citext extension.
--   * Permissions are rows rather than a Java enum so a Super Admin can adjust
--     what a role may do without a redeploy.
--   * timestamptz everywhere; the API works exclusively in UTC.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
CREATE TABLE users (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email                 VARCHAR(255) NOT NULL,
    password_hash         VARCHAR(255) NOT NULL,
    full_name             VARCHAR(180) NOT NULL,
    phone                 VARCHAR(32),
    avatar_url            VARCHAR(512),

    -- Account state. is_active is the admin on/off switch; the lock fields are
    -- driven automatically by failed-login throttling.
    is_active             BOOLEAN      NOT NULL DEFAULT TRUE,
    failed_login_attempts INTEGER      NOT NULL DEFAULT 0,
    locked_until          TIMESTAMPTZ,

    last_login_at         TIMESTAMPTZ,
    email_verified_at     TIMESTAMPTZ,
    password_changed_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT users_email_not_blank CHECK (length(btrim(email)) > 0),
    CONSTRAINT users_email_format CHECK (email LIKE '%_@_%.__%'),
    CONSTRAINT users_full_name_not_blank CHECK (length(btrim(full_name)) > 0),
    CONSTRAINT users_failed_attempts_non_negative CHECK (failed_login_attempts >= 0)
);

CREATE UNIQUE INDEX ux_users_email_lower ON users (lower(email));
CREATE INDEX ix_users_is_active ON users (is_active);
CREATE INDEX ix_users_created_at ON users (created_at DESC);

COMMENT ON TABLE users IS 'Staff and administrator accounts for the church platform.';
COMMENT ON COLUMN users.locked_until IS 'Set by failed-login throttling; NULL means not locked.';

-- ---------------------------------------------------------------------------
-- roles
-- ---------------------------------------------------------------------------
CREATE TABLE roles (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name         VARCHAR(64)  NOT NULL UNIQUE,
    display_name VARCHAR(120) NOT NULL,
    description  VARCHAR(500),

    -- System roles ship with the product and cannot be renamed or deleted.
    is_system    BOOLEAN      NOT NULL DEFAULT TRUE,

    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT roles_name_uppercase_snake CHECK (name ~ '^[A-Z][A-Z0-9_]*$')
);

COMMENT ON TABLE roles IS 'Named bundles of permissions assignable to users.';

-- ---------------------------------------------------------------------------
-- permissions
-- ---------------------------------------------------------------------------
CREATE TABLE permissions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(96)  NOT NULL UNIQUE,  -- e.g. 'gallery:create'
    resource    VARCHAR(48)  NOT NULL,         -- e.g. 'gallery'
    action      VARCHAR(32)  NOT NULL,         -- e.g. 'create'
    description VARCHAR(500),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT permissions_name_format CHECK (name ~ '^[a-z][a-z0-9_]*:[a-z][a-z0-9_]*$'),
    CONSTRAINT permissions_name_matches_parts CHECK (name = resource || ':' || action)
);

CREATE INDEX ix_permissions_resource ON permissions (resource);

COMMENT ON TABLE permissions IS 'Atomic resource:action capabilities checked by @PreAuthorize.';

-- ---------------------------------------------------------------------------
-- role_permissions (many-to-many)
-- ---------------------------------------------------------------------------
CREATE TABLE role_permissions (
    role_id       UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions (id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX ix_role_permissions_permission ON role_permissions (permission_id);

-- ---------------------------------------------------------------------------
-- user_roles (many-to-many)
-- ---------------------------------------------------------------------------
CREATE TABLE user_roles (
    user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role_id     UUID NOT NULL REFERENCES roles (id) ON DELETE RESTRICT,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Nullable and ON DELETE SET NULL: deleting an admin must not erase the
    -- assignment history of the users they onboarded.
    assigned_by UUID REFERENCES users (id) ON DELETE SET NULL,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX ix_user_roles_role ON user_roles (role_id);

-- ---------------------------------------------------------------------------
-- refresh_tokens
--
-- Persisted so sessions can actually be revoked. Only a SHA-256 hash of the
-- token is stored: a database leak must not hand an attacker usable sessions.
-- ---------------------------------------------------------------------------
CREATE TABLE refresh_tokens (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash     CHAR(64)     NOT NULL UNIQUE,  -- hex-encoded SHA-256
    expires_at     TIMESTAMPTZ  NOT NULL,
    revoked_at     TIMESTAMPTZ,

    -- Set when this token is rotated, giving a reuse-detection audit chain.
    replaced_by_id UUID REFERENCES refresh_tokens (id) ON DELETE SET NULL,

    user_agent     VARCHAR(400),
    ip_address     VARCHAR(64),
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT refresh_tokens_hash_is_hex CHECK (token_hash ~ '^[0-9a-f]{64}$'),
    CONSTRAINT refresh_tokens_expiry_after_creation CHECK (expires_at > created_at)
);

CREATE INDEX ix_refresh_tokens_user ON refresh_tokens (user_id);
CREATE INDEX ix_refresh_tokens_expires_at ON refresh_tokens (expires_at);
-- Supports the "active sessions for this user" lookup on every refresh.
CREATE INDEX ix_refresh_tokens_user_active ON refresh_tokens (user_id)
    WHERE revoked_at IS NULL;

COMMENT ON COLUMN refresh_tokens.token_hash IS
    'Hex SHA-256 of the opaque token. The raw token is never persisted.';

-- ---------------------------------------------------------------------------
-- audit_logs
--
-- actor_email is denormalised on purpose: audit trails must survive deletion
-- of the acting user, so the FK is SET NULL while the email remains readable.
-- ---------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id  UUID REFERENCES users (id) ON DELETE SET NULL,
    actor_email    VARCHAR(255),
    action         VARCHAR(96)  NOT NULL,   -- e.g. 'auth.login.success'
    resource_type  VARCHAR(64),             -- e.g. 'gallery_item'
    resource_id    VARCHAR(64),
    details        JSONB,
    ip_address     VARCHAR(64),
    user_agent     VARCHAR(400),
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_audit_logs_created_at ON audit_logs (created_at DESC);
CREATE INDEX ix_audit_logs_actor ON audit_logs (actor_user_id, created_at DESC);
CREATE INDEX ix_audit_logs_action ON audit_logs (action, created_at DESC);
CREATE INDEX ix_audit_logs_resource ON audit_logs (resource_type, resource_id);

-- ===========================================================================
-- Seed data — the six system roles from the platform specification.
-- ===========================================================================
INSERT INTO roles (name, display_name, description, is_system) VALUES
    ('SUPER_ADMIN', 'Super Admin', 'Unrestricted access to every module and setting.', TRUE),
    ('PASTOR',      'Pastor',      'Oversees sermons, ministries, prayer requests and leadership content.', TRUE),
    ('SECRETARY',   'Secretary',   'Manages events, announcements, contact messages and membership requests.', TRUE),
    ('MEDIA_TEAM',  'Media Team',  'Manages gallery, sermon media, livestream and downloads.', TRUE),
    ('EDITOR',      'Editor',      'Edits public website content without access to people or finance data.', TRUE),
    ('VOLUNTEER',   'Volunteer',   'Read-only dashboard access for assigned ministry areas.', TRUE);

-- ===========================================================================
-- Seed data — permissions.
--
-- Generated as the cross product of resources x actions, then trimmed. Every
-- module named in the specification is represented, so later slices only need
-- to wire controllers rather than add migrations.
-- ===========================================================================
INSERT INTO permissions (name, resource, action, description)
SELECT r.resource || ':' || a.action,
       r.resource,
       a.action,
       initcap(a.action) || ' ' || replace(r.resource, '_', ' ')
FROM (VALUES
        ('dashboard'),
        ('user'),
        ('role'),
        ('ministry'),
        ('ministry_application'),
        ('event'),
        ('event_registration'),
        ('gallery'),
        ('gallery_category'),
        ('sermon'),
        ('announcement'),
        ('testimonial'),
        ('download'),
        ('leader'),
        ('service_time'),
        ('contact_message'),
        ('prayer_request'),
        ('donation'),
        ('livestream'),
        ('newsletter'),
        ('church_setting'),
        ('social_link'),
        ('homepage'),
        ('audit_log')
     ) AS r (resource)
CROSS JOIN (VALUES
        ('read'),
        ('create'),
        ('update'),
        ('delete'),
        ('publish'),
        ('export')
     ) AS a (action)
-- Actions that make no sense for a given resource.
WHERE NOT (r.resource = 'dashboard'      AND a.action <> 'read')
  AND NOT (r.resource = 'audit_log'      AND a.action NOT IN ('read', 'export'))
  AND NOT (r.resource = 'church_setting' AND a.action IN ('create', 'delete', 'publish', 'export'))
  AND NOT (r.resource = 'homepage'       AND a.action IN ('create', 'delete', 'export'))
  AND NOT (r.resource = 'role'           AND a.action IN ('publish', 'export'))
  AND NOT (r.resource = 'user'           AND a.action = 'publish')
  AND NOT (r.resource IN ('contact_message', 'prayer_request', 'ministry_application',
                          'event_registration', 'donation', 'newsletter')
           AND a.action IN ('create', 'publish'));

-- ===========================================================================
-- Seed data — role → permission grants.
-- ===========================================================================

-- SUPER_ADMIN: everything.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'SUPER_ADMIN';

-- PASTOR: spiritual oversight — people-facing and teaching modules, plus
-- read-only visibility of finance. No user/role administration.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
        p.resource IN ('dashboard', 'sermon', 'ministry', 'ministry_application',
                       'prayer_request', 'leader', 'announcement', 'testimonial',
                       'event', 'event_registration', 'service_time', 'homepage',
                       'livestream', 'download', 'contact_message')
     OR (p.resource IN ('donation', 'audit_log', 'gallery') AND p.action IN ('read', 'export'))
)
WHERE r.name = 'PASTOR';

-- SECRETARY: day-to-day administration and correspondence.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
        p.resource IN ('dashboard', 'event', 'event_registration', 'announcement',
                       'contact_message', 'ministry_application', 'newsletter',
                       'service_time', 'prayer_request')
     OR (p.resource IN ('ministry', 'leader', 'gallery', 'sermon') AND p.action = 'read')
     OR (p.resource = 'donation' AND p.action IN ('read', 'export'))
)
WHERE r.name = 'SECRETARY';

-- MEDIA_TEAM: all media assets.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
        p.resource IN ('dashboard', 'gallery', 'gallery_category', 'sermon',
                       'download', 'livestream', 'testimonial')
     OR (p.resource IN ('event', 'ministry', 'announcement') AND p.action = 'read')
)
WHERE r.name = 'MEDIA_TEAM';

-- EDITOR: public website copy only. Deliberately excludes every module holding
-- personal or financial data.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
        p.resource IN ('dashboard', 'homepage', 'announcement', 'testimonial',
                       'service_time', 'social_link')
     OR (p.resource IN ('ministry', 'event', 'sermon', 'gallery', 'leader')
         AND p.action IN ('read', 'update'))
)
WHERE r.name = 'EDITOR';

-- VOLUNTEER: read-only, and never over sensitive modules.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
        p.action = 'read'
    AND p.resource IN ('dashboard', 'event', 'ministry', 'announcement',
                       'sermon', 'gallery', 'service_time')
)
WHERE r.name = 'VOLUNTEER';
