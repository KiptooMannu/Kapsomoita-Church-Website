package com.kapsomoita.church.media.domain;

import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * A file stored in Cloudinary, with the metadata the church manages around it.
 *
 * <p>Enums are persisted by name ({@code EnumType.STRING}) rather than ordinal: an
 * ordinal column silently remaps every existing row the moment a constant is
 * inserted or reordered in the enum.
 */
@Entity
@Table(name = "media_assets")
public class MediaAsset extends BaseEntity {

    // --- Editorial metadata ------------------------------------------------

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "media_folder", nullable = false, length = 48)
    private MediaFolder mediaFolder;

    /** Non-null only for gallery assets; enforced by a database CHECK constraint. */
    @Enumerated(EnumType.STRING)
    @Column(name = "gallery_category", length = 48)
    private GalleryCategory galleryCategory;

    /** Absolute Cloudinary folder, e.g. {@code church/gallery/youth}. */
    @Column(name = "folder", nullable = false, length = 300)
    private String folder;

    // --- Cloudinary identifiers -------------------------------------------

    @Column(name = "public_id", nullable = false, length = 300)
    private String publicId;

    @Column(name = "asset_id", length = 100)
    private String assetId;

    @Column(name = "secure_url", nullable = false, length = 1000)
    private String secureUrl;

    /** {@code image}, {@code video} or {@code raw}. */
    @Column(name = "resource_type", nullable = false, length = 16)
    private String resourceType;

    @Column(name = "format", length = 16)
    private String format;

    @Column(name = "bytes", nullable = false)
    private long bytes;

    /** Null for audio and documents, which have no pixel dimensions. */
    @Column(name = "width")
    private Integer width;

    @Column(name = "height")
    private Integer height;

    @Column(name = "etag", length = 100)
    private String etag;

    // --- Provenance --------------------------------------------------------

    @Column(name = "original_filename", length = 300)
    private String originalFilename;

    @Column(name = "mime_type", length = 160)
    private String mimeType;

    @Column(name = "checksum_sha256", length = 64)
    private String checksumSha256;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    @Column(name = "uploaded_at", nullable = false)
    private Instant uploadedAt;

    // --- Publication state -------------------------------------------------

    @Column(name = "featured", nullable = false)
    private boolean featured = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false, length = 16)
    private MediaVisibility visibility = MediaVisibility.PUBLIC;

    /**
     * Mapped to a Postgres {@code text[]} rather than a join table: tags are always
     * read and written wholesale with their asset, and never queried independently,
     * so a separate table would add a join for no benefit.
     */
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "tags", nullable = false, columnDefinition = "text[]")
    private List<String> tags = new ArrayList<>();

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    // --- Accessors ---------------------------------------------------------

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public MediaFolder getMediaFolder() {
        return mediaFolder;
    }

    public void setMediaFolder(MediaFolder mediaFolder) {
        this.mediaFolder = mediaFolder;
    }

    public GalleryCategory getGalleryCategory() {
        return galleryCategory;
    }

    public void setGalleryCategory(GalleryCategory galleryCategory) {
        this.galleryCategory = galleryCategory;
    }

    public String getFolder() {
        return folder;
    }

    public void setFolder(String folder) {
        this.folder = folder;
    }

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getSecureUrl() {
        return secureUrl;
    }

    public void setSecureUrl(String secureUrl) {
        this.secureUrl = secureUrl;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public long getBytes() {
        return bytes;
    }

    public void setBytes(long bytes) {
        this.bytes = bytes;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public String getEtag() {
        return etag;
    }

    public void setEtag(String etag) {
        this.etag = etag;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getChecksumSha256() {
        return checksumSha256;
    }

    public void setChecksumSha256(String checksumSha256) {
        this.checksumSha256 = checksumSha256;
    }

    public User getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(User uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Instant uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public MediaVisibility getVisibility() {
        return visibility;
    }

    public void setVisibility(MediaVisibility visibility) {
        this.visibility = visibility;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags == null ? new ArrayList<>() : new ArrayList<>(tags);
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    // --- Derived -----------------------------------------------------------

    /**
     * The media kind, derived from the folder rather than stored.
     *
     * <p>Needed when deleting, because Cloudinary requires the resource type to
     * locate an asset.
     */
    public MediaKind kind() {
        return mediaFolder.expectedKind();
    }

    @Override
    public String toString() {
        return "MediaAsset(" + publicId + ")";
    }
}
