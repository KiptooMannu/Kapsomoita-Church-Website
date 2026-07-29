package com.kapsomoita.church.media.service;

import com.kapsomoita.church.auth.repository.UserRepository;
import com.kapsomoita.church.media.domain.GalleryCategory;
import com.kapsomoita.church.media.domain.MediaAsset;
import com.kapsomoita.church.media.domain.MediaFolder;
import com.kapsomoita.church.media.domain.MediaVisibility;
import com.kapsomoita.church.media.dto.MediaDtos.UploadMetadata;
import com.kapsomoita.church.media.repository.MediaAssetRepository;
import com.kapsomoita.church.media.service.CloudinaryStorageService.StoredMedia;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Writes media metadata rows.
 *
 * <p>A separate bean rather than a method on {@code MediaAssetService} for a concrete
 * reason: Spring's transaction support is proxy-based, so a {@code @Transactional}
 * method invoked through {@code this} from another method of the same class is never
 * intercepted and runs with no transaction at all. Crossing a bean boundary is what
 * makes the annotation take effect.
 */
@Service
public class MediaAssetWriter {

    private final MediaAssetRepository mediaAssetRepository;
    private final UserRepository userRepository;

    public MediaAssetWriter(MediaAssetRepository mediaAssetRepository,
                            UserRepository userRepository) {
        this.mediaAssetRepository = mediaAssetRepository;
        this.userRepository = userRepository;
    }

    /**
     * Persists the metadata for an already-uploaded file.
     *
     * @param actorId the uploading account, or null for a system upload
     */
    @Transactional
    public MediaAsset write(StoredMedia stored,
                            UploadMetadata metadata,
                            MediaFolder folder,
                            GalleryCategory category,
                            MediaVisibility visibility,
                            List<String> tags,
                            UUID actorId) {

        MediaAsset asset = new MediaAsset();

        asset.setTitle(metadata.title().trim());
        asset.setDescription(blankToNull(metadata.description()));
        asset.setMediaFolder(folder);
        asset.setGalleryCategory(category);
        asset.setFolder(stored.folder());

        asset.setPublicId(stored.publicId());
        asset.setAssetId(stored.assetId());
        asset.setSecureUrl(stored.secureUrl());
        asset.setResourceType(stored.resourceType());
        asset.setFormat(stored.format());
        asset.setBytes(stored.bytes() == null ? 0L : stored.bytes());
        asset.setWidth(stored.width());
        asset.setHeight(stored.height());
        asset.setEtag(stored.etag());

        asset.setOriginalFilename(stored.originalFilename());
        asset.setMimeType(stored.mimeType());
        asset.setChecksumSha256(stored.checksumSha256());
        asset.setUploadedAt(stored.uploadedAt());

        // Eagerly fetch the uploader so DTO mapping outside this transaction can
        // safely call getFullName() on the returned entity. getReferenceById returns a
        // Hibernate proxy that becomes unusable once the session closes.
        if (actorId != null) {
            userRepository.findById(actorId).ifPresent(asset::setUploadedBy);
        }

        asset.setFeatured(metadata.featuredOrDefault());
        asset.setVisibility(visibility);
        asset.setTags(tags);
        asset.setSortOrder(metadata.sortOrderOrDefault());

        return mediaAssetRepository.save(asset);
    }

    private static String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
