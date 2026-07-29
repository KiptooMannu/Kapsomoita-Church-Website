-- ===========================================================================
-- V2 — Media asset registry.
--
-- Every file uploaded to Cloudinary gets a row here. The database is the source
-- of truth for editorial metadata (title, category, visibility, featured, tags)
-- and holds the Cloudinary identifiers needed to render, transform and delete
-- the asset.
--
-- Cloudinary folders are created implicitly on upload, so `folder` records where
-- an asset actually landed rather than describing a structure that must be
-- provisioned first.
-- ===========================================================================

CREATE TABLE media_assets (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- --- Editorial metadata ------------------------------------------------
    title             VARCHAR(200) NOT NULL,
    description       TEXT,

    -- Logical destination, matching the MediaFolder enum, e.g. 'GALLERY'.
    media_folder      VARCHAR(48)  NOT NULL,
    -- Gallery category, matching the GalleryCategory enum. NULL for every
    -- destination other than the gallery, which is enforced below.
    gallery_category  VARCHAR(48),
    -- Absolute Cloudinary folder the asset was filed into, e.g.
    -- 'church/gallery/youth'. Stored so an asset can be traced without
    -- recomputing the mapping, which may change in a later release.
    folder            VARCHAR(300) NOT NULL,

    -- --- Cloudinary identifiers -------------------------------------------
    public_id         VARCHAR(300) NOT NULL,
    asset_id          VARCHAR(100),
    secure_url        VARCHAR(1000) NOT NULL,
    resource_type     VARCHAR(16)  NOT NULL,
    format            VARCHAR(16),
    bytes             BIGINT       NOT NULL,
    width             INTEGER,
    height            INTEGER,
    etag              VARCHAR(100),

    -- --- Provenance --------------------------------------------------------
    original_filename VARCHAR(300),
    mime_type         VARCHAR(160),
    -- Hex SHA-256 of the file contents, for duplicate detection. Nullable
    -- because checksumming is best-effort and must not block an upload.
    checksum_sha256   CHAR(64),

    -- Nullable + ON DELETE SET NULL: removing a staff account must not delete
    -- the church's photo library.
    uploaded_by       UUID REFERENCES users (id) ON DELETE SET NULL,
    uploaded_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    -- --- Publication state -------------------------------------------------
    featured          BOOLEAN      NOT NULL DEFAULT FALSE,
    -- PUBLIC: visible on the website. INTERNAL: staff only. ARCHIVED: hidden
    -- but retained.
    visibility        VARCHAR(16)  NOT NULL DEFAULT 'PUBLIC',
    -- Free-form tags for search and filtering.
    tags              TEXT[]       NOT NULL DEFAULT '{}',

    -- Manual ordering within a gallery; lower sorts first.
    sort_order        INTEGER      NOT NULL DEFAULT 0,

    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT media_assets_title_not_blank CHECK (length(btrim(title)) > 0),
    CONSTRAINT media_assets_bytes_positive CHECK (bytes > 0),
    CONSTRAINT media_assets_resource_type_known
        CHECK (resource_type IN ('image', 'video', 'raw')),
    CONSTRAINT media_assets_visibility_known
        CHECK (visibility IN ('PUBLIC', 'INTERNAL', 'ARCHIVED')),
    CONSTRAINT media_assets_checksum_is_hex
        CHECK (checksum_sha256 IS NULL OR checksum_sha256 ~ '^[0-9a-f]{64}$'),
    -- Dimensions are either both present (visual media) or both absent (audio,
    -- documents). One without the other means the upload mapping is broken.
    CONSTRAINT media_assets_dimensions_paired
        CHECK ((width IS NULL) = (height IS NULL)),
    -- A gallery asset must be categorised, and a non-gallery asset must not be.
    -- This is what guarantees "selecting a category files the image correctly":
    -- an uncategorised gallery row cannot exist.
    CONSTRAINT media_assets_gallery_requires_category
        CHECK (
            (media_folder = 'GALLERY' AND gallery_category IS NOT NULL)
            OR (media_folder <> 'GALLERY' AND gallery_category IS NULL)
        )
);

-- A Cloudinary public_id is unique per resource type, not globally.
CREATE UNIQUE INDEX ux_media_assets_public_id
    ON media_assets (public_id, resource_type);

-- Drives the public gallery pages: category + visibility, newest first.
CREATE INDEX ix_media_assets_gallery
    ON media_assets (gallery_category, visibility, uploaded_at DESC)
    WHERE gallery_category IS NOT NULL;

CREATE INDEX ix_media_assets_folder ON media_assets (media_folder, visibility, sort_order);
CREATE INDEX ix_media_assets_uploaded_at ON media_assets (uploaded_at DESC);
CREATE INDEX ix_media_assets_uploaded_by ON media_assets (uploaded_by);

-- Partial index: the "featured on the homepage" query only ever wants these.
CREATE INDEX ix_media_assets_featured
    ON media_assets (uploaded_at DESC)
    WHERE featured = TRUE AND visibility = 'PUBLIC';

-- GIN index for tag containment lookups (tags @> ARRAY['baptism']).
CREATE INDEX ix_media_assets_tags ON media_assets USING GIN (tags);

-- Duplicate detection. Non-unique on purpose: the same file may legitimately be
-- filed under two categories, so this locates existing copies and lets the
-- application decide, rather than rejecting the upload outright.
CREATE INDEX ix_media_assets_checksum
    ON media_assets (checksum_sha256)
    WHERE checksum_sha256 IS NOT NULL;

COMMENT ON TABLE media_assets IS
    'Registry of every file stored in Cloudinary, with its editorial metadata.';
COMMENT ON COLUMN media_assets.folder IS
    'Absolute Cloudinary folder, created implicitly by the upload API.';
COMMENT ON COLUMN media_assets.checksum_sha256 IS
    'Hex SHA-256 of file contents; NULL when checksumming failed.';
