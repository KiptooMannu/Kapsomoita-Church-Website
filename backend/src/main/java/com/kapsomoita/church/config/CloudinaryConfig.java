package com.kapsomoita.church.config;

import com.cloudinary.Cloudinary;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Builds the {@link Cloudinary} client.
 *
 * <p>The bean is always created, even without credentials, so the application
 * context is identical in every environment and a misconfiguration surfaces as a
 * clear error at upload time rather than as a failure to start. The storage
 * service checks {@link CloudinaryProperties#isConfigured()} before using it.
 */
@Configuration
public class CloudinaryConfig {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryConfig.class);

    @Bean
    public Cloudinary cloudinary(CloudinaryProperties properties) {
        if (!properties.isConfigured()) {
            log.warn("""
                    Cloudinary is not configured (CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / \
                    CLOUDINARY_API_SECRET). Media uploads will be rejected with a configuration \
                    error until these are set in backend/.env.""");
            // An unconfigured client is never called; the guard lives in the service.
            return new Cloudinary(Map.of("cloud_name", "unconfigured", "secure", true));
        }

        log.info("Cloudinary configured for cloud '{}', root folder '{}'",
                properties.cloudName(), properties.rootFolder());

        return new Cloudinary(Map.of(
                "cloud_name", properties.cloudName(),
                "api_key", properties.apiKey(),
                "api_secret", properties.apiSecret(),
                // Always return https URLs; a mixed-content image is blocked by
                // browsers on an https site.
                "secure", true));
    }
}
