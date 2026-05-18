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

      {/* ══════════════════════════════════════════════════════════════════
          §1  HERO — all-light, interactive 3D containers
      ══════════════════════════════════════════════════════════════════ */}
      <section style="background:#F3F2F0; overflow:hidden; position:relative; min-height:88vh; display:flex; align-items:center;">

        {/* Subtle dot grid */}
        <div style="position:absolute; inset:0; background-image:radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px); background-size:28px 28px; pointer-events:none; opacity:0.6;" />

        <div class="max-w-6xl mx-auto px-6 w-full" style="padding-top:5rem; padding-bottom:6rem; position:relative; z-index:1;">
          <div style="display:grid; grid-template-columns:1fr 1.15fr; gap:64px; align-items:center;" class="hero-grid">

            {/* Left: copy */}
            <div>
              <div style="display:inline-flex; align-items:center; gap:7px; padding:5px 14px; border-radius:9999px; background:rgba(34,197,94,0.09); border:1px solid rgba(34,197,94,0.22); margin-bottom:28px;">
                <span style="width:6px; height:6px; border-radius:9999px; background:#22C55E; flex-shrink:0; animation:pulse-dot 2s ease-in-out infinite;" />
                <span style="font-size:11px; font-weight:600; color:#16A34A; letter-spacing:0.01em;">Open today · Mon–Fri 06:00–18:00</span>
              </div>

              <h1 style="font-size:clamp(2.4rem,4.4vw,3.6rem); font-weight:800; color:#1C1917; letter-spacing:-0.045em; line-height:1.03; margin-bottom:22px;">
                <span style="display:block;">Book your CFS slot.</span>
                <span style="display:block; color:#FC6514;">Skip the queue.</span>
              </h1>

              <p style="font-size:15px; color:#78716C; line-height:1.8; max-width:420px; margin-bottom:36px;">
                Schedule a pick-up or drop-off online, arrive at your window, scan your QR code at the kiosk — done. No calls, no whiteboards, no waiting.
              </p>

              <div style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:40px;">
                <a href="/book" class="btn-primary" style="padding:13px 26px; font-size:13.5px;">
                  <Icon name={ICONS.calendar} size={15} />
                  Book a Slot
                  <Icon name={ICONS.arrowRight} size={14} />
                </a>
                <a href="#how-it-works" class="btn-ghost" style="padding:13px 22px; font-size:13.5px;">
                  How it works
                </a>
              </div>

              {/* Trust row */}
              <div style="display:flex; align-items:center; gap:0; border-top:1px solid rgba(0,0,0,0.07); padding-top:24px;">
                {[
                  { v: '4 min',  l: 'avg gate time'      },
                  { v: '0',      l: 'phone calls needed'  },
                  { v: '24/7',   l: 'online booking'      },
                  { v: '99.2%',  l: 'on-time arrivals'    },
                ].map((s, i) => (
                  <div key={s.v} style={`flex:1; text-align:center; ${i > 0 ? 'border-left:1px solid rgba(0,0,0,0.07);' : ''} padding:0 16px;`}>
                    <span style="display:block; font-size:18px; font-weight:800; color:#1C1917; letter-spacing:-0.04em; line-height:1;">{s.v}</span>
                    <span style="display:block; font-size:10.5px; color:#A8A29E; margin-top:3px; font-weight:500;">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: interactive 3D */}
            <div style="position:relative;">
              <canvas id="hero-3d" style="width:100%; height:460px; display:block; cursor:grab; border-radius:20px;" />

              {/* Drag hint */}
              <div id="drag-hint" style="position:absolute; bottom:16px; left:50%; transform:translateX(-50%); background:rgba(28,25,23,0.65); backdrop-filter:blur(10px); border-radius:9999px; padding:5px 14px; display:inline-flex; align-items:center; gap:6px; transition:opacity 0.6s ease; pointer-events:none;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round"><path d="M8 9V5a2 2 0 0 1 4 0v4M8 9a2 2 0 0 0-2 2v5a6 6 0 0 0 12 0v-5a2 2 0 0 0-2-2"/><path d="M12 9v3"/></svg>
                <span style="font-size:10.5px; color:rgba(255,255,255,0.65); font-weight:500; white-space:nowrap;">Drag to rotate · Scroll to zoom</span>
              </div>

              {/* Container info label */}
              <div id="container-label" style="position:absolute; top:16px; left:16px; background:rgba(255,255,255,0.90); backdrop-filter:blur(12px); border:1px solid rgba(0,0,0,0.09); border-radius:10px; padding:9px 14px; display:flex; align-items:center; gap:0; opacity:0; transition:opacity 0.25s ease; pointer-events:none; box-shadow:0 2px 12px rgba(0,0,0,0.08);">
              </div>

              <script dangerouslySetInnerHTML={{ __html: `
(function(){
  function init(){
    if(typeof THREE==='undefined'){setTimeout(init,60);return;}
    var canvas=document.getElementById('hero-3d');
    if(!canvas)return;
    var W=canvas.parentElement.offsetWidth||480, H=460;
    canvas.width=W*window.devicePixelRatio; canvas.height=H*window.devicePixelRatio;
    var scene=new THREE.Scene();
    var camera=new THREE.PerspectiveCamera(36,W/H,0.1,100);
    camera.position.set(0,2,13);
    camera.lookAt(0,0,0);
    var renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.setClearColor(0,0);

    // Lights — bright daylight
    scene.add(new THREE.AmbientLight(0xffffff,1.4));
    var sun=new THREE.DirectionalLight(0xfff8f0,2.4); sun.position.set(6,12,8); scene.add(sun);
    var fill=new THREE.DirectionalLight(0xe8f4ff,0.9); fill.position.set(-10,3,-5); scene.add(fill);
    var under=new THREE.DirectionalLight(0xffffff,0.35); under.position.set(0,-6,0); scene.add(under);

    // Helper: create mesh
    function mk(geo,mat,x,y,z){var m=new THREE.Mesh(geo,mat); if(x!==undefined)m.position.set(x,y,z); return m;}

    // Container builder
    function mkContainer(len,h,d,mainCol,darkCol){
      var g=new THREE.Group();
      var mMain=new THREE.MeshPhongMaterial({color:mainCol,shininess:24,specular:0x181818});
      var mDark=new THREE.MeshPhongMaterial({color:darkCol,shininess:44,specular:0x282828});
      var mCast=new THREE.MeshPhongMaterial({color:0x181818,shininess:150,specular:0x444444});

      // Body
      g.add(mk(new THREE.BoxGeometry(len,h,d),mMain));

      // Vertical corrugation ribs on front & back long faces
      var nR=Math.round(len/0.34);
      var sR=len/nR;
      for(var i=0;i<nR;i++){
        var rx=-len/2+(i+0.5)*sR;
        var rw=sR*0.44;
        var rf=mk(new THREE.BoxGeometry(rw,h*0.93,0.03),mDark,rx,0,d/2+0.011);
        var rb=mk(new THREE.BoxGeometry(rw,h*0.93,0.03),mDark,rx,0,-d/2-0.011);
        g.add(rf); g.add(rb);
      }

      // Horizontal ribs on short non-door end (left face)
      var nE=3;
      var seH=h/nE;
      for(var j=0;j<nE;j++){
        var ey=-h/2+(j+0.5)*seH;
        var ew=seH*0.48;
        var re=mk(new THREE.BoxGeometry(0.028,ew,d*0.93),mDark,-len/2-0.012,ey,0);
        g.add(re);
      }

      // Top rail
      g.add(mk(new THREE.BoxGeometry(len+0.06,0.065,d+0.06),mDark,0,h/2+0.024,0));
      // Bottom rail
      g.add(mk(new THREE.BoxGeometry(len+0.06,0.065,d+0.06),mDark,0,-h/2-0.024,0));
      // Mid rail on long sides
      g.add(mk(new THREE.BoxGeometry(len+0.04,0.045,0.028),mDark,0,0,d/2+0.024));
      g.add(mk(new THREE.BoxGeometry(len+0.04,0.045,0.028),mDark,0,0,-d/2-0.024));

      // Corner posts (4 vertical, full height)
      [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(s){
        g.add(mk(new THREE.BoxGeometry(0.08,h+0.06,0.08),mDark,s[0]*(len/2),0,s[1]*(d/2)));
      });

      // Corner castings — all 8 (ISO corner fittings)
      [[1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],[-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1]].forEach(function(s){
        var cc=mk(new THREE.BoxGeometry(0.15,0.12,0.15),mCast,s[0]*(len/2+0.03),s[1]*(h/2+0.034),s[2]*(d/2+0.03));
        g.add(cc);
        // Oval hole in casting (approximated as darker inset box)
        var ch=mk(new THREE.BoxGeometry(0.07,0.06,0.04),new THREE.MeshPhongMaterial({color:0x080808}),s[0]*(len/2+0.055),s[1]*(h/2+0.034),s[2]*(d/2+0.03));
        g.add(ch);
      });

      // Door end details (positive X face)
      var mDoor=new THREE.MeshPhongMaterial({color:darkCol,shininess:35,specular:0x222222});
      // Two door panels
      var dPanW=d/2-0.04;
      var dpL=mk(new THREE.BoxGeometry(0.025,h*0.96,dPanW),mDoor,len/2+0.012,0,-d/4);
      var dpR=mk(new THREE.BoxGeometry(0.025,h*0.96,dPanW),mDoor,len/2+0.012,0,d/4);
      g.add(dpL); g.add(dpR);
      // Cam-lock rods (vertical, 2 per panel)
      [-d*0.38,-d*0.12,d*0.12,d*0.38].forEach(function(dz){
        var rod=mk(new THREE.CylinderGeometry(0.018,0.018,h*0.82,8),mCast,len/2+0.038,0,dz);
        g.add(rod);
      });
      // Center vertical gap
      g.add(mk(new THREE.BoxGeometry(0.015,h,0.015),mCast,len/2+0.04,0,0));
      // Hinge strips on door edge
      [-h*0.28,0,h*0.28].forEach(function(hy){
        g.add(mk(new THREE.BoxGeometry(0.035,0.06,0.035),mCast,len/2+0.04,hy,-d/2+0.04));
        g.add(mk(new THREE.BoxGeometry(0.035,0.06,0.035),mCast,len/2+0.04,hy,d/2-0.04));
      });

      return g;
    }

    var world=new THREE.Group();

    // Container 1 — 40ft Orange (brand), slightly angled, front-center
    var c1=mkContainer(3.8,0.96,0.82,0xFC6514,0xB54100);
    c1.rotation.y=0.22; c1.position.set(-0.3,0,0);
    world.add(c1);

    // Container 2 — 20ft Steel Blue, elevated, slightly behind
    var c2=mkContainer(2.0,0.88,0.76,0x1B5FA8,0x0F3E72);
    c2.rotation.y=-0.28; c2.position.set(0.6,1.06,-0.6);
    world.add(c2);

    // Container 3 — 20ft Shipping Green, low, partially behind
    var c3=mkContainer(2.2,0.90,0.78,0x2D6B3E,0x1B4228);
    c3.rotation.y=0.48; c3.position.set(-1.1,-1.08,-0.4);
    world.add(c3);

    scene.add(world);

    // Collect all meshes for raycasting
    var allMeshes=[];
    world.traverse(function(obj){if(obj.isMesh)allMeshes.push(obj);});
    var containers=[c1,c2,c3];
    var cInfo=[
      {ref:'MSCU·184729',type:'40ft HC',size:'12.2m',status:'ICS Cleared'},
      {ref:'COSU·037614',type:'20ft Std',size:'6.1m',status:'Confirmed'},
      {ref:'OOLU·295183',type:'20ft Std',size:'6.1m',status:'On Site'},
    ];

    function getContainer(obj){
      for(var i=0;i<containers.length;i++){
        var found=false;
        containers[i].traverse(function(c){if(c===obj)found=true;});
        if(found)return i;
      }
      return -1;
    }

    // Raycaster & hover
    var ray=new THREE.Raycaster();
    var m2=new THREE.Vector2();
    var hovered=-1, selected=-1;
    function setEmissive(idx,val){
      containers.forEach(function(con,ci){
        con.traverse(function(obj){
          if(obj.isMesh&&obj.material&&obj.material.emissive){
            obj.material.emissive.setHex(ci===idx?val:0x000000);
            obj.material.emissiveIntensity=(ci===idx?1:0);
          }
        });
      });
    }

    // Drag
    var dragging=false, lastX=0, lastY=0, clickX=0, clickY=0;
    canvas.addEventListener('mousedown',function(e){
      dragging=true; lastX=e.clientX; lastY=e.clientY;
      clickX=e.clientX; clickY=e.clientY;
      canvas.style.cursor='grabbing';
    });
    window.addEventListener('mouseup',function(){
      if(dragging){dragging=false; canvas.style.cursor=hovered>=0?'pointer':'grab';}
    });
    window.addEventListener('mousemove',function(e){
      if(dragging){
        world.rotation.y+=(e.clientX-lastX)*0.009;
        world.rotation.x=Math.max(-0.65,Math.min(0.65,world.rotation.x+(e.clientY-lastY)*0.007));
        lastX=e.clientX; lastY=e.clientY;
      } else {
        var r=canvas.getBoundingClientRect();
        m2.x=((e.clientX-r.left)/r.width)*2-1;
        m2.y=-((e.clientY-r.top)/r.height)*2+1;
      }
    });

    // Scroll zoom
    canvas.addEventListener('wheel',function(e){
      e.preventDefault();
      camera.position.z=Math.max(6,Math.min(18,camera.position.z+e.deltaY*0.014));
    },{passive:false});

    // Touch
    var tX=0,tY=0,tDist=0;
    canvas.addEventListener('touchstart',function(e){
      if(e.touches.length===1){tX=e.touches[0].clientX;tY=e.touches[0].clientY;}
      if(e.touches.length===2){var dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY;tDist=Math.sqrt(dx*dx+dy*dy);}
    },{passive:true});
    canvas.addEventListener('touchmove',function(e){
      e.preventDefault();
      if(e.touches.length===1){
        world.rotation.y+=(e.touches[0].clientX-tX)*0.009;
        world.rotation.x=Math.max(-0.65,Math.min(0.65,world.rotation.x+(e.touches[0].clientY-tY)*0.007));
        tX=e.touches[0].clientX;tY=e.touches[0].clientY;
      }
      if(e.touches.length===2){
        var dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY;
        var nd=Math.sqrt(dx*dx+dy*dy);
        camera.position.z=Math.max(6,Math.min(18,camera.position.z+(tDist-nd)*0.025));
        tDist=nd;
      }
    },{passive:false});

    // Click to select
    canvas.addEventListener('click',function(e){
      if(Math.abs(e.clientX-clickX)+Math.abs(e.clientY-clickY)>5)return;
      ray.setFromCamera(m2,camera);
      var hits=ray.intersectObjects(allMeshes,false);
      var lbl=document.getElementById('container-label');
      if(hits.length>0){
        var ci=getContainer(hits[0].object);
        if(ci>=0){
          selected=ci;
          if(lbl){
            var inf=cInfo[ci];
            lbl.innerHTML='<span style="font-size:11px;font-weight:700;color:#FC6514;font-family:ui-monospace,monospace;">'+inf.ref+'</span><span style="font-size:11px;color:#57534E;margin-left:8px;">'+inf.type+' · '+inf.size+'</span><span style="font-size:10px;font-weight:600;background:rgba(34,197,94,0.12);color:#16A34A;border:1px solid rgba(34,197,94,0.22);border-radius:99px;padding:2px 8px;margin-left:8px;">'+inf.status+'</span>';
            lbl.style.opacity='1';
          }
        }
      } else {
        selected=-1;
        if(lbl)lbl.style.opacity='0';
      }
    });

    // Fade hint after 4s
    var hint=document.getElementById('drag-hint');
    if(hint)setTimeout(function(){hint.style.opacity='0';},4000);

    window.addEventListener('resize',function(){
      var W2=canvas.parentElement.offsetWidth||480;
      camera.aspect=W2/H;camera.updateProjectionMatrix();renderer.setSize(W2,H);
    });

    var t0=performance.now();
    (function loop(){
      requestAnimationFrame(loop);
      var t=(performance.now()-t0)*0.001;
      if(!dragging){
        world.rotation.y+=0.004;
        c1.position.y=Math.sin(t*0.44)*0.055;
        c2.position.y=1.06+Math.sin(t*0.57+1.2)*0.048;
        c3.position.y=-1.08+Math.sin(t*0.39+2.5)*0.065;
      }
      // Hover detection
      if(!dragging){
        ray.setFromCamera(m2,camera);
        var hits2=ray.intersectObjects(allMeshes,false);
        var nh=hits2.length>0?getContainer(hits2[0].object):-1;
        if(nh!==hovered){
          hovered=nh;
          canvas.style.cursor=nh>=0?'pointer':'grab';
          setEmissive(nh===selected?selected:nh,0x221100);
        }
      }
      renderer.render(scene,camera);
    })();
  }
  init();
})();
              `}} />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §2  MARQUEE
      ══════════════════════════════════════════════════════════════════ */}
      <section style="padding:18px 0; background:#FFFFFF; overflow:hidden; border-top:1px solid rgba(0,0,0,0.06); border-bottom:1px solid rgba(0,0,0,0.06);">
        <div style="display:flex; overflow:hidden; mask-image:linear-gradient(to right,transparent,black 12%,black 88%,transparent); -webkit-mask-image:linear-gradient(to right,transparent,black 12%,black 88%,transparent);">
          <div class="animate-marquee" style="display:flex; gap:0; white-space:nowrap; flex-shrink:0;">
            {[
              'Express Freight Co.','Pacific Logistics','Harbour Carriers','SydPort Forwarding',
              'BlueAnchor CFS','Apex Customs','Meridian Shipping','Coastline Brokers','Trident Freight','Atlas Logistics',
              'Express Freight Co.','Pacific Logistics','Harbour Carriers','SydPort Forwarding',
              'BlueAnchor CFS','Apex Customs','Meridian Shipping','Coastline Brokers','Trident Freight','Atlas Logistics',
            ].map((name, i) => (
              <span key={i} style="display:inline-flex; align-items:center; gap:18px; padding:0 26px; font-size:11px; font-weight:600; color:rgba(0,0,0,0.22); letter-spacing:0.07em; text-transform:uppercase;">
                <span style="width:3px; height:3px; border-radius:9999px; background:rgba(252,101,20,0.40); display:inline-block; flex-shrink:0;" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §3  HOW IT WORKS
      ══════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style="padding:96px 24px; background:#FFFFFF;">
        <div class="max-w-5xl mx-auto">
          <div class="reveal" style="margin-bottom:56px;">
            <p style="font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#FC6514; margin-bottom:10px;">How it works</p>
            <h2 style="font-size:clamp(1.8rem,3.2vw,2.5rem); font-weight:800; color:#1C1917; letter-spacing:-0.04em; line-height:1.1; margin-bottom:12px; max-width:500px;">
              From browser to bay door in four steps
            </h2>
            <p style="font-size:14px; color:#78716C; line-height:1.75; max-width:400px;">
              No spreadsheets. No radio calls. The whole process is online.
            </p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:2px; background:rgba(0,0,0,0.06); border-radius:20px; overflow:hidden;" class="steps-grid-new">
            {[
              { num:'01', icon:ICONS.users,    title:'Your details',  desc:'Name, service type, cargo category. Under 60 seconds.' },
              { num:'02', icon:ICONS.calendar,  title:'Pick a slot',   desc:'Choose a window — held 10 min while you finish booking.' },
              { num:'03', icon:ICONS.document,  title:'Add shipment',  desc:'Enter HBL or container. ICS clearance is auto-checked.' },
              { num:'04', icon:ICONS.qrCode,    title:'Scan & enter',  desc:'Scan your QR at the kiosk. No counter. No wait.' },
            ].map((step, i) => (
              <div key={step.num} class="reveal" data-reveal-delay={String(i*80)}
                style="background:#FFFFFF; padding:32px 26px; transition:background 0.15s ease;"
                onmouseover="this.style.background='#FFFAF7';"
                onmouseout="this.style.background='#FFFFFF';">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px;">
                  <span style="font-size:12px; font-weight:800; color:rgba(252,101,20,0.35); letter-spacing:0.04em;">{step.num}</span>
                  <div style="width:40px; height:40px; border-radius:11px; background:#FFF3EC; border:1px solid rgba(252,101,20,0.14); display:flex; align-items:center; justify-content:center;">
                    <Icon name={step.icon} size={18} style="color:#FC6514;" />
                  </div>
                </div>
                <p style="font-size:14px; font-weight:700; color:#1C1917; margin-bottom:7px; letter-spacing:-0.02em;">{step.title}</p>
                <p style="font-size:12.5px; color:#78716C; line-height:1.65;">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §4  PLATFORM PREVIEW
      ══════════════════════════════════════════════════════════════════ */}
      <section style="padding:96px 24px; background:#F7F6F5; border-top:1px solid rgba(0,0,0,0.06);">
        <div class="max-w-5xl mx-auto">
          <div style="display:grid; grid-template-columns:1fr 1.7fr; gap:56px; align-items:center;" class="preview-grid">

            <div class="reveal-left">
              <p style="font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#FC6514; margin-bottom:10px;">Operations centre</p>
              <h2 style="font-size:clamp(1.6rem,2.8vw,2.2rem); font-weight:800; color:#1C1917; letter-spacing:-0.04em; line-height:1.1; margin-bottom:14px;">
                Everything reception needs in one view
              </h2>
              <p style="font-size:14px; color:#78716C; line-height:1.75; margin-bottom:28px;">
                Live bookings, walk-in queue, ICS hold flags, and gate activity — all updated in real time.
              </p>
              <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:28px;">
                {[
                  { icon:ICONS.userCheck, label:'Live check-in feed',  sub:'See who is on site right now' },
                  { icon:ICONS.warning,   label:'ICS hold alerts',      sub:'Flagged before they reach the gate' },
                  { icon:ICONS.reports,   label:'End-of-day reports',   sub:'PDF export in one click' },
                ].map(item => (
                  <div key={item.label} style="display:flex; align-items:flex-start; gap:11px;">
                    <div style="width:34px; height:34px; border-radius:9px; background:#FFFFFF; border:1px solid rgba(0,0,0,0.09); box-shadow:0 1px 3px rgba(0,0,0,0.04); display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px;">
                      <Icon name={item.icon} size={15} style="color:#FC6514;" />
                    </div>
                    <div>
                      <p style="font-size:13px; font-weight:600; color:#1C1917; margin-bottom:1px;">{item.label}</p>
                      <p style="font-size:12px; color:#A8A29E;">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="/reception" style="display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:600; color:#FC6514; text-decoration:none; transition:opacity 0.15s ease;"
                onmouseover="this.style.opacity='0.75';" onmouseout="this.style.opacity='1';">
                View Reception Dashboard <Icon name={ICONS.arrowRight} size={13} />
              </a>
            </div>

            {/* Dashboard mockup — light style */}
            <div class="reveal-right" style="border-radius:16px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.10); border:1px solid rgba(0,0,0,0.08);">
              {/* Light title bar */}
              <div style="background:#FFFFFF; border-bottom:1px solid rgba(0,0,0,0.07); padding:11px 16px; display:flex; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:7px;">
                  <div style="display:flex; gap:5px;">
                    <div style="width:10px; height:10px; border-radius:9999px; background:rgba(0,0,0,0.08);" />
                    <div style="width:10px; height:10px; border-radius:9999px; background:rgba(0,0,0,0.06);" />
                    <div style="width:10px; height:10px; border-radius:9999px; background:rgba(0,0,0,0.04);" />
                  </div>
                  <span style="font-size:11px; font-weight:500; color:#A8A29E; margin-left:4px;">Reception · Dashboard</span>
                </div>
                <div style="display:flex; align-items:center; gap:5px;">
                  <span style="width:5px; height:5px; border-radius:9999px; background:#22C55E; animation:pulse-dot 2s ease-in-out infinite;" />
                  <span style="font-size:10px; color:#A8A29E; font-weight:500;">Live</span>
                </div>
              </div>
              {/* KPI row */}
              <div style="background:#F7F6F5; padding:10px; display:grid; grid-template-columns:repeat(4,1fr); gap:6px;">
                {[
                  {label:'Scheduled',val:'24',c:'#1C1917'},{label:'On Site',val:'7',c:'#22C55E'},
                  {label:'Completed',val:'11',c:'#78716C'},{label:'ICS Held',val:'2',c:'#EF4444'},
                ].map(k=>(
                  <div key={k.label} style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.07); border-radius:10px; padding:10px 12px;">
                    <p style={`font-size:22px; font-weight:800; color:${k.c}; letter-spacing:-0.04em; line-height:1; margin-bottom:2px;`}>{k.val}</p>
                    <p style="font-size:10px; color:#A8A29E; font-weight:500;">{k.label}</p>
                  </div>
                ))}
              </div>
              {/* Table */}
              <div style="background:#FFFFFF;">
                <div style="display:grid; grid-template-columns:1fr 72px 80px 28px; padding:8px 14px; border-bottom:1px solid rgba(0,0,0,0.06); background:#F7F6F5;">
                  {['Visitor','Slot','Status',''].map(h=>(
                    <span key={h} style="font-size:9.5px; font-weight:700; color:#A8A29E; letter-spacing:0.07em; text-transform:uppercase;">{h}</span>
                  ))}
                </div>
                {[
                  {name:'A. Rahman',  ref:'MSCU·184',time:'08:30',status:'On Site',  sc:'rgba(34,197,94,0.10)',tc:'#16A34A'},
                  {name:'T. Nguyen',  ref:'COSU·456',time:'09:00',status:'Confirmed',sc:'rgba(251,191,36,0.10)',tc:'#B45309'},
                  {name:'J. Smith',   ref:'OOLU·789',time:'09:30',status:'Confirmed',sc:'rgba(251,191,36,0.10)',tc:'#B45309'},
                  {name:'M. Al-Farsi',ref:'MSCU·321',time:'10:00',status:'ICS Hold', sc:'rgba(239,68,68,0.10)', tc:'#DC2626'},
                ].map((row,ri)=>(
                  <div key={ri} style={`display:grid; grid-template-columns:1fr 72px 80px 28px; padding:9px 14px; border-bottom:1px solid rgba(0,0,0,0.05); ${ri===3?'background:rgba(239,68,68,0.025);':''}`}>
                    <div>
                      <p style="font-size:12px; font-weight:500; color:#1C1917;">{row.name}</p>
                      <p style="font-size:9.5px; color:#A8A29E; font-family:ui-monospace,monospace;">{row.ref}</p>
                    </div>
                    <span style="font-size:11px; color:#78716C; align-self:center; font-variant-numeric:tabular-nums;">{row.time}</span>
                    <div style="align-self:center;">
                      <span style={`font-size:10px; font-weight:600; padding:2px 7px; border-radius:9999px; background:${row.sc}; color:${row.tc};`}>{row.status}</span>
                    </div>
                    <div style="align-self:center; display:flex; justify-content:flex-end;">
                      <Icon name={ICONS.arrowRight} size={11} style="color:rgba(0,0,0,0.25);" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §5  WHO IS IT FOR — 3 personas
      ══════════════════════════════════════════════════════════════════ */}
      <section style="padding:96px 24px; background:#FFFFFF; border-top:1px solid rgba(0,0,0,0.06);">
        <div class="max-w-5xl mx-auto">
          <div class="reveal" style="text-align:center; margin-bottom:56px;">
            <p style="font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#FC6514; margin-bottom:10px;">Who uses Glido</p>
            <h2 style="font-size:clamp(1.8rem,3.2vw,2.5rem); font-weight:800; color:#1C1917; letter-spacing:-0.04em; line-height:1.1; margin-bottom:12px;">
              Built for everyone in the chain
            </h2>
            <p style="font-size:14px; color:#78716C; max-width:380px; margin:0 auto; line-height:1.75;">
              From the freight forwarder booking a slot to the driver scanning in — everyone benefits.
            </p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px;" class="persona-grid">
            {[
              {
                emoji: '📋',
                role: 'Freight Forwarders',
                desc: 'Book slots on behalf of multiple clients, attach documents, track ICS status — all from one portal. No more calling the depot.',
                bullets: ['Multi-shipment booking','HBL & container lookup','Document upload','Email confirmation'],
              },
              {
                emoji: '🚛',
                role: 'Truck Drivers',
                desc: 'Arrive at your confirmed window, scan your QR at the kiosk, and go straight to the bay. No queue, no counter.',
                bullets: ['QR code check-in','Slot arrival window','No account needed','Walk-in fallback'],
              },
              {
                emoji: '🏗️',
                role: 'Depot Managers',
                desc: 'See every booking, walk-in, and ICS flag in a live dashboard. Run end-of-day reports with one click.',
                bullets: ['Real-time live view','ICS hold alerts','Walk-in registration','PDF reports'],
              },
            ].map((p, i) => (
              <div key={p.role} class="reveal" data-reveal-delay={String(i*80)}
                style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.09); border-radius:18px; padding:32px 28px; box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.06); transition:transform 0.2s cubic-bezier(0.16,1,0.3,1),box-shadow 0.2s ease,border-color 0.2s ease;"
                onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 32px rgba(0,0,0,0.10)';this.style.borderColor='rgba(252,101,20,0.22)';"
                onmouseout="this.style.transform='';this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04),0 4px 20px rgba(0,0,0,0.06)';this.style.borderColor='rgba(0,0,0,0.09)';">
                <div style="font-size:32px; margin-bottom:16px; line-height:1;">{p.emoji}</div>
                <p style="font-size:16px; font-weight:700; color:#1C1917; letter-spacing:-0.025em; margin-bottom:10px;">{p.role}</p>
                <p style="font-size:13px; color:#78716C; line-height:1.7; margin-bottom:20px;">{p.desc}</p>
                <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:7px;">
                  {p.bullets.map(b => (
                    <li key={b} style="display:flex; align-items:center; gap:8px; font-size:12.5px; color:#57534E;">
                      <span style="width:16px; height:16px; border-radius:9999px; background:rgba(252,101,20,0.10); border:1px solid rgba(252,101,20,0.20); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <svg width="8" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#FC6514" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §6  FEATURES BENTO — all-light, no dark card
      ══════════════════════════════════════════════════════════════════ */}
      <section style="padding:96px 24px; background:#F7F6F5; border-top:1px solid rgba(0,0,0,0.06);">
        <div class="max-w-5xl mx-auto">
          <div class="reveal" style="text-align:center; margin-bottom:56px;">
            <p style="font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#FC6514; margin-bottom:10px;">Built for the floor</p>
            <h2 style="font-size:clamp(1.8rem,3.2vw,2.5rem); font-weight:800; color:#1C1917; letter-spacing:-0.04em; line-height:1.1; margin-bottom:12px;">
              Purpose-built for Container Freight Stations
            </h2>
            <p style="font-size:14px; color:#78716C; max-width:380px; margin:0 auto; line-height:1.75;">
              Every feature solves a real operational headache.
            </p>
          </div>

          {/* Wide hero feature — ICS check */}
          <div class="reveal bento-hero" style="background:#FFFFFF; border:1px solid rgba(252,101,20,0.20); border-radius:20px; padding:40px 44px; margin-bottom:10px; display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(252,101,20,0.06);">
            <div>
              <div style="width:50px; height:50px; border-radius:13px; background:#FFF3EC; border:1px solid rgba(252,101,20,0.20); display:flex; align-items:center; justify-content:center; margin-bottom:22px;">
                <Icon name={ICONS.shield} size={24} style="color:#FC6514;" />
              </div>
              <p style="font-size:18px; font-weight:700; color:#1C1917; letter-spacing:-0.025em; margin-bottom:10px; line-height:1.25;">Automatic ICS clearance check</p>
              <p style="font-size:13px; color:#78716C; line-height:1.75; max-width:320px;">
                Customs status is fetched the moment you enter your shipment number — holds flagged before they reach the gate.
              </p>
            </div>
            <div style="background:#F7F6F5; border-radius:14px; padding:20px 24px; border:1px solid rgba(0,0,0,0.07);">
              {[
                {ref:'MSCU·184729',status:'Cleared',sc:'rgba(34,197,94,0.12)',tc:'#16A34A'},
                {ref:'COSU·037614',status:'Pending',sc:'rgba(251,191,36,0.12)',tc:'#B45309'},
                {ref:'OOLU·295183',status:'ICS Held',sc:'rgba(239,68,68,0.10)',tc:'#DC2626'},
              ].map((row, ri) => (
                <div key={ri} style={`display:flex; align-items:center; justify-content:space-between; padding:10px 0; ${ri < 2 ? 'border-bottom:1px solid rgba(0,0,0,0.06);' : ''}`}>
                  <span style="font-size:12px; font-family:ui-monospace,monospace; font-weight:600; color:#57534E;">{row.ref}</span>
                  <span style={`font-size:11px; font-weight:600; padding:3px 10px; border-radius:9999px; background:${row.sc}; color:${row.tc};`}>{row.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2+3 grid */}
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;" class="bento-row">
            {[
              {icon:ICONS.clock,  title:'10-min slot holds',  desc:'Your preferred time is reserved while you complete the booking — zero double-bookings.'},
              {icon:ICONS.qrCode, title:'QR check-in kiosk',  desc:'Scan at arrival. Skip the counter queue entirely. Works on any smartphone.'},
            ].map((feat,i)=>(
              <div key={feat.title} class="reveal" data-reveal-delay={String(i*80)}
                style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.08); border-radius:16px; padding:30px; transition:border-color 0.15s ease,box-shadow 0.15s ease,transform 0.2s cubic-bezier(0.16,1,0.3,1);"
                onmouseover="this.style.borderColor='rgba(252,101,20,0.25)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.07)';this.style.transform='translateY(-2px)';"
                onmouseout="this.style.borderColor='rgba(0,0,0,0.08)';this.style.boxShadow='none';this.style.transform='';">
                <div style="width:42px; height:42px; border-radius:11px; background:#FFF3EC; border:1px solid rgba(252,101,20,0.14); display:flex; align-items:center; justify-content:center; margin-bottom:18px;">
                  <Icon name={feat.icon} size={19} style="color:#FC6514;" />
                </div>
                <p style="font-size:14px; font-weight:700; color:#1C1917; letter-spacing:-0.02em; margin-bottom:7px;">{feat.title}</p>
                <p style="font-size:12.5px; color:#78716C; line-height:1.65;">{feat.desc}</p>
              </div>
            ))}
          </div>
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px;" class="bento-row">
            {[
              {icon:ICONS.warning, title:'CHEP pallet alerts',  desc:'Pallet exchange flagged before you leave for the depot.'},
              {icon:ICONS.users,   title:'Agent bookings',      desc:'Freight forwarders book for drivers — no extra account.'},
              {icon:ICONS.reports, title:'Live reception view',  desc:'Staff see bookings, walk-ins, and holds in one screen.'},
            ].map((feat,i)=>(
              <div key={feat.title} class="reveal" data-reveal-delay={String(i*70)}
                style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.08); border-radius:16px; padding:28px; transition:border-color 0.15s ease,box-shadow 0.15s ease,transform 0.2s cubic-bezier(0.16,1,0.3,1);"
                onmouseover="this.style.borderColor='rgba(252,101,20,0.25)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.07)';this.style.transform='translateY(-2px)';"
                onmouseout="this.style.borderColor='rgba(0,0,0,0.08)';this.style.boxShadow='none';this.style.transform='';">
                <div style="width:40px; height:40px; border-radius:10px; background:#FFF3EC; border:1px solid rgba(252,101,20,0.14); display:flex; align-items:center; justify-content:center; margin-bottom:16px;">
                  <Icon name={feat.icon} size={18} style="color:#FC6514;" />
                </div>
                <p style="font-size:14px; font-weight:700; color:#1C1917; letter-spacing:-0.02em; margin-bottom:6px;">{feat.title}</p>
                <p style="font-size:12.5px; color:#78716C; line-height:1.65;">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §7  TESTIMONIAL
      ══════════════════════════════════════════════════════════════════ */}
      <section style="padding:96px 24px; background:#FFFFFF; border-top:1px solid rgba(0,0,0,0.06);">
        <div class="max-w-3xl mx-auto">
          <div class="reveal" style="background:#F7F6F5; border:1px solid rgba(0,0,0,0.08); border-radius:22px; padding:52px 48px; position:relative; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.04),0 8px 32px rgba(0,0,0,0.06);">
            <div style="position:absolute; top:20px; left:32px; font-size:120px; font-weight:800; color:rgba(252,101,20,0.08); line-height:1; font-family:Georgia,serif; pointer-events:none; user-select:none;">"</div>
            <blockquote style="position:relative; font-size:clamp(1rem,2vw,1.25rem); font-weight:400; color:#1C1917; letter-spacing:-0.02em; line-height:1.65; margin-bottom:28px; font-style:italic;">
              We used to spend 40 minutes every morning on phone bookings and a whiteboard. Now drivers book online, ICS checks happen automatically, and our gate time is under 4 minutes.
            </blockquote>
            <div style="display:flex; align-items:center; gap:14px;">
              <div style="width:42px; height:42px; border-radius:10px; background:#1C1917; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <span style="font-size:14px; font-weight:700; color:rgba(255,255,255,0.85);">JR</span>
              </div>
              <div>
                <p style="font-size:13px; font-weight:600; color:#1C1917;">James R.</p>
                <p style="font-size:12px; color:#A8A29E;">Operations Manager · Sydney CFS</p>
              </div>
              <div style="margin-left:auto; display:flex; gap:2px;">
                {[1,2,3,4,5].map(s=>(
                  <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#FC6514">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §8  CTA — warm light, not dark
      ══════════════════════════════════════════════════════════════════ */}
      <section style="padding:100px 24px; background:linear-gradient(180deg,#FFF8F4 0%,#FFF3EC 100%); border-top:1px solid rgba(252,101,20,0.12); position:relative; overflow:hidden;">
        <div style="position:absolute; inset:0; background-image:radial-gradient(rgba(252,101,20,0.07) 1px,transparent 1px); background-size:28px 28px; pointer-events:none;" />
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:600px; height:300px; background:radial-gradient(ellipse,rgba(252,101,20,0.08) 0%,transparent 68%); pointer-events:none;" />

        <div class="max-w-2xl mx-auto" style="text-align:center; position:relative; z-index:1;">
          <div class="reveal" style="display:inline-flex; align-items:center; gap:7px; padding:5px 14px; border-radius:9999px; background:rgba(34,197,94,0.09); border:1px solid rgba(34,197,94,0.22); margin-bottom:28px;">
            <span style="width:6px; height:6px; border-radius:9999px; background:#22C55E; animation:pulse-dot 2s ease-in-out infinite;" />
            <span style="font-size:11px; font-weight:600; color:#16A34A;">Open Mon–Fri 06:00–18:00</span>
          </div>

          <h2 class="reveal" data-reveal-delay="80"
            style="font-size:clamp(2.2rem,4.8vw,3.5rem); font-weight:800; color:#1C1917; letter-spacing:-0.045em; line-height:1.05; margin-bottom:16px;">
            Ready to skip<br/>the queue?
          </h2>

          <p class="reveal" data-reveal-delay="130"
            style="font-size:15px; color:#78716C; line-height:1.8; margin-bottom:36px; max-width:360px; margin-left:auto; margin-right:auto;">
            Your first booking takes under 3 minutes. No account, no calls, no paper.
          </p>

          <div class="reveal" data-reveal-delay="180" style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
            <a href="/book" class="btn-primary" style="padding:14px 32px; font-size:14px;">
              <Icon name={ICONS.calendar} size={15} />
              Book a Visit
              <Icon name={ICONS.arrowRight} size={14} />
            </a>
            <a href="/bookings" class="btn-ghost" style="padding:14px 26px; font-size:14px;">
              <Icon name={ICONS.search} size={15} />
              Look Up Booking
            </a>
          </div>

          <p class="reveal" data-reveal-delay="230" style="font-size:12px; color:#A8A29E; margin-top:28px;">
            Sydney Container Freight Station · ABN 12 345 678 901
          </p>
        </div>
      </section>

      {/* Responsive styles */}
      <style>{`
        @media (max-width:960px){
          .hero-grid,.preview-grid{grid-template-columns:1fr!important;}
          .steps-grid-new{grid-template-columns:repeat(2,1fr)!important;}
          .bento-row,.persona-grid{grid-template-columns:1fr!important;}
          .bento-hero{grid-template-columns:1fr!important;}
        }
        @media (max-width:640px){
          .steps-grid-new{grid-template-columns:1fr!important;}
        }
      `}</style>

    </LandingLayout>
  )
})

// ─── Booking wizard ─────────────────────────────────────────────────────────
portalRoutes.get('/book', (c) => {
  return c.html(
    <PublicLayout title="Book a Visit" plain>
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
