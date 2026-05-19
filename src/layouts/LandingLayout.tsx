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
          @media (max-width: 700px) {
            .hero-img-panel { display: none !important; }
            .hero-left-panel { flex: 1 1 100% !important; }
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
            var D='#1C232C',O='#FF6610',O2='#FC6514';
            /* Only show full preloader on first visit per session */
            var firstVisit = !sessionStorage.getItem('g-visited');
            if (firstVisit) sessionStorage.setItem('g-visited','1');
            var s=document.createElement('style');
            s.textContent='#g-pl-overlay{position:fixed;inset:0;z-index:99998;background:#fff;pointer-events:none}'
              +'#g-pl-bar{position:fixed;top:0;left:0;height:3px;width:0%;background:'+O2+';z-index:100000}'
              +(firstVisit ? '#g-pl-logo-wrap{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:99999;pointer-events:none}' : '');
            document.head.appendChild(s);
            /* Subsequent navigations: only show thin progress bar, no overlay or logo */
            if (!firstVisit) {
              var bar=document.createElement('div');bar.id='g-pl-bar';
              document.documentElement.appendChild(bar);
              var raf=requestAnimationFrame;raf(function(){raf(function(){
                bar.style.transition='width 0.3s ease';bar.style.width='80%';
              });});
              window.__gPlSafetyTimer=setTimeout(function(){
                var b=document.getElementById('g-pl-bar');
                if(b){b.style.transition='width 0.1s ease';b.style.width='100%';setTimeout(function(){b.style.transition='opacity 0.2s ease';b.style.opacity='0';setTimeout(function(){if(b&&b.parentNode)b.parentNode.removeChild(b);},220);},120);}
              },4000);
              return;
            }
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
