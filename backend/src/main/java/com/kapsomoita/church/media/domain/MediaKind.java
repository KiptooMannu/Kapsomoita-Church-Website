package com.kapsomoita.church.media.domain;

import java.util.Set;

/**
 * Broad classes of media, each with its own allow-list and Cloudinary resource type.
 *
 * <p>Cloudinary distinguishes three resource types: {@code image}, {@code video} and
 * {@code raw}. Audio is uploaded as {@code video} — that is Cloudinary's own
 * convention for time-based media, not a mistake — and documents as {@code raw},
 * which stores the bytes without attempting transformation.
 */
public enum MediaKind {

    IMAGE(
            "image",
            Set.of("image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"),
            Set.of("jpg", "jpeg", "png", "webp", "gif", "avif")),

    VIDEO(
            "video",
            Set.of("video/mp4", "video/quicktime", "video/x-matroska", "video/webm"),
            Set.of("mp4", "mov", "mkv", "webm")),

    /** Cloudinary handles audio under the {@code video} resource type. */
    AUDIO(
            "video",
            Set.of("audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/mp4",
                    "audio/aac", "audio/ogg"),
            Set.of("mp3", "wav", "m4a", "aac", "ogg")),

    DOCUMENT(
            "raw",
            Set.of("application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/vnd.ms-powerpoint",
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    "text/plain"),
            Set.of("pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"));

    private final String cloudinaryResourceType;
    private final Set<String> allowedMimeTypes;
    private final Set<String> allowedExtensions;

    MediaKind(String cloudinaryResourceType,
              Set<String> allowedMimeTypes,
              Set<String> allowedExtensions) {
        this.cloudinaryResourceType = cloudinaryResourceType;
        this.allowedMimeTypes = allowedMimeTypes;
        this.allowedExtensions = allowedExtensions;
    }

    /** The {@code resource_type} value to send to Cloudinary. */
    public String cloudinaryResourceType() {
        return cloudinaryResourceType;
    }

    public Set<String> allowedMimeTypes() {
        return allowedMimeTypes;
    }

    public Set<String> allowedExtensions() {
        return allowedExtensions;
    }

    public boolean permitsMimeType(String mimeType) {
        return mimeType != null && allowedMimeTypes.contains(mimeType.toLowerCase());
    }

    public boolean permitsExtension(String extension) {
        return extension != null && allowedExtensions.contains(extension.toLowerCase());
    }

    /** Comma-separated extensions, for an error message a user can act on. */
    public String describeAllowedExtensions() {
        return allowedExtensions.stream().sorted().map(extension -> "." + extension)
                .reduce((a, b) -> a + ", " + b).orElse("");
    }
}
