package com.kapsomoita.church.media.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import org.springframework.lang.NonNull;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

/**
 * Presents a file on disk as a {@link MultipartFile}.
 *
 * <p>Exists so the local media importer can feed files through the same
 * {@code MediaAssetService.uploadSingle} path an administrator's browser upload
 * takes. The alternative — a second upload code path for imports — would duplicate
 * validation, folder resolution and metadata recording, and the two would drift.
 *
 * <p>{@link #getInputStream()} opens a fresh stream on each call, which matters:
 * the validation service reads the file twice (once to detect its type, once to
 * checksum it), and a single shared stream would arrive at the second read already
 * exhausted.
 */
final class MultipartFileAdapter implements MultipartFile {

    private final Path path;
    private final String originalFilename;
    private final String contentType;
    private final long size;

    private MultipartFileAdapter(Path path, String contentType, long size) {
        this.path = path;
        this.originalFilename = path.getFileName().toString();
        this.contentType = contentType;
        this.size = size;
    }

    /**
     * Wraps a file on disk.
     *
     * <p>The content type is probed rather than guessed from the extension, though
     * the validation service re-detects it from the bytes regardless — this value is
     * only a hint and is never trusted.
     */
    static MultipartFileAdapter of(Path path) throws IOException {
        if (!Files.isRegularFile(path)) {
            throw new IOException("Not a readable file: " + path);
        }
        String probed = Files.probeContentType(path);
        return new MultipartFileAdapter(
                path,
                probed == null ? "application/octet-stream" : probed,
                Files.size(path));
    }

    @Override
    @NonNull
    public String getName() {
        // The form field name an equivalent browser upload would have used.
        return "file";
    }

    @Override
    public String getOriginalFilename() {
        return originalFilename;
    }

    @Override
    public String getContentType() {
        return contentType;
    }

    @Override
    public boolean isEmpty() {
        return size == 0;
    }

    @Override
    public long getSize() {
        return size;
    }

    @Override
    @NonNull
    public byte[] getBytes() throws IOException {
        return Files.readAllBytes(path);
    }

    @Override
    @NonNull
    public InputStream getInputStream() throws IOException {
        return Files.newInputStream(path);
    }

    @Override
    public void transferTo(@NonNull java.io.File destination) throws IOException {
        Files.copy(path, destination.toPath(), StandardCopyOption.REPLACE_EXISTING);
    }

    @Override
    public String toString() {
        return "MultipartFileAdapter(" + StringUtils.cleanPath(path.toString()) + ")";
    }
}
