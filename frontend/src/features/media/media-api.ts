import { api, apiDelete, apiGet } from '@/lib/api/client'
import type { PageResponse } from '@/lib/api/types'

/** Mirrors `MediaDtos.MediaAssetResponse`. */
export interface MediaAsset {
  id: string
  title: string
  description: string | null
  folder: string
  mediaFolder: string
  category: string | null
  categoryLabel: string | null
  publicId: string
  assetId: string | null
  secureUrl: string
  resourceType: string
  format: string | null
  bytes: number
  width: number | null
  height: number | null
  originalFilename: string | null
  mimeType: string | null
  uploadedById: string | null
  uploadedByName: string | null
  uploadedAt: string
  featured: boolean
  visibility: string
  tags: string[]
  sortOrder: number
}

/** Mirrors `MediaDtos.MediaFolderSummary`. */
export interface MediaFolderSummary {
  name: string
  relativePath: string
  absoluteFolder: string
  expectedKind: string
  requiresCategory: boolean
  maxBytes: number
  allowedExtensions: string[]
}

/** Mirrors `MediaDtos.GalleryCategorySummary`. */
export interface GalleryCategorySummary {
  name: string
  slug: string
  displayName: string
  folder: string
  imageCount: number
}

/** Mirrors `MediaDtos.FailedUpload`. */
export interface FailedUpload {
  filename: string
  code: string
  message: string
}

/** Mirrors `MediaDtos.BulkUploadResponse`. */
export interface BulkUploadResult {
  uploaded: MediaAsset[]
  failed: FailedUpload[]
  successCount: number
  failureCount: number
}

/** Mirrors `MediaDtos.UploadMetadata`. */
export interface UploadMetadata {
  title: string
  description?: string
  /** A `MediaFolder` name, e.g. `GALLERY`. Never a literal path. */
  folder: string
  /** Required only when the folder is category-scoped. */
  category?: string
  visibility?: string
  featured?: boolean
  tags?: string[]
  sortOrder?: number
}

export interface MediaListParams {
  folder?: string
  category?: string
  visibility?: string
  featured?: boolean
  search?: string
  page?: number
  size?: number
}

/**
 * Builds the multipart body.
 *
 * The metadata goes in as a `Blob` with an explicit `application/json` content type,
 * which is what makes Spring bind it to `@RequestPart UploadMetadata` and run bean
 * validation on it. A plain string part arrives as `text/plain` and fails to convert.
 */
function buildFormData(
  files: File | File[],
  metadata: UploadMetadata,
  fileFieldName: 'file' | 'files',
): FormData {
  const form = new FormData()

  if (Array.isArray(files)) {
    files.forEach((file) => form.append(fileFieldName, file))
  } else {
    form.append(fileFieldName, files)
  }

  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' }),
  )

  return form
}

export const mediaApi = {
  /**
   * Uploads one file.
   *
   * The Content-Type header is deliberately left unset: the browser must generate it
   * so it can include the multipart boundary. Setting it manually produces a body the
   * server cannot parse.
   */
  async upload(
    file: File,
    metadata: UploadMetadata,
    onProgress?: (percent: number) => void,
  ): Promise<MediaAsset> {
    const { data } = await api.post<MediaAsset>(
      '/admin/media',
      buildFormData(file, metadata, 'file'),
      {
        // Generous timeout: a large video over a slow Kenyan mobile connection
        // legitimately takes minutes, and the default 30s would abort it.
        timeout: 10 * 60_000,
        onUploadProgress: (event) => {
          if (onProgress && event.total) {
            onProgress(Math.round((event.loaded / event.total) * 100))
          }
        },
      },
    )
    return data
  },

  /** Uploads several files to the same destination; reports per-file outcomes. */
  async uploadBatch(
    files: File[],
    metadata: UploadMetadata,
    onProgress?: (percent: number) => void,
  ): Promise<BulkUploadResult> {
    const { data } = await api.post<BulkUploadResult>(
      '/admin/media/batch',
      buildFormData(files, metadata, 'files'),
      {
        timeout: 15 * 60_000,
        onUploadProgress: (event) => {
          if (onProgress && event.total) {
            onProgress(Math.round((event.loaded / event.total) * 100))
          }
        },
      },
    )
    return data
  },

  /** The server's folder map, so the upload form never hardcodes destinations. */
  folders(): Promise<MediaFolderSummary[]> {
    return apiGet<MediaFolderSummary[]>('/admin/media/folders')
  },

  galleryCategories(): Promise<GalleryCategorySummary[]> {
    return apiGet<GalleryCategorySummary[]>('/admin/media/gallery-categories')
  },

  list(params: MediaListParams): Promise<PageResponse<MediaAsset>> {
    return apiGet<PageResponse<MediaAsset>>('/admin/media', { params })
  },

  remove(id: string): Promise<void> {
    return apiDelete<void>(`/admin/media/${id}`)
  },
}
