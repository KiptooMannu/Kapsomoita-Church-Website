package com.kapsomoita.church.media.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kapsomoita.church.media.domain.GalleryCategory;
import com.kapsomoita.church.media.domain.MediaFolder;
import com.kapsomoita.church.media.dto.MediaDtos.UploadMetadata;
import com.kapsomoita.church.media.repository.MediaAssetRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * One-off importer that moves the site's bundled images into Cloudinary.
 *
 * <p>Disabled by default. Enable for a single run with:
 *
 * <pre>
 *   mvn spring-boot:run -Dspring-boot.run.arguments=--media.import.enabled=true
 * </pre>
 *
 * <p>It walks the frontend's {@code public/gallery} and {@code src/assets} trees,
 * maps each directory onto a {@link MediaFolder} (and {@link GalleryCategory} where
 * relevant), and uploads through {@link MediaAssetService} — so imported files go
 * through exactly the same validation, folder resolution and metadata recording as
 * an administrator's upload. No import-specific copy of that logic exists.
 *
 * <p><strong>Idempotent.</strong> Every file is checksummed and skipped if an asset
 * with the same SHA-256 already exists in the destination folder, so re-running it
 * after a partial failure resumes rather than duplicating.
 *
 * <p>Local files are left in place. Deleting them is a separate, deliberate step for
 * whoever runs this — see the manifest it writes.
 */
