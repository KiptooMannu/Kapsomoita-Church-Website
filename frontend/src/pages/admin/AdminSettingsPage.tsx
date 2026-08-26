import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2Icon, SettingsIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { churchSettingsApi, type ChurchSettingRequest, type ChurchSettingResponse } from '@/features/content/church-settings-api'
import { normaliseApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-client'
import { SeoHead } from '@/components/seo/SeoHead'
import { useAuth } from '@/features/auth/useAuth'

const emptyForm: ChurchSettingRequest = { settingKey: '', settingValue: '', valueType: 'STRING', category: 'General', label: '', description: '', publicSetting: false, sortOrder: 0 }

export default function AdminSettingsPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = useAuth()
  const settingsQuery = useQuery({ queryKey: queryKeys.admin.churchSettings({}), queryFn: () => churchSettingsApi.adminList() })
  const [form, setForm] = useState<ChurchSettingRequest>(emptyForm)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const canCreate = hasPermission('church_setting:create')
  const canUpdate = hasPermission('church_setting:update')
  const canDelete = hasPermission('church_setting:delete')
  const canWrite = editingKey ? canUpdate : canCreate

  const updateField = <K extends keyof ChurchSettingRequest>(key: K, value: ChurchSettingRequest[K]) => setForm((current) => ({ ...current, [key]: value }))
  const reset = () => { setEditingKey(null); setForm(emptyForm) }

  const saveMutation = useMutation({
    mutationFn: () => editingKey ? churchSettingsApi.adminUpdate(editingKey, form) : churchSettingsApi.adminCreate(form),
    onSuccess: () => { toast.success(editingKey ? 'Setting updated' : 'Setting created'); void queryClient.invalidateQueries({ queryKey: queryKeys.admin.churchSettings({}) }); void queryClient.invalidateQueries({ queryKey: queryKeys.public.settings }); reset() },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })
  const deleteMutation = useMutation({
    mutationFn: (key: string) => churchSettingsApi.adminDelete(key),
    onSuccess: () => { toast.success('Setting deleted'); void queryClient.invalidateQueries({ queryKey: queryKeys.admin.churchSettings({}) }); void queryClient.invalidateQueries({ queryKey: queryKeys.public.settings }) },
    onError: (error) => toast.error(normaliseApiError(error).message),
  })

  const edit = (setting: ChurchSettingResponse) => { setEditingKey(setting.settingKey); setForm({ settingKey: setting.settingKey, settingValue: setting.settingValue ?? '', valueType: setting.valueType, category: setting.category, label: setting.label, description: setting.description ?? '', publicSetting: setting.publicSetting, sortOrder: setting.sortOrder }) }
  const settings = settingsQuery.data ?? []
  const busy = saveMutation.isPending || deleteMutation.isPending

  return (
    <>
      <SeoHead title="Church Settings Administration — Kapsomoita AGC" />
      <div className="space-y-6">
        <div><h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight"><SettingsIcon className="size-6 text-primary" />Church Settings</h1><p className="text-sm text-muted-foreground">Manage organization details and public website preferences.</p></div>
        {settingsQuery.isPending ? <div className="flex justify-center p-12"><Loader2Icon className="size-8 animate-spin text-primary" /></div> : settingsQuery.isError ? <Card><CardContent className="p-6 text-destructive">{normaliseApiError(settingsQuery.error).message}</CardContent></Card> : (
          <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
            <Card><CardHeader><h2 className="font-semibold">Saved settings</h2><p className="text-sm text-muted-foreground">Select a setting to edit it.</p></CardHeader><CardContent className="space-y-2">{settings.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No settings found.</p> : settings.map((setting) => <div key={setting.settingKey} className="flex items-center justify-between gap-3 rounded-lg border p-3"><div className="min-w-0"><p className="font-medium">{setting.label}</p><p className="truncate text-xs text-muted-foreground">{setting.settingKey}: {setting.settingValue || 'Empty'}</p></div><Button variant="outline" size="sm" onClick={() => edit(setting)} disabled={!canUpdate || busy}>Edit</Button></div>)}</CardContent></Card>
            <Card><CardHeader><h2 className="font-semibold">{editingKey ? 'Edit setting' : 'Add setting'}</h2><p className="text-sm text-muted-foreground">Write access is controlled by your assigned permission.</p></CardHeader><CardContent className="space-y-4"><div><Label htmlFor="setting-key">Key</Label><Input id="setting-key" value={form.settingKey} onChange={(e) => updateField('settingKey', e.target.value)} disabled={Boolean(editingKey) || !canWrite || busy} /></div><div><Label htmlFor="setting-label">Label</Label><Input id="setting-label" value={form.label} onChange={(e) => updateField('label', e.target.value)} disabled={!canWrite || busy} /></div><div><Label htmlFor="setting-value">Value</Label><Textarea id="setting-value" value={form.settingValue ?? ''} onChange={(e) => updateField('settingValue', e.target.value)} disabled={!canWrite || busy} /></div><div><Label htmlFor="setting-category">Category</Label><Input id="setting-category" value={form.category ?? ''} onChange={(e) => updateField('category', e.target.value)} disabled={!canWrite || busy} /></div><div><Label htmlFor="setting-description">Description</Label><Textarea id="setting-description" value={form.description ?? ''} onChange={(e) => updateField('description', e.target.value)} disabled={!canWrite || busy} /></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.publicSetting)} onChange={(e) => updateField('publicSetting', e.target.checked)} disabled={!canWrite || busy} /> Expose on the public website</label><div className="flex justify-end gap-2"><Button variant="outline" onClick={reset} disabled={busy}>Clear</Button><Button onClick={() => saveMutation.mutate()} disabled={!canWrite || busy || !form.settingKey || !form.label}>{saveMutation.isPending && <Loader2Icon className="size-4 animate-spin" />}Save</Button></div>{editingKey && canDelete && <Button variant="ghost" className="w-full text-destructive" onClick={() => deleteMutation.mutate(editingKey)} disabled={busy}><Trash2Icon className="size-4" />Delete setting</Button>}</CardContent></Card>
          </div>
        )}
      </div>
    </>
  )
}
