import { useState, useEffect } from 'react'
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  RefreshCwIcon,
  CheckCircle2Icon,
  ClockIcon,
  FileTextIcon,
  Loader2Icon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SeoHead } from '@/components/seo/SeoHead'
import { HomepageItemForm } from '@/components/admin/HomepageItemForm'
import {
  getAdminHomepageItems,
  type HomepageItem,
} from '@/lib/api/homepage'
import { normaliseApiError } from '@/lib/api/client'

interface AdminGenericModulePageProps {
  title: string
  description: string
  category: string
  entityName: string
}

export function AdminGenericModulePage({
  title,
  description,
  category,
  entityName,
}: AdminGenericModulePageProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [items, setItems] = useState<HomepageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<HomepageItem | null>(null)

  useEffect(() => {
    loadHomepageItems()
  }, [])

  const loadHomepageItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAdminHomepageItems()
      setItems(data)
    } catch (err) {
      const apiError = normaliseApiError(err)
      setError(apiError.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && item.status === 'PUBLISHED') ||
      (statusFilter === 'draft' && item.status === 'DRAFT')
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: items.length,
    published: items.filter((i) => i.status === 'PUBLISHED').length,
    drafts: items.filter((i) => i.status === 'DRAFT').length,
  }

  return (
    <>
      <SeoHead title={title} description={description} />

      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>{category}</span>
              <span>•</span>
              <span className="text-primary">Active Module</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={loadHomepageItems} disabled={loading}>
              {loading ? (
                <Loader2Icon className="mr-2 size-4 animate-spin" />
              ) : (
                <RefreshCwIcon className="mr-2 size-4" />
              )}
              Refresh
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setEditingItem(null)
                setFormOpen(true)
              }}
            >
              <PlusIcon className="mr-2 size-4" />
              Add {entityName}
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total {title}
              </CardTitle>
              <FileTextIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Active in platform database</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published & Public
              </CardTitle>
              <CheckCircle2Icon className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{loading ? '...' : stats.published}</div>
              <p className="text-xs text-muted-foreground mt-1">Live on public website</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Drafts & Scheduled
              </CardTitle>
              <ClockIcon className="size-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{loading ? '...' : stats.drafts}</div>
              <p className="text-xs text-muted-foreground mt-1">Pending review or release</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls: Search and Filters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={`Search ${title.toLowerCase()}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex items-center gap-2">
                <FilterIcon className="size-4 text-muted-foreground" />
                <div className="flex rounded-lg border border-border p-1 bg-muted/40 text-xs">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      statusFilter === 'all'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('published')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      statusFilter === 'published'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('draft')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      statusFilter === 'draft'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Drafts
                  </button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Active Data Management View */}
            <div className="rounded-md border border-border overflow-hidden">
              <div className="bg-muted/50 px-4 py-3 text-xs font-semibold text-muted-foreground grid grid-cols-12 gap-4">
                <div className="col-span-5">TITLE / ITEM</div>
                <div className="col-span-3">CATEGORY / TAG</div>
                <div className="col-span-2">STATUS</div>
                <div className="col-span-2 text-right">ACTIONS</div>
              </div>

              <div className="divide-y divide-border bg-card">
                {loading ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    <Loader2Icon className="mx-auto size-6 animate-spin mb-2" />
                    Loading homepage items...
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No homepage items found. Create your first item to get started.
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-3 text-sm grid grid-cols-12 gap-4 items-center hover:bg-muted/30 transition-colors"
                    >
                      <div className="col-span-5 font-medium text-foreground">
                        {item.title}
                        <div className="text-xs text-muted-foreground font-normal">
                          Updated {new Date(item.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="col-span-3 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="font-normal">
                          {item.categoryLabel}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <Badge
                          variant={item.status === 'PUBLISHED' ? 'success' : 'gold'}
                          className={
                            item.status === 'PUBLISHED'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20'
                          }
                        >
                          {item.statusLabel}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => {
                            setEditingItem(item)
                            setFormOpen(true)
                          }}
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Homepage Item Form Dialog */}
        <HomepageItemForm
          open={formOpen}
          onOpenChange={setFormOpen}
          item={editingItem}
          onSuccess={loadHomepageItems}
        />
      </div>
    </>
  )
}
