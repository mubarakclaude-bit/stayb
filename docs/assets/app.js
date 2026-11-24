(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const NS='http://www.w3.org/2000/svg';
const progress=$('.progress'),nav=$('.nav'),dock=$('.dock');

/* entrance */
requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.add('is-in')));

/* reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.14,rootMargin:'0px 0px -48px 0px'});
$$('.rv').forEach(el=>io.observe(el));

/* hero image drift */
const heroImg=$('.hero-media img');

/* ---------- a day at StayB ---------- */
const day=$('.day .track');
let dayUpdate=()=>{};
if(day){
  const stick=$('.stick',day),clock=$('.clock'),list=$('.moments'),items=$$('.moments li');
  const trail=$('.sp-trail'),sun=$('.sp-sun'),moon=$('.sp-moon');
  const L=trail.getTotalLength();
  // Kochi sits ~10°N: sunrise and sunset stay close to 06:15 and 18:15 all year.
  const RISE=6.25,SET=18.25;
  // scroll progress -> hour. The two walks get more scroll so they can be read.
  const MAP=[[0,6],[.12,7.5],[.22,8.75],[.34,8.95],[.46,13],[.58,18.3],[.70,18.5],[.84,20],[1,23.25]];
  const AT=[6,7.5,8.75,13,18.3,19.5,22.5];
  // very muted background shift: night, dawn warmth, day, dusk warmth
  const BG=[[0,'#0c120e'],[5.8,'#0f1511'],[6.6,'#1a1b15'],[8,'#111a14'],[12,'#131d16'],[17.4,'#131c15'],[18.3,'#1c1a14'],[19.4,'#0f1511'],[24,'#0c120e']];
  const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
  const mix=(a,b,t)=>{const A=hex(a),B=hex(b);return'rgb('+A.map((v,i)=>Math.round(lerp(v,B[i],t))).join(',')+')'};
  const bgAt=h=>{for(let i=0;i<BG.length-1;i++){const[a,c1]=BG[i],[b,c2]=BG[i+1];if(h>=a&&h<=b)return mix(c1,c2,(h-a)/(b-a))}return BG[0][1]};
  const hourAt=p=>{for(let i=0;i<MAP.length-1;i++){const[a,h1]=MAP[i],[b,h2]=MAP[i+1];if(p<=b)return lerp(h1,h2,(p-a)/(b-a))}return MAP.at(-1)[1]};
  let last=-1;
  dayUpdate=()=>{
    const r=day.getBoundingClientRect(),p=clamp(-r.top/(r.height-innerHeight));
    const h=hourAt(p);
    stick.style.backgroundColor=bgAt(h);
    const u=clamp((h-RISE)/(SET-RISE));
    if(h>=RISE&&h<=SET){const pt=trail.getPointAtLength(L*u);sun.setAttribute('transform',`translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);sun.style.opacity=1;trail.style.strokeDashoffset=(1-u).toFixed(4)}
    else{sun.style.opacity=0;trail.style.strokeDashoffset=h>SET?0:1}
    if(h>SET+.4){const v=clamp((h-SET-.4)/10);const pt=trail.getPointAtLength(L*(.12+v*.5));moon.setAttribute('transform',`translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);moon.style.opacity=clamp((h-SET-.4)/.6)}else moon.style.opacity=0;
    const walking=(h>=8.75&&h<=8.95)||(h>=18.3&&h<=18.5);
    const step=walking?1:5,mins=Math.round(h*60/step)*step;
    clock.textContent=String(Math.floor(mins/60)%24).padStart(2,'0')+':'+String(mins%60).padStart(2,'0');
    let k=0;AT.forEach((a,i)=>{if(h>=a-.001)k=i});
    if(k!==last){last=k;items.forEach((li,i)=>li.classList.toggle('on',i===k))}
    list.style.setProperty('--prog',(p*100).toFixed(2)+'%');
  };
}

