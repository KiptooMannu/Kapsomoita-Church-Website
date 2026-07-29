package com.kapsomoita.church.media.service;

import com.kapsomoita.church.config.CloudinaryProperties;
import com.kapsomoita.church.common.exception.Exceptions.BadRequestException;
import com.kapsomoita.church.media.domain.MediaKind;
import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.Normalizer;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;
import org.apache.tika.Tika;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Validates uploads and derives safe identifiers for them.
 *
 * <p>The central decision here is that the file's declared {@code Content-Type} is
 * treated as a hint, never as evidence. A browser sends whatever it likes, and an
 * attacker sends whatever gets past the check — so the real type is detected from
 * the leading bytes with Tika, and <em>both</em> the detected type and the extension
 * must be permitted for the target folder. Renaming {@code payload.exe} to
 * {@code photo.jpg} fails on content; a genuine JPEG named {@code .exe} fails on
 * extension.
 */
@Service
public class MediaValidationService {

    private static final Logger log = LoggerFactory.getLogger(MediaValidationService.class);

    /** Anything outside this set is stripped from a generated filename slug. */
    private static final Pattern UNSAFE_SLUG_CHARS = Pattern.compile("[^a-z0-9]+");

    /** Keeps generated public IDs a sane length for URLs and the Cloudinary console. */
    private static final int MAX_SLUG_LENGTH = 60;

    private final CloudinaryProperties properties;
    private final Tika tika = new Tika();

    public MediaValidationService(CloudinaryProperties properties) {
        this.properties = properties;
    }

