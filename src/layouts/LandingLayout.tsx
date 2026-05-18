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
        `}</style>

        {/* Alpine init must be synchronous before defer */}
        <script src="/public/alpine-init.js"></script>
        <script src="https://unpkg.com/alpinejs@3.14.3/dist/cdn.min.js" defer></script>
        <script src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js" defer></script>
        <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" defer></script>
        {/* Anime.js for scroll and counter animations */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
        {/* Three.js for hero 3D scene */}
        <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
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
                  { href: '#how-it-works', label: 'How it works', icon: 'solar:info-circle-bold-duotone'    },
                  { href: '/book',         label: 'Book a Slot',  icon: ICONS.calendar                      },
                  { href: '/bookings',     label: 'My Bookings',  icon: ICONS.bookings                      },
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
              <a href="/book" class="btn-primary" style="padding:9px 18px; font-size:13px; gap:6px;">
                <Icon name={ICONS.calendar} size={13} />
                Book a Slot
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

        {/* ── Logo intro — fires once per session ───────────────────────── */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            if (sessionStorage.getItem('g-intro')) return;
            sessionStorage.setItem('g-intro', '1');
            var anchorEl = document.querySelector('.glido-logo-anchor');
            if (!anchorEl) return;
            var srcSvg = anchorEl.querySelector('svg');
            if (!srcSvg) return;

            /* build overlay */
            var ov = document.createElement('div');
            ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#ffffff;display:flex;align-items:center;justify-content:center;pointer-events:none;';

            /* clone logo at display size ~130w */
            var clone = srcSvg.cloneNode(true);
            clone.setAttribute('width', '130');
            clone.setAttribute('height', '25');
            clone.style.cssText = 'opacity:0;transform:scale(0.72) translateY(6px);transition:opacity 0.22s ease,transform 0.42s cubic-bezier(0.16,1,0.3,1);display:block;';
            ov.appendChild(clone);
            document.body.prepend(ov);

            /* step 1: flash in */
            requestAnimationFrame(function() { requestAnimationFrame(function() {
              clone.style.opacity = '1';
              clone.style.transform = 'scale(1.04) translateY(0)';
              setTimeout(function() { clone.style.transform = 'scale(1) translateY(0)'; }, 260);
            }); });

            /* step 2: fly to header then dissolve */
            setTimeout(function() {
              var hRect = srcSvg.getBoundingClientRect();
              var cRect = clone.getBoundingClientRect();
              var dx = (hRect.left + hRect.width  / 2) - (cRect.left + cRect.width  / 2);
              var dy = (hRect.top  + hRect.height / 2) - (cRect.top  + cRect.height / 2);
              var sc = hRect.width / cRect.width;
              clone.style.transition = 'transform 0.38s cubic-bezier(0.4,0,0.2,1),opacity 0.22s ease 0.14s';
              clone.style.transform  = 'translate('+dx+'px,'+dy+'px) scale('+sc+')';
              clone.style.opacity    = '0';
              ov.style.transition    = 'opacity 0.25s ease 0.08s';
              ov.style.opacity       = '0';
              setTimeout(function() { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 580);
            }, 780);
          })();
        `}} />

        {/* ── Animation engine ──────────────────────────────────────────── */}
        <script dangerouslySetInnerHTML={{ __html: `
          /* ── Intersection Observer — scroll reveal ── */
          (function() {
            var io = new IntersectionObserver(function(entries) {
              entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                  var el = entry.target;
                  var delay = parseInt(el.getAttribute('data-reveal-delay') || '0');
                  setTimeout(function() {
                    el.classList.add('revealed');
                  }, delay);
                  io.unobserve(el);
                }
              });
            }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

            document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
              .forEach(function(el) { io.observe(el); });

            // Fire immediately for elements already in view
            setTimeout(function() {
              document.querySelectorAll('.reveal:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed), .reveal-scale:not(.revealed)')
                .forEach(function(el) {
                  var rect = el.getBoundingClientRect();
                  if (rect.top < window.innerHeight * 0.9) {
                    var delay = parseInt(el.getAttribute('data-reveal-delay') || '0');
                    setTimeout(function() { el.classList.add('revealed'); }, delay);
                    io.unobserve(el);
                  }
                });
            }, 100);
          })();

          /* ── Animated counter ── */
          (function() {
            var counters = document.querySelectorAll('[data-count]');
            if (!counters.length) return;
            var co = new IntersectionObserver(function(entries) {
              entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var target = parseFloat(el.getAttribute('data-count'));
                var prefix = el.getAttribute('data-prefix') || '';
                var suffix = el.getAttribute('data-suffix') || '';
                var decimals = parseInt(el.getAttribute('data-decimals') || '0');
                var duration = 1800;
                var start = Date.now();
                function tick() {
                  var elapsed = Date.now() - start;
                  var progress = Math.min(elapsed / duration, 1);
                  var eased = 1 - Math.pow(1 - progress, 3);
                  var val = target * eased;
                  el.textContent = prefix + val.toFixed(decimals) + suffix;
                  if (progress < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                co.unobserve(el);
              });
            }, { threshold: 0.5 });
            counters.forEach(function(el) { co.observe(el); });
          })();

          /* ── Staggered word reveal in hero ── */
          (function() {
            var hero = document.querySelector('.hero-words');
            if (!hero) return;
            var words = hero.querySelectorAll('.hero-word');
            words.forEach(function(w, i) {
              w.style.opacity = '0';
              w.style.transform = 'translateY(20px)';
              w.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
              w.style.transitionDelay = (i * 90 + 200) + 'ms';
              setTimeout(function() {
                w.style.opacity = '1';
                w.style.transform = 'translateY(0)';
              }, 50);
            });
          })();

          /* ── Rotating word cycle ── */
          (function() {
            var el = document.getElementById('rotating-word');
            if (!el) return;
            var words = ['Collection', 'Delivery', 'Drop Off', 'Pick Up', 'Clearance'];
            var i = 0;
            function cycle() {
              el.style.opacity = '0';
              el.style.transform = 'translateY(-8px)';
              setTimeout(function() {
                i = (i + 1) % words.length;
                el.textContent = words[i];
                el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
              }, 300);
            }
            el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            setInterval(cycle, 2600);
          })();

          /* ── Re-observe after each navigation (soft nav) ── */
          document.addEventListener('htmx:afterSwap', function() {
            document.querySelectorAll('.reveal:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed), .reveal-scale:not(.revealed)')
              .forEach(function(el) { io && io.observe(el); });
          });
        `}} />

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