/* ---------- photos: horizontal on scroll (desktop) ---------- */
const gtrack=$('.gtrack'),strip=$('.strip');
let galUpdate=()=>{},galFit=()=>{};
if(gtrack&&strip){
  let dist=0;
  galFit=()=>{
    strip.style.transform='';
    if(innerWidth<=860||reduce){gtrack.style.height='';dist=0;return}
    // end with the same margin the strip starts with
    const last=strip.lastElementChild,pad=parseFloat(getComputedStyle(strip).paddingLeft)||0;
    dist=Math.max(0,last.offsetLeft+last.offsetWidth+pad-innerWidth);
    gtrack.style.height=(innerHeight+dist)+'px';
  };
  galUpdate=()=>{
    if(!dist)return;
    const r=gtrack.getBoundingClientRect(),p=clamp(-r.top/(r.height-innerHeight));
    strip.style.transform=`translate3d(${(-dist*p).toFixed(1)}px,0,0)`;
  };
}

/* ---------- 7-minute walk ---------- */
const route=$('.route');
let walkUpdate=()=>{};
if(route){
  const timer=$('.timer .t',route);
  const drawings=$$('.rsvg',route).map(svg=>{
    const base=$('.rbase',svg),done=$('.rdone',svg),w=$('.rwalker',svg),mins=$('.mins',svg),vertical=!!svg.dataset.v;
    const L=base.getTotalLength();
    done.style.strokeDasharray=L;done.style.strokeDashoffset=L;
    const samples=Array.from({length:121},(_,i)=>base.getPointAtLength(L*i/120));
    const far=(x,y)=>samples.reduce((m,s)=>Math.min(m,Math.hypot(s.x-x,s.y-y)),1e9);
    const dots=[];
    for(let m=1;m<=6;m++){
      const pt=base.getPointAtLength(L*m/7);
      const c=document.createElementNS(NS,'circle');c.setAttribute('cx',pt.x);c.setAttribute('cy',pt.y);c.setAttribute('r',5);
      const t=document.createElementNS(NS,'text');t.textContent=m+' min';
      // put each label on the side of the line that is farthest from the rest of the route
      const a=base.getPointAtLength(Math.max(0,L*m/7-4)),b=base.getPointAtLength(Math.min(L,L*m/7+4));
      let nx=-(b.y-a.y),ny=b.x-a.x;const n=Math.hypot(nx,ny)||1;nx/=n;ny/=n;
      const d=vertical?30:26,c1=[pt.x+nx*d,pt.y+ny*d],c2=[pt.x-nx*d,pt.y-ny*d],[cx,cy]=far(...c1)>=far(...c2)?c1:c2;
      t.setAttribute('x',cx);t.setAttribute('y',cy+5);
      if(vertical)t.setAttribute('text-anchor',cx>=pt.x?'start':'end');
      mins.append(c,t);dots.push(c)}
    return{svg,base,done,w,L,dots};
  });
  walkUpdate=()=>{
    const r=route.getBoundingClientRect();
    const p=reduce?1:clamp((innerHeight*.85-r.top)/(innerHeight*.45+r.height*.5));
    drawings.forEach(({svg,base,done,w,L,dots})=>{
      if(!svg.getBoundingClientRect().width)return;
      done.style.strokeDashoffset=L*(1-p);
      const pt=base.getPointAtLength(L*p);w.setAttribute('transform',`translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
      dots.forEach((d,i)=>d.classList.toggle('on',p>=(i+1)/7));
    });
    const s=Math.round(p*420);timer.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
  };
}

/* ---------- scroll loop ---------- */
const fin=$('.final');
let ticking=false;
function onScroll(){
  ticking=false;
  const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  progress.style.transform=`scaleX(${h>0?(y/h).toFixed(4):0})`;
  nav.classList.toggle('s',y>24);
  if(heroImg&&!reduce&&y<innerHeight*1.4)heroImg.style.transform=`translate3d(0,${(-y*.06).toFixed(1)}px,0)`;
  if(dock){const inFinal=fin&&fin.getBoundingClientRect().top<innerHeight*.75;dock.classList.toggle('on',y>innerHeight*.7&&!inFinal)}
  dayUpdate();galUpdate();walkUpdate();
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
addEventListener('resize',()=>{galFit();onScroll()});
addEventListener('load',()=>{galFit();onScroll()});
galFit();onScroll();

/* faq: one open at a time per list */
$$('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)$$('details',d.parentElement).forEach(o=>{if(o!==d)o.open=false})}));
})();
