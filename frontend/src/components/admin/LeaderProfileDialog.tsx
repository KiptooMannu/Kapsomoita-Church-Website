import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ImageUploadField } from '@/components/admin/ImageUploadField'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ministryDetails } from '@/config/ministries'
import { contentApi, type Leader } from '@/features/content/content-api'
import { mediaApi } from '@/features/media/media-api'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'

interface LeaderProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leader?: Leader | null
  defaultMinistry?: string
  defaultTeam?: string
  defaultRole?: string
}

/**
 * Create or edit a leader, including the portrait uploaded to Cloudinary.
 *
 * Used by the leadership directory and by each ministry on the ministries
 * screen, so a photo saved in either place is the same record.
 */
export function LeaderProfileDialog({
  open,
  onOpenChange,
  leader,
  defaultMinistry = '',
  defaultTeam = 'PASTORAL',
  defaultRole = '',
}: LeaderProfileDialogProps) {
  const queryClient = useQueryClient()
  const [fullName, setFullName] = useState('')
  const [roleTitle, setRoleTitle] = useState('')
  const [bio, setBio] = useState('')
  const [ministry, setMinistry] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [team, setTeam] = useState('PASTORAL')
  const [published, setPublished] = useState(true)
  const [photoId, setPhotoId] = useState<string | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  useEffect(() => {
    if (!open) return
    setFullName(leader?.fullName ?? '')
    setRoleTitle(leader?.roleTitle ?? defaultRole)
    setBio(leader?.bio ?? '')
    setMinistry(leader?.ministry ?? defaultMinistry)
    setEmail(leader?.email ?? '')
    setPhone(leader?.phone ?? '')
    setTeam(leader?.team ?? defaultTeam)
    setPublished(leader?.published ?? true)
    setPhotoId(leader?.photoId ?? null)
    setPhotoUrl(leader?.photoUrl ?? null)
    setPhotoFile(null)
  }, [open, leader, defaultMinistry, defaultTeam, defaultRole])

  const saveMutation = useMutation({
    mutationFn: async () => {
      let nextPhotoId = photoId
      if (photoFile) {
        const uploaded = await mediaApi.upload(photoFile, {
          title: (fullName || roleTitle).trim() || 'Leader photo',
          folder: team === 'PASTORAL' ? 'PASTOR_PHOTO' : 'LEADERSHIP_PHOTO',
          visibility: 'INTERNAL',
          featured: false,
          description: ministry || undefined,
        })
        nextPhotoId = uploaded.id
      }
      const payload = {
        fullName: fullName || undefined,
        roleTitle,
        bio: bio || undefined,
        ministry: ministry || undefined,
        email: email || undefined,
        phone: phone || undefined,
        photoId: nextPhotoId,
        team,
        published,
      }
      return leader
        ? contentApi.adminUpdateLeader(leader.id, payload)
        : contentApi.adminCreateLeader(payload)
    },
    onSuccess: () => {
      toast.success(leader ? 'Leader profile updated' : 'Leader profile added')
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.leaders })
      void queryClient.invalidateQueries({ queryKey: queryKeys.public.leaders })
      onOpenChange(false)
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{leader ? 'Edit leader' : 'Add leader'}</DialogTitle>
          <DialogDescription>
            The profile photo is stored in Cloudinary and shown on this ministry, the leadership section, and the pastor&apos;s message. It does not appear in the gallery.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lead-name">Full name</Label>
              <Input
                id="lead-name"
                placeholder="e.g. Rev. John Tanui"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lead-role">Role title *</Label>
              <Input
                id="lead-role"
                placeholder="e.g. Senior Pastor"
                value={roleTitle}
                onChange={(event) => setRoleTitle(event.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lead-bio">Biography</Label>
            <Textarea
              id="lead-bio"
              placeholder="A short word visitors will read with the portrait."
              rows={3}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                placeholder="pastor@kapsomoitachurch.org"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lead-phone">Phone</Label>
              <Input
                id="lead-phone"
                placeholder="+254 700 000 000"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lead-ministry">Ministry</Label>
            <select
              id="lead-ministry"
              value={ministry}
              onChange={(event) => setMinistry(event.target.value)}
              className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Not tied to one ministry</option>
              {ministry && !ministryDetails.some((entry) => entry.name === ministry) && (
                <option value={ministry}>{ministry}</option>
              )}
              {ministryDetails.map((entry) => (
                <option key={entry.slug} value={entry.name}>
                  {entry.name}
                </option>
              ))}
            </select>
          </div>

          <ImageUploadField
            id="lead-photo"
            label="Profile photo"
            helper="JPEG, PNG, WebP or GIF, up to 10 MB. Replace the file to change the picture, or remove it to show initials instead."
            existingUrl={photoFile ? null : photoUrl}
            file={photoFile}
            onFileChange={setPhotoFile}
            onClearExisting={() => {
              setPhotoId(null)
              setPhotoUrl(null)
            }}
            disabled={saveMutation.isPending}
          />

          <div>
            <Label htmlFor="lead-team">Team</Label>
            <select
              id="lead-team"
              value={team}
              onChange={(event) => setTeam(event.target.value)}
              className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="PASTORAL">Pastoral team</option>
              <option value="MINISTRY">Ministry leaders</option>
              <option value="SUPPORT">Support and board</option>
            </select>
          </div>

          <label className="flex cursor-pointer items-center gap-2 pt-1 text-sm font-medium">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
              className="border-input text-primary size-4 rounded"
            />
            Publish on the website
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saveMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !roleTitle.trim()}
          >
            {saveMutation.isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
            {saveMutation.isPending ? 'Saving photo…' : leader ? 'Save changes' : 'Add leader'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
