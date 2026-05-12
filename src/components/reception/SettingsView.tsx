import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table'

const TABS = [
  'General',
  'Slot Configuration',
  'Services',
  'Notifications',
  'Users',
  'Branding',
  'Security',
]

export const SettingsView = ({ activeTab = 'General' }: { activeTab?: string }) => (
  <div x-data={`{ tab: '${activeTab}' }`}>
    {/* Tab nav */}
    <div class="flex gap-1 bg-muted rounded-xl p-1 mb-6 overflow-x-auto">
      {TABS.map((t) => (
        <button
          key={t}
          type="button"
          x-on:click={`tab = '${t}'`}
          x-bind:class={`tab === '${t}' ? 'bg-card shadow text-foreground' : 'text-foreground-muted hover:text-foreground'`}
          class="px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all"
        >
          {t}
        </button>
      ))}
    </div>

    {/* General */}
    <div x-show={`tab === 'General'`} class="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle class="font-semibold text-foreground text-base">General Settings</CardTitle>
        </CardHeader>
        <CardContent class="space-y-5">
          {[
            { label: 'Depot Name', name: 'depotName', value: 'Glido CFS Terminal 1', type: 'text' },
            { label: 'Depot Address', name: 'address', value: 'Port Qasim, Karachi', type: 'text' },
            { label: 'Contact Email', name: 'contactEmail', value: 'ops@glido.pk', type: 'email' },
            { label: 'Contact Phone', name: 'phone', value: '021-3456789', type: 'tel' },
            { label: 'Operating Hours', name: 'hours', value: '07:00 – 18:00', type: 'text' },
          ].map((f) => (
            <div key={f.name}>
              <label class="block text-sm font-medium text-foreground mb-1.5">{f.label}</label>
              <Input type={f.type} value={f.value} class="w-full" />
            </div>
          ))}
          <div class="pt-2">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Slot Configuration */}
    <div x-show={`tab === 'Slot Configuration'`} class="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle class="font-semibold text-foreground text-base">Slot Configuration</CardTitle>
        </CardHeader>
        <CardContent class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            {[
              { label: 'Default Slot Duration (min)', name: 'slotDuration', value: '60' },
              { label: 'Max Capacity per Slot', name: 'capacity', value: '5' },
              { label: 'Booking Window (days)', name: 'window', value: '7' },
              { label: 'Hold Duration (min)', name: 'holdDuration', value: '10' },
              { label: 'First Slot', name: 'firstSlot', value: '07:00' },
              { label: 'Last Slot', name: 'lastSlot', value: '17:00' },
            ].map((f) => (
              <div key={f.name}>
                <label class="block text-sm font-medium text-foreground mb-1.5">{f.label}</label>
                <Input type="text" value={f.value} class="w-full" />
              </div>
            ))}
          </div>
          <div class="pt-2">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Services */}
    <div x-show={`tab === 'Services'`} class="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle class="font-semibold text-foreground text-base">Enabled Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            {[
              { label: 'Import — FCL', enabled: true },
              { label: 'Import — LCL', enabled: true },
              { label: 'Import — Breakbulk', enabled: true },
              { label: 'Export — FCL', enabled: true },
              { label: 'Export — LCL', enabled: true },
              { label: 'Export — Breakbulk', enabled: false },
              { label: 'Transshipment — FCL', enabled: true },
              { label: 'Transshipment — LCL', enabled: false },
            ].map((s) => (
              <label key={s.label} class="flex items-center justify-between py-2.5 border-b border-border last:border-0 cursor-pointer">
                <span class="text-sm text-foreground">{s.label}</span>
                <input type="checkbox" checked={s.enabled} class="w-4 h-4 text-primary rounded" />
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Notifications */}
    <div x-show={`tab === 'Notifications'`} class="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle class="font-semibold text-foreground text-base">Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            {[
              { label: 'Booking confirmation email', enabled: true },
              { label: '24-hour reminder email', enabled: true },
              { label: '2-hour reminder SMS', enabled: false },
              { label: 'Check-in confirmation', enabled: true },
              { label: 'No-show alert to admin', enabled: true },
              { label: 'Slot hold expiry warning', enabled: true },
            ].map((n) => (
              <label key={n.label} class="flex items-center justify-between py-2.5 border-b border-border last:border-0 cursor-pointer">
                <span class="text-sm text-foreground">{n.label}</span>
                <input type="checkbox" checked={n.enabled} class="w-4 h-4 text-primary rounded" />
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Users */}
    <div x-show={`tab === 'Users'`} class="max-w-2xl">
      <Card class="overflow-hidden">
        <CardHeader>
          <CardTitle class="font-semibold text-foreground">Team Members</CardTitle>
          <div class="col-start-2 row-start-1 justify-self-end">
            <Button variant="outline" size="sm">+ Invite</Button>
          </div>
        </CardHeader>
        <CardContent class="px-0 pb-0">
          <Table>
            <TableBody>
              {[
                { name: 'Admin User', email: 'admin@glido.pk', role: 'Admin', status: 'Active' },
                { name: 'Reception Agent', email: 'reception@glido.pk', role: 'Reception', status: 'Active' },
                { name: 'Supervisor', email: 'supervisor@glido.pk', role: 'Supervisor', status: 'Active' },
              ].map((u) => (
                <TableRow key={u.email}>
                  <TableCell class="px-5 py-3.5">
                    <p class="font-medium text-foreground">{u.name}</p>
                    <p class="text-xs text-foreground-muted">{u.email}</p>
                  </TableCell>
                  <TableCell class="px-4 py-3.5">
                    <Badge variant="default">{u.role}</Badge>
                  </TableCell>
                  <TableCell class="px-4 py-3.5">
                    <Badge variant="success">{u.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>

    {/* Branding */}
    <div x-show={`tab === 'Branding'`} class="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle class="font-semibold text-foreground text-base">Branding</CardTitle>
        </CardHeader>
        <CardContent class="space-y-5">
          {[
            { label: 'Platform Name', name: 'name', value: 'Glido', type: 'text' },
            { label: 'Tagline', name: 'tagline', value: 'CFS Depot Management Platform', type: 'text' },
            { label: 'Primary Colour', name: 'primaryColor', value: '#1d4ed8', type: 'color' },
            { label: 'Support Email', name: 'supportEmail', value: 'support@glido.pk', type: 'email' },
          ].map((f) => (
            <div key={f.name}>
              <label class="block text-sm font-medium text-foreground mb-1.5">{f.label}</label>
              <Input type={f.type || 'text'} value={f.value} class="w-full" />
            </div>
          ))}
          <div class="pt-2">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Security */}
    <div x-show={`tab === 'Security'`} class="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle class="font-semibold text-foreground text-base">Security Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            {[
              { label: 'Require 2FA for admin login', enabled: false },
              { label: 'Session timeout after inactivity (30 min)', enabled: true },
              { label: 'Log all reception actions', enabled: true },
              { label: 'Allow public booking without login', enabled: true },
              { label: 'Rate-limit booking submissions', enabled: true },
            ].map((s) => (
              <label key={s.label} class="flex items-center justify-between py-2.5 border-b border-border last:border-0 cursor-pointer">
                <span class="text-sm text-foreground">{s.label}</span>
                <input type="checkbox" checked={s.enabled} class="w-4 h-4 text-primary rounded" />
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)
