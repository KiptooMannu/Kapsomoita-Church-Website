import { ImagePlusIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024

interface ImageUploadFieldProps {
  id: string
  label: string
  helper?: string
  existingUrl?: string | null
  file: File | null
  onFileChange: (file: File | null) => void
  onClearExisting?: () => void
  disabled?: boolean
  required?: boolean
}

/**
 * File picker with a preview for admin image fields.
 *
 * The parent uploads the selected file when the form is saved, so cancelling
 * the dialog does not leave an unused file in storage.
 */
export function ImageUploadField({
  id,
  label,
  helper,
  existingUrl,
  file,
  onFileChange,
  onClearExisting,
  disabled,
  required,
}: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const shown = preview || existingUrl || null

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? ' *' : ''}
      </Label>
      <Input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={disabled}
        onChange={(event) => {
          const next = event.target.files?.[0] ?? null
          if (next && !next.type.startsWith('image/')) {
            setError('Choose a JPEG, PNG, WebP or GIF image.')
            onFileChange(null)
            return
          }
          if (next && next.size > MAX_IMAGE_BYTES) {
            setError('That image is larger than 10 MB.')
            onFileChange(null)
            return
          }
          setError(null)
          onFileChange(next)
        }}
      />
      {helper && <p className="text-muted-foreground text-xs">{helper}</p>}
      {error && <p className="text-destructive text-sm">{error}</p>}
      {shown ? (
        <div className="relative">
          <img src={shown} alt="" className="bg-muted h-40 w-full rounded-lg object-cover" />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="absolute top-2 right-2"
            disabled={disabled}
            onClick={() => {
              onFileChange(null)
              if (!file) onClearExisting?.()
            }}
          >
            <XIcon className="size-4" aria-hidden="true" />
            {file ? 'Clear selection' : 'Remove photo'}
          </Button>
        </div>
      ) : (
        <div className="bg-muted text-muted-foreground flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border">
          <ImagePlusIcon className="size-8" aria-hidden="true" />
          <span className="text-xs">No photo yet</span>
        </div>
      )}
    </div>
  )
}
