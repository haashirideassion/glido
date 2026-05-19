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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/public/styles.css" />
        <style>{`
          * { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }

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
            overflow: hidden;
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
            transition: background 0.15s ease, border-radius 0.28s ease;
            overflow: hidden;
            flex-shrink: 0;
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
            display: none;
            transition: color 0.15s ease;
          }
          .sidebar-col.is-open .nav-item-label {
            display: block;
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
            display: none;
          }
          .sidebar-col.is-open .action-btn-label {
            display: block;
          }

          /* Toggle button — sits inside the pill at the bottom */
          .nav-toggle {
            width: 40px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            cursor: pointer;
            border: none;
            background: transparent;
            color: rgba(255,255,255,0.30);
            transition: background 0.15s ease, color 0.15s ease;
            margin-top: 2px;
          }
          .nav-toggle:hover {
            background: rgba(255,255,255,0.07);
            color: rgba(255,255,255,0.65);
          }
          .sidebar-col.is-open .nav-toggle {
            width: 100%;
          }

          /* User footer */
          .sidebar-user {
            margin-top: auto;
            display: flex;
            align-items: center;
            gap: 0;
            width: 100%;
            justify-content: center;
            overflow: hidden;
            transition: gap 0.28s ease;
          }
          .sidebar-col.is-open .sidebar-user {
            gap: 10px;
            justify-content: flex-start;
            padding-left: 4px;
          }
          .sidebar-user-info {
            display: none;
            min-width: 0;
          }
          .sidebar-col.is-open .sidebar-user-info {
            display: block;
          }
        `}</style>
        <script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js"></script>
        <script src="/public/alpine-init.js"></script>
        <script src="https://unpkg.com/alpinejs@3.14.3/dist/cdn.min.js" defer></script>
        <script src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js" defer></script>
        <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" defer></script>

        {/* ── Instant preloader ── */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var s=document.createElement('style');
            s.textContent='#g-pl{position:fixed;inset:0;z-index:99999;background:#f9f9f9;display:flex;align-items:center;justify-content:center;pointer-events:none;will-change:transform}'
              +'#g-pl-inner{display:flex;flex-direction:column;align-items:center;gap:20px}'
              +'#g-pl-bar{width:64px;height:2px;background:rgba(0,0,0,0.10);border-radius:999px;overflow:hidden}'
              +'#g-pl-fill{height:100%;width:0%;background:#FC6514;border-radius:999px;transition:width .5s ease}';
            document.head.appendChild(s);
            var logo='<div style="font-size:21px;font-weight:800;letter-spacing:-0.055em;font-family:system-ui,ui-sans-serif,sans-serif;"><span style="color:#1C232C;">glid</span><span style="color:#FC6514;">o</span></div>';
            var pl=document.createElement('div');pl.id='g-pl';
            pl.innerHTML='<div id="g-pl-inner">'+logo+'<div id="g-pl-bar"><div id="g-pl-fill"></div></div></div>';
            document.documentElement.appendChild(pl);
            var raf=requestAnimationFrame;raf(function(){raf(function(){var f=document.getElementById('g-pl-fill');if(f)f.style.width='60%';});});
            function _safetyDismiss(){
              var p=document.getElementById('g-pl');if(!p)return;
              var f=document.getElementById('g-pl-fill');if(f){f.style.transition='width 0.16s ease';f.style.width='100%';}
              setTimeout(function(){p.style.transition='transform 0.52s cubic-bezier(0.16,1,0.3,1)';p.style.transform='translateY(-105%)';setTimeout(function(){if(p.parentNode)p.parentNode.removeChild(p);},560);},180);
            }
            window.__gPlSafetyTimer=setTimeout(_safetyDismiss,5000);
          })();
        `}} />
      </head>
      <body style="min-height:100vh; background:#f9f9f9; color:#1C1917; font-family:'Inter',ui-sans-serif,system-ui,sans-serif; display:flex; -webkit-font-smoothing:antialiased;">

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside
          class="sidebar-col"
          id="sidebar-col"
        >
          {/* ── Logo mark ── */}
          <a
            href="/"
            style="display:flex; align-items:center; justify-content:center; width:40px; height:40px; flex-shrink:0; text-decoration:none; margin-bottom:4px;"
          >
            <GlidoLogo height={16} onDark={false} />
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
                      style={`flex-shrink:0; margin-right:8px; min-width:18px; height:18px; border-radius:999px; background:#EF4444; color:#fff; font-size:10px; font-weight:700; display:${walkInCount && walkInCount > 0 ? 'flex' : 'none'}; align-items:center; justify-content:center; padding:0 4px;`}
                      class="nav-item-label"
                    >
                      {walkInCount ?? 0}
                    </span>
                  )}
                </a>
              )
            })}

            {/* ── Toggle collapse ── */}
            <button
              class="nav-toggle"
              type="button"
              onclick="document.getElementById('sidebar-col').classList.toggle('is-open'); this.querySelector('span').style.transform = document.getElementById('sidebar-col').classList.contains('is-open') ? 'rotate(180deg)' : 'rotate(0deg)';"
              title="Toggle sidebar"
            >
              <span style="display:inline-flex; transition:transform 0.28s ease;">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </button>
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
          <div class="sidebar-user">
            <div
              style="width:32px; height:32px; border-radius:999px; background:rgba(252,101,20,0.12); border:1px solid rgba(252,101,20,0.22); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#FC6514; flex-shrink:0; cursor:pointer;"
              title="Reception Agent"
            >
              RA
            </div>
            <div class="sidebar-user-info">
              <p style="font-size:12px; font-weight:600; color:#1C1917; white-space:nowrap;">Reception Agent</p>
              <p style="font-size:11px; color:#A8A29E; white-space:nowrap;">Sydney CFS · T1</p>
            </div>
          </div>
        </aside>

        {/* ── Main area ─────────────────────────────────────────────────── */}
        <div class="flex-1 flex flex-col min-w-0" style="background:#f9f9f9;">
          {/* Top header */}
          <header
            class="h-14 flex items-center justify-between px-5 shrink-0"
            style="background:#f9f9f9; border-bottom:1px solid rgba(0,0,0,0.07);"
          >
            <h1 class="text-sm font-semibold" style="color:#1C1917; letter-spacing:-0.01em;">{title}</h1>
            <a href="/" class="transition-colors text-xs font-medium" style="color:#FC6514; text-decoration:none;">Visitor Portal ↗</a>
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
