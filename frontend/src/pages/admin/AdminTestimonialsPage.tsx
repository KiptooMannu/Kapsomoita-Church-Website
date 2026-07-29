import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Loader2Icon,
  MessageSquareQuoteIcon,
  PlusIcon,
  StarIcon,
  Trash2Icon,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
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
import { SeoHead } from '@/components/seo/SeoHead'
import { contentApi, type Testimonial } from '@/features/content/content-api'
import { normaliseApiError } from '@/lib/api/client'

export default function AdminTestimonialsPage() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)

  // Form state
  const [quote, setQuote] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [authorRole, setAuthorRole] = useState('')
  const [published, setPublished] = useState(true)
  const [featured, setFeatured] = useState(false)

  const testimonialsQuery = useQuery({
    queryKey: ['admin', 'testimonials'],
    queryFn: () => contentApi.adminListTestimonials({}),
  })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        quote,
        authorName: authorName || undefined,
        authorRole: authorRole || undefined,
        published,
        featured,
      }
      if (editingTestimonial) {
        return contentApi.adminUpdateTestimonial(editingTestimonial.id, payload)
      }
      return contentApi.adminCreateTestimonial(payload)
    },
    onSuccess: () => {
      toast.success(editingTestimonial ? 'Testimonial updated' : 'Testimonial created')
      void queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] })
      void queryClient.invalidateQueries({ queryKey: ['public', 'testimonials'] })
      handleCloseDialog()
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contentApi.adminDeleteTestimonial(id),
    onSuccess: () => {
      toast.success('Testimonial deleted')
      void queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] })
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const handleOpenDialog = (item?: Testimonial) => {
    if (item) {
      setEditingTestimonial(item)
      setQuote(item.quote)
      setAuthorName(item.authorName ?? '')
      setAuthorRole(item.authorRole ?? '')
      setPublished(item.published)
      setFeatured(item.featured)
    } else {
      setEditingTestimonial(null)
      setQuote('')
      setAuthorName('')
      setAuthorRole('')
      setPublished(true)
      setFeatured(false)
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTestimonial(null)
  }

  const testimonials = testimonialsQuery.data?.content ?? []

  return (
    <>
      <SeoHead title="Testimonials Manager" description="Manage member stories, testimonies and community posts." />

      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Content</span>
              <span>•</span>
              <span className="text-primary">Live Module</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">
              Testimonials Manager
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage congregation member testimonies and stories displayed on the homepage.
            </p>
          </div>

          <Button onClick={() => handleOpenDialog()} className="shrink-0 bg-primary text-primary-foreground">
            <PlusIcon className="mr-2 size-4" />
            Add Testimony
          </Button>
        </div>

        {/* Content */}
        <Card>
          <CardHeader className="pb-3">
            <h2 className="text-sm font-semibold text-foreground">All Testimonial Submissions</h2>
          </CardHeader>

          <CardContent>
            {testimonialsQuery.isPending ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2Icon className="mr-2 size-5 animate-spin" />
                Loading testimonies...
              </div>
            ) : testimonials.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <MessageSquareQuoteIcon className="size-10 mb-3 opacity-40" />
                <p className="font-medium text-foreground">No testimonies yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click "Add Testimony" above to publish a member story.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant={item.published ? 'success' : 'outline'}>
                          {item.published ? 'Published' : 'Draft'}
                        </Badge>
                        {item.featured && (
                          <Badge variant="gold" className="flex items-center gap-1 bg-amber-500/15 text-amber-700">
                            <StarIcon className="size-3 fill-amber-500 text-amber-500" />
                            Featured
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm italic text-foreground/90 font-serif border-l-2 border-primary/40 pl-3 py-1 my-2">
                        "{item.quote}"
                      </p>

                      <div className="text-xs font-semibold text-foreground mt-3">
                        — {item.displayAuthor}
                      </div>
                      {item.authorRole && (
                        <div className="text-xs text-muted-foreground">{item.authorRole}</div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border/50">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteMutation.mutate(item.id)}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? 'Edit Testimony' : 'New Testimony'}
            </DialogTitle>
            <DialogDescription>
              Add member stories to display in the website testimonial carousel.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div>
              <Label htmlFor="test-quote">Quote / Testimony *</Label>
              <Textarea
                id="test-quote"
                placeholder="Enter the testimony text..."
                rows={4}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="test-author">Author Name</Label>
                <Input
                  id="test-author"
                  placeholder="e.g., Church Member"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="test-role">Role / Ministry (Optional)</Label>
                <Input
                  id="test-role"
                  placeholder="e.g., Youth Fellowship"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded border-input text-primary size-4"
                />
                Published Live
              </label>

              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-input text-primary size-4"
                />
                Featured on Homepage
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !quote.trim()}
            >
              {saveMutation.isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              {editingTestimonial ? 'Save Changes' : 'Save Testimony'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
