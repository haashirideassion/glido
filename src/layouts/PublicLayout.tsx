import type { FC } from 'hono/jsx'
import { Icon, ICONS } from '../lib/Icon'
import { GlidoLogo } from '../lib/GlidoLogo'

interface Props {
  title?: string
  plain?: boolean   /* skip white card — renders children directly on page bg */
  user?: { firstName: string | null; email: string } | null
  children: any
}

export const PublicLayout: FC<Props> = ({ title = 'Glido', plain = false, user, children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} — Glido CFS</title>
        <link rel="icon" type="image/svg+xml" href="/public/favicon.svg" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

        <link rel="stylesheet" href="/public/styles.css" />
        <style>{`
          [x-cloak]{display:none!important}
          * { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        `}</style>
        <script src="/public/alpine-init.js"></script>
        <script src="https://unpkg.com/alpinejs@3.14.3/dist/cdn.min.js" defer></script>
        <script src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js" defer></script>
        <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" defer></script>

        {/* ── Instant preloader ── */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var D='#1C232C',O='#FF6610',O2='#FC6514';
            var firstVisit = !sessionStorage.getItem('g-visited');
            if (firstVisit) sessionStorage.setItem('g-visited','1');
            var s=document.createElement('style');
            s.textContent='#g-pl-overlay{position:fixed;inset:0;z-index:99998;background:#fff;pointer-events:none}'
              +'#g-pl-bar{position:fixed;top:0;left:0;height:4px;width:0%;background:linear-gradient(90deg,'+O2+',#FF9500);box-shadow:0 0 10px rgba(252,101,20,0.5);z-index:100000}'
              +(firstVisit ? '#g-pl-logo-wrap{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:99999;pointer-events:none}' : '');
            document.head.appendChild(s);
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
            } else {
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
            }
          })();
        `}} />
      </head>
      <body class="min-h-screen font-sans antialiased" style="background:#f6f7f9; color:#1C1917;">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <header class="sticky top-0 z-40" style="background:rgba(246,247,249,0.97); backdrop-filter:blur(16px) saturate(180%); -webkit-backdrop-filter:blur(16px) saturate(180%); border-bottom:1px solid rgba(0,0,0,0.07);">
          <div class="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

            {/* Logo */}
            <a href="/" class="flex items-center glido-logo-anchor" style="text-decoration:none;">
              <GlidoLogo height={20} onDark={false} />
            </a>

            <nav class="hidden sm:flex items-center gap-1">
              {[
                { href: '/',         label: 'Home',        icon: ICONS.home      },
                { href: '/book',     label: 'Book a Slot', icon: ICONS.calendar  },
                { href: '/bookings', label: 'My Bookings', icon: ICONS.bookings  },
              ].map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  style="display:inline-flex; align-items:center; gap:5px; padding:7px 12px; border-radius:8px; font-size:13px; font-weight:500; color:#78716C; text-decoration:none; transition:all 0.15s ease;"
                  onmouseover="this.style.color='#1C1917'; this.style.background='rgba(0,0,0,0.05)';"
                  onmouseout="this.style.color='#78716C'; this.style.background='transparent';"
                >
                  <Icon name={l.icon} size={14} style="opacity:0.7;" />
                  {l.label}
                </a>
              ))}
            </nav>

            {user ? (
              <div style="display:inline-flex; align-items:center; gap:8px;">
                <span style="font-size:12px; font-weight:500; color:#78716C;">
                  {user.firstName ?? user.email}
                </span>
                <a href="/logout" style="display:inline-flex; align-items:center; gap:6px; padding:8px 16px; font-size:12px; font-weight:600; color:#1C1917; background:#F5F4F3; border:1px solid rgba(0,0,0,0.10); border-radius:9999px; text-decoration:none; transition:all 0.15s ease;"
                  onmouseover="this.style.background='#EBEBEA'; this.style.borderColor='rgba(0,0,0,0.18)';"
                  onmouseout="this.style.background='#F5F4F3'; this.style.borderColor='rgba(0,0,0,0.10)';"
                >
                  <Icon name={ICONS.logout} size={13} style="opacity:0.6;" />
                  Log out
                </a>
              </div>
            ) : (
              <a href="/login" style="display:inline-flex; align-items:center; gap:6px; padding:8px 16px; font-size:12px; font-weight:600; color:#1C1917; background:#F5F4F3; border:1px solid rgba(0,0,0,0.10); border-radius:9999px; text-decoration:none; transition:all 0.15s ease;"
                onmouseover="this.style.background='#EBEBEA'; this.style.borderColor='rgba(0,0,0,0.18)';"
                onmouseout="this.style.background='#F5F4F3'; this.style.borderColor='rgba(0,0,0,0.10)';"
              >
                <Icon name={ICONS.users} size={13} style="opacity:0.6;" />
                Login
              </a>
            )}
          </div>
        </header>

        {/* ── Main content ───────────────────────────────────────────── */}
        {plain
          ? <main style="min-height:calc(100vh - 56px - 64px);">{children}</main>
          : (
            <main style="padding:12px; min-height:calc(100vh - 56px - 64px); box-sizing:border-box;">
              <div style="background:#FFFFFF; border-radius:20px; min-height:calc(100vh - 56px - 64px - 24px); box-shadow:0 1px 4px rgba(0,0,0,0.04), 0 6px 28px rgba(0,0,0,0.07);">
                {children}
              </div>
            </main>
          )
        }

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer style="border-top:1px solid rgba(0,0,0,0.07); padding:24px; margin-top:0; background:#f6f7f9;">
          <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3" style="font-size:12px; color:#A8A29E;">
            <span>© 2026 Glido CFS · Sydney Container Freight Station</span>
            <div style="display:flex; gap:20px;">
              {['Privacy', 'Terms', 'Contact'].map(l => (
                <a
                  key={l}
                  href="#"
                  style="color:#A8A29E; text-decoration:none; transition:color 0.15s ease;"
                  onmouseover="this.style.color='#57534E';"
                  onmouseout="this.style.color='#A8A29E';"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </footer>
        <script src="/public/transitions.js"></script>
      </body>
    </html>
  )
}
