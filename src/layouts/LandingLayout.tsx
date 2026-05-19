import type { FC } from 'hono/jsx'
import { Icon, ICONS } from '../lib/Icon'
import { GlidoLogo } from '../lib/GlidoLogo'

interface Props {
  title?: string
  children: any
}

export const LandingLayout: FC<Props> = ({ title = 'Home', children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} — Glido</title>

        {/* Inter font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        <link rel="stylesheet" href="/public/styles.css" />
        <style>{`
          [x-cloak]{display:none!important}
          * { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
          @keyframes dot-drift {
            from { background-position: 0 0; }
            to   { background-position: 28px 28px; }
          }
          .section-dots {
            background-image: radial-gradient(rgba(0,0,0,0.06) 1.5px, transparent 1.5px);
            background-size: 28px 28px;
            animation: dot-drift 24s linear infinite;
          }
          @keyframes warp-beam-fly {
            0%   { transform: translateY(620px); opacity: 0; }
            8%   { opacity: 1; }
            92%  { opacity: 1; }
            100% { transform: translateY(-420px); opacity: 0; }
          }
          .warp-beam {
            position: absolute;
            top: 0;
            width: 2px;
            border-radius: 9999px;
            pointer-events: none;
            animation: warp-beam-fly linear infinite;
          }
        `}</style>

        {/* Alpine init must be synchronous before defer */}
        <script src="/public/alpine-init.js"></script>
        <script src="https://unpkg.com/alpinejs@3.14.3/dist/cdn.min.js" defer></script>
        <script src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js" defer></script>
        <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" defer></script>

        {/* ── Instant preloader — runs before body renders ── */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var s=document.createElement('style');
            s.textContent='#g-pl{position:fixed;inset:0;z-index:99999;background:#fff;display:flex;align-items:center;justify-content:center;pointer-events:none;will-change:transform}'
              +'#g-pl-inner{display:flex;flex-direction:column;align-items:center;gap:20px}'
              +'#g-pl-bar{width:64px;height:2px;background:rgba(0,0,0,0.07);border-radius:999px;overflow:hidden}'
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
      <body style="background:#fff; color:#1C1917; overflow-x:hidden;">

        {/* ── Fixed nav ─────────────────────────────────────────────────── */}
        <header
          id="main-nav"
          class="fixed top-0 inset-x-0 z-50"
          style="transition: background 0.3s ease, box-shadow 0.3s ease;"
        >
          <div
            style="background:rgba(255,255,255,0.92); backdrop-filter:blur(16px) saturate(180%); -webkit-backdrop-filter:blur(16px) saturate(180%); border-bottom:1px solid rgba(0,0,0,0.07);"
          >
            <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

              {/* Logo */}
              <a href="/" class="flex items-center glido-logo-anchor" style="text-decoration:none;">
                <GlidoLogo height={22} onDark={false} />
              </a>

              {/* Center nav */}
              <nav class="hidden sm:flex items-center gap-1">
                {[
                  { href: '#how-it-works', label: 'How it works', icon: 'solar:info-circle-bold-duotone' },
                  { href: '/book',         label: 'Book a Slot',  icon: ICONS.calendar                   },
                  { href: '/bookings',     label: 'My Bookings',  icon: ICONS.bookings                   },
                  { href: '/dashboard',    label: 'Dashboard',    icon: ICONS.home                       },
                ].map(l => (
                  <a
                    key={l.href}
                    href={l.href}
                    style="display:inline-flex; align-items:center; gap:5px; padding:7px 13px; border-radius:8px; font-size:13px; font-weight:500; color:#78716C; text-decoration:none; transition:all 0.15s ease;"
                    onmouseover="this.style.color='#1C1917'; this.style.background='rgba(0,0,0,0.05)';"
                    onmouseout="this.style.color='#78716C'; this.style.background='transparent';"
                  >
                    <Icon name={l.icon} size={14} style="opacity:0.7;" />
                    {l.label}
                  </a>
                ))}
              </nav>

              {/* CTA */}
              <a href="/login" style="display:inline-flex; align-items:center; gap:6px; padding:9px 18px; font-size:13px; font-weight:600; color:#1C1917; background:#F5F4F3; border:1px solid rgba(0,0,0,0.10); border-radius:9999px; text-decoration:none; transition:all 0.15s ease;"
                onmouseover="this.style.background='#EBEBEA'; this.style.borderColor='rgba(0,0,0,0.18)';"
                onmouseout="this.style.background='#F5F4F3'; this.style.borderColor='rgba(0,0,0,0.10)';"
              >
                <Icon name={ICONS.users} size={13} style="opacity:0.6;" />
                Login
              </a>
            </div>
          </div>
        </header>

        {/* ── Main content ────────────────────────────────────────────── */}
        <main style="padding-top:64px;">
          {children}
        </main>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer style="border-top:1px solid #f0f0f0; background:#fff; padding:64px 24px 32px;">
          <div class="max-w-6xl mx-auto">
            <div style="display:grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap:48px; margin-bottom:48px;" class="footer-grid">

              {/* Brand column */}
              <div>
                <div class="flex items-center mb-4">
                  <GlidoLogo height={20} onDark={false} />
                </div>
                <p style="font-size:13px; color:#78716C; line-height:1.7; max-width:220px;">
                  Streamlining container freight station operations — from booking to bay door.
                </p>
                <div style="display:flex; gap:12px; margin-top:20px;">
                  {[
                    { icon: 'solar:letter-bold-duotone', href: '#' },
                    { icon: 'solar:global-bold-duotone', href: '#' },
                  ].map(s => (
                    <a
                      key={s.icon}
                      href={s.href}
                      style="width:32px; height:32px; border-radius:8px; background:rgba(0,0,0,0.05); border:1px solid rgba(0,0,0,0.08); display:flex; align-items:center; justify-content:center; transition:background 0.15s ease;"
                      onmouseover="this.style.background='rgba(252,101,20,0.12)'"
                      onmouseout="this.style.background='rgba(0,0,0,0.05)'"
                    >
                      <Icon name={s.icon} size={14} style="color:#78716C;" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Links */}
              {[
                { heading: 'Platform', links: [{ label: 'Book a Visit', href: '/book' }, { label: 'My Bookings', href: '/bookings' }, { label: 'Kiosk', href: '/kiosk' }] },
                { heading: 'Operations', links: [{ label: 'Reception', href: '/reception' }, { label: 'Dashboard', href: '/reception' }, { label: 'Reports', href: '/reception/reports' }] },
                { heading: 'Company', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }, { label: 'Contact', href: '#' }] },
              ].map(col => (
                <div key={col.heading}>
                  <p style="font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:#A8A29E; margin-bottom:16px;">{col.heading}</p>
                  <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px;">
                    {col.links.map(l => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          style="font-size:13px; color:#78716C; text-decoration:none; transition:color 0.15s ease;"
                          onmouseover="this.style.color='#1C1917'"
                          onmouseout="this.style.color='#78716C'"
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div style="padding-top:24px; border-top:1px solid rgba(0,0,0,0.07); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
              <span style="font-size:12px; color:#A8A29E;">© 2026 Glido CFS. All rights reserved.</span>
              <span style="font-size:12px; color:#A8A29E;">Sydney Container Freight Station · Mon–Fri 06:00–18:00</span>
            </div>
          </div>
        </footer>

        {/* ── Landing-specific animations (hero words, rotating text) ──── */}
        <script dangerouslySetInnerHTML={{ __html: `
          /* ── Staggered word reveal in hero ── */
          (function() {
            function initHeroWords() {
              var hero = document.querySelector('.hero-words');
              if (!hero) return;
              var words = hero.querySelectorAll('.hero-word');
              words.forEach(function(w, i) {
                w.style.opacity = '0';
                w.style.transform = 'translateY(22px)';
                w.style.filter = 'blur(2px)';
                w.style.transition = 'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease';
                w.style.transitionDelay = (i * 85 + 340) + 'ms';
                setTimeout(function() {
                  w.style.opacity = '1';
                  w.style.transform = 'translateY(0)';
                  w.style.filter = 'blur(0)';
                }, 40);
              });
            }
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initHeroWords);
            } else {
              initHeroWords();
            }
          })();

          /* ── Rotating word cycle ── */
          (function() {
            function initRotatingWord() {
              var el = document.getElementById('rotating-word');
              if (!el) return;
              var words = ['Collection', 'Delivery', 'Drop Off', 'Pick Up', 'Clearance'];
              var i = 0;
              el.style.transition = 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)';
              function cycle() {
                el.style.opacity = '0';
                el.style.transform = 'translateY(-10px)';
                setTimeout(function() {
                  i = (i + 1) % words.length;
                  el.textContent = words[i];
                  el.style.opacity = '1';
                  el.style.transform = 'translateY(0)';
                }, 320);
              }
              setInterval(cycle, 2800);
            }
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initRotatingWord);
            } else {
              initRotatingWord();
            }
          })();
        `}} />

        {/* ── Global animation engine ───────────────────────────────────── */}
        <script src="/public/transitions.js"></script>

        <style>{`
          @media (max-width: 768px) {
            .footer-grid {
              grid-template-columns: 1fr 1fr !important;
              gap: 32px !important;
            }
          }
          @media (max-width: 480px) {
            .footer-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </body>
    </html>
  )
}
