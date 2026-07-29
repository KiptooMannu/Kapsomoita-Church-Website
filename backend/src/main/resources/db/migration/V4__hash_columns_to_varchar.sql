-- ===========================================================================
-- V4 — Change the hash columns from CHAR(64) to VARCHAR(64).
--
-- V1 and V2 declared these as CHAR(64). Postgres reports CHAR as `bpchar`, which
-- Hibernate's schema validation rejects against a `@Column(length = 64)` String
-- mapping (it expects varchar), so the application refused to start.
--
-- VARCHAR is also the correct type on its own merits: CHAR is blank-padded to a
-- fixed width, so a value read back carries trailing spaces and comparisons
-- silently ignore them. For a hex digest — always exactly 64 characters — padding
-- buys nothing and the padding semantics are a liability.
--
-- Delivered as a new migration rather than by editing V1/V2: Flyway records a
-- checksum for every applied migration, so changing one retroactively makes it
-- refuse to start against any database that already ran it.
-- ===========================================================================

-- --- refresh_tokens.token_hash -----------------------------------------
-- The CHECK constraint is dropped first: it is revalidated on type change, and
-- re-adding it afterwards keeps the same guarantee against the new type.
ALTER TABLE refresh_tokens
    DROP CONSTRAINT IF EXISTS refresh_tokens_hash_is_hex;

ALTER TABLE refresh_tokens
    ALTER COLUMN token_hash TYPE VARCHAR(64);

-- Trim any blank padding CHAR may already have introduced, so the regex below
-- cannot fail on an existing row.
UPDATE refresh_tokens SET token_hash = btrim(token_hash) WHERE token_hash <> btrim(token_hash);

ALTER TABLE refresh_tokens
    ADD CONSTRAINT refresh_tokens_hash_is_hex CHECK (token_hash ~ '^[0-9a-f]{64}$');

-- --- media_assets.checksum_sha256 --------------------------------------
ALTER TABLE media_assets
    DROP CONSTRAINT IF EXISTS media_assets_checksum_is_hex;

ALTER TABLE media_assets
    ALTER COLUMN checksum_sha256 TYPE VARCHAR(64);

UPDATE media_assets
SET checksum_sha256 = btrim(checksum_sha256)
WHERE checksum_sha256 IS NOT NULL AND checksum_sha256 <> btrim(checksum_sha256);

ALTER TABLE media_assets
    ADD CONSTRAINT media_assets_checksum_is_hex
        CHECK (checksum_sha256 IS NULL OR checksum_sha256 ~ '^[0-9a-f]{64}$');

COMMENT ON COLUMN refresh_tokens.token_hash IS
    'Hex SHA-256 of the opaque token, exactly 64 characters. The raw token is never persisted.';
COMMENT ON COLUMN media_assets.checksum_sha256 IS
    'Hex SHA-256 of file contents; NULL when checksumming failed.';
