import type { FC } from 'hono/jsx'
import { Icon, ICONS } from '../lib/Icon'
import { GlidoLogo } from '../lib/GlidoLogo'

interface Props {
  title?: string
  activeNav?: string
  walkInCount?: number
  children: any
}

const navItems = [
  { href: '/reception',           label: 'Dashboard',  icon: ICONS.home,     badge: false },
  { href: '/reception/bookings',  label: 'Bookings',   icon: ICONS.bookings, badge: false },
  { href: '/reception/walk-ins',  label: 'Walk-Ins',   icon: ICONS.walkIn,   badge: true  },
  { href: '/reception/reports',   label: 'Reports',    icon: ICONS.reports,  badge: false },
  { href: '/reception/settings',  label: 'Settings',   icon: ICONS.settings, badge: false },
]

export const ReceptionLayout: FC<Props> = ({ title = 'Reception', activeNav = '/reception', walkInCount, children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} — Glido Reception</title>
        <link rel="icon" type="image/svg+xml" href="/public/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/public/styles.css" />
        <script dangerouslySetInnerHTML={{ __html: `window.__sb={url:'${process.env.SUPABASE_URL ?? 'https://lnknynjqxyfvtjpnaljc.supabase.co'}',key:'${process.env.SUPABASE_ANON_KEY ?? ''}'};` }} />
        <style>{`
          * { font-family: 'Red Hat Display', ui-sans-serif, system-ui, sans-serif; }

          /* ── Sidebar pill ──────────────────────────────────────────── */
          .sidebar-col {
            position: sticky;
            top: 0;
            height: 100vh;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 12px;
            gap: 12px;
            width: 72px;
            transition: width 0.28s cubic-bezier(0.16,1,0.3,1);
            background: #f9f9f9;
          }
          .sidebar-col.is-open {
            width: 200px;
          }

          /* The dark pill container */
          .nav-pill {
            background: #1C1917;
            border-radius: 28px;
            padding: 6px;
            display: flex;
            flex-direction: column;
            gap: 2px;
            box-shadow:
              0 8px 32px rgba(0,0,0,0.22),
              0 2px 8px rgba(0,0,0,0.12),
              inset 0 1px 0 rgba(255,255,255,0.07);
            width: 52px;
            transition: width 0.28s cubic-bezier(0.16,1,0.3,1), border-radius 0.28s ease;
          }
          .sidebar-col.is-open .nav-pill {
            width: 176px;
            border-radius: 20px;
          }

          /* Nav item row */
          .nav-item {
            display: flex;
            align-items: center;
            gap: 0;
            padding: 0;
            border-radius: 22px;
            text-decoration: none;
            transition: background 0.15s ease, border-radius 0.28s ease, gap 0.28s cubic-bezier(0.16,1,0.3,1);
            overflow: hidden;
            flex-shrink: 0;
          }
          .sidebar-col.is-open .nav-item {
            gap: 6px;
          }
          .nav-item-icon {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 19px;
            transition: background 0.15s ease;
          }
          .nav-item-label {
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            color: rgba(255,255,255,0.55);
            padding-right: 10px;
            flex: 1;
            opacity: 0;
            max-width: 0;
            overflow: hidden;
            pointer-events: none;
            transition: color 0.15s ease, opacity 0.14s ease, max-width 0.28s cubic-bezier(0.16,1,0.3,1);
          }
          .sidebar-col.is-open .nav-item-label {
            opacity: 1;
            max-width: 160px;
            pointer-events: auto;
            transition: color 0.15s ease, opacity 0.2s ease 0.14s, max-width 0.28s cubic-bezier(0.16,1,0.3,1);
          }
          .sidebar-col.is-open .nav-item {
            border-radius: 14px;
          }

          /* Active state */
          .nav-item.active .nav-item-icon {
            background: rgba(255,255,255,0.12);
          }
          .sidebar-col.is-open .nav-item.active {
            background: rgba(255,255,255,0.09);
          }
          .nav-item.active .nav-item-label {
            color: #ffffff;
            font-weight: 600;
          }

          /* Hover on inactive items */
          .nav-item:not(.active):hover .nav-item-icon {
            background: rgba(255,255,255,0.06);
          }
          .sidebar-col.is-open .nav-item:not(.active):hover {
            background: rgba(255,255,255,0.05);
          }
          .nav-item:not(.active):hover .nav-item-label {
            color: rgba(255,255,255,0.80);
          }

          /* Action button */
          .action-btn {
            width: 48px;
            height: 48px;
            border-radius: 999px;
            background: #FC6514;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
            border: none;
            cursor: pointer;
            flex-shrink: 0;
            transition: width 0.28s cubic-bezier(0.16,1,0.3,1), gap 0.28s ease, box-shadow 0.15s ease;
            box-shadow: 0 4px 16px rgba(252,101,20,0.38), 0 1px 4px rgba(252,101,20,0.20);
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
          }
          .sidebar-col.is-open .action-btn {
            width: 176px;
            gap: 8px;
            padding: 0 18px;
            justify-content: center;
          }
          .action-btn:hover {
            box-shadow: 0 6px 24px rgba(252,101,20,0.48), 0 2px 8px rgba(252,101,20,0.24);
          }
          .action-btn-label {
            opacity: 0;
            max-width: 0;
            overflow: hidden;
            pointer-events: none;
            transition: opacity 0.14s ease, max-width 0.28s cubic-bezier(0.16,1,0.3,1);
          }
          .sidebar-col.is-open .action-btn-label {
            opacity: 1;
            max-width: 140px;
            pointer-events: auto;
            transition: opacity 0.2s ease 0.14s, max-width 0.28s cubic-bezier(0.16,1,0.3,1);
          }

          /* Toggle button — sits inside the pill at the bottom */
          .sidebar-toggle-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            border-radius: 9px;
            border: 1px solid rgba(0,0,0,0.09);
            background: #FFFFFF;
            color: #78716C;
            cursor: pointer;
            flex-shrink: 0;
            transition: background 0.13s ease, border-color 0.13s ease, color 0.13s ease;
          }
          .sidebar-toggle-btn:hover {
            background: #F3F2F1;
            border-color: rgba(0,0,0,0.14);
            color: #1C1917;
          }

          /* Walk-in badge — animates with sidebar but never stretches */
          .sidebar-badge {
            flex-shrink: 0;
            opacity: 0;
            max-width: 0;
            overflow: hidden;
            pointer-events: none;
            transition: opacity 0.14s ease, max-width 0.28s cubic-bezier(0.16,1,0.3,1);
          }
          .sidebar-col.is-open .sidebar-badge {
            opacity: 1;
            max-width: 28px;
            pointer-events: auto;
            transition: opacity 0.2s ease 0.14s, max-width 0.28s cubic-bezier(0.16,1,0.3,1);
          }

          /* Logo anchor — left-align when expanded */
          .glido-logo-anchor {
            width: 40px;
            justify-content: center;
            transition: width 0.28s cubic-bezier(0.16,1,0.3,1);
          }
          .sidebar-col.is-open .glido-logo-anchor {
            width: 100%;
            justify-content: center;
          }

          /* Logo SVG — smaller when collapsed, full-size when expanded */
          .glido-logo-wrap svg {
            height: 11px !important;
            width: 57px !important;
            transition: height 0.28s cubic-bezier(0.16,1,0.3,1), width 0.28s cubic-bezier(0.16,1,0.3,1);
          }
          .sidebar-col.is-open .glido-logo-wrap svg {
            height: 17px !important;
            width: 88px !important;
          }

          /* User footer */
          .sidebar-user {
            display: flex;
            align-items: center;
            gap: 0;
            width: 100%;
            justify-content: center;
            overflow: hidden;
            transition: gap 0.28s ease;
            border-radius: 12px;
            padding: 4px;
          }
          .sidebar-col.is-open .sidebar-user {
            gap: 10px;
            justify-content: flex-start;
            padding-left: 4px;
          }
          .sidebar-user:hover {
            background: rgba(0,0,0,0.04);
          }
          .sidebar-user-info {
            min-width: 0;
            opacity: 0;
            max-width: 0;
            overflow: hidden;
            pointer-events: none;
            transition: opacity 0.14s ease, max-width 0.28s cubic-bezier(0.16,1,0.3,1);
          }
          .sidebar-col.is-open .sidebar-user-info {
            opacity: 1;
            max-width: 140px;
            pointer-events: auto;
            transition: opacity 0.2s ease 0.14s, max-width 0.28s cubic-bezier(0.16,1,0.3,1);
          }

          /* User menu popover */
          @keyframes user-menu-in {
            from { opacity: 0; transform: scale(0.96) translateY(6px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          .user-menu-popover {
            transform-origin: bottom left;
            animation: user-menu-in 0.16s cubic-bezier(0.16,1,0.3,1) both;
          }
          .user-menu-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 9px 12px;
            border-radius: 10px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            color: #1C1917;
            background: transparent;
            border: none;
            cursor: pointer;
            width: 100%;
            text-align: left;
            transition: background 0.1s ease;
          }
          .user-menu-item:hover { background: rgba(0,0,0,0.05); }
          .user-menu-item.danger { color: #EF4444; }
          .user-menu-item.danger:hover { background: rgba(239,68,68,0.06); }

          /* ── Custom filter-select dropdown rows ──────────────────────────── */
          .fsel-opt {
            display: flex; align-items: center; gap: 9px;
            width: 100%; padding: 8px 10px;
            font-size: 13px; font-weight: 400; color: #1C1917;
            border: none; cursor: pointer; border-radius: 8px;
            text-align: left; background: transparent;
            transition: background 0.1s ease;
            white-space: nowrap;
            font-family: 'Red Hat Display', ui-sans-serif, sans-serif;
          }
          .fsel-opt:hover { background: rgba(0,0,0,0.05); }
          .fsel-opt.fsel-active { background: rgba(252,101,20,0.07); color: #FC6514; font-weight: 600; }
          .fsel-opt.fsel-active:hover { background: rgba(252,101,20,0.12); }
        `}</style>
        <script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js"></script>
        <script src="/public/alpine-init.js"></script>
        <script src="https://unpkg.com/alpinejs@3.14.3/dist/cdn.min.js" defer></script>
        <script src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js" defer></script>
        <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" defer></script>

        {/* ── Instant preloader — first session visit only ── */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            // Skip overlay on every navigation after the first page in this session.
            // transitions.js sets 'g-anim-visited' in sessionStorage on first load;
            // we read it here (head script runs before transitions.js).
            if (sessionStorage.getItem('g-anim-visited')) {
              window.__gPlSafetyTimer = null;
              return;
            }
            var D='#1C232C',O='#FF6610',O2='#FC6514';
            var s=document.createElement('style');
            s.textContent='#g-pl-overlay{position:fixed;inset:0;z-index:99998;background:#f9f9f9;pointer-events:none}'
              +'#g-pl-bar{position:fixed;top:0;left:0;height:3px;width:0%;background:'+O2+';z-index:100000}'
              +'#g-pl-logo-wrap{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:99999;pointer-events:none}';
            document.head.appendChild(s);
            var H=28,W=145;
            var svg='<svg id="g-pl-logo-svg" viewBox="0 0 160 31" height="'+H+'" width="'+W+'" xmlns="http://www.w3.org/2000/svg" style="display:block">'
              +'<path fill="'+D+'" d="m25.5 13c-1.2 0-2.5 0.6-3.4 1.6l-3 3.2 0.1 0.2h24.8l-0.8 3.1c-0.6 2.3-1.9 3.5-4.3 3.5h-23.6c-5.3 0-8.7-3.1-8.3-8.3s3.1-9.8 8.3-9.8h15.5c0.8 0 1.4-0.5 1.8-1.1l2-3.5-0.1-0.6h-19.3c-8.2 0-12.8 6.1-13.3 14-0.5 7.1 2.8 14.2 12.7 14.3h24.4c5.4 0 8.6-2.2 9.9-7.3l2.4-9.2-25.8-0.1z"/>'
              +'<path fill="'+D+'" d="m60.9 1.3-6.3 21.2c-0.9 4.1 1.1 6.8 5.5 6.9h5.8l1.3-5h-4.6c-1.6 0-2.5-0.9-2-2.6l5.7-20.5h-5.4z"/>'
              +'<path fill="'+D+'" d="m75.6 9.3-5.4 20.1h5.8l5.6-20.5h-5.5l-0.5 0.4z"/>'
              +'<path fill="'+D+'" d="m116.5 1.4-5.3 19.1c-0.8 2.6-2.3 3.8-4.9 3.8h-12.4c-2.5 0-4.2-1.4-3.8-4.4 0.5-3.6 3-6 6.2-6h12c1 0 1.4-0.4 1.9-1.1l1.8-3.5v-0.4h-16c-5.9 0-11.2 3.9-12 10.7-0.6 5.8 2.4 9.7 9.3 9.7h13c5.6 0 9.1-1.9 10.6-7.7l5.7-20.3h-6l-0.1 0.1z"/>'
              +'<path fill="'+D+'" d="m150.5 16c-0.4 0-0.4 0.2-0.6 0.5l-0.8 3.5c-0.6 2.7-2.6 4.4-4.7 4.4h-11.9c-2.7 0-4.6-1.5-4-4.8 0.5-3.3 2.8-5.7 6.3-5.7h12.2c0.7 0 1.2-0.3 1.6-1l1.8-3.6-0.2-0.4h-15.2c-6.3 0-11 3.4-12.2 9.8-1.1 6.1 1.4 10.6 8.7 10.7h13c5.9 0 9.1-3.1 10.2-7.8l1.3-5.5-5.5-0.1z"/>'
              +'<path fill="'+O+'" d="m43.1 1.4c-1.5 0-2.6 0.3-3.5 1.4-0.7 0.7-2.9 3.4-2.8 3.6l0.2 0.1h13.6c1 0 1.5-0.4 2-1.1 0.6-0.8 2.4-3.7 2.3-4h-11.8z"/>'
              +'<path fill="'+O2+'" d="m77.8 1.4-1.4 5.1h5.1c0.5 0 0.7-0.4 0.8-0.6l1.3-4.6h-5.8v0.1z"/>'
              +'<path fill="'+O+'" d="m152.8 8.9c-0.2 0-0.2 0.1-0.3 0.2l-1.9 4.3 4 0.1c0.7 0 1-0.3 1.5-0.8 0.7-0.8 2.4-3.4 2.4-3.6l-0.1-0.2h-5.6z"/>'
              +'</svg>';
            var overlay=document.createElement('div');overlay.id='g-pl-overlay';
            var bar=document.createElement('div');bar.id='g-pl-bar';
            var wrap=document.createElement('div');wrap.id='g-pl-logo-wrap';wrap.innerHTML=svg;
            document.documentElement.appendChild(overlay);
            document.documentElement.appendChild(bar);
            document.documentElement.appendChild(wrap);
            var raf=requestAnimationFrame;raf(function(){raf(function(){
              bar.style.transition='width 0.5s ease';bar.style.width='60%';
            });});
            function _safetyDismiss(){
              var b=document.getElementById('g-pl-bar');
              var o=document.getElementById('g-pl-overlay');
              var w=document.getElementById('g-pl-logo-wrap');
              if(b){b.style.transition='width 0.16s ease';b.style.width='100%';}
              setTimeout(function(){
                if(b){b.style.transition='opacity 0.3s ease';b.style.opacity='0';}
                if(o){o.style.transition='opacity 0.4s ease';o.style.opacity='0';}
                if(w){w.style.transition='opacity 0.4s ease';w.style.opacity='0';}
                setTimeout(function(){
                  [b,o,w].forEach(function(el){if(el&&el.parentNode)el.parentNode.removeChild(el);});
                },450);
              },200);
            }
            window.__gPlSafetyTimer=setTimeout(_safetyDismiss,5000);
          })();
        `}} />
      </head>
      <body style="min-height:100vh; background:#f9f9f9; color:#1C1917; font-family:'Red Hat Display',ui-sans-serif,system-ui,sans-serif; display:flex; -webkit-font-smoothing:antialiased;">

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside
          class="sidebar-col"
          id="sidebar-col"
          style="/* border-right:1px solid rgba(0,0,0,0.07); */"
        >
          {/* ── Logo mark ── */}
          <a
            href="/"
            class="glido-logo-anchor"
            style="display:flex; align-items:center; height:40px; flex-shrink:0; text-decoration:none; margin-bottom:4px;"
          >
            <span class="glido-logo-wrap" style="display:inline-flex; align-items:center;">
              <GlidoLogo height={17} onDark={false} />
            </span>
          </a>

          {/* ── Pill nav ── */}
          <nav class="nav-pill">
            {navItems.map((item) => {
              const isActive = activeNav === item.href
              return (
                <a
                  key={item.href}
                  href={item.href}
                  class={`nav-item${isActive ? ' active' : ''}`}
                >
                  {/* Icon container */}
                  <div class="nav-item-icon">
                    <Icon
                      name={item.icon}
                      size={17}
                      style={isActive
                        ? 'color:#FC6514;'
                        : 'color:rgba(255,255,255,0.45);'}
                    />
                  </div>

                  {/* Label + badge */}
                  <span class="nav-item-label" style={isActive ? 'color:#ffffff; font-weight:600;' : ''}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      id="walk-in-badge"
                      style={`margin-right:8px; width:20px; height:20px; border-radius:50%; background:#EF4444; color:#fff; font-size:10px; font-weight:700; display:${walkInCount && walkInCount > 0 ? 'flex' : 'none'}; align-items:center; justify-content:center;`}
                      class="sidebar-badge"
                    >
                      {walkInCount ?? 0}
                    </span>
                  )}
                </a>
              )
            })}

          </nav>

          {/* ── Action button ── */}
          <a
            href="/reception/bookings/new"
            class="action-btn"
          >
            <Icon name={ICONS.add} size={18} style="color:#ffffff; flex-shrink:0;" />
            <span class="action-btn-label">New Booking</span>
          </a>

          {/* ── User ── */}
          <div x-data="{ userMenu: false }" style="margin-top:auto; width:100%;">

            {/* Teleport to <body> so the menu escapes the aside's stacking context */}
            <template x-teleport="body">
              {/* Backdrop */}
              <div
                x-show="userMenu"
                x-cloak
                style="position:fixed; inset:0; z-index:9100;"
                x-on:click="userMenu = false"
              ></div>
            </template>

            <template x-teleport="body">
              {/* Popover */}
              <div
                x-show="userMenu"
                x-cloak
                class="user-menu-popover"
                style="position:fixed; bottom:76px; left:12px; z-index:9101; width:232px; background:#FFFFFF; border:1px solid rgba(0,0,0,0.09); border-radius:16px; box-shadow:0 12px 40px rgba(0,0,0,0.15), 0 3px 10px rgba(0,0,0,0.07); overflow:hidden;"
              >
                {/* Header */}
                <div style="display:flex; align-items:center; gap:10px; padding:14px 16px; background:rgba(252,101,20,0.025); border-bottom:1px solid rgba(0,0,0,0.06);">
                  <div style="width:38px; height:38px; border-radius:9999px; background:rgba(252,101,20,0.12); border:1.5px solid rgba(252,101,20,0.22); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#FC6514; flex-shrink:0;">RA</div>
                  <div style="min-width:0;">
                    <p style="font-size:13px; font-weight:600; color:#1C1917; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Reception Agent</p>
                    <p style="font-size:11px; color:#A8A29E; white-space:nowrap;">Sydney CFS · T1</p>
                  </div>
                </div>

                {/* Menu items */}
                <div style="padding:6px;">
                  <div class="user-menu-item" style="opacity:0.4; cursor:default; pointer-events:none;">
                    <Icon name={ICONS.settings} size={15} style="color:#78716C; flex-shrink:0;" />
                    Settings
                  </div>
                  <div class="user-menu-item" style="opacity:0.4; cursor:default; pointer-events:none;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#78716C; flex-shrink:0;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Visitor Portal
                    <span style="font-size:10px; color:#C7C3BF; margin-left:auto;">↗</span>
                  </div>

                  <div style="border-top:1px solid rgba(0,0,0,0.06); margin:4px 0;"></div>

                  <a href="/" class="user-menu-item danger">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out
                  </a>
                </div>
              </div>
            </template>

            {/* Avatar trigger */}
            <div
              class="sidebar-user"
              x-on:click="userMenu = !userMenu"
              style="cursor:pointer;"
              title="Account menu"
            >
              <div style="width:32px; height:32px; border-radius:999px; background:rgba(252,101,20,0.12); border:1px solid rgba(252,101,20,0.22); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#FC6514; flex-shrink:0;">
                RA
              </div>
              <div class="sidebar-user-info">
                <p style="font-size:12px; font-weight:600; color:#1C1917; white-space:nowrap;">Reception Agent</p>
                <p style="font-size:11px; color:#A8A29E; white-space:nowrap;">Sydney CFS · T1</p>
              </div>
            </div>
          </div>
        </aside>
        {/* Restore sidebar open/close state across navigations */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            if(localStorage.getItem('glido-sidebar')==='1'){
              var sb=document.getElementById('sidebar-col');
              if(sb) sb.classList.add('is-open');
              var h=document.getElementById('sidebar-icon-hamburger');
              var c=document.getElementById('sidebar-icon-chevron');
              if(h) h.style.display='none';
              if(c) c.style.display='inline-flex';
            }
          })();
        `}} />

        {/* ── Main area ─────────────────────────────────────────────────── */}
        <div class="flex-1 flex flex-col min-w-0" style="background:#f9f9f9;">
          {/* Top header */}
          <header
            class="flex items-center justify-between px-5 shrink-0"
            style="height:73px; background:#f9f9f9; /* border-bottom:1px solid rgba(0,0,0,0.07); */"
          >
            <div style="display:flex; align-items:center; gap:14px;">
              <button
                id="sidebar-toggle-btn"
                type="button"
                class="sidebar-toggle-btn"
                onclick="var sb=document.getElementById('sidebar-col');sb.classList.toggle('is-open');var open=sb.classList.contains('is-open');document.getElementById('sidebar-icon-hamburger').style.display=open?'none':'inline-flex';document.getElementById('sidebar-icon-chevron').style.display=open?'inline-flex':'none';localStorage.setItem('glido-sidebar',open?'1':'0');"
                title="Toggle sidebar"
              >
                {/* Hamburger — shown when collapsed */}
                <span id="sidebar-icon-hamburger" style="display:inline-flex;">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M2 4h11M2 7.5h11M2 11h11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </span>
                {/* Chevron-left — shown when expanded */}
                <span id="sidebar-icon-chevron" style="display:none;">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 3L5 7l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </button>
              <h1 class="text-2xl font-semibold" style="color:#1C1917; letter-spacing:-0.02em;">{title}</h1>
            </div>
            <a
              href="/book"
              target="_blank"
              style="display:inline-flex; align-items:center; gap:6px; padding:7px 14px 7px 12px; font-size:12px; font-weight:600; color:#FC6514; background:rgba(252,101,20,0.07); border:1px solid rgba(252,101,20,0.22); border-radius:9999px; text-decoration:none; letter-spacing:-0.01em; transition:background 0.14s ease, border-color 0.14s ease, box-shadow 0.14s ease; box-shadow:0 1px 3px rgba(252,101,20,0.08);"
              onmouseover="this.style.background='rgba(252,101,20,0.13)'; this.style.borderColor='rgba(252,101,20,0.38)'; this.style.boxShadow='0 2px 8px rgba(252,101,20,0.18)';"
              onmouseout="this.style.background='rgba(252,101,20,0.07)'; this.style.borderColor='rgba(252,101,20,0.22)'; this.style.boxShadow='0 1px 3px rgba(252,101,20,0.08)';"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Visitor Portal
            </a>
          </header>

          {/* White content card */}
          <main
            class="flex-1 overflow-y-auto"
            id="main-content"
            style="padding:12px;"
          >
            <div style="background:#FFFFFF; border-radius:20px; min-height:100%; box-shadow:0 1px 4px rgba(0,0,0,0.04), 0 6px 28px rgba(0,0,0,0.07); overflow:hidden; padding:24px;">
              {children}
            </div>
          </main>
        </div>

        {/* ── Slide-over ────────────────────────────────────────────────── */}
        <div
          id="slide-over-backdrop"
          class="hidden fixed inset-0 z-40"
          style="background:rgba(28,25,23,0.35); backdrop-filter:blur(4px);"
          onclick="document.getElementById('slide-over-backdrop').classList.add('hidden'); document.getElementById('slide-over').classList.add('translate-x-full')"
        ></div>
        <div
          id="slide-over"
          class="fixed right-0 top-0 h-full w-[480px] z-50 translate-x-full transition-transform duration-300 overflow-y-auto flex flex-col"
          style="background:#FFFFFF; border-left:1px solid rgba(0,0,0,0.08); box-shadow:-8px 0 40px rgba(0,0,0,0.12);"
        >
          <div id="slide-over-content"></div>
        </div>

        <script src="/public/transitions.js"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            function refreshBadge(){
              fetch('/reception/api/walk-in-count')
                .then(function(r){return r.json();})
                .then(function(d){
                  var badge=document.getElementById('walk-in-badge');
                  if(!badge)return;
                  badge.textContent=d.count;
                  badge.style.display=d.count>0?'flex':'none';
                }).catch(function(){});
            }
            refreshBadge();
            setInterval(refreshBadge,30000);
          })();
        `}} />
      </body>
    </html>
  )
}
