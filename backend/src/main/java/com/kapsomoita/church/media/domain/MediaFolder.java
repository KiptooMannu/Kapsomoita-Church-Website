package com.kapsomoita.church.media.domain;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * The centralised folder map. Every destination path in the platform is declared
 * here and nowhere else.
 *
 * <p>This is the rule the specification calls for: no upload path may contain a
 * hardcoded folder name outside this enum. Callers name a <em>purpose</em>
 * ({@code SERMON_VIDEO}), never a path, so the storage layout can be reorganised
 * by editing this file alone.
 *
 * <p>Paths are relative to the configured root folder ({@code church} by default),
 * which the storage service prepends. {@link #GALLERY} is the one entry whose leaf
 * segment is dynamic — it is completed by a {@link GalleryCategory} — which is why
 * its path is resolved through {@link #resolveRelativePath(GalleryCategory)} rather
 * than read directly.
 *
 * <p>None of these folders needs to exist in Cloudinary beforehand. The upload API
 * creates missing path segments implicitly, so first use of a category creates its
 * folder as a side effect of storing the file.
 */
public enum MediaFolder {

    /** Homepage hero and banner imagery. */
    HOMEPAGE("homepage", MediaKind.IMAGE),

    /**
     * Gallery images. The leaf segment is supplied by a {@link GalleryCategory},
     * making the full path {@code gallery/{category-slug}}.
     */
    GALLERY("gallery", MediaKind.IMAGE, true),

    SERMON_VIDEO("sermons/videos", MediaKind.VIDEO),
    SERMON_AUDIO("sermons/audio", MediaKind.AUDIO),
    /** Sermon notes and handouts — PDFs, stored as raw assets. */
    SERMON_NOTES("sermons/notes", MediaKind.DOCUMENT),
    SERMON_THUMBNAIL("sermons/thumbnails", MediaKind.IMAGE),

    EVENT_BANNER("events", MediaKind.IMAGE),
    PASTOR_PHOTO("pastors", MediaKind.IMAGE),
    LEADERSHIP_PHOTO("leadership", MediaKind.IMAGE),
    MINISTRY_IMAGE("ministries", MediaKind.IMAGE),
    TESTIMONIAL_PHOTO("testimonials", MediaKind.IMAGE),
    ANNOUNCEMENT_IMAGE("announcements", MediaKind.IMAGE),

    /** Internal church documents. */
    DOCUMENT("documents", MediaKind.DOCUMENT),
    /** Publicly downloadable files — forms, study guides, bulletins. */
    DOWNLOAD("downloads", MediaKind.DOCUMENT),

    LOGO("logos", MediaKind.IMAGE),
    BANNER("banners", MediaKind.IMAGE);

    private final String relativePath;
    private final MediaKind expectedKind;
    private final boolean categoryScoped;

    MediaFolder(String relativePath, MediaKind expectedKind) {
        this(relativePath, expectedKind, false);
    }

    MediaFolder(String relativePath, MediaKind expectedKind, boolean categoryScoped) {
        this.relativePath = relativePath;
        this.expectedKind = expectedKind;
        this.categoryScoped = categoryScoped;
    }

    /**
     * The kind of media this folder accepts.
     *
     * <p>Used to pick the size limit and the allowed file types, which is what stops
     * a 200 MB video being accepted as a pastor's photo.
     */
    public MediaKind expectedKind() {
        return expectedKind;
    }

    /** True when a {@link GalleryCategory} is required to complete the path. */
    public boolean isCategoryScoped() {
        return categoryScoped;
    }

    /**
     * Resolves the path relative to the root folder.
     *
     * @param category required for a category-scoped folder, ignored otherwise
     * @throws IllegalArgumentException when a category-scoped folder is given no
     *         category — a programming error, since the request layer validates it
     */
    public String resolveRelativePath(GalleryCategory category) {
        if (!categoryScoped) {
            return relativePath;
        }
        if (category == null) {
            throw new IllegalArgumentException(
                    "Folder " + name() + " requires a gallery category to resolve its path.");
        }
        return relativePath + "/" + category.slug();
    }

    /** Resolves a folder that needs no category. */
    public String resolveRelativePath() {
        return resolveRelativePath(null);
    }

    public static Optional<MediaFolder> from(String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.empty();
        }
        String normalised = raw.trim().toUpperCase().replace('-', '_');
        return Arrays.stream(values()).filter(folder -> folder.name().equals(normalised)).findFirst();
    }

    public static List<MediaFolder> all() {
        return List.of(values());
    }

    /**
     * Every folder path the platform uses, relative to the root — the gallery
     * expanded across all its categories.
     *
     * <p>Exposed for diagnostics and documentation. Deliberately <em>not</em> used to
     * pre-create anything: folders come into existence through uploads.
     */
    public static List<String> allRelativePaths() {
        return Arrays.stream(values())
                .flatMap(folder -> folder.isCategoryScoped()
                        ? GalleryCategory.all().stream().map(folder::resolveRelativePath)
                        : java.util.stream.Stream.of(folder.resolveRelativePath()))
                .toList();
    }
}
