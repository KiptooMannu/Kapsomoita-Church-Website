/**
 * GENERATED FILE — do not edit by hand.
 *
 * Written by LocalMediaImportRunner. Maps each image's original path in
 * this repository to the Cloudinary public ID it was uploaded to.
 *
 * Regenerate with:
 *   cd backend
 *   mvn spring-boot:run -Dspring-boot.run.arguments=--media.import.enabled=true
 *
 * This committed version is intentionally empty: it exists so the frontend
 * compiles before the import has ever run. Components that call `mediaPublicId`
 * get null and fall back to their bundled asset until the import populates it.
 */

/** Original repository path -> Cloudinary public ID. */
export const MEDIA_MANIFEST: Readonly<Record<string, string>> = {}

/**
 * Resolves an original local path to its Cloudinary public ID.
 *
 * Returns null when the image has not been imported yet, which lets a
 * component fall back to its bundled asset instead of rendering nothing.
 */
export function mediaPublicId(localPath: string): string | null {
  return MEDIA_MANIFEST[localPath] ?? null
}
