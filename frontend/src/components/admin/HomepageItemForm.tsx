import { Loader2Icon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  createHomepageItem,
  updateHomepageItem,
  type HomepageItem,
  type HomepageItemRequest,
} from '@/lib/api/homepage'
import { normaliseApiError } from '@/lib/api/client'

interface HomepageItemFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: HomepageItem | null
  onSuccess: () => void
}

export function HomepageItemForm({
  open,
  onOpenChange,
  item,
  onSuccess,
}: HomepageItemFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<HomepageItemRequest>({
    defaultValues: {
      title: '',
      description: '',
      category: 'HERO_BANNER',
      status: 'DRAFT',
      imageUrl: '',
      linkUrl: '',
      displayOrder: 0,
      featured: false,
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (item) {
      setValue('title', item.title)
      setValue('description', item.description || '')
      setValue('category', item.category)
      setValue('status', item.status)
      setValue('imageUrl', item.imageUrl || '')
      setValue('linkUrl', item.linkUrl || '')
      setValue('displayOrder', item.displayOrder)
      setValue('featured', item.featured)
    } else {
      reset()
    }
  }, [item, setValue, reset])

  const onSubmit = async (data: HomepageItemRequest) => {
    try {
      setLoading(true)
      setError(null)

      if (item) {
        await updateHomepageItem(item.id, data)
      } else {
        await createHomepageItem(data)
      }

      onSuccess()
      onOpenChange(false)
      reset()
    } catch (err) {
      const apiError = normaliseApiError(err)
      setError(apiError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Homepage Item' : 'Add Homepage Item'}</DialogTitle>
          <DialogDescription>
            {item
              ? 'Update the homepage content details below.'
              : 'Create a new homepage content item to display on the landing page.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter title"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="text-destructive text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                defaultValue="HERO_BANNER"
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HERO_BANNER">Hero Banner</SelectItem>
                  <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                  <SelectItem value="EVENT">Event</SelectItem>
                  <SelectItem value="MINISTRY">Ministry</SelectItem>
                  <SelectItem value="SERMON">Sermon</SelectItem>
                  <SelectItem value="TESTIMONIAL">Testimonial</SelectItem>
                  <SelectItem value="FEATURE">Feature</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              rows={3}
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                {...register('imageUrl')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkUrl">Link URL</Label>
              <Input
                id="linkUrl"
                placeholder="https://example.com/page"
                {...register('linkUrl')}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue="DRAFT"
                onValueChange={(value) => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                defaultValue={0}
                {...register('displayOrder', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featured">Featured</Label>
              <Select
                defaultValue="false"
                onValueChange={(value) => setValue('featured', value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  {item ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                item ? 'Update Item' : 'Create Item'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}