    /**
     * Validates a file against the rules for its target media kind.
     *
     * @return the validated facts about the file, so callers need not re-derive them
     * @throws BadRequestException with a message safe to show a user
     */
    public ValidatedUpload validate(MultipartFile file, MediaKind kind) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No file was uploaded, or the file is empty.");
        }

        String originalFilename = sanitiseOriginalFilename(file.getOriginalFilename());
        String extension = extractExtension(originalFilename);

        // --- Size -----------------------------------------------------------
        long maxBytes = maxBytesFor(kind);
        if (file.getSize() > maxBytes) {
            throw new BadRequestException(String.format(
                    "That file is %s, which exceeds the %s limit for %s uploads.",
                    humanReadable(file.getSize()), humanReadable(maxBytes),
                    kind.name().toLowerCase(Locale.ROOT)));
        }

        // --- Extension ------------------------------------------------------
        if (extension.isEmpty()) {
            throw new BadRequestException(
                    "The file has no extension, so its type cannot be confirmed. Allowed types: "
                            + kind.describeAllowedExtensions() + ".");
        }
        if (!kind.permitsExtension(extension)) {
            throw new BadRequestException(String.format(
                    "'.%s' files are not accepted here. Allowed types: %s.",
                    extension, kind.describeAllowedExtensions()));
        }

        // --- Actual content -------------------------------------------------
        String detectedMimeType = detectMimeType(file, originalFilename);
        if (!kind.permitsMimeType(detectedMimeType)) {
            // Logged with both values, because a mismatch is worth investigating.
            log.warn("Rejected upload '{}': detected content type '{}' is not permitted for {} "
                            + "(client declared '{}')",
                    originalFilename, detectedMimeType, kind, file.getContentType());
            throw new BadRequestException(
                    "The file's contents do not match its extension, so it was rejected. "
                            + "Please re-export the file and try again.");
        }

        String checksum = sha256Hex(file);

        return new ValidatedUpload(
                originalFilename,
                extension,
                detectedMimeType,
                file.getSize(),
                checksum,
                kind);
    }

    /** The configured size cap for a media kind. */
    public long maxBytesFor(MediaKind kind) {
        return switch (kind) {
            case IMAGE -> properties.maxImageBytes();
            case VIDEO, AUDIO -> properties.maxVideoBytes();
            case DOCUMENT -> properties.maxRawBytes();
        };
    }

    // -----------------------------------------------------------------------
    // Identifier generation
    // -----------------------------------------------------------------------

    /**
     * Builds a collision-free public ID.
     *
     * <p>Shape: {@code my-holiday-photo-3f9a1c2b4d5e6f70}. The slug makes assets
     * recognisable when browsing Cloudinary; the appended UUID hex guarantees
     * uniqueness, so two people uploading {@code IMG_0001.jpg} on the same day never
     * overwrite one another — which is exactly what would happen if the original
     * filename were used directly with Cloudinary's default overwrite behaviour.
     *
     * <p>The extension is omitted: Cloudinary appends the format itself for image and
     * video assets, and including it would produce {@code photo.jpg.jpg}.
     */
    public String generatePublicId(String originalFilename, MediaKind kind) {
        String uniqueSuffix = UUID.randomUUID().toString().replace("-", "").substring(0, 16);

        if (!properties.useFilenameAsPublicIdPrefix()) {
            return uniqueSuffix;
        }

        String slug = slugifyFilename(originalFilename);
        if (slug.isEmpty()) {
            return uniqueSuffix;
        }

        // Raw assets keep their extension: Cloudinary does not add one for `raw`,
        // and without it a downloaded PDF has no extension for the OS to act on.
        String publicId = slug + "-" + uniqueSuffix;
        if (kind == MediaKind.DOCUMENT) {
            String extension = extractExtension(originalFilename);
            if (!extension.isEmpty()) {
                publicId = publicId + "." + extension;
            }
        }
        return publicId;
    }

    /**
     * Reduces a filename to a lowercase, hyphenated slug.
     *
     * <p>Strips diacritics, drops path separators and every character that is not
     * alphanumeric. That removes the traversal and injection concerns in one step:
     * a name like {@code ../../etc/passwd} slugs to {@code etc-passwd}.
     */
    public String slugifyFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            return "";
        }

        String withoutExtension = filename.contains(".")
                ? filename.substring(0, filename.lastIndexOf('.'))
                : filename;

        String slug = Normalizer.normalize(withoutExtension, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .toLowerCase(Locale.ROOT);
        slug = UNSAFE_SLUG_CHARS.matcher(slug).replaceAll("-");
        slug = slug.replaceAll("^-+|-+$", "");

        return slug.length() > MAX_SLUG_LENGTH ? slug.substring(0, MAX_SLUG_LENGTH) : slug;
    }

    // -----------------------------------------------------------------------
    // Internals
    // -----------------------------------------------------------------------

    /**
     * Reduces a client-supplied filename to its bare name.
     *
     * <p>Some clients send a full path; anything before the last separator is dropped
     * so no directory component survives into storage.
     */
    private static String sanitiseOriginalFilename(String rawFilename) {
        if (rawFilename == null || rawFilename.isBlank()) {
            return "upload";
        }
        String name = rawFilename.trim().replace('\\', '/');
        int lastSeparator = name.lastIndexOf('/');
        if (lastSeparator >= 0) {
            name = name.substring(lastSeparator + 1);
        }
        // Strip control characters, which have no place in a filename.
        name = name.replaceAll("[\\p{Cntrl}]", "");
        return name.isBlank() ? "upload" : name;
    }

    private static String extractExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        if (lastDot < 0 || lastDot == filename.length() - 1) {
            return "";
        }
        return filename.substring(lastDot + 1).toLowerCase(Locale.ROOT);
    }

    /** Detects the type from the file's own bytes. */
    private String detectMimeType(MultipartFile file, String filename) {
        try (InputStream stream = file.getInputStream()) {
            // Passing the filename lets Tika disambiguate container formats it cannot
            // tell apart from magic bytes alone (notably the OOXML zip family).
            return tika.detect(stream, filename).toLowerCase(Locale.ROOT);
        } catch (IOException unreadable) {
            log.warn("Could not read '{}' for content type detection", filename, unreadable);
            throw new BadRequestException(
                    "The uploaded file could not be read. Please try uploading it again.");
        }
    }

    /**
     * SHA-256 of the file contents, used for duplicate detection.
     *
     * <p>Streamed rather than loaded whole, so a 200 MB video does not sit in the heap
     * twice.
     */
    private String sha256Hex(MultipartFile file) {
        try (InputStream stream = file.getInputStream()) {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] buffer = new byte[8192];
            int read;
            while ((read = stream.read(buffer)) != -1) {
                digest.update(buffer, 0, read);
            }
            return toHex(digest.digest());
        } catch (IOException | NoSuchAlgorithmException failure) {
            log.warn("Could not checksum upload; duplicate detection will be skipped", failure);
            return null;
        }
    }

    private static String toHex(byte[] bytes) {
        StringBuilder hex = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            hex.append(Character.forDigit((b >> 4) & 0xF, 16));
            hex.append(Character.forDigit(b & 0xF, 16));
        }
        return hex.toString();
    }

    private static String humanReadable(long bytes) {
        if (bytes < 1024) return bytes + " B";
        String[] units = {"KB", "MB", "GB"};
        double value = bytes;
        int unitIndex = -1;
        while (value >= 1024 && unitIndex < units.length - 1) {
            value /= 1024;
            unitIndex++;
        }
        return String.format("%.1f %s", value, units[unitIndex]);
    }

    /**
     * The verified facts about an accepted upload.
     *
     * @param originalFilename sanitised original name
     * @param extension        lowercase extension, without the dot
     * @param detectedMimeType type detected from the file's bytes, not the client header
     * @param sizeBytes        size in bytes
     * @param checksumSha256   hex SHA-256, or null if it could not be computed
     * @param kind             the media kind it was validated against
     */
    public record ValidatedUpload(
            String originalFilename,
            String extension,
            String detectedMimeType,
            long sizeBytes,
            String checksumSha256,
            MediaKind kind) {
    }
}
