import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2Icon, RadioIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { livestreamApi } from '@/features/content/livestream-api'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'
import { SeoHead } from '@/components/seo/SeoHead'
import { useAuth } from '@/features/auth/useAuth'

export default function AdminLivestreamPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = useAuth()
  const canUpdate = hasPermission('livestream:update')
  const livestreamQuery = useQuery({ queryKey: queryKeys.admin.livestream, queryFn: livestreamApi.public })
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState('YouTube')
  const [streamUrl, setStreamUrl] = useState('')
  const [embedUrl, setEmbedUrl] = useState('')
  const [scheduledFor, setScheduledFor] = useState('')
  const [offlineMessage, setOfflineMessage] = useState('Join us for our next live service.')
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const stream = livestreamQuery.data
    if (!stream) return
    setTitle(stream.title ?? '')
    setPlatform(stream.platform ?? 'YouTube')
    setStreamUrl(stream.streamUrl ?? '')
    setEmbedUrl(stream.embedUrl ?? '')
    setScheduledFor(stream.scheduledFor ? stream.scheduledFor.slice(0, 16) : '')
    setOfflineMessage(stream.offlineMessage ?? '')
    setIsLive(stream.isLive)
  }, [livestreamQuery.data])

  const updateMutation = useMutation({
    mutationFn: () => livestreamApi.update({
      title: title || undefined,
      platform: platform || undefined,
      streamUrl: streamUrl || undefined,
      embedUrl: embedUrl || undefined,
      scheduledFor: scheduledFor ? new Date(scheduledFor).toISOString() : undefined,
      offlineMessage: offlineMessage || undefined,
      isLive,
    }),
    onSuccess: () => {
      toast.success('Livestream settings updated')
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.livestream })
      void queryClient.invalidateQueries({ queryKey: queryKeys.public.livestream })
    },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const disabled = livestreamQuery.isPending || updateMutation.isPending || !canUpdate

  return (
    <>
      <SeoHead title="Livestream Administration — Kapsomoita AGC" />
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight"><RadioIcon className="size-6 text-primary" />Livestream Settings</h1>
          <p className="text-sm text-muted-foreground">Control the public livestream link, embed, schedule, and offline message.</p>
        </div>
        {livestreamQuery.isPending ? <div className="flex justify-center p-12"><Loader2Icon className="size-8 animate-spin text-primary" /></div> : livestreamQuery.isError ? (
          <Card><CardContent className="p-6 text-destructive">{normaliseApiError(livestreamQuery.error).message}</CardContent></Card>
        ) : (
          <Card>
            <CardHeader><h2 className="font-semibold">Stream configuration</h2><p className="text-sm text-muted-foreground">{canUpdate ? 'Update the public stream configuration.' : 'You have read-only access to livestream settings.'}</p></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="stream-title">Title</Label><Input id="stream-title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={disabled} /></div>
              <div><Label htmlFor="stream-platform">Platform</Label><Input id="stream-platform" value={platform} onChange={(e) => setPlatform(e.target.value)} disabled={disabled} /></div>
              <div><Label htmlFor="stream-url">Stream URL</Label><Input id="stream-url" type="url" value={streamUrl} onChange={(e) => setStreamUrl(e.target.value)} disabled={disabled} /></div>
              <div><Label htmlFor="embed-url">Embed URL</Label><Input id="embed-url" type="url" value={embedUrl} onChange={(e) => setEmbedUrl(e.target.value)} disabled={disabled} /></div>
              <div><Label htmlFor="scheduled-for">Scheduled for</Label><Input id="scheduled-for" type="datetime-local" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} disabled={disabled} /></div>
              <label className="flex items-center gap-2 pt-7 text-sm"><input type="checkbox" checked={isLive} onChange={(e) => setIsLive(e.target.checked)} disabled={disabled} /> Mark stream as live</label>
              <div className="sm:col-span-2"><Label htmlFor="offline-message">Offline message</Label><Textarea id="offline-message" value={offlineMessage} onChange={(e) => setOfflineMessage(e.target.value)} disabled={disabled} /></div>
              <div className="sm:col-span-2 flex justify-end"><Button onClick={() => updateMutation.mutate()} disabled={disabled}>{updateMutation.isPending && <Loader2Icon className="size-4 animate-spin" />}Save livestream settings</Button></div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
