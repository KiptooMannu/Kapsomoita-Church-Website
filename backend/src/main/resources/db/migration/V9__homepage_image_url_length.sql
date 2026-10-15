-- Cloudinary delivery URLs are longer than the original 512-character limit.
ALTER TABLE homepage_items
    ALTER COLUMN image_url TYPE VARCHAR(1024);

-- Event, pastor, homepage and other non-gallery files must not appear in the gallery.
UPDATE media_assets
SET visibility = 'INTERNAL'
WHERE media_folder <> 'GALLERY'
  AND visibility = 'PUBLIC';
