import { Hono } from 'hono'
import { PublicLayout } from '../layouts/PublicLayout'
import { LandingLayout } from '../layouts/LandingLayout'
import { Icon, ICONS } from '../lib/Icon'
import { Button } from '../components/ui/button'
import { BookingWizard } from '../components/portal/BookingWizard'
import { MyBookingsList } from '../components/portal/MyBookingsList'
import { Input } from '../components/ui/input'
import { getBookings, findBooking, createBooking } from '../lib/db/bookings'
import { getSlotsByDate } from '../lib/db/slots'
import { getTenant } from '../lib/db/tenants'
import { lookupShipment, lookupShipmentByContainer } from '../lib/db/cfs-shipments'
import { calculateCharges } from '../lib/charges'
import { generateQRDataURL } from '../lib/qr'
import { DEFAULT_TENANT_ID } from '../lib/supabase'

export const portalRoutes = new Hono()

// ─── Landing page ─────────────────────────────────────────────────────────────
portalRoutes.get('/', (c) => {
  return c.html(
    <LandingLayout title="Home">

      {/* ═══════════════════════════════════════════════════════════════════════
          §1  HERO — split layout, floating booking card preview
      ═══════════════════════════════════════════════════════════════════════ */}
      <section class="bg-hero-gradient noise" style="padding-top:2rem; padding-bottom:4rem; overflow:hidden; position:relative; min-height:80vh; display:flex; align-items:flex-start;">

        {/* Background orb */}
        <div style="position:absolute; top:-120px; right:-80px; width:600px; height:600px; border-radius:9999px; background:radial-gradient(circle, rgba(252,101,20,0.12) 0%, transparent 70%); pointer-events:none;" />
        <div style="position:absolute; bottom:0; left:-60px; width:400px; height:400px; border-radius:9999px; background:radial-gradient(circle, rgba(252,101,20,0.06) 0%, transparent 70%); pointer-events:none;" />

        <div class="max-w-6xl mx-auto px-6 w-full" style="padding-bottom:5rem;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; padding-top:3rem;">

            {/* Left: text */}
            <div>
              {/* Status badge */}
              <div class="status-badge animate-fade-up" style="display:inline-flex; margin-bottom:28px;">
                <span class="pulse-dot" style="width:7px; height:7px; border-radius:9999px; background:#16A34A; flex-shrink:0; animation:pulse-dot 2s ease-in-out infinite;" />
                Open today · Mon–Fri 06:00–18:00
              </div>

              {/* Headline with rotating word */}
              <h1
                class="hero-words"
                style="font-size:clamp(2.4rem,4.5vw,3.4rem); font-weight:700; color:#1C1917; letter-spacing:-0.04em; line-height:1.05; margin-bottom:24px;"
              >
                <span class="hero-word" style="display:block;">Schedule your</span>
                <span class="hero-word" style="display:block;">
                  <span
                    id="rotating-word"
                    style="color:#FC6514; display:inline-block; min-width:200px;"
                  >Collection</span>
                </span>
                <span class="hero-word" style="display:block;">at the CFS.</span>
              </h1>

              <p
                class="animate-fade-up delay-300"
                style="font-size:15px; color:#78716C; line-height:1.7; max-width:440px; margin-bottom:36px;"
              >
                Skip the queue. Book a slot online, arrive on time, scan your QR at the kiosk — all without a single phone call.
              </p>

              <div class="animate-fade-up delay-400" style="display:flex; gap:12px; flex-wrap:wrap;">
                <a href="/book" class="btn-primary" style="padding:13px 26px; font-size:13.5px;">
                  <Icon name={ICONS.calendar} size={15} />
                  Book a Slot
                  <Icon name={ICONS.arrowRight} size={14} />
                </a>
                <a href="#how-it-works" class="btn-ghost" style="padding:13px 22px; font-size:13.5px;">
                  See how it works
                </a>
              </div>

              <p class="animate-fade-up delay-500" style="font-size:12px; color:#64748B; margin-top:20px;">
                No account required · Takes under 3 minutes
              </p>
            </div>

            {/* Right: Three.js interactive 3D illustration */}
            <div class="animate-fade-up delay-200" style="position:relative; display:flex; align-items:center; justify-content:center;">
              <canvas
                id="hero-3d"
                style="width:100%; height:480px; display:block; cursor:grab;"
              ></canvas>
              <script dangerouslySetInnerHTML={{ __html: `
                (function() {
                  function waitAndInit() {
                    if (typeof THREE === 'undefined') { setTimeout(waitAndInit, 60); return; }
                    var canvas = document.getElementById('hero-3d');
                    if (!canvas) return;

                    var W = canvas.parentElement.offsetWidth || 500;
                    var H = 480;
                    canvas.width  = W * window.devicePixelRatio;
                    canvas.height = H * window.devicePixelRatio;

                    var scene    = new THREE.Scene();
                    var camera   = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
                    camera.position.set(0, 1.2, 14);

                    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
                    renderer.setSize(W, H);
                    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                    renderer.setClearColor(0x000000, 0);

                    /* ── Lights ── */
                    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
                    var sun = new THREE.DirectionalLight(0xffffff, 1.4);
                    sun.position.set(8, 12, 8);
                    scene.add(sun);
                    var fill = new THREE.DirectionalLight(0xfff4ec, 0.6);
                    fill.position.set(-8, -2, 6);
                    scene.add(fill);
                    var glow = new THREE.PointLight(0xFC6514, 3.0, 18);
                    glow.position.set(0, 2, 6);
                    scene.add(glow);

                    /* ── Materials ── */
                    var mOrange = new THREE.MeshPhongMaterial({ color: 0xFC6514,  shininess: 50, specular: 0xffffff });
                    var mCream  = new THREE.MeshPhongMaterial({ color: 0xEEEAE4,  shininess: 20, specular: 0xcccccc });
                    var mWhite  = new THREE.MeshPhongMaterial({ color: 0xFFFFFF,  shininess: 35, specular: 0xeeeeee });
                    var eOrange = new THREE.LineBasicMaterial({ color: 0xD44D00,  opacity: 0.55, transparent: true });
                    var eDark   = new THREE.LineBasicMaterial({ color: 0x1C1917,  opacity: 0.12, transparent: true });

                    /* ── Container builder ── */
                    function box(w, h, d, mat, edge, x, y, z, rx, ry, rz) {
                      var geo  = new THREE.BoxGeometry(w, h, d);
                      var mesh = new THREE.Mesh(geo, mat);
                      mesh.position.set(x, y, z);
                      mesh.rotation.set(rx, ry, rz);
                      mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edge));
                      return mesh;
                    }

                    var group = new THREE.Group();

                    /* Large orange container — hero piece */
                    group.add(box(4.2, 1.7, 1.7,  mOrange, eOrange,   0,    0,    0,     0,     0.28,  0));
                    /* Secondary cream container — upper left */
                    group.add(box(3.2, 1.3, 1.3,  mCream,  eDark,    -0.6,  2.1,  0.5,   0.05, -0.18,  0));
                    /* Third white container — lower right */
                    group.add(box(2.6, 1.1, 1.1,  mWhite,  eDark,     1.4, -1.9, -0.6,  -0.04,  0.42,  0.04));

                    /* Tiny accent spheres */
                    var sdot = new THREE.SphereGeometry(0.09, 12, 12);
                    var mdot = new THREE.MeshPhongMaterial({ color: 0xFC6514, emissive: 0xFC6514, emissiveIntensity: 0.4 });
                    [[-2.8, 3.0, 1.8], [3.2, -0.8, 1.2], [-1.8, -2.6, 0.6]].forEach(function(p) {
                      var s = new THREE.Mesh(sdot, mdot);
                      s.position.set(p[0], p[1], p[2]);
                      group.add(s);
                    });

                    /* Connecting lines between containers */
                    var lmat = new THREE.LineBasicMaterial({ color: 0xFC6514, opacity: 0.15, transparent: true });
                    var lpts = new Float32Array([-0, 0, 0,  -0.6, 2.1, 0.5,  0, 0, 0,  1.4, -1.9, -0.6]);
                    var lgeo = new THREE.BufferGeometry();
                    lgeo.setAttribute('position', new THREE.BufferAttribute(lpts, 3));
                    group.add(new THREE.LineSegments(lgeo, lmat));

                    scene.add(group);

                    /* ── Extract individual containers from group ── */
                    var containers = group.children.slice();
                    /* Store per-container animation params */
                    var cParams = [
                      { yPhase: 0,    yFreq: 0.52, yAmp: 0.18, zFreq: 0.31, zAmp: 0.022 },
                      { yPhase: 1.1,  yFreq: 0.68, yAmp: 0.13, zFreq: 0.47, zAmp: 0.018 },
                      { yPhase: 2.4,  yFreq: 0.41, yAmp: 0.22, zFreq: 0.25, zAmp: 0.030 },
                    ];
                    /* Spheres stay in group, only first 3 are containers */
                    var boxMeshes = [group.children[0], group.children[1], group.children[2]];

                    /* ── Wind streak lines ── */
                    /* Each streak = 2 vertices (start, end) = 6 floats */
                    var streakCount = 48;
                    var streakGeo   = new THREE.BufferGeometry();
                    var streakPos   = new Float32Array(streakCount * 6);
                    var streakData  = [];
                    function initStreak(i) {
                      var x   = (Math.random() - 0.5) * 30;
                      var y   = (Math.random() - 0.5) * 13;
                      var z   = -2 + Math.random() * 7;
                      var len = 0.25 + Math.random() * 0.85;
                      var spd = 1.6 + Math.random() * 3.8;
                      var op  = 0.07 + Math.random() * 0.18;
                      streakData[i] = { x: x, y: y, z: z, len: len, spd: spd, op: op };
                      streakPos[i*6]   = x;       streakPos[i*6+1] = y; streakPos[i*6+2] = z;
                      streakPos[i*6+3] = x + len; streakPos[i*6+4] = y; streakPos[i*6+5] = z;
                    }
                    for (var si = 0; si < streakCount; si++) initStreak(si);
                    streakGeo.setAttribute('position', new THREE.BufferAttribute(streakPos, 3));
                    var streakMat = new THREE.LineBasicMaterial({ color: 0xC85010, transparent: true, opacity: 0.18 });
                    var streakLines = new THREE.LineSegments(streakGeo, streakMat);
                    scene.add(streakLines);

                    /* ── Air-cushion halos beneath containers ── */
                    /* Flat ellipse sprite (plane geometry) under each container */
                    var haloGeo  = new THREE.PlaneGeometry(1, 0.3);
                    var haloMat  = new THREE.MeshBasicMaterial({ color: 0xFC6514, transparent: true, opacity: 0.07, depthWrite: false });
                    var halos    = [];
                    var haloBase = [
                      { bx: 0,    bz: 0,    sx: 3.4, sz: 0.55 },
                      { bx: -0.6, bz: 0.5,  sx: 2.6, sz: 0.44 },
                      { bx: 1.4,  bz: -0.6, sx: 2.1, sz: 0.36 },
                    ];
                    for (var hi = 0; hi < 3; hi++) {
                      var hm = new THREE.Mesh(haloGeo, haloMat.clone());
                      hm.rotation.x = -Math.PI / 2;
                      hm.scale.set(haloBase[hi].sx, haloBase[hi].sz, 1);
                      hm.position.set(haloBase[hi].bx, -0.95, haloBase[hi].bz);
                      halos.push(hm);
                      scene.add(hm);
                    }

                    /* ── Mouse parallax ── */
                    var mouse   = { x: 0, y: 0 };
                    var smooth  = { x: 0, y: 0 };
                    window.addEventListener('mousemove', function(e) {
                      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
                      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
                    });

                    /* ── Resize ── */
                    window.addEventListener('resize', function() {
                      var W2 = canvas.parentElement.offsetWidth || 500;
                      camera.aspect = W2 / H;
                      camera.updateProjectionMatrix();
                      renderer.setSize(W2, H);
                    });

                    /* ── Render loop ── */
                    var t0 = performance.now();
                    (function loop() {
                      requestAnimationFrame(loop);
                      var t = (performance.now() - t0) * 0.001;

                      smooth.x += (mouse.x * 0.32 - smooth.x) * 0.045;
                      smooth.y += (mouse.y * 0.20 - smooth.y) * 0.045;

                      /* Group-level parallax only — no group y oscillation */
                      group.rotation.y = t * 0.06 + smooth.x * 0.6;
                      group.rotation.x = -smooth.y * 0.30;

                      /* Per-container independent glide */
                      var basePositions = [
                        [0, 0, 0],
                        [-0.6, 2.1, 0.5],
                        [1.4, -1.9, -0.6]
                      ];
                      for (var ci = 0; ci < 3; ci++) {
                        var cp = cParams[ci];
                        var bm = boxMeshes[ci];
                        if (!bm) continue;
                        bm.position.y = basePositions[ci][1] + Math.sin(t * cp.yFreq + cp.yPhase) * cp.yAmp;
                        bm.rotation.z = Math.sin(t * cp.zFreq + cp.yPhase * 0.7) * cp.zAmp;
                      }

                      glow.intensity = 2.6 + Math.sin(t * 1.1) * 0.5;

                      /* Wind streaks drift left → right */
                      var spa = streakLines.geometry.attributes.position;
                      for (var si2 = 0; si2 < streakCount; si2++) {
                        streakData[si2].x += streakData[si2].spd * 0.016;
                        /* gentle vertical undulation */
                        streakData[si2].y += Math.sin(t * 0.6 + si2 * 0.55) * 0.0018;
                        if (streakData[si2].x > 15) {
                          streakData[si2].x = -15 - streakData[si2].len;
                          streakData[si2].y  = (Math.random() - 0.5) * 13;
                        }
                        var sx = streakData[si2].x, sy = streakData[si2].y, sz = streakData[si2].z;
                        spa.setXYZ(si2 * 2,     sx,                    sy, sz);
                        spa.setXYZ(si2 * 2 + 1, sx + streakData[si2].len, sy, sz);
                      }
                      spa.needsUpdate = true;
                      /* Pulse global streak opacity for breathing effect */
                      streakMat.opacity = 0.13 + Math.sin(t * 0.7) * 0.05;

                      /* Air-cushion halos pulse with each container's Y position */
                      var haloBaseY = [-0.95, 0.18 + 2.1 - 0.65, -1.9 - 0.55 - 0.12];
                      for (var hi2 = 0; hi2 < 3; hi2++) {
                        var bm2 = boxMeshes[hi2];
                        if (!bm2 || !halos[hi2]) continue;
                        /* halo sits just below each container's current Y */
                        halos[hi2].position.y = bm2.position.y - 0.88;
                        halos[hi2].position.x = haloBase[hi2].bx;
                        halos[hi2].position.z = haloBase[hi2].bz;
                        /* opacity swells as container is highest in oscillation */
                        var lift = (Math.sin(t * cParams[hi2].yFreq + cParams[hi2].yPhase) + 1) * 0.5;
                        halos[hi2].material.opacity = 0.04 + lift * 0.10;
                        /* scale x with group rotation so it tracks visually */
                        halos[hi2].scale.x = haloBase[hi2].sx * (0.9 + lift * 0.15);
                      }

                      renderer.render(scene, camera);
                    })();
                  }
                  waitAndInit();
                })();
              `}} />
            </div>
          </div>
        </div>

        {/* Fade to next section */}
        <div style="position:absolute; bottom:0; left:0; right:0; height:80px; background:linear-gradient(to bottom, transparent, #F3F2F0); pointer-events:none;" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §2  MARQUEE — trust strip
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style="padding:24px 0; background:#F3F2F0; overflow:hidden; border-top:1px solid rgba(0,0,0,0.07); border-bottom:1px solid rgba(0,0,0,0.07);">
        <div style="display:flex; overflow:hidden; mask-image:linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%); -webkit-mask-image:linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);">
          <div class="animate-marquee" style="display:flex; gap:0; white-space:nowrap; flex-shrink:0;">
            {[
              'Express Freight Co.',
              'Pacific Logistics',
              'Harbour Carriers',
              'SydPort Forwarding',
              'BlueAnchor CFS',
              'Apex Customs',
              'Meridian Shipping',
              'Coastline Brokers',
              'Trident Freight',
              'Atlas Logistics',
              // duplicate for seamless loop
              'Express Freight Co.',
              'Pacific Logistics',
              'Harbour Carriers',
              'SydPort Forwarding',
              'BlueAnchor CFS',
              'Apex Customs',
              'Meridian Shipping',
              'Coastline Brokers',
              'Trident Freight',
              'Atlas Logistics',
            ].map((name, i) => (
              <span key={i} style="display:inline-flex; align-items:center; gap:20px; padding:0 32px; font-size:11px; font-weight:600; color:rgba(0,0,0,0.20); letter-spacing:0.06em; text-transform:uppercase;">
                <span style="width:3px; height:3px; border-radius:9999px; background:rgba(0,0,0,0.15); display:inline-block; flex-shrink:0;" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §4  HOW IT WORKS — numbered step cards with connector
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style="padding:80px 24px; background:#F3F2F0; border-top:1px solid rgba(0,0,0,0.07);">
        <div class="max-w-5xl mx-auto">

          {/* Header */}
          <div class="reveal" style="max-width:520px; margin-bottom:60px;">
            <p style="font-size:10px; font-weight:700; letter-spacing:0.10em; text-transform:uppercase; color:#FC6514; opacity:0.75; margin-bottom:10px;">How it works</p>
            <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem); font-weight:700; color:#1C1917; letter-spacing:-0.03em; line-height:1.1; margin-bottom:14px;">
              From browser to bay door in four steps
            </h2>
            <p style="font-size:14px; color:#78716C; line-height:1.7;">
              No spreadsheets. No radio calls. The whole check-in process runs online.
            </p>
          </div>

          {/* Steps grid */}
          <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:12px; position:relative;" class="steps-grid">

            {/* Connector line */}
            <div style="position:absolute; top:52px; left:calc(12.5% + 12px); right:calc(12.5% + 12px); height:1px; background:rgba(0,0,0,0.10); pointer-events:none; z-index:0;" class="hide-mobile" />

            {[
              { num: '01', icon: ICONS.users,   title: 'Your details',     desc: 'Name, service type, and cargo category. Takes 60 seconds.' },
              { num: '02', icon: ICONS.calendar, title: 'Pick a slot',     desc: 'Choose an open window — held for 10 min while you finish.' },
              { num: '03', icon: ICONS.document, title: 'Add shipment',    desc: 'Enter your HBL or container. ICS status fetched automatically.' },
              { num: '04', icon: ICONS.qrCode,   title: 'Scan & enter',   desc: 'Scan your QR at the kiosk. No counter queue, no wait.' },
            ].map((step, i) => (
              <div
                class="reveal gl-card"
                data-reveal-delay={String(i * 120)}
                style="position:relative; z-index:1; padding:24px 20px;"
              >
                {/* Step number pill */}
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px;">
                  <div style="width:36px; height:36px; border-radius:9999px; background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 12px rgba(252,101,20,0.35);">
                    <span style="font-size:12px; font-weight:700; color:white; letter-spacing:-0.01em;">{step.num}</span>
                  </div>
                  <div style="flex:1; height:1px; background:rgba(0,0,0,0.08); border-radius:9999px;" />
                </div>
                <div style="width:36px; height:36px; border-radius:9px; background:rgba(252,101,20,0.08); border:1px solid rgba(252,101,20,0.16); display:flex; align-items:center; justify-content:center; margin-bottom:14px;">
                  <Icon name={step.icon} size={16} style="color:#FC6514;" />
                </div>
                <p style="font-size:14px; font-weight:600; color:#1C1917; margin-bottom:8px; letter-spacing:-0.015em;">{step.title}</p>
                <p style="font-size:12.5px; color:#78716C; line-height:1.65;">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §5  FEATURES — asymmetric bento grid
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style="padding:80px 24px; background:#F3F2F0; border-top:1px solid rgba(0,0,0,0.07);">
        <div class="max-w-5xl mx-auto">

          {/* Header */}
          <div class="reveal" style="text-align:center; margin-bottom:56px;">
            <p style="font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#FC6514; margin-bottom:10px;">Built different</p>
            <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem); font-weight:700; color:#1C1917; letter-spacing:-0.03em; line-height:1.1; margin-bottom:14px;">
              Purpose-built for the depot floor
            </h2>
            <p style="font-size:14px; color:#78716C; max-width:440px; margin:0 auto; line-height:1.7;">
              Every feature exists because it solves a real operational headache at a Container Freight Station.
            </p>
          </div>

          {/* Bento grid — top row: 1 wide + 2 narrow */}
          <div style="display:grid; grid-template-columns:1.6fr 1fr 1fr; gap:12px; margin-bottom:12px;" class="bento-row">

            {/* Wide feature — Level 4 brand surface */}
            <div
              class="reveal-left noise"
              style="background:linear-gradient(135deg,rgba(252,101,20,0.15) 0%,rgba(232,90,10,0.08) 100%); border:1px solid rgba(252,101,20,0.22); border-radius:16px; padding:32px; position:relative; overflow:hidden; box-shadow:0 8px 32px rgba(252,101,20,0.12);"
            >
              <div style="position:absolute; top:-40px; right:-40px; width:180px; height:180px; border-radius:9999px; background:radial-gradient(circle, rgba(252,101,20,0.20) 0%, transparent 70%); pointer-events:none;" />
              <div style="width:48px; height:48px; border-radius:10px; background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); display:flex; align-items:center; justify-content:center; margin-bottom:20px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 14px rgba(252,101,20,0.40);">
                <Icon name={ICONS.shield} size={22} style="color:white;" />
              </div>
              <p style="font-size:16px; font-weight:600; color:#1C1917; letter-spacing:-0.02em; margin-bottom:10px;">Automatic ICS clearance check</p>
              <p style="font-size:13px; color:#78716C; line-height:1.7; max-width:280px;">
                Customs clearance status is fetched automatically the moment you enter your shipment number — no manual checks needed.
              </p>
              <div style="margin-top:24px; display:inline-flex; align-items:center; gap:6px; background:rgba(34,197,94,0.10); border:1px solid rgba(34,197,94,0.22); border-radius:9999px; padding:6px 12px;">
                <span class="gl-live-dot" style="width:6px; height:6px;" />
                <span style="font-size:11px; font-weight:500; color:#22C55E;">Clearance verified</span>
              </div>
            </div>

            {/* Narrow features */}
            {[
              { icon: ICONS.clock,   title: '10-min slot holds',    desc: 'Your preferred time is reserved while you complete the booking — zero double-bookings.' },
              { icon: ICONS.qrCode,  title: 'QR check-in kiosk',    desc: 'Scan at arrival. Skip the counter entirely.' },
            ].map((feat, i) => (
              <div
                class="reveal gl-card"
                data-reveal-delay={String((i + 1) * 100)}
                style="padding:28px;"
              >
                <div style="width:44px; height:44px; border-radius:10px; background:rgba(252,101,20,0.10); border:1px solid rgba(252,101,20,0.18); display:flex; align-items:center; justify-content:center; margin-bottom:18px;">
                  <Icon name={feat.icon} size={20} style="color:#FC6514;" />
                </div>
                <p style="font-size:14px; font-weight:600; color:#1C1917; letter-spacing:-0.015em; margin-bottom:8px;">{feat.title}</p>
                <p style="font-size:12.5px; color:#78716C; line-height:1.65;">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom row: 3 equal */}
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px;" class="bento-row">
            {[
              { icon: ICONS.warning, title: 'CHEP pallet alerts',    desc: 'System flags any pallet exchange requirements before you arrive at the depot.' },
              { icon: ICONS.users,   title: 'Agent bookings',         desc: 'Freight forwarders can book on behalf of drivers — no separate account needed.' },
              { icon: ICONS.reports, title: 'Reception dashboard',    desc: 'Staff see live bookings, walk-ins, and clearance holds in a single view.' },
            ].map((feat, i) => (
              <div
                class="reveal gl-card"
                data-reveal-delay={String(i * 80)}
                style="padding:28px;"
              >
                <div style="width:44px; height:44px; border-radius:10px; background:rgba(252,101,20,0.10); border:1px solid rgba(252,101,20,0.18); display:flex; align-items:center; justify-content:center; margin-bottom:18px;">
                  <Icon name={feat.icon} size={20} style="color:#FC6514;" />
                </div>
                <p style="font-size:14px; font-weight:600; color:#1C1917; letter-spacing:-0.015em; margin-bottom:8px;">{feat.title}</p>
                <p style="font-size:12.5px; color:#78716C; line-height:1.65;">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §6  TESTIMONIAL / TRUST QUOTE
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style="padding:80px 24px; background:#F3F2F0; border-top:1px solid rgba(0,0,0,0.06);">
        <div class="max-w-3xl mx-auto">
          <div
            class="reveal"
            style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.07); border-radius:16px;"
          >
            <div style="padding:52px 48px; text-align:center;">

              {/* Quote marks */}
              <div style="width:48px; height:48px; border-radius:10px; background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); display:flex; align-items:center; justify-content:center; margin:0 auto 28px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 14px rgba(252,101,20,0.40), 0 1px 3px rgba(0,0,0,0.40);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                </svg>
              </div>

              <blockquote style="font-size:clamp(1.1rem,2.5vw,1.4rem); font-weight:400; color:#1C1917; letter-spacing:-0.02em; line-height:1.55; margin-bottom:28px; font-style:italic;">
                "We used to spend 40 minutes every morning taking phone bookings and updating a whiteboard. Now drivers book online, the system handles ICS checks, and our gate time is down to under 4 minutes."
              </blockquote>

              <div style="display:flex; align-items:center; justify-content:center; gap:12px;">
                <div style="width:40px; height:40px; border-radius:8px; background:rgba(252,101,20,0.15); border:1px solid rgba(252,101,20,0.25); display:flex; align-items:center; justify-content:center;">
                  <Icon name={ICONS.users} size={18} style="color:#FC6514;" />
                </div>
                <div style="text-align:left;">
                  <p style="font-size:13px; font-weight:600; color:#1C1917;">James R.</p>
                  <p style="font-size:12px; color:#64748B;">Operations Manager, Sydney CFS</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §7  FINAL CTA — dark section
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style="padding:96px 24px; background:#F3F2F0; position:relative; overflow:hidden;">

        {/* Ambient glow */}
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:700px; height:400px; border-radius:9999px; background:radial-gradient(ellipse, rgba(252,101,20,0.12) 0%, transparent 65%); pointer-events:none;" />

        <div class="max-w-2xl mx-auto" style="text-align:center; position:relative; z-index:1;">

          <div class="reveal" style="display:inline-flex; align-items:center; gap:8px; border:1px solid rgba(252,101,20,0.25); border-radius:9999px; padding:7px 16px; margin-bottom:28px;">
            <span style="width:6px; height:6px; border-radius:9999px; background:#FC6514; animation:pulse-dot 2s ease-in-out infinite;" />
            <span style="font-size:11px; font-weight:500; color:rgba(252,101,20,0.85);">Open Mon–Fri 06:00–18:00</span>
          </div>

          <h2
            class="reveal"
            data-reveal-delay="100"
            style="font-size:clamp(2rem,5vw,3.2rem); font-weight:500; color:#1C1917; letter-spacing:-0.03em; line-height:1.1; margin-bottom:20px;"
          >
            Ready to skip<br />
            <span class="text-gradient-orange">the queue?</span>
          </h2>

          <p
            class="reveal"
            data-reveal-delay="150"
            style="font-size:14px; color:#78716C; line-height:1.7; margin-bottom:36px; max-width:380px; margin-left:auto; margin-right:auto;"
          >
            Your first booking takes under 3 minutes. No account, no calls, no paper.
          </p>

          <div
            class="reveal"
            data-reveal-delay="200"
            style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;"
          >
            <a href="/book" class="btn-primary" style="padding:14px 28px; font-size:14px;">
              <Icon name={ICONS.calendar} size={15} />
              Book a Visit
              <Icon name={ICONS.arrowRight} size={14} />
            </a>
            <a
              href="/bookings"
              style="display:inline-flex; align-items:center; gap:8px; padding:14px 24px; font-size:14px; font-weight:500; color:#78716C; border:1px solid rgba(0,0,0,0.10); border-radius:9999px; text-decoration:none; transition:border-color 0.15s ease, color 0.15s ease;"
              onmouseover="this.style.borderColor='rgba(0,0,0,0.25)'; this.style.color='#1C1917';"
              onmouseout="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.color='#78716C';"
            >
              <Icon name={ICONS.search} size={15} />
              Look Up Booking
            </a>
          </div>

          <p class="reveal" data-reveal-delay="250" style="font-size:12px; color:#64748B; margin-top:20px;">
            Sydney Container Freight Station · ABN 12 345 678 901
          </p>
        </div>
      </section>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bento-row  { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hide-mobile { display: none !important; }
        }
        @media (max-width: 640px) {
          section > div > div[style*="grid-template-columns:1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .steps-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .status-badge {
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(252,101,20,0.85);
          background: rgba(252,101,20,0.08);
          border: 1px solid rgba(252,101,20,0.20);
          border-radius: 9999px;
          padding: 6px 14px;
          backdrop-filter: blur(8px);
        }
      `}</style>

    </LandingLayout>
  )
})

// ─── Booking wizard ─────────────────────────────────────────────────────────
portalRoutes.get('/book', (c) => {
  return c.html(
    <PublicLayout title="Book a Visit">
      <BookingWizard />
    </PublicLayout>
  )
})

// ─── My Bookings ─────────────────────────────────────────────────────────────
portalRoutes.get('/bookings', async (c) => {
  const ref = c.req.query('ref')?.trim().toUpperCase()
  let bookings = ref ? [] : (await getBookings().catch(() => []))
  let heading  = 'My Bookings'

  if (ref) {
    const found = await findBooking(ref).catch(() => null)
    bookings = found ? [found] : []
    heading  = `Results for "${ref}"`
  }

  return c.html(
    <PublicLayout title="My Bookings">
      <div style="padding:40px 24px 64px;">
        <div style="max-width:640px; margin:0 auto;">

          {/* Page header */}
          <div style="margin-bottom:28px;">
            <h1 style="font-size:22px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; margin-bottom:4px;">My Bookings</h1>
            <p style="font-size:13px; color:#64748B;">Track the status of your depot slot bookings.</p>
          </div>

          {/* Search bar */}
          <form method="get" action="/bookings" style="display:flex; gap:8px; margin-bottom:28px;">
            <div style="flex:1; position:relative;">
              <input
                type="text"
                name="ref"
                value={ref || ''}
                placeholder="Booking reference — e.g. GLD-2026-10142"
                class="wizard-field"
                style="width:100%; padding:10px 14px; font-size:13.5px; border-radius:10px; outline:none; box-sizing:border-box; font-family:inherit;"
                onfocus="this.style.borderColor='rgba(252,101,20,0.50)';"
                onblur="this.style.borderColor='rgba(0,0,0,0.12)';"
              />
            </div>
            <button
              type="submit"
              class="btn-primary"
              style="padding:10px 20px; font-size:13px; white-space:nowrap; border:none; cursor:pointer;"
            >
              Search
            </button>
            {ref && (
              <a
                href="/bookings"
                class="btn-ghost"
                style="padding:10px 16px; font-size:13px; white-space:nowrap;"
              >
                Clear
              </a>
            )}
          </form>

          {ref && (
            <p style="font-size:12px; font-weight:500; color:#78716C; margin-bottom:16px;">{heading}</p>
          )}

          <MyBookingsList bookings={bookings} query={ref} />
        </div>
      </div>
    </PublicLayout>
  )
})

// ─── Shipment lookup API (called by Alpine wizard) ────────────────────────────
portalRoutes.post('/api/shipments/lookup', async (c) => {
  try {
    const body = await c.req.json<{ hbl?: string; container?: string; serviceType?: string; loadType?: string; slotDate?: string }>()
    const tenant = await getTenant(DEFAULT_TENANT_ID)
    if (!tenant) return c.json({ found: false, slotFee: 5 })

    // Look up shipment
    let shipment = body.hbl?.trim()
      ? await lookupShipment(DEFAULT_TENANT_ID, body.hbl.trim())
      : undefined
    if (!shipment && body.container?.trim()) {
      shipment = await lookupShipmentByContainer(DEFAULT_TENANT_ID, body.container.trim())
    }

    const slotDate = body.slotDate || new Date().toISOString().split('T')[0]
    const charges = calculateCharges({
      serviceType:      (body.serviceType as 'pickup' | 'dropoff') || 'pickup',
      loadType:         (body.loadType as 'fcl' | 'lcl') || 'lcl',
      weightKg:         shipment?.weightKg,
      volumeCbm:        shipment?.volumeCbm,
      palletCount:      shipment?.palletCount,
      palletType:       shipment?.palletType,
      storageStartDate: shipment?.storageStartDate,
      slotDate,
      tenant,
    })

    return c.json({
      found:              !!shipment,
      hbl:                shipment?.hbl,
      containerNumber:    shipment?.containerNumber,
      weightKg:           shipment?.weightKg,
      volumeCbm:          shipment?.volumeCbm,
      packageCount:       shipment?.packageCount,
      palletCount:        shipment?.palletCount,
      palletType:         shipment?.palletType,
      storageStartDate:   shipment?.storageStartDate,
      readyForCollection: shipment?.readyForCollection,
      icsStatus:          'unavailable', // real ICS API pending OQ-01
      ...charges,
    })
  } catch (err) {
    console.error('[portal] shipment lookup error:', err)
    return c.json({ found: false, slotFee: 5, subtotal: 5, gstAmount: 0.5, totalAmount: 5.5 })
  }
})

// ─── Tenant public config API ─────────────────────────────────────────────────
portalRoutes.get('/api/tenants/config', async (c) => {
  const tenant = await getTenant(DEFAULT_TENANT_ID).catch(() => null)
  if (!tenant) return c.json({ error: 'not found' }, 404)
  return c.json({
    name:                    tenant.name,
    primaryColor:            tenant.primary_color,
    slotDurationMin:         tenant.slot_duration_min,
    advanceBookingDays:      tenant.advance_booking_days,
    currency:                tenant.currency,
    gstEnabled:              tenant.gst_enabled,
    gstRate:                 tenant.gst_rate,
    eftBankName:             tenant.eft_bank_name,
    eftBsb:                  tenant.eft_bsb,
    eftAccountNumber:        tenant.eft_account_number,
    eftAccountName:          tenant.eft_account_name,
    slotFeePickup:           tenant.slot_fee_pickup,
    slotFeeDropoff:          tenant.slot_fee_dropoff,
    requirePaymentToConfirm: tenant.require_payment_to_confirm,
  })
})

// ─── Slots API for wizard Step 4 ─────────────────────────────────────────────
portalRoutes.get('/api/slots', async (c) => {
  const date = c.req.query('date')
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return c.json({ slots: [] })
  try {
    const slots = await getSlotsByDate(date)
    // If DB has no slots for this date, generate defaults from 06:00–18:00
    if (slots.length === 0) {
      const defaults = []
      const tenant = await getTenant(DEFAULT_TENANT_ID)
      const capacity = tenant?.max_bookings_per_slot ?? 10
      for (let h = 6; h < 18; h++) {
        const start = `${String(h).padStart(2, '0')}:00`
        const end   = `${String(h + 1).padStart(2, '0')}:00`
        defaults.push({ id: `gen-${date}-${h}`, startTime: start, endTime: end, capacity, confirmed: 0, held: 0, busyness: 'available' })
      }
      return c.json({ slots: defaults })
    }
    return c.json({ slots: slots.map(s => ({ id: s.id, startTime: s.startTime, endTime: s.endTime, capacity: s.capacity, confirmed: s.confirmed, held: s.held, busyness: s.busyness })) })
  } catch {
    return c.json({ slots: [] })
  }
})

// ─── Create booking (POST from wizard) ───────────────────────────────────────
portalRoutes.post('/bookings', async (c) => {
  const body = await c.req.parseBody()

  try {
    const booking = await createBooking({
      serviceType:      (body.serviceType as any) || 'pickup',
      loadType:         (body.loadType as any) || 'lcl',
      slotDate:         body.slotDate as string,
      slotStartTime:    body.slotStartTime as string,
      slotEndTime:      body.slotEndTime as string,
      driverName:       (body.driverName as string) || 'Guest',
      driverPhone:      body.driverPhone as string | undefined,
      guestName:        body.guestName as string | undefined,
      guestPhone:       body.guestPhone as string | undefined,
      houseBillNumber:  body.houseBillNumber as string | undefined,
      containerNumber:  body.containerNumber as string | undefined,
      weightKg:         body.weightKg ? Number(body.weightKg) : undefined,
      volumeCbm:        body.volumeCbm ? Number(body.volumeCbm) : undefined,
      packageCount:     body.packageCount ? Number(body.packageCount) : undefined,
      palletCount:      body.palletCount ? Number(body.palletCount) : undefined,
      palletType:       (body.palletType as any) || undefined,
      storageStartDate: body.storageStartDate as string | undefined,
      storageDays:      body.storageDays ? Number(body.storageDays) : undefined,
      storageCharge:    body.storageCharge ? Number(body.storageCharge) : undefined,
      shrinkWrapCharge: body.shrinkWrapCharge ? Number(body.shrinkWrapCharge) : undefined,
      slotFee:          body.slotFee ? Number(body.slotFee) : undefined,
      subtotal:         body.subtotal ? Number(body.subtotal) : undefined,
      gstAmount:        body.gstAmount ? Number(body.gstAmount) : undefined,
      totalAmount:      body.totalAmount ? Number(body.totalAmount) : undefined,
      paymentMethod:    (body.paymentMethod as any) || 'card',
      paymentStatus:    (body.paymentStatus as any) || 'pending',
      tenantId:         DEFAULT_TENANT_ID,
    })
    return c.redirect(`/booking-confirmed/${booking.referenceNumber}`)
  } catch (err) {
    console.error('[portal] createBooking error:', err)
    return c.html(
      <PublicLayout title="Booking Error">
        <div class="max-w-xl mx-auto px-4 py-16 text-center">
          <p class="text-xs font-medium mb-4" style="color:#DC2626;">Something went wrong creating your booking.</p>
          <a href="/book" class="text-xs underline" style="color:#FC6514;">Try again</a>
        </div>
      </PublicLayout>
    )
  }
})

// ─── Booking confirmed page (with QR) ────────────────────────────────────────
portalRoutes.get('/booking-confirmed/:ref', async (c) => {
  const ref     = c.req.param('ref').toUpperCase()
  const booking = await findBooking(ref).catch(() => null)
  if (!booking) return c.redirect('/bookings')

  const qrDataUrl = await generateQRDataURL(ref, 220).catch(() => '')
  const isEft     = booking.paymentMethod === 'eft'
  const tenant    = await getTenant(DEFAULT_TENANT_ID).catch(() => null)

  return c.html(
    <PublicLayout title="Booking Confirmed">
      <div style="min-height:calc(100vh - 56px); background:#F3F2F0; padding:40px 24px 64px;">
      <div class="max-w-2xl mx-auto">

        {/* Success banner */}
        <div
          class="flex items-center gap-3 rounded-xl px-5 py-4 mb-8"
          style="background:rgba(34,197,94,0.10); border:1px solid rgba(34,197,94,0.22);"
        >
          <div
            style="width:40px; height:40px; border-radius:9999px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:linear-gradient(180deg,#4ADE80 0%,#16A34A 100%); box-shadow:0 4px 12px rgba(34,197,94,0.35);"
          >
            <Icon name={ICONS.check} size={20} style="color:white;" />
          </div>
          <div>
            <p style="font-size:13px; font-weight:600; color:#22C55E;">Booking Confirmed!</p>
            <p style="font-size:12px; font-family:ui-monospace,monospace; font-weight:700; color:#78716C; margin-top:2px;">{ref}</p>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-6">
          {/* QR Code */}
          <div
            style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:32px 24px; border-radius:16px; background:rgba(0,0,0,0.03); border:1px solid rgba(0,0,0,0.08);"
          >
            <img src={qrDataUrl} alt={`QR code for ${ref}`} width={220} height={220} style="border-radius:8px;" />
            <p style="font-size:12px; font-weight:500; color:#64748B; margin-top:14px;">Scan at the kiosk to check in</p>
            <p style="font-size:12px; font-family:ui-monospace,monospace; font-weight:700; color:#1C1917; margin-top:4px;">{ref}</p>
          </div>

          {/* Booking summary */}
          <div style="display:flex; flex-direction:column; gap:14px;">
            <div
              style="border-radius:12px; padding:16px; background:rgba(0,0,0,0.03); border:1px solid rgba(0,0,0,0.08);"
            >
              <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#64748B; margin-bottom:12px;">Booking Details</p>
              <div style="display:flex; flex-direction:column; gap:7px; font-size:12px;">
                {[
                  { label: 'Driver', value: booking.driverName },
                  { label: 'Service', value: booking.serviceType === 'pickup' ? 'Pick Up' : 'Drop Off' },
                  { label: 'Load type', value: booking.loadType.toUpperCase() },
                  { label: 'Date', value: booking.slotDate },
                  { label: 'Time', value: `${booking.slotStartTime} – ${booking.slotEndTime}` },
                  ...(booking.houseBillNumber ? [{ label: 'HBL', value: booking.houseBillNumber }] : []),
                  ...(booking.containerNumber ? [{ label: 'Container', value: booking.containerNumber }] : []),
                ].map((row) => (
                  <div key={row.label} style="display:flex; justify-content:space-between;">
                    <span style="color:#64748B;">{row.label}</span>
                    <span style="font-weight:500; color:#1C1917;">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Charges */}
            {booking.totalAmount && (
              <div
                style="border-radius:12px; padding:16px; background:rgba(0,0,0,0.03); border:1px solid rgba(0,0,0,0.08);"
              >
                <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#64748B; margin-bottom:12px;">Charges</p>
                <div style="display:flex; flex-direction:column; gap:6px; font-size:12px;">
                  {(booking.storageCharge ?? 0) > 0 && (
                    <div style="display:flex; justify-content:space-between; color:#78716C;"><span>Storage</span><span>${booking.storageCharge!.toFixed(2)}</span></div>
                  )}
                  {(booking.shrinkWrapCharge ?? 0) > 0 && (
                    <div style="display:flex; justify-content:space-between; color:#78716C;"><span>Shrink wrap</span><span>${booking.shrinkWrapCharge!.toFixed(2)}</span></div>
                  )}
                  {(booking.slotFee ?? 0) > 0 && (
                    <div style="display:flex; justify-content:space-between; color:#78716C;"><span>Slot fee</span><span>${booking.slotFee!.toFixed(2)}</span></div>
                  )}
                  {(booking.gstAmount ?? 0) > 0 && (
                    <div style="display:flex; justify-content:space-between; color:#64748B; padding-top:6px; border-top:1px solid rgba(0,0,0,0.07);"><span>GST (10%)</span><span>${booking.gstAmount!.toFixed(2)}</span></div>
                  )}
                  <div style="display:flex; justify-content:space-between; font-weight:700; color:#1C1917; padding-top:6px; border-top:1px solid rgba(0,0,0,0.09);">
                    <span>Total</span>
                    <span style="color:#FC6514;">${booking.totalAmount.toFixed(2)}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; color:#64748B;">
                    <span>{booking.paymentMethod?.toUpperCase()}</span>
                    <span style={booking.paymentStatus === 'paid' ? 'color:#22C55E; font-weight:500;' : 'color:#FBBF24; font-weight:500;'}>
                      {booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus === 'pending_eft' ? 'EFT Pending' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* EFT bank details */}
            {isEft && tenant && (
              <div
                style="border-radius:12px; padding:16px; background:rgba(252,101,20,0.06); border:1px solid rgba(252,101,20,0.20);"
              >
                <p style="font-size:11px; font-weight:600; color:#FC6514; margin-bottom:10px;">Transfer details</p>
                <div style="display:flex; flex-direction:column; gap:6px; font-size:12px; color:rgba(252,101,20,0.65);">
                  <div style="display:flex; justify-content:space-between;"><span>Bank</span><span style="font-weight:500; color:#FC6514;">{tenant.eft_bank_name || '—'}</span></div>
                  <div style="display:flex; justify-content:space-between;"><span>BSB</span><span style="font-family:ui-monospace,monospace; font-weight:500; color:#FC6514;">{tenant.eft_bsb || '—'}</span></div>
                  <div style="display:flex; justify-content:space-between;"><span>Account No.</span><span style="font-family:ui-monospace,monospace; font-weight:500; color:#FC6514;">{tenant.eft_account_number || '—'}</span></div>
                  <div style="display:flex; justify-content:space-between;"><span>Account Name</span><span style="font-weight:500; color:#FC6514;">{tenant.eft_account_name || '—'}</span></div>
                  <div style="display:flex; justify-content:space-between;"><span>Reference</span><span style="font-family:ui-monospace,monospace; font-weight:700; color:#FC6514;">{ref}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CHEP warning */}
        {booking.palletType === 'chep' && (
          <div
            style="display:flex; align-items:flex-start; gap:10px; border-radius:10px; padding:12px 16px; margin-top:20px; background:rgba(251,191,36,0.07); border:1px solid rgba(251,191,36,0.20);"
          >
            <Icon name={ICONS.warning} size={16} style="color:#FBBF24; flex-shrink:0; margin-top:2px;" />
            <p style="font-size:12px; font-weight:500; color:rgba(251,191,36,0.75); line-height:1.5;">
              Remember: Bring {booking.palletCount} empty CHEP pallet{(booking.palletCount ?? 1) > 1 ? 's' : ''} to exchange at collection.
            </p>
          </div>
        )}

        {/* Actions */}
        <div class="flex flex-wrap gap-3 mt-8 justify-center">
          <a
            href="/book"
            class="btn-primary"
            style="padding:11px 22px; font-size:13px;"
          >
            <Icon name={ICONS.add} size={14} />
            Book Another Visit
          </a>
          <a
            href={`/bookings?ref=${ref}`}
            class="btn-ghost"
            style="padding:11px 20px; font-size:13px;"
          >
            <Icon name={ICONS.search} size={14} />
            View My Bookings
          </a>
        </div>

      </div>
      </div>
    </PublicLayout>
  )
})
