import { useState } from 'react'
import {
  CheckCircle2Icon,
  ClockIcon,
  MailIcon,
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

interface ContactMessageItem {
  id: string
  fullName: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'UNREAD' | 'READ' | 'REPLIED'
  createdAt: string
}

const INITIAL_MESSAGES: ContactMessageItem[] = [
  {
    id: '1',
    fullName: 'David Kiprono',
    email: 'david.kiprono@gmail.com',
    phone: '+254 712 345 678',
    subject: 'Inquiry about Sunday Service Times',
    message: 'Hello, I would like to know if there is a youth service during the second service on Sunday. Thank you!',
    status: 'UNREAD',
    createdAt: '2026-07-29T10:30:00Z',
  },
  {
    id: '2',
    fullName: 'Sarah Chemutai',
    email: 'sarah.c@yahoo.com',
    phone: '+254 722 987 654',
    subject: 'Joining Women Fellowship',
    message: 'Praise God! I recently moved to Kapsomoita and would love to register for the Wednesday Women Fellowship.',
    status: 'READ',
    createdAt: '2026-07-28T14:15:00Z',
  },
]

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageItem[]>(INITIAL_MESSAGES)
  const [search, setSearch] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null)

  const handleOpenMessage = (msg: ContactMessageItem) => {
    setSelectedMessage(msg)
    if (msg.status === 'UNREAD') {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: 'READ' } : m)),
      )
    }
  }

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
    toast.success('Message removed')
    setSelectedMessage(null)
  }

  const handleMarkReplied = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'REPLIED' } : m)),
    )
    toast.success('Marked as Replied')
    if (selectedMessage) {
      setSelectedMessage((prev) => (prev ? { ...prev, status: 'REPLIED' } : null))
    }
  }

  const filtered = messages.filter(
    (m) =>
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
      <SeoHead title="Contact Messages" description="View and respond to inquiries from website visitors." />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>People</span>
              <span>•</span>
              <span className="text-primary font-bold">Inquiries</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1 flex items-center gap-2">
              <MailIcon className="size-6 text-primary" />
              Contact Messages Inbox
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Read and manage incoming website contact form submissions and inquiries.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search messages by sender name, email or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>

          <CardContent>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <MailIcon className="size-10 mb-3 opacity-40" />
                <p className="font-medium text-foreground">No messages found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Incoming contact submissions from the website will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenMessage(item)}
                    className="py-4 cursor-pointer hover:bg-muted/30 px-3 rounded-lg transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
                        <MailIcon className="size-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground text-sm">{item.fullName}</h3>
                          <Badge
                            variant={
                              item.status === 'UNREAD'
                                ? 'warning'
                                : item.status === 'REPLIED'
                                  ? 'success'
                                  : 'outline'
                            }
                            className="text-[10px] px-2 py-0.2"
                          >
                            {item.status}
                          </Badge>
                        </div>

                        <p className="text-xs font-medium text-foreground/90">{item.subject}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.message}</p>

                        <div className="flex items-center gap-4 text-[11px] text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <MailIcon className="size-3" />
                            {item.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="size-3" />
                            {new Date(item.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenMessage(item); }}>
                        Read Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Message Reader Dialog */}
      <Dialog open={selectedMessage !== null} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MailIcon className="size-5 text-primary" />
              {selectedMessage?.subject}
            </DialogTitle>
            <DialogDescription>
              From: <span className="font-semibold text-foreground">{selectedMessage?.fullName}</span> ({selectedMessage?.email})
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg">
                <span className="flex items-center gap-1">
                  <UserIcon className="size-3.5 text-primary" />
                  {selectedMessage.fullName}
                </span>
                {selectedMessage.phone && (
                  <span className="flex items-center gap-1">
                    <PhoneIcon className="size-3.5 text-muted-foreground" />
                    {selectedMessage.phone}
                  </span>
                )}
                <span className="flex items-center gap-1 font-mono">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-muted-foreground mb-1 block">Message Content:</span>
                <div className="p-4 bg-muted/30 border border-border rounded-lg text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(selectedMessage.id)}
                >
                  <Trash2Icon className="mr-1.5 size-4" />
                  Delete
                </Button>

                {selectedMessage.status !== 'REPLIED' && (
                  <Button
                    size="sm"
                    onClick={() => handleMarkReplied(selectedMessage.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle2Icon className="mr-1.5 size-4" />
                    Mark as Replied
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
