import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  CheckCircle2Icon,
  ClockIcon,
  MailIcon,
  Loader2Icon,
  PhoneIcon,
  SearchIcon,
  Trash2Icon,
  UserIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { SeoHead } from '@/components/seo/SeoHead'
import { contactMessagesApi, type ContactMessageResponse } from '@/features/content/contact-messages-api'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'

export default function AdminContactMessagesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageResponse | null>(null)
  const messagesQuery = useQuery({ queryKey: queryKeys.admin.contactMessages({}), queryFn: () => contactMessagesApi.adminList() })
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => contactMessagesApi.adminUpdateStatus(id, status),
    onSuccess: () => { toast.success('Message status updated'); void queryClient.invalidateQueries({ queryKey: queryKeys.admin.contactMessages({}) }); setSelectedMessage(null) },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactMessagesApi.adminDelete(id),
    onSuccess: () => { toast.success('Message removed'); void queryClient.invalidateQueries({ queryKey: queryKeys.admin.contactMessages({}) }); setSelectedMessage(null) },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })
  const messages = messagesQuery.data?.content ?? []
  const searchTerm = search.toLowerCase()
  const filtered = messages.filter((message) => [message.fullName, message.email, message.subject, message.message].some((value) => (value ?? '').toLowerCase().includes(searchTerm)))

  return (
    <>
      <SeoHead title="Contact Messages" description="View and respond to inquiries from website visitors." />
      <div className="flex flex-col gap-6 p-6">
        <div className="border-b border-border pb-5"><h1 className="flex items-center gap-2 text-2xl font-bold"><MailIcon className="size-6 text-primary" />Contact Messages Inbox</h1><p className="mt-1 text-sm text-muted-foreground">Review inquiries submitted through the church website.</p></div>
        <Card><CardHeader className="pb-3"><div className="relative max-w-md"><SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input type="search" placeholder="Search messages by sender, email or subject..." value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" /></div></CardHeader><CardContent>
          {messagesQuery.isPending ? <div className="flex justify-center py-12"><Loader2Icon className="size-6 animate-spin text-primary" /></div> : messagesQuery.isError ? <div className="py-12 text-center text-destructive">Unable to load messages: {normaliseApiError(messagesQuery.error).message}</div> : filtered.length === 0 ? <p className="py-12 text-center font-medium text-foreground">No messages found</p> : <div className="divide-y divide-border/60">{filtered.map((item) => <div key={item.id} onClick={() => setSelectedMessage(item)} className="flex cursor-pointer items-center justify-between gap-4 py-4"><div className="min-w-0 flex-1"><div className="mb-1 flex items-center gap-2"><h3 className="text-sm font-semibold text-foreground">{item.fullName}</h3><Badge variant={item.status === 'NEW' ? 'warning' : item.status === 'REPLIED' ? 'success' : 'outline'}>{item.status}</Badge></div><p className="text-xs font-medium">{item.subject || 'No subject'}</p><p className="line-clamp-1 text-xs text-muted-foreground">{item.message}</p><span className="text-[11px] text-muted-foreground">{item.email} · {new Date(item.createdAt).toLocaleString()}</span></div><Button variant="outline" size="sm" onClick={(event) => { event.stopPropagation(); setSelectedMessage(item) }}>Read Message</Button></div>)}</div>}
        </CardContent></Card>
      </div>
      <Dialog open={selectedMessage !== null} onOpenChange={(open) => !open && setSelectedMessage(null)}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle className="flex items-center gap-2"><MailIcon className="size-5 text-primary" />{selectedMessage?.subject || 'Contact message'}</DialogTitle><DialogDescription>Message received from {selectedMessage?.fullName}.</DialogDescription></DialogHeader>{selectedMessage && <div className="flex flex-col gap-4 py-2"><div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><UserIcon className="size-3.5 text-primary" />{selectedMessage.fullName}</span>{selectedMessage.phone && <span className="flex items-center gap-1"><PhoneIcon className="size-3.5" />{selectedMessage.phone}</span>}<span className="flex items-center gap-1"><ClockIcon className="size-3.5" />{new Date(selectedMessage.createdAt).toLocaleString()}</span></div><div className="whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed">{selectedMessage.message}</div><div className="flex items-center justify-between gap-3 pt-2"><Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => deleteMutation.mutate(selectedMessage.id)} disabled={deleteMutation.isPending}><Trash2Icon className="mr-1.5 size-4" />Delete</Button>{selectedMessage.status !== 'REPLIED' && <Button size="sm" onClick={() => updateMutation.mutate({ id: selectedMessage.id, status: 'REPLIED' })} disabled={updateMutation.isPending} className="bg-emerald-600 text-white hover:bg-emerald-700"><CheckCircle2Icon className="mr-1.5 size-4" />Mark as Replied</Button>}</div></div>}</DialogContent></Dialog>
    </>
  )
}
