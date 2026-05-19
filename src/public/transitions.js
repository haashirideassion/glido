/* ─────────────────────────────────────────────────────────────────────────────
   Glido · Global Animation Engine
   • Preloader (logo + sweep bar)
   • Page enter  — curtain lift + content rise
   • Page exit   — content fade-up, white overlay sweeps in
   • Scroll reveals (.reveal / .reveal-left / .reveal-right / .reveal-scale)
   • Auto-stagger grids  ([data-stagger])
   • Animated counters   ([data-count])
   • 3D tilt cards       (.tilt-card)
   • Scroll parallax     ([data-parallax])
   ───────────────────────────────────────────────────────────────────────────── */
;(function () {
  'use strict'
  if (window.__gAnim) return
  window.__gAnim = true

  /* ── easing ─────────────────────────────────────────────────────────────── */
  var SP = 'cubic-bezier(0.16,1,0.3,1)'   /* spring  */
  var EO = 'cubic-bezier(0.4,0,0.2,1)'    /* ease-out */

  /* ══════════════════════════════════════════════════════════════════════════
     1. PRELOADER
     The <head> inline script already created #g-pl with #g-pl-fill.
     We inject the logo clone and handle dismiss.
  ══════════════════════════════════════════════════════════════════════════ */
  var _pl = document.getElementById('g-pl')

  function _plInjectLogo () {
    if (!_pl) return
    var slot = document.getElementById('g-pl-logo-slot')
    if (!slot) return
    /* clone the nav logo */
    var srcSvg = document.querySelector('.glido-logo-anchor svg')
    if (srcSvg) {
      var clone = srcSvg.cloneNode(true)
      clone.setAttribute('width', '112')
      clone.setAttribute('height', '22')
      clone.style.cssText = 'display:block;'
      slot.appendChild(clone)
    } else {
      slot.innerHTML = '<span style="font-size:22px;font-weight:800;letter-spacing:-0.06em;color:#1C1917;">glido</span>'
    }
    /* fade logo in */
    requestAnimationFrame(function () {
      slot.style.opacity = '1'
      slot.style.transform = 'translateY(0)'
    })
  }

  function _plFill (pct, ms) {
    var fill = document.getElementById('g-pl-fill')
    if (!fill) return
    fill.style.transition = 'width ' + (ms || 420) + 'ms ease'
    fill.style.width = pct + '%'
  }

  function _plDismiss () {
    if (!_pl) return
    /* complete the bar */
    _plFill(100, 160)
    setTimeout(function () {
      /* slide the curtain UP */
      _pl.style.transition = 'transform 0.52s ' + SP
      _pl.style.transform  = 'translateY(-105%)'
      setTimeout(function () {
        if (_pl.parentNode) _pl.parentNode.removeChild(_pl)
      }, 560)
    }, 160)
  }

  /* ══════════════════════════════════════════════════════════════════════════
     2. PAGE ENTER
     Content slides up from 20 px and fades in — starts while curtain lifts.
  ══════════════════════════════════════════════════════════════════════════ */
  function _pageEnter () {
    var isLanding = !!document.getElementById('hero-section')

    /* ── Header slides down ── */
    var header = document.querySelector('header')
    if (header) {
      header.style.opacity    = '0'
      header.style.transform  = 'translateY(-10px)'
      header.style.transition = 'none'
      setTimeout(function () {
        header.style.transition = 'opacity 0.45s ease, transform 0.5s ' + SP
        header.style.opacity    = '1'
        header.style.transform  = 'translateY(0)'
      }, 40)
    }

    /* ── Reception sidebar slides in from left ── */
    var sidebar = document.querySelector('.sidebar-col')
    if (sidebar) {
      sidebar.style.opacity    = '0'
      sidebar.style.transform  = 'translateX(-20px)'
      sidebar.style.transition = 'none'
      setTimeout(function () {
        sidebar.style.transition = 'opacity 0.5s ' + SP + ', transform 0.55s ' + SP
        sidebar.style.opacity    = '1'
        sidebar.style.transform  = 'translateX(0)'
      }, 30)
    }

    /* ── Main area ── */
    if (!isLanding) {
      /* Portal / reception pages: single main card rises */
      var main = document.querySelector('main')
      if (main) {
        main.style.opacity    = '0'
        main.style.transform  = 'translateY(22px)'
        main.style.transition = 'none'
        setTimeout(function () {
          main.style.transition = 'opacity 0.55s ' + SP + ', transform 0.65s ' + SP
          main.style.opacity    = '1'
          main.style.transform  = 'translateY(0)'
        }, 80)
      }
    } else {
      /* Landing: stagger top-level sections (hero has own word animation) */
      var sections = document.querySelectorAll('main > section, main > div[id]')
      Array.from(sections).forEach(function (el, i) {
        el.style.opacity    = '0'
        el.style.transform  = 'translateY(24px)'
        el.style.transition = 'none'
        setTimeout(function () {
          el.style.transition = 'opacity 0.6s ' + SP + ', transform 0.7s ' + SP
          el.style.opacity    = '1'
          el.style.transform  = 'translateY(0)'
        }, 60 + i * 80)
      })
    }

    /* ── Nav item stagger ── */
    var navLinks = document.querySelectorAll('header nav a, header .nav-pill a')
    Array.from(navLinks).forEach(function (el, i) {
      el.style.opacity    = '0'
      el.style.transform  = 'translateY(-5px)'
      el.style.transition = 'none'
      setTimeout(function () {
        el.style.transition = 'opacity 0.38s ease, transform 0.42s ' + SP
        el.style.opacity    = '1'
        el.style.transform  = 'translateY(0)'
      }, 110 + i * 28)
    })
  }

  /* ══════════════════════════════════════════════════════════════════════════
     3. PAGE EXIT  — intercept link clicks
  ══════════════════════════════════════════════════════════════════════════ */
  var _exiting = false

  function _exitAndGo (href) {
    if (_exiting) return
    _exiting = true

    /* white flash overlay */
    var ov = document.createElement('div')
    ov.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:9998',
      'background:#ffffff', 'opacity:0', 'pointer-events:none',
      'transition:opacity 0.22s ease',
    ].join(';')
    document.body.appendChild(ov)

    /* slide content up */
    var main = document.querySelector('main') || document.querySelector('#main-content')
    if (main) {
      main.style.transition = 'opacity 0.18s ease, transform 0.24s ' + EO
      main.style.opacity    = '0'
      main.style.transform  = 'translateY(-12px)'
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { ov.style.opacity = '1' })
    })

    setTimeout(function () { window.location.href = href }, 220)
  }

  function _interceptLinks () {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]')
      if (!a) return
      var href = a.getAttribute('href')
      if (!href) return

      /* ignore special schemes and anchors */
      if (href.charAt(0) === '#') return
      if (/^(mailto|tel|javascript):/.test(href)) return

      /* ignore external / new-tab */
      if (a.target === '_blank') return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      /* ignore HTMX-bound links */
      if (a.hasAttribute('hx-get') || a.hasAttribute('hx-post') ||
          a.hasAttribute('hx-push-url') || a.closest('[hx-boost]')) return

      /* ignore external hostnames */
      try {
        var url = new URL(href, window.location.href)
        if (url.hostname !== window.location.hostname) return
        /* ignore same-page reload */
        if (url.pathname === window.location.pathname && !url.search) return
      } catch (_) { return }

      e.preventDefault()
      _exitAndGo(href)
    }, true /* capture — beat other handlers */)
  }

  /* ══════════════════════════════════════════════════════════════════════════
     4. SCROLL REVEALS
  ══════════════════════════════════════════════════════════════════════════ */
  var _io = null

  function _setupReveals () {
    var sel = '.reveal:not(.revealed),.reveal-left:not(.revealed),.reveal-right:not(.revealed),.reveal-scale:not(.revealed)'

    if (!window.IntersectionObserver) {
      document.querySelectorAll(sel).forEach(function (el) { el.classList.add('revealed') })
      return
    }

    _io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return
        var el    = entry.target
        var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10)
        setTimeout(function () { el.classList.add('revealed') }, delay)
        _io.unobserve(el)
      })
    }, { threshold: 0.07, rootMargin: '0px 0px -24px 0px' })

    function _observe () {
      document.querySelectorAll(sel).forEach(function (el) {
        var r = el.getBoundingClientRect()
        if (r.top < window.innerHeight * 0.94) {
          var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10)
          setTimeout(function () { el.classList.add('revealed') }, delay)
        } else {
          _io.observe(el)
        }
      })
    }

    _observe()
    /* re-observe after HTMX partial swaps */
    document.addEventListener('htmx:afterSwap', _observe)
  }

  /* ══════════════════════════════════════════════════════════════════════════
     5. AUTO-STAGGER GRIDS   [data-stagger]
        data-stagger-delay="100"   base delay ms  (default 0)
        data-stagger-ms="60"       per-child step (default 60)
  ══════════════════════════════════════════════════════════════════════════ */
  function _setupStagger () {
    if (!window.IntersectionObserver) return

    document.querySelectorAll('[data-stagger]').forEach(function (wrap) {
      var base = parseInt(wrap.getAttribute('data-stagger-delay') || '0', 10)
      var step = parseInt(wrap.getAttribute('data-stagger-ms')    || '60', 10)
      var kids = Array.from(wrap.children).filter(function (c) {
        return c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE'
      })

      kids.forEach(function (c) {
        c.style.opacity    = '0'
        c.style.transform  = 'translateY(16px)'
        c.style.transition = 'none'
      })

      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return
          kids.forEach(function (c, i) {
            setTimeout(function () {
              c.style.transition = 'opacity 0.55s ' + SP + ', transform 0.62s ' + SP
              c.style.opacity    = '1'
              c.style.transform  = 'translateY(0)'
            }, base + i * step)
          })
          sio.unobserve(entry.target)
        })
      }, { threshold: 0.05 })

      sio.observe(wrap)
    })
  }

  /* ══════════════════════════════════════════════════════════════════════════
     6. ANIMATED COUNTERS   [data-count]
        data-prefix  data-suffix  data-decimals
  ══════════════════════════════════════════════════════════════════════════ */
  function _setupCounters () {
    if (!window.IntersectionObserver) return
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return
        var el       = entry.target
        var target   = parseFloat(el.getAttribute('data-count')    || '0')
        var prefix   = el.getAttribute('data-prefix')  || ''
        var suffix   = el.getAttribute('data-suffix')  || ''
        var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10)
        var dur = 1800, t0 = Date.now()
        ;(function tick () {
          var prog  = Math.min((Date.now() - t0) / dur, 1)
          var eased = 1 - Math.pow(1 - prog, 3)
          el.textContent = prefix + (target * eased).toFixed(decimals) + suffix
          if (prog < 1) requestAnimationFrame(tick)
        })()
        cio.unobserve(el)
      })
    }, { threshold: 0.5 })
    document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el) })
  }

  /* ══════════════════════════════════════════════════════════════════════════
     7. 3-D TILT CARDS   .tilt-card
  ══════════════════════════════════════════════════════════════════════════ */
  function _setupTilt () {
    document.querySelectorAll('.tilt-card').forEach(function (card) {
      card.style.transition = 'transform 0.18s ease, box-shadow 0.18s ease'
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect()
        var x = (e.clientX - r.left) / r.width  - 0.5
        var y = (e.clientY - r.top)  / r.height - 0.5
        card.style.transform  = 'perspective(720px) rotateY(' + (x * 11) + 'deg) rotateX(' + (-y * 11) + 'deg) translateZ(6px)'
        card.style.boxShadow  = '0 14px 44px rgba(0,0,0,0.18),' + (-x * 7) + 'px ' + (-y * 7) + 'px 22px rgba(0,0,0,0.10)'
      })
      card.addEventListener('mouseleave', function () {
        card.style.transform = ''
        card.style.boxShadow = ''
      })
    })
  }

  /* ══════════════════════════════════════════════════════════════════════════
     8. PARALLAX   [data-parallax]   data-parallax-speed="0.25"
  ══════════════════════════════════════════════════════════════════════════ */
  function _setupParallax () {
    var els = document.querySelectorAll('[data-parallax]')
    if (!els.length) return
    function onScroll () {
      var sy = window.scrollY
      els.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax-speed') || '0.25')
        el.style.transform = 'translateY(' + (sy * speed) + 'px)'
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  /* ══════════════════════════════════════════════════════════════════════════
     9. HTMX RECEPTION — animate slide-over content on swap
  ══════════════════════════════════════════════════════════════════════════ */
  function _setupHtmxSwapAnim () {
    document.addEventListener('htmx:afterSwap', function (e) {
      var target = e.detail && e.detail.target
      if (!target) return
      /* Slide-over content */
      if (target.id === 'slide-over-content') {
        target.style.opacity    = '0'
        target.style.transform  = 'translateX(16px)'
        target.style.transition = 'none'
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            target.style.transition = 'opacity 0.3s ease, transform 0.35s ' + SP
            target.style.opacity    = '1'
            target.style.transform  = 'translateX(0)'
          })
        })
      }
      /* Any HTMX-loaded cards — stagger children */
      var newKids = Array.from(target.children).filter(function (c) {
        return c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE'
      })
      if (newKids.length > 1) {
        newKids.forEach(function (c, i) {
          c.style.opacity    = '0'
          c.style.transform  = 'translateY(10px)'
          c.style.transition = 'none'
          setTimeout(function () {
            c.style.transition = 'opacity 0.35s ' + SP + ', transform 0.4s ' + SP
            c.style.opacity    = '1'
            c.style.transform  = 'translateY(0)'
          }, i * 40)
        })
      }
    })
  }

  /* ══════════════════════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════════════════════ */
  function _boot () {
    _plInjectLogo()
    _plFill(82, 300)
    _pageEnter()
    _setupReveals()
    _setupStagger()
    _setupCounters()
    _setupTilt()
    _setupParallax()
    _setupHtmxSwapAnim()
    _interceptLinks()
    /* dismiss preloader — slight delay so logo has time to appear */
    setTimeout(_plDismiss, 220)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _boot)
  } else {
    setTimeout(_boot, 0)
  }
})()
