import { CheckCircle2Icon, Loader2Icon, MailIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiPost, normaliseApiError } from '@/lib/api/client'
import { site } from '@/config/site'
import { cn } from '@/lib/utils'

/**
 * Newsletter signup.
 *
 * Posts to `/api/newsletter/subscribe`, which is allow-listed as public in
 * `SecurityConfig` but **not yet implemented** — there is no handler, so it will
 * return 404 until the newsletter module lands.
 *
 * Rather than pretend, a 404 or 501 is treated as "not available yet" and the
 * visitor is offered the church's email address instead. That way the section is
 * useful now and needs no change once the endpoint exists.
 */
export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'subscribed'>('idle')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return

    setStatus('submitting')
    try {
      await apiPost<{ message: string }>('/newsletter/subscribe', { email: trimmed })
      setStatus('subscribed')
      setEmail('')
      toast.success('Thank you — you are on the list.')
    } catch (error) {
      const { status: httpStatus, message } = normaliseApiError(error)

      // The endpoint does not exist yet. Say so honestly and give the visitor a
      // route that does work, instead of a misleading "something went wrong".
      if (httpStatus === 404 || httpStatus === 501) {
        toast.info(
          `Our newsletter signup is not live yet. Please email ${site.contact.email} and we will add you.`,
          { duration: 8000 },
        )
      } else {
        toast.error(message)
      }
      setStatus('idle')
    }
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="bg-primary text-primary-foreground py-16 sm:py-20"
    >
      <div className="container-page">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-3">
            <span className="flex size-12 items-center justify-center rounded-xl bg-white/15">
              <MailIcon className="size-6" aria-hidden="true" />
            </span>

            <h2 id="newsletter-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
              Stay connected
            </h2>
            <p className="text-primary-foreground/85 max-w-md text-base leading-relaxed">
              Get service reminders, event news and encouragement from the church, straight
              to your inbox. No more than one email a week.
            </p>
          </div>

          {status === 'subscribed' ? (
            <div
              role="status"
              className="flex items-center gap-3 rounded-xl bg-white/15 p-5 backdrop-blur-sm"
            >
              <CheckCircle2Icon className="size-6 shrink-0" aria-hidden="true" />
              <p className="text-sm font-medium">
                You are subscribed. Watch your inbox for our next update.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
              <Label htmlFor="newsletter-email" className="text-primary-foreground/90">
                Email address
              </Label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  id="newsletter-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className={cn(
                    'border-white/25 bg-white/15 text-white placeholder:text-white/55',
                    'focus-visible:border-white focus-visible:ring-white/40',
                  )}
                />

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  disabled={status === 'submitting'}
                  className="shrink-0"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2Icon className="animate-spin" aria-hidden="true" />
                      Subscribing…
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </div>

              <p className="text-primary-foreground/65 text-xs">
                We will never share your address. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
