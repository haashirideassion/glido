import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table'
import { Badge } from '../ui/badge'
import { Icon, ICONS } from '../../lib/Icon'
import { STATUS_LABEL, STATUS_BADGE_VARIANT, SERVICE_LABEL, LOAD_LABEL, ICS_LABEL, ICS_BADGE_CLASS } from '../../lib/constants'
import type { Booking } from '../../data/types'

interface Props {
  bookings:    Booking[]
  title?:      string
  showFilters?: boolean
  page?:       number
  totalPages?: number
  totalCount?: number
  currentDate?: string   // dashboard date picker
}

type StatusVariant = 'warning' | 'default' | 'success' | 'secondary' | 'outline' | 'destructive'

// ─── Shared filter include string ─────────────────────────────────────────────
const HX_INCLUDE = "[name='status'],[name='service'],[name='loadType'],[name='date'],[name='search']"

const INPUT_STYLE = "font-size:13px; border-radius:8px; padding:8px 14px; outline:none; background:#FFFFFF; border:1px solid rgba(0,0,0,0.12); color:#1C1917;"

// ─── Custom filter dropdown — replaces <select> to avoid iOS native picker ───
interface SelectOpt { value: string; label: string }

const FilterSelect = ({ name, uid, placeholder, options }: {
  name: string; uid: string; placeholder: string; options: SelectOpt[]
}) => {
  const inputId = `fsel-${uid}`
  const allOpts = [{ value: '', label: placeholder }, ...options]
  return (
    <div
      x-data={`{ open: false, val: '', lbl: '${placeholder}' }`}
      style="position:relative; flex-shrink:0;"
      {...{"x-on:click.outside": "open = false"}}
    >
      {/* Hidden input — picked up by hx-include */}
      <input type="hidden" name={name} id={inputId} />

      {/* Pill trigger */}
      <button
        type="button"
        x-on:click="open = !open"
        style="display:inline-flex; align-items:center; gap:8px; font-size:13px; padding:8px 12px 8px 14px; border-radius:8px; cursor:pointer; white-space:nowrap; outline:none; transition:all 0.12s ease;"
        {...{"x-bind:style": "{background:val!==''?'rgba(252,101,20,0.07)':'#FFFFFF','border-width':'1px','border-style':'solid','border-color':val!==''?'rgba(252,101,20,0.30)':'rgba(0,0,0,0.12)',color:val!==''?'#FC6514':'#1C1917'}"}}
      >
        <span x-text="lbl">{placeholder}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style="flex-shrink:0; opacity:0.55; transition:transform 0.15s ease;"
          {...{"x-bind:style": "open?'transform:rotate(180deg)':'transform:rotate(0deg)'"}}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      {/* Dropdown panel */}
      <div
        x-show="open"
        x-cloak
        style="position:absolute; top:calc(100% + 5px); left:0; z-index:300; min-width:160px; background:#FFFFFF; border:1px solid rgba(0,0,0,0.09); border-radius:12px; box-shadow:0 8px 28px rgba(0,0,0,0.11), 0 2px 6px rgba(0,0,0,0.06); padding:5px;"
        {...{"x-on:keydown.escape.window": "open = false"}}
      >
        {allOpts.map((opt) => (
          <button
            key={opt.value || '__all__'}
            type="button"
            class="fsel-opt"
            x-on:click={`val='${opt.value}';lbl='${opt.label}';document.getElementById('${inputId}').value='${opt.value}';open=false;htmx.trigger(document.getElementById('filter-htmx-trigger'),'filter:change')`}
            {...{"x-bind:class": `{ 'fsel-active': val==='${opt.value}' }`}}
          >
            {/* Fixed-size checkmark slot — reserves space so layout never shifts */}
            <span style="width:16px; height:16px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;">
              <svg x-show={`val==='${opt.value}'`} width="11" height="11" viewBox="0 0 12 12" fill="none" style="display:block;">
                <path d="M2 6L4.5 8.5 10 3" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export const PAGE_SIZE = 15

// ─── Is this scheduled booking starting within 15 minutes? ───────────────────
function isUpcomingSoon(slotDate: string, slotStartTime: string, status: string): boolean {
  if (status !== 'scheduled') return false
  const now  = new Date()
  const slot = new Date(`${slotDate}T${slotStartTime}:00`)
  const diff = slot.getTime() - now.getTime()
  return diff > 0 && diff <= 15 * 60 * 1000
}

// ─── Pagination strip ─────────────────────────────────────────────────────────
function pageWindow(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (current > 3) pages.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p)
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}

const BTN = "display:inline-flex; align-items:center; justify-content:center; min-width:30px; height:30px; padding:0 8px; border-radius:8px; font-size:12px; font-weight:500; border:1px solid transparent; transition:all 0.12s ease; background:transparent;"

const Pagination = ({ page, totalPages, totalCount }: { page: number; totalPages: number; totalCount: number }) => {
  const from  = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to    = Math.min(page * PAGE_SIZE, totalCount)
  const pages = pageWindow(page, totalPages)

  return (
    <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 20px; border-top:1px solid rgba(0,0,0,0.06); background:#FAFAF9; flex-shrink:0;">
      <span style="font-size:11px; color:#A8A29E;">
        {totalCount === 0
          ? 'No results'
          : totalPages <= 1
            ? `${totalCount} result${totalCount !== 1 ? 's' : ''}`
            : `Showing ${from}–${to} of ${totalCount}`}
      </span>
      {totalPages > 1 && (
        <div style="display:flex; align-items:center; gap:2px;">
          <button type="button"
            hx-get={`/reception/bookings?page=${page - 1}`}
            hx-target="#bookings-results" hx-swap="innerHTML" hx-include={HX_INCLUDE}
            disabled={page <= 1}
            style={page <= 1 ? BTN+"color:#D6D3D1;cursor:not-allowed;pointer-events:none;" : BTN+"color:#78716C;cursor:pointer;"}
            onmouseover={page > 1 ? "this.style.background='rgba(0,0,0,0.05)'" : undefined}
            onmouseout={page  > 1 ? "this.style.background='transparent'"      : undefined}
            title="Previous page"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>

          {pages.map((p, i) =>
            p === '…'
              ? <span key={`ell-${i}`} style="font-size:12px;color:#C7C3BF;padding:0 4px;user-select:none;">…</span>
              : (
                <button key={p} type="button"
                  hx-get={`/reception/bookings?page=${p}`}
                  hx-target="#bookings-results" hx-swap="innerHTML" hx-include={HX_INCLUDE}
                  style={p === page
                    ? BTN+"color:#FC6514;background:rgba(252,101,20,0.08);border-color:rgba(252,101,20,0.22);font-weight:700;cursor:default;"
                    : BTN+"color:#78716C;cursor:pointer;"}
                  onmouseover={p !== page ? "this.style.background='rgba(0,0,0,0.05)'" : undefined}
                  onmouseout={p  !== page ? "this.style.background='transparent'"      : undefined}
                >
                  {p}
                </button>
              )
          )}

          <button type="button"
            hx-get={`/reception/bookings?page=${page + 1}`}
            hx-target="#bookings-results" hx-swap="innerHTML" hx-include={HX_INCLUDE}
            disabled={page >= totalPages}
            style={page >= totalPages ? BTN+"color:#D6D3D1;cursor:not-allowed;pointer-events:none;" : BTN+"color:#78716C;cursor:pointer;"}
            onmouseover={page < totalPages ? "this.style.background='rgba(0,0,0,0.05)'" : undefined}
            onmouseout={page  < totalPages ? "this.style.background='transparent'"      : undefined}
            title="Next page"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      )}
    </div>
  )
}

// ─── CSV export onclick ───────────────────────────────────────────────────────
const CSV_ONCLICK = `(function(){
  var p=new URLSearchParams();
  ['status','service','loadType','date','search'].forEach(function(n){
    var el=document.querySelector('[name="'+n+'"]');
    if(el&&el.value)p.set(n,el.value);
  });
  window.open('/reception/bookings/export?'+p.toString(),'_blank');
})()`

// ─── Rows + pagination fragment — returned for HTMX filter/page requests ─────
export const BookingTableBody = ({
  bookings,
  page       = 1,
  totalPages,
  totalCount,
}: {
  bookings:   Booking[]
  page?:      number
  totalPages?: number
  totalCount?: number
}) => {
  const count     = totalCount ?? bookings.length
  const paginated = totalPages !== undefined

  if (bookings.length === 0) {
    return (
      <>
        <div style="text-align:center; padding:48px 0; color:#A8A29E;">
          <Icon name={ICONS.bookings} size={36} style="margin:0 auto 10px; opacity:0.25;" />
          <p style="font-size:13px;">No bookings match your filters.</p>
        </div>
        {paginated && <Pagination page={1} totalPages={0} totalCount={0} />}
      </>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow style="background:#F7F6F5; border-bottom:1px solid rgba(0,0,0,0.07);">
            {['Reference','Driver','Slot','Service','HBL','ICS','Status',''].map((h) => (
              <TableHead key={h} class="text-left px-5 py-3"
                style="font-size:10px; font-weight:700; color:#78716C; text-transform:uppercase; letter-spacing:0.08em; white-space:nowrap;"
              >{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody style="border-top:none;">
          {bookings.map((b) => {
            // Row background priority: ICS held > checked-in > completed > upcoming < 15 min
            let rowBg = ''
            if (b.icsStatus === 'held') {
              rowBg = 'rgba(239,68,68,0.05)'
            } else if (b.status === 'checked_in') {
              rowBg = 'rgba(34,197,94,0.04)'
            } else if (b.status === 'completed') {
              rowBg = 'rgba(0,0,0,0.01)'
            } else if (isUpcomingSoon(b.slotDate, b.slotStartTime, b.status)) {
              rowBg = 'rgba(251,191,36,0.07)'
            }

            const checkedInTime = b.checkedInAt
              ? new Date(b.checkedInAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
              : null

            return (
              <TableRow
                key={b.id}
                style={`border-bottom:1px solid rgba(0,0,0,0.06); cursor:pointer; transition:background 0.12s ease;${rowBg ? ` background:${rowBg};` : ''}`}
                onmouseover={`this.style.background='rgba(252,101,20,0.03)'`}
                onmouseout={`this.style.background='${rowBg}'`}
                hx-get={`/reception/bookings/${b.id}`}
                hx-target="#slide-over-content"
                hx-swap="innerHTML"
                {...{"hx-on:htmx:after-request": "document.getElementById('slide-over-backdrop').classList.remove('hidden'); document.getElementById('slide-over').classList.remove('translate-x-full')"}}
              >
                <TableCell class="px-5 py-3.5" style="font-family:ui-monospace,monospace; font-size:12px; font-weight:700; color:#FC6514; white-space:nowrap;">
                  {b.referenceNumber}
                </TableCell>
                <TableCell class="px-4 py-3.5">
                  <p style="font-size:13px; font-weight:600; color:#1C1917;">{b.driverName}</p>
                  <p style="font-size:11px; color:#A8A29E;">{b.driverPhone || '—'}</p>
                </TableCell>
                <TableCell class="px-4 py-3.5">
                  <p style="font-size:13px; font-weight:600; color:#1C1917; white-space:nowrap;">{b.slotStartTime} – {b.slotEndTime}</p>
                  <p style="font-size:11px; color:#A8A29E;">{b.slotDate}</p>
                  {checkedInTime && (
                    <p style="font-size:10px; color:#22C55E; font-weight:600; margin-top:2px; display:flex; align-items:center; gap:3px;">
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6.5L4.5 9 10 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      In {checkedInTime}
                    </p>
                  )}
                  {isUpcomingSoon(b.slotDate, b.slotStartTime, b.status) && (
                    <p style="font-size:10px; color:#D97706; font-weight:600; margin-top:2px;">Soon</p>
                  )}
                </TableCell>
                <TableCell class="px-4 py-3.5" style="font-size:12px; font-weight:500; color:#78716C; white-space:nowrap;">
                  {SERVICE_LABEL[b.serviceType]} · {LOAD_LABEL[b.loadType]}
                </TableCell>
                <TableCell class="px-4 py-3.5" style="font-family:ui-monospace,monospace; font-size:12px; color:#78716C;">
                  {b.houseBillNumber || b.containerNumber || '—'}
                </TableCell>
                <TableCell class="px-4 py-3.5">
                  {b.icsStatus ? (
                    <span class={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${ICS_BADGE_CLASS[b.icsStatus]}`}>
                      {ICS_LABEL[b.icsStatus]}
                    </span>
                  ) : (
                    <span style="font-size:12px; color:#A8A29E;">—</span>
                  )}
                </TableCell>
                <TableCell class="px-4 py-3.5">
                  <Badge variant={STATUS_BADGE_VARIANT[b.status] as StatusVariant}>
                    {STATUS_LABEL[b.status]}
                  </Badge>
                </TableCell>
                <TableCell class="px-4 py-3.5" style="color:rgba(0,0,0,0.30);">
                  <Icon name={ICONS.arrowRight} size={16} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {paginated && <Pagination page={page} totalPages={totalPages!} totalCount={count} />}
    </>
  )
}

// ─── Full card — initial server render ───────────────────────────────────────
export const BookingTable = ({
  bookings,
  showFilters  = false,
  page,
  totalPages,
  totalCount,
  currentDate,
}: Props) => (
  <div
    class="rounded-xl overflow-hidden"
    style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.07); box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.07);"
  >
    {/* Dashboard date picker — shown when not in filter mode */}
    {!showFilters && currentDate !== undefined && (
      <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 20px; border-bottom:1px solid rgba(0,0,0,0.07); background:rgba(0,0,0,0.01);">
        <span style="font-size:12px; font-weight:600; color:#78716C;">Today's Bookings</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <input
            type="date"
            value={currentDate}
            style={INPUT_STYLE + "cursor:pointer;"}
            onchange="window.location.href='/reception?date='+this.value"
          />
          <button
            type="button"
            onclick="window.location.href='/reception'"
            style="font-size:12px; font-weight:500; color:#FC6514; background:rgba(252,101,20,0.07); border:1px solid rgba(252,101,20,0.20); border-radius:8px; padding:7px 12px; cursor:pointer; white-space:nowrap;"
          >Today</button>
        </div>
      </div>
    )}

    {/* Filter bar — static, never swapped */}
    {showFilters && (
      <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; padding:12px 20px; border-bottom:1px solid rgba(0,0,0,0.07); background:rgba(0,0,0,0.01);">

        {/* Left — filters */}
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; flex:1;">
          <span style="display:inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:600; color:#78716C; white-space:nowrap;">
            <Icon name={ICONS.filter} size={13} style="color:#A8A29E;" />
            Filters
          </span>

          {/* Shared HTMX trigger — fired programmatically by FilterSelect on change */}
          <span id="filter-htmx-trigger"
            hx-get="/reception/bookings"
            hx-target="#bookings-results"
            hx-swap="innerHTML"
            hx-include={HX_INCLUDE}
            hx-trigger="filter:change"
            style="display:none;"
          />

          <FilterSelect name="status" uid="status" placeholder="All Statuses" options={[
            { value: 'scheduled',  label: 'Scheduled'  },
            { value: 'checked_in', label: 'Checked In' },
            { value: 'completed',  label: 'Completed'  },
            { value: 'cancelled',  label: 'Cancelled'  },
          ]} />

          <FilterSelect name="service" uid="service" placeholder="All Services" options={[
            { value: 'pickup',  label: 'Pick Up'  },
            { value: 'dropoff', label: 'Drop Off' },
          ]} />

          <FilterSelect name="loadType" uid="load" placeholder="FCL + LCL" options={[
            { value: 'fcl', label: 'FCL only' },
            { value: 'lcl', label: 'LCL only' },
          ]} />

          <input
            type="date" name="date"
            hx-get="/reception/bookings" hx-target="#bookings-results" hx-swap="innerHTML" hx-include={HX_INCLUDE}
            hx-trigger="change"
            style={INPUT_STYLE}
          />
        </div>

        {/* Right — search + export + live indicator */}
        <div style="display:flex; align-items:center; gap:10px; flex-shrink:0;">
          <input
            type="text" name="search"
            placeholder="Search ref, driver, HBL…"
            hx-get="/reception/bookings" hx-target="#bookings-results" hx-swap="innerHTML" hx-include={HX_INCLUDE}
            hx-trigger="input changed delay:300ms"
            style={INPUT_STYLE + "min-width:200px;"}
          />

          {/* Export CSV */}
          <button
            type="button"
            onclick={CSV_ONCLICK}
            style="display:inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:500; color:#78716C; background:#FFFFFF; border:1px solid rgba(0,0,0,0.12); border-radius:8px; padding:8px 12px; cursor:pointer; white-space:nowrap; transition:background 0.12s ease, border-color 0.12s ease;"
            onmouseover="this.style.background='#F7F6F5'; this.style.borderColor='rgba(0,0,0,0.18)';"
            onmouseout="this.style.background='#FFFFFF'; this.style.borderColor='rgba(0,0,0,0.12)';"
            title="Export current filtered view as CSV"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            CSV
          </button>

          {/* Live / realtime indicator */}
          <span style="display:inline-flex; align-items:center; gap:5px; font-size:11px; color:#A8A29E; white-space:nowrap; user-select:none;">
            <span
              id="conn-dot"
              style="width:7px; height:7px; border-radius:50%; background:#22C55E; flex-shrink:0; transition:background 0.4s ease;"
            />
            Live
          </span>

          {/* Hidden HTMX heartbeat — fires every 30 s, updates the live dot */}
          <div
            id="refresh-heartbeat"
            hx-get="/reception/bookings"
            hx-target="#bookings-results"
            hx-swap="innerHTML"
            hx-include={HX_INCLUDE}
            hx-trigger="every 30s"
            style="display:none;"
            {...{
              "hx-on:htmx:before-request": "var d=document.getElementById('conn-dot');if(d)d.style.background='#FBBF24';",
              "hx-on:htmx:after-request":  "var d=document.getElementById('conn-dot');if(d)d.style.background=event.detail.successful?'#22C55E':'#EF4444';",
            }}
          />
        </div>
      </div>
    )}

    {/* Results area — only this div is swapped by HTMX filters / pagination */}
    <div style="overflow-x:auto;" id="bookings-results">
      <BookingTableBody
        bookings={bookings}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount ?? bookings.length}
      />
    </div>
  </div>
)
