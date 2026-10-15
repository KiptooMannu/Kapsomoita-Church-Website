package com.kapsomoita.church.config;

import jakarta.validation.constraints.Min;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Cloudinary credentials and upload limits, bound from {@code cloudinary.*}.
 *
 * <p>Credentials are optional at startup: the application must still boot without
 * them so the rest of the platform works, but every upload then fails with a clear
 * configuration error rather than a confusing 401 from Cloudinary. {@link #isConfigured()}
 * is the single check for that.
 *
 * @param cloudName    Cloudinary cloud name
 * @param apiKey       Cloudinary API key
 * @param apiSecret    Cloudinary API secret — server-side only, never exposed
 * @param rootFolder   top-level namespace all media lives under (default {@code church})
 * @param maxImageBytes maximum accepted image size
 * @param maxVideoBytes maximum accepted video size
 * @param maxRawBytes   maximum accepted document size
 * @param useFilenameAsPublicIdPrefix prefix generated public IDs with a slug of the
 *        original filename, which makes assets recognisable in the Cloudinary console
 */
@Validated
@ConfigurationProperties(prefix = "cloudinary")
public record CloudinaryProperties(
        String cloudName,
        String apiKey,
        String apiSecret,
        String rootFolder,
        @Min(1) long maxImageBytes,
        @Min(1) long maxVideoBytes,
        @Min(1) long maxRawBytes,
        boolean useFilenameAsPublicIdPrefix) {

    /** Fallbacks applied when a value is absent, so the record is never half-built. */
    public CloudinaryProperties(
            String cloudName,
            String apiKey,
            String apiSecret,
            String rootFolder,
            long maxImageBytes,
            long maxVideoBytes,
            long maxRawBytes,
            boolean useFilenameAsPublicIdPrefix) {
        this.cloudName = cloudName;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.rootFolder = normaliseRootFolder(rootFolder);
        this.maxImageBytes = maxImageBytes <= 0 ? 10L * 1024 * 1024 : maxImageBytes;
        this.maxVideoBytes = maxVideoBytes <= 0 ? 200L * 1024 * 1024 : maxVideoBytes;
        this.maxRawBytes = maxRawBytes <= 0 ? 25L * 1024 * 1024 : maxRawBytes;
        this.useFilenameAsPublicIdPrefix = useFilenameAsPublicIdPrefix;
    }

    private static String normaliseRootFolder(String rootFolder) {
        String folder = (rootFolder == null || rootFolder.isBlank()) ? "church" : rootFolder;
        return folder.replaceAll("^/+|/+$", "");
    }

    /** True when all three credentials are present, so uploads can be attempted. */
    public boolean isConfigured() {
        return isPresent(cloudName) && isPresent(apiKey) && isPresent(apiSecret);
    }

    private static boolean isPresent(String value) {
        return value != null && !value.isBlank();
    }
}
