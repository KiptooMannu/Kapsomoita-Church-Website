import { HeartHandshakeIcon, InfoIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { SeoHead } from '@/components/seo/SeoHead'
export default function AdminMinistriesPage() {
  return (
    <>
      <SeoHead title="Ministries Directory" description="View church ministry information." />
      <div className="flex flex-col gap-6 p-6">
        <div className="border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Church Life</span>
              <span>•</span>
              <span className="text-primary font-bold">Ministries Directory</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1 flex items-center gap-2">
              <HeartHandshakeIcon className="size-6 text-primary" />
              Ministries Manager
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ministry details are maintained in the current public site configuration.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center"><InfoIcon className="mb-3 size-10 text-muted-foreground opacity-60" /><p className="font-medium text-foreground">Ministry administration is unavailable</p><p className="mt-1 max-w-md text-sm text-muted-foreground">The backend does not currently provide a ministries list or CRUD endpoint, so this screen is read-only and does not show demo records.</p></CardContent>
        </Card>
      </div>
    </>
  )
}