@Component
@Order(20) // After SuperAdminBootstrapper, so uploads are attributed to a real user.
public class LocalMediaImportRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(LocalMediaImportRunner.class);

    /**
     * Generated TypeScript module mapping original local paths to Cloudinary public
     * IDs.
     *
     * <p>Emitted as {@code .ts} rather than {@code .json} so the frontend can import
     * it directly and type-check against it. A committed empty version already
     * exists, which is what keeps the build working before the import has ever run —
     * a static ESM import of a missing file cannot be caught at runtime.
     */
    private static final String MANIFEST_FILENAME = "media-manifest.ts";

    /**
     * Directory-to-destination map.
     *
     * <p>Paths are relative to the repository root. Longest prefix wins, so
     * {@code public/gallery/youth} beats the bare {@code public/gallery} fallback.
     */
    private static final Map<String, Destination> DIRECTORY_MAP = buildDirectoryMap();

    private final MediaAssetService mediaAssetService;
    private final MediaValidationService validationService;
    private final MediaAssetRepository mediaAssetRepository;
    private final ObjectMapper objectMapper;

    @Value("${media.import.enabled:false}")
    private boolean enabled;

    /** Repository root. Defaults to the parent of the backend working directory. */
    @Value("${media.import.root:..}")
    private String importRoot;

    public LocalMediaImportRunner(MediaAssetService mediaAssetService,
                                  MediaValidationService validationService,
                                  MediaAssetRepository mediaAssetRepository,
                                  ObjectMapper objectMapper) {
        this.mediaAssetService = mediaAssetService;
        this.validationService = validationService;
        this.mediaAssetRepository = mediaAssetRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!enabled) {
            return;
        }

        Path root = Paths.get(importRoot).toAbsolutePath().normalize();
        Path frontendSrc = root.resolve("frontend");

        if (!Files.isDirectory(frontendSrc)) {
            log.error("Media import: could not find a 'frontend' directory under {}. "
                    + "Set --media.import.root to the repository root.", root);
            return;
        }

        log.warn("Media import starting from {}. This uploads to Cloudinary and may take "
                + "several minutes.", frontendSrc);

        List<ImportedAsset> imported = new ArrayList<>();
        List<String> skipped = new ArrayList<>();
        List<String> failed = new ArrayList<>();

        for (Path searchRoot : List.of(frontendSrc.resolve("public/gallery"),
                                       frontendSrc.resolve("src/assets"))) {
            if (!Files.isDirectory(searchRoot)) {
                log.info("Media import: {} does not exist, skipping", searchRoot);
                continue;
            }
            importTree(frontendSrc, searchRoot, imported, skipped, failed);
        }

        writeManifest(frontendSrc, imported);

        log.warn("""

                ========================================================================
                 Media import complete
                   uploaded : {}
                   skipped  : {} (already present)
                   failed   : {}
                 Manifest written to frontend/src/config/{}
                 The local files were NOT deleted. Review the manifest, confirm the
                 images render, then remove them from git in a separate commit.
                ========================================================================""",
                imported.size(), skipped.size(), failed.size(), MANIFEST_FILENAME);

        if (!failed.isEmpty()) {
            log.error("Media import failures: {}", failed);
        }
    }

    private void importTree(Path frontendRoot,
                            Path searchRoot,
                            List<ImportedAsset> imported,
                            List<String> skipped,
                            List<String> failed) {

        List<Path> files;
        try (Stream<Path> walk = Files.walk(searchRoot)) {
            files = walk.filter(Files::isRegularFile)
                    .filter(LocalMediaImportRunner::isSupportedImage)
                    .sorted(Comparator.comparing(Path::toString))
                    .toList();
        } catch (IOException unreadable) {
            log.error("Media import: could not read {}", searchRoot, unreadable);
            return;
        }

        for (Path file : files) {
            // Forward slashes so the map keys are platform-independent.
            String relativePath = frontendRoot.relativize(file).toString().replace('\\', '/');
            Destination destination = resolveDestination(relativePath);

            if (destination == null) {
                log.info("Media import: no destination mapped for {}, skipping", relativePath);
                skipped.add(relativePath);
                continue;
            }

            try {
                MultipartFileAdapter multipart = MultipartFileAdapter.of(file);

                // Duplicate check before uploading, so a re-run costs no bandwidth.
                String checksum = checksumOf(multipart, destination);
                String targetFolder = mediaAssetService.resolveFolderFor(
                        destination.folder(), destination.category());

                if (checksum != null
                        && !mediaAssetRepository
                                .findAllByChecksumSha256AndFolder(checksum, targetFolder)
                                .isEmpty()) {
                    log.info("Media import: {} already present in {}, skipping",
                            relativePath, targetFolder);
                    skipped.add(relativePath);
                    continue;
                }

                UploadMetadata metadata = new UploadMetadata(
                        titleFor(file),
                        "Imported from the original website (" + relativePath + ").",
                        destination.folder().name(),
                        destination.category() == null ? null : destination.category().name(),
                        "PUBLIC",
                        false,
                        List.of("imported"),
                        0);

                var response = mediaAssetService.uploadSingle(multipart, metadata, null, null);

                imported.add(new ImportedAsset(
                        relativePath, response.publicId(), response.secureUrl(),
                        response.folder(), response.mediaFolder(), response.category()));

                log.info("Media import: {} -> {}", relativePath, response.publicId());

            } catch (Exception failure) {
                log.error("Media import: failed to upload {}", relativePath, failure);
                failed.add(relativePath + " (" + failure.getMessage() + ")");
            }
        }
    }

    private String checksumOf(MultipartFileAdapter multipart, Destination destination) {
        try {
            return validationService
                    .validate(multipart, destination.folder().expectedKind())
                    .checksumSha256();
        } catch (RuntimeException rejected) {
            // Validation will fail again during upload and be reported there; here
            // it only means the duplicate check cannot run.
            return null;
        }
    }

    /** Longest matching directory prefix wins. */
    private static Destination resolveDestination(String relativePath) {
        return DIRECTORY_MAP.entrySet().stream()
                .filter(entry -> relativePath.startsWith(entry.getKey()))
                .max(Comparator.comparingInt(entry -> entry.getKey().length()))
                .map(Map.Entry::getValue)
                .orElse(null);
    }

    /** Turns `worship1.jpg` into `Worship 1`. */
    private static String titleFor(Path file) {
        String name = file.getFileName().toString();
        int dot = name.lastIndexOf('.');
        String base = dot > 0 ? name.substring(0, dot) : name;

        String spaced = base.replaceAll("[-_]+", " ")
                // Split a trailing digit run off the word: "worship1" -> "worship 1".
                .replaceAll("(?<=[a-zA-Z])(?=\\d)", " ")
                .trim();

        return spaced.isEmpty()
                ? "Untitled"
                : spaced.substring(0, 1).toUpperCase(Locale.ROOT) + spaced.substring(1);
    }

    private static boolean isSupportedImage(Path file) {
        String name = file.getFileName().toString().toLowerCase(Locale.ROOT);
        return name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png")
                || name.endsWith(".webp") || name.endsWith(".gif") || name.endsWith(".avif");
    }

    /**
     * Writes the local-path to public-ID mapping as a TypeScript module.
     *
     * <p>Components keep referencing images by their original local path; the
     * manifest translates that to a Cloudinary public ID. So migrating a component
     * to CDN delivery is a one-line change rather than hand-copying dozens of
     * generated IDs.
     *
     * <p>Existing entries are preserved and merged, so importing a second batch does
     * not discard the first run's mapping.
     */
    private void writeManifest(Path frontendRoot, List<ImportedAsset> imported) {
        if (imported.isEmpty()) {
            return;
        }

        Path target = frontendRoot.resolve("src/config").resolve(MANIFEST_FILENAME);

        Map<String, String> entries = new LinkedHashMap<>(readExistingEntries(target));
        imported.forEach(asset -> entries.put(asset.localPath(), asset.publicId()));

        StringBuilder ts = new StringBuilder();
        ts.append("""
                /**
                 * GENERATED FILE — do not edit by hand.
                 *
                 * Written by LocalMediaImportRunner. Maps each image's original path in
                 * this repository to the Cloudinary public ID it was uploaded to.
                 *
                 * Regenerate with:
                 *   cd backend
                 *   mvn spring-boot:run -Dspring-boot.run.arguments=--media.import.enabled=true
                 */

                /** Original repository path -> Cloudinary public ID. */
                export const MEDIA_MANIFEST: Readonly<Record<string, string>> = {
                """);

        entries.forEach((localPath, publicId) ->
                ts.append("  ").append(quote(localPath)).append(": ")
                        .append(quote(publicId)).append(",\n"));

        ts.append("""
                }

                /**
                 * Resolves an original local path to its Cloudinary public ID.
                 *
                 * Returns null when the image has not been imported yet, which lets a
                 * component fall back to its bundled asset instead of rendering nothing.
                 */
                export function mediaPublicId(localPath: string): string | null {
                  return MEDIA_MANIFEST[localPath] ?? null
                }
                """);

        try {
            Files.createDirectories(target.getParent());
            Files.writeString(target, ts.toString());
            log.info("Media import: wrote manifest with {} entries to {}", entries.size(), target);
        } catch (IOException failure) {
            // Not fatal: the uploads succeeded, only the convenience mapping is lost.
            log.error("Media import: could not write the manifest to {}", target, failure);
        }
    }

    /**
     * Recovers the entries already in a generated manifest.
     *
     * <p>Parsed with a regex rather than a TypeScript parser: the file is machine
     * written, so its shape is known exactly, and pulling in a JS parser to read back
     * a file this program produced would be disproportionate.
     */
    private Map<String, String> readExistingEntries(Path manifest) {
        if (!Files.isRegularFile(manifest)) {
            return Map.of();
        }
        try {
            Map<String, String> entries = new LinkedHashMap<>();
            var pattern = java.util.regex.Pattern.compile("^\\s*'([^']+)':\\s*'([^']+)',\\s*$");
            for (String line : Files.readAllLines(manifest)) {
                var matcher = pattern.matcher(line);
                if (matcher.matches()) {
                    entries.put(matcher.group(1), matcher.group(2));
                }
            }
            return entries;
        } catch (IOException unreadable) {
            log.warn("Media import: could not read the existing manifest at {}; it will be "
                    + "replaced rather than merged", manifest);
            return Map.of();
        }
    }

    /** Single-quoted TS string literal, with embedded quotes and backslashes escaped. */
    private static String quote(String value) {
        return "'" + value.replace("\\", "\\\\").replace("'", "\\'") + "'";
    }

    /**
     * Maps source directories onto destinations.
     *
     * <p>The gallery subdirectories use the church's own naming — {@code ladies} for
     * women, {@code worship} for Sunday services, {@code community} for outreach —
     * which is why this translation table exists rather than matching slugs directly.
     */
    private static Map<String, Destination> buildDirectoryMap() {
        Map<String, Destination> map = new LinkedHashMap<>();

        // --- Gallery subdirectories ----------------------------------------
        map.put("public/gallery/worship",
                new Destination(MediaFolder.GALLERY, GalleryCategory.SUNDAY_SERVICES));
        map.put("public/gallery/youth",
                new Destination(MediaFolder.GALLERY, GalleryCategory.YOUTH));
        map.put("public/gallery/ladies",
                new Destination(MediaFolder.GALLERY, GalleryCategory.WOMEN));
        map.put("public/gallery/men",
                new Destination(MediaFolder.GALLERY, GalleryCategory.MEN));
        map.put("public/gallery/children",
                new Destination(MediaFolder.GALLERY, GalleryCategory.CHILDREN));
        map.put("public/gallery/missions",
                new Destination(MediaFolder.GALLERY, GalleryCategory.MISSIONS));
        map.put("public/gallery/community",
                new Destination(MediaFolder.GALLERY, GalleryCategory.OUTREACH));
        map.put("public/gallery/events",
                new Destination(MediaFolder.GALLERY, GalleryCategory.CONFERENCES));

        // --- Loose files directly in public/gallery ------------------------
        // Mapped individually because the filename is the only category signal.
        map.put("public/gallery/baptism",
                new Destination(MediaFolder.GALLERY, GalleryCategory.BAPTISMS));
        map.put("public/gallery/christmas",
                new Destination(MediaFolder.GALLERY, GalleryCategory.CHRISTMAS));
        map.put("public/gallery/easter",
                new Destination(MediaFolder.GALLERY, GalleryCategory.EASTER));
        map.put("public/gallery/mission",
                new Destination(MediaFolder.GALLERY, GalleryCategory.MISSIONS));
        map.put("public/gallery/community1",
                new Destination(MediaFolder.GALLERY, GalleryCategory.OUTREACH));
        map.put("public/gallery/women",
                new Destination(MediaFolder.GALLERY, GalleryCategory.WOMEN));
        map.put("public/gallery/worship1",
                new Destination(MediaFolder.GALLERY, GalleryCategory.SUNDAY_SERVICES));
        map.put("public/gallery/youth1",
                new Destination(MediaFolder.GALLERY, GalleryCategory.YOUTH));
        // Fallback for anything else loose in the gallery root.
        map.put("public/gallery/",
                new Destination(MediaFolder.GALLERY, GalleryCategory.SUNDAY_SERVICES));

        // --- Bundled site assets ------------------------------------------
        map.put("src/assets/hero", new Destination(MediaFolder.HOMEPAGE, null));
        map.put("src/assets/events", new Destination(MediaFolder.EVENT_BANNER, null));
        map.put("src/assets/leaders", new Destination(MediaFolder.LEADERSHIP_PHOTO, null));
        map.put("src/assets/agc", new Destination(MediaFolder.LOGO, null));
        // Ministry images sit loose in src/assets (youth-ministry.jpg and friends).
        map.put("src/assets/youth-ministry", new Destination(MediaFolder.MINISTRY_IMAGE, null));
        map.put("src/assets/women-ministry", new Destination(MediaFolder.MINISTRY_IMAGE, null));
        map.put("src/assets/men-ministry", new Destination(MediaFolder.MINISTRY_IMAGE, null));
        map.put("src/assets/kids-ministry", new Destination(MediaFolder.MINISTRY_IMAGE, null));

        return Map.copyOf(map);
    }

    /** A resolved upload destination. */
    private record Destination(MediaFolder folder, GalleryCategory category) {
    }

    /** One successfully imported file, as recorded in the manifest. */
    private record ImportedAsset(
            String localPath,
            String publicId,
            String secureUrl,
            String folder,
            String mediaFolder,
            String category) {
    }
}
