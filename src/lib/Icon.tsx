interface IconProps {
  name: string
  size?: number
  class?: string
  style?: string
}

/**
 * Renders a Solar Duotone icon via Iconify CDN.
 * Requires the Iconify script loaded in the page <head>.
 * Usage: <Icon name={ICONS.home} size={20} />
 */
export const Icon = ({ name, size = 20, class: cls = '', style }: IconProps) => (
  <span
    class={`iconify ${cls}`.trim()}
    data-icon={name}
    data-width={String(size)}
    data-height={String(size)}
    style={style}
  ></span>
)

// ─── Solar Duotone icon name constants ────────────────────────────────────────
export const ICONS = {
  // Navigation
  home:           'solar:home-2-bold-duotone',
  bookings:       'solar:document-text-bold-duotone',
  walkIn:         'solar:user-plus-rounded-bold-duotone',
  reports:        'solar:chart-2-bold-duotone',
  settings:       'solar:settings-bold-duotone',

  // Actions / UI
  arrowRight:     'solar:alt-arrow-right-bold-duotone',
  arrowLeft:      'solar:alt-arrow-left-bold-duotone',
  arrowUp:        'solar:alt-arrow-up-bold-duotone',
  arrowDown:      'solar:alt-arrow-down-bold-duotone',
  close:          'solar:close-circle-bold-duotone',
  check:          'solar:check-circle-bold-duotone',
  checkSquare:    'solar:verified-check-bold-duotone',
  search:         'solar:magnifer-bold-duotone',
  add:            'solar:add-circle-bold-duotone',
  upload:         'solar:upload-minimalistic-bold-duotone',
  download:       'solar:download-minimalistic-bold-duotone',
  trash:          'solar:trash-bin-minimalistic-bold-duotone',
  edit:           'solar:pen-bold-duotone',
  eye:            'solar:eye-bold-duotone',
  copy:           'solar:copy-bold-duotone',
  filter:         'solar:filter-bold-duotone',
  sort:           'solar:sort-bold-duotone',
  refresh:        'solar:refresh-bold-duotone',

  // Status
  pending:        'solar:hourglass-bold-duotone',
  confirmed:      'solar:ticket-star-bold-duotone',
  inProgress:     'solar:play-circle-bold-duotone',
  completed:      'solar:check-circle-bold-duotone',
  cancelled:      'solar:forbidden-circle-bold-duotone',
  noShow:         'solar:close-circle-bold-duotone',
  warning:        'solar:danger-bold-duotone',
  info:           'solar:info-circle-bold-duotone',

  // Services
  import:         'solar:download-bold-duotone',
  export:         'solar:upload-bold-duotone',
  transshipment:  'solar:transfer-horizontal-bold-duotone',

  // Cargo / Logistics
  container:      'solar:box-bold-duotone',
  cargo:          'solar:delivery-bold-duotone',
  truck:          'solar:delivery-bold-duotone',
  ship:           'solar:global-bold-duotone',
  document:       'solar:file-text-bold-duotone',

  // Platform / UI
  logo:           'solar:widget-5-bold-duotone',
  kiosk:          'solar:monitor-smartphone-bold-duotone',
  qrCode:         'solar:qr-code-bold-duotone',
  camera:         'solar:camera-bold-duotone',
  calendar:       'solar:calendar-date-bold-duotone',
  clock:          'solar:clock-circle-bold-duotone',
  bell:           'solar:bell-bing-bold-duotone',
  star:           'solar:star-bold-duotone',
  layers:         'solar:layers-minimalistic-bold-duotone',

  // People
  user:           'solar:user-rounded-bold-duotone',
  users:          'solar:users-group-rounded-bold-duotone',
  userCheck:      'solar:user-check-rounded-bold-duotone',

  // Contact
  phone:          'solar:phone-bold-duotone',
  email:          'solar:letter-bold-duotone',
  car:            'solar:car-bold-duotone',

  // Settings sections
  shield:         'solar:shield-keyhole-bold-duotone',
  palette:        'solar:pallete-2-bold-duotone',
  lock:           'solar:lock-keyhole-bold-duotone',
  layers2:        'solar:layers-bold-duotone',

  // KPI extras
  chartBar:       'solar:graph-new-bold-duotone',
  percent:        'solar:pie-chart-2-bold-duotone',
} as const
