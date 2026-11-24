(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const bar=$('#bar'),nav=$('nav.top'),dock=$('.dock');

/* ---------- reveal ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
$$('.rv').forEach(el=>io.observe(el));

/* ---------- a day at StayB ---------- */
const day=$('.day .track');
let dayUpdate=()=>{};
if(day){
  const stick=$('.day .stick'),bar=$('.day-bar'),svg=$('.scene'),sun=$('.sunb',svg),moon=$('.moon',svg),moonCut=$('.moon-cut',svg),stars=$('.stars',svg),
        wins=$$('.wins rect',svg),walker=$('.walker',svg),road=$('.road',svg),far=$('.far',svg),ground=$('.ground',svg),gwave=$('.g-wave',svg),towers=$('.towers',svg),
        hWalls=$$('.s-house .h-wall',svg),hRoofs=$$('.s-house .h-roof',svg),hWins=$$('.s-house .h-win rect',svg),pTrunks=$$('.s-palm .p-trunk',svg),pLeaves=$$('.s-palm .p-leaf',svg),
        sky=$('.day .sky'),clock=$('.clock'),evt=$('.evt'),fill=$('.tl-fill'),ticks=$('.tl-ticks');
  const roadLen=road.getTotalLength();
  // Kochi sits ~10°N: sunrise/sunset stay close to 06:15 / 18:15 all year.
  const RISE=6.25,SET=18.25,HORIZON=410;
  // scroll progress -> hour of day. Walks get extra scroll so they are watchable.
  const MAP=[[0,6],[.12,7.5],[.22,8.75],[.34,8.95],[.46,13],[.58,18.3],[.70,18.5],[.84,20],[1,23.25]];
  const EVENTS=[
    {at:6,   t:'06:00', l:'Wake up',   h:'Wake up to green views.', p:'Coconut palms outside, a quiet start. No traffic to plan around.'},
    {at:7.5, t:'07:30', l:'Breakfast', h:'Breakfast is ready.', p:'Laundry and ironing are handled too, so your shirt is ready for the day.'},
    {at:8.75,t:'08:45', l:'Walk',      h:'Seven minutes to your desk.', p:'Walk to Infopark Phase 2 with your packed lunch. No bus, no auto, no fuel. At your desk before nine.'},
    {at:13,  t:'13:00', l:'Lunch',     h:'Lunch from home, at your desk.', p:'A packed lunch goes with you every day, already paid for in the rent.'},
    {at:18.3,t:'18:20', l:'Walk back', h:'Home before the lights come on.', p:'Log off and walk back. Seven minutes later you are home.'},
    {at:19.5,t:'19:30', l:'Dinner',    h:'Dinner is on the table.', p:'Eat, call home, catch up on WiFi. No cooking, no ordering in.'},
    {at:22.5,t:'23:00', l:'Quiet',     h:'Quiet hours from 11 PM.', p:'No fixed curfew. You carry your own key, and everyone gets their rest.'}];
  // sky gradient keyframes [hour, top, bottom]
  const SKY=[[0,'#070c1a','#111a2e'],[5.6,'#0b1328','#1c2740'],[6.25,'#40508a','#f0a35e'],[7.3,'#6aa3d6','#f4d6a2'],[9.5,'#3f8dd0','#a8d3ee'],
             [15.5,'#3d88c9','#b7dbef'],[17.4,'#5a7fbf','#f2c487'],[18.25,'#4a3e6e','#f0884a'],[19,'#232748','#6b4866'],[20.5,'#0e1631','#1e2642'],[24,'#070c1a','#111a2e']];
  const hex=h=>h[0]==='#'?[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)):h.match(/\d+/g).map(Number);
  const mix=(a,b,t)=>{const A=hex(a),B=hex(b);return'rgb('+A.map((v,i)=>Math.round(lerp(v,B[i],t))).join(',')+')'};
  const skyAt=h=>{for(let i=0;i<SKY.length-1;i++){const[a,t1,b1]=SKY[i],[b,t2,b2]=SKY[i+1];if(h>=a&&h<=b){const t=(h-a)/(b-a);return[mix(t1,t2,t),mix(b1,b2,t)]}}return[SKY[0][1],SKY[0][2]]};
  const hourAt=p=>{for(let i=0;i<MAP.length-1;i++){const[a,h1]=MAP[i],[b,h2]=MAP[i+1];if(p<=b)return lerp(h1,h2,(p-a)/(b-a))}return MAP.at(-1)[1]};
  const pAt=h=>{for(let i=0;i<MAP.length-1;i++){const[a,h1]=MAP[i],[b,h2]=MAP[i+1];if(h<=h2)return lerp(a,b,(h-h1)/(h2-h1))}return 1};
  // darkness 0 (noon) .. 1 (deep night)
  const darkAt=h=>h<5.6?1:h<6.9?1-(h-5.6)/1.3:h<17.6?0:h<19.6?(h-17.6)/2:1;
  ticks.innerHTML=EVENTS.map(e=>`<li style="left:${(pAt(e.at)*100).toFixed(2)}%"><b>${e.t}</b>${e.l}</li>`).join('');
  const tickEls=$$('li',ticks);
  // The text lives in a bar under the scene, so the sun has the whole sky.
  // The arc's peak is fitted to the part of the scene actually on screen.
  let RY=300;
  const fit=()=>{
    stick.style.setProperty('--uih',bar.offsetHeight+'px');
    // meet-scaled and bottom-anchored: find the scene's drawn top, then how much of it sits under the nav or off screen
    const r=svg.getBoundingClientRect(),k=Math.min(r.width/1440,r.height/560),drawnTop=r.bottom-560*k,
          safeTop=stick.getBoundingClientRect().top+84,visTop=Math.max(0,(safeTop-drawnTop)/k);
    RY=clamp(HORIZON-(visTop+60),150,320);
  };
  addEventListener('resize',fit);fit();
  const arc=(u,ry)=>{const a=Math.PI*(1-u);return[720+660*Math.cos(a),HORIZON-ry*Math.sin(a)]};
  let last=-1;
  dayUpdate=()=>{
    const r=day.getBoundingClientRect(),p=clamp(-r.top/(r.height-innerHeight));
    const h=hourAt(p);
    const[top,bot]=skyAt(h);
    sky.style.background=`linear-gradient(180deg,${top} 0%,${bot} 100%)`;
    moonCut.style.fill=top;
    const d=darkAt(h);
    stars.style.opacity=clamp((d-.4)/.6).toFixed(3);
    // sun: drawn behind the hills, so it rises out of them and sets behind the towers
    if(h>RISE-.4&&h<SET+.4){const[x,y]=arc(clamp((h-RISE)/(SET-RISE)),RY);sun.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`);sun.style.opacity=1}else sun.style.opacity=0;
    // moon follows the same sky, rising after dusk
    if(h>18.6){const[x,y]=arc(clamp(.42+(h-18.6)/12*.8),RY*.9);moon.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`);moon.style.opacity=clamp((h-18.6)/.8)}else moon.style.opacity=0;
    // landscape tints toward night
    far.style.fill=mix('#2c4b34','#15241b',d);towers.style.fill=mix('#24372b','#131e18',d);
    const g=mix('#1c3122','#0d1811',d);ground.style.fill=g;stick.style.setProperty('--gnd',g);
    gwave.style.stroke=mix('#6b9a62','#2f4a35',d);
    hWalls.forEach((w,i)=>w.style.fill=mix(i?'#33523a':'#2c4732',i?'#1d2d22':'#1a281e',d));
    hRoofs.forEach(w=>w.style.stroke=mix('#f6f3e8','#8f968f',d));
    pTrunks.forEach(w=>w.style.stroke=mix('#7c8a5a','#3b4433',d));pLeaves.forEach(w=>w.style.stroke=mix('#6b9a62','#2d4430',d));
    // windows: offices lit in late evening; the hostel lights up when people are home
    const officeLit=h>17.2&&h<21.5?clamp(Math.min((h-17.2)/.8,(21.5-h)/.8)):0;
    wins.forEach((w,i)=>{const on=(i*7%5)<3;w.style.fill=officeLit>.05&&on?'#f3d82b':'#cfe0e6';w.style.opacity=(.16+officeLit*.6*on).toFixed(2)});
    const homeLit=h>18.4?clamp((h-18.4)/.4):h<7.2?clamp((7.2-h)/.6):0;
    hWins.forEach((w,i)=>{const on=i%3!==2||h<22.4;w.style.fill=homeLit>.05&&on?'#f3d82b':'#a9c3cc';w.style.opacity=(homeLit>.05&&on?.35+homeLit*.65:.55).toFixed(2)});
    // walker on the road during the two walks
    let wt=-1;
    if(h>=8.75&&h<=8.95)wt=(h-8.75)/.2;else if(h>=18.3&&h<=18.5)wt=1-(h-18.3)/.2;
    if(wt>=0){const pt=road.getPointAtLength(roadLen*wt);walker.setAttribute('transform',`translate(${pt.x.toFixed(1)} ${(pt.y-12).toFixed(1)})`);walker.style.opacity=1}else walker.style.opacity=0;
    // clock: minute precision during walks, 5-minute steps otherwise
    const step=(wt>=0)?1:5;let mins=Math.round(h*60/step)*step;
    clock.textContent=String(Math.floor(mins/60)%24).padStart(2,'0')+':'+String(mins%60).padStart(2,'0');
    // phones: the panorama is wider than the screen, so a camera follows the story
    if(innerWidth<820){
      const CAM=[[0,230],[8.75,230],[8.95,1180],[16.5,1180],[18.25,1240],[18.3,1180],[18.5,230],[24,230]];
      let fx=230;for(let i=0;i<CAM.length-1;i++){const[a,x1]=CAM[i],[b,x2]=CAM[i+1];if(h>=a&&h<=b){const t=(h-a)/(b-a);fx=lerp(x1,x2,t*t*(3-2*t));break}}
      const sw=svg.getBoundingClientRect().width,k=sw/1440;
      svg.style.transform=`translateX(${clamp(innerWidth/2-fx*k,innerWidth-sw,0).toFixed(1)}px)`;
    }else svg.style.transform='';
    fill.style.width=(p*100).toFixed(2)+'%';
    let k=0;EVENTS.forEach((e,i)=>{if(h>=e.at-.001)k=i});
    if(k!==last){last=k;const e=EVENTS[k];$('h3',evt).textContent=e.h;$('p',evt).textContent=e.p;evt.classList.remove('swap');void evt.offsetWidth;evt.classList.add('swap');tickEls.forEach((t,i)=>t.classList.toggle('on',i===k));fit()}
  };
}

/* ---------- 7-minute walk ---------- */
const route=$('.route');
let walkUpdate=()=>{};
if(route){
  const timer=$('.timer .t',route);
  const NS='http://www.w3.org/2000/svg';
  const drawings=$$('.rsvg',route).map(svg=>{
    const base=$('.rbase',svg),done=$('.rdone',svg),w=$('.rwalker',svg),mins=$('.mins',svg),vertical=!!svg.dataset.v;
    const L=base.getTotalLength();
    done.style.strokeDasharray=L;done.style.strokeDashoffset=L;
    const dots=[],samples=Array.from({length:121},(_,i)=>base.getPointAtLength(L*i/120));
    for(let m=1;m<=6;m++){
      const pt=base.getPointAtLength(L*m/7);
      const c=document.createElementNS(NS,'circle');c.setAttribute('cx',pt.x);c.setAttribute('cy',pt.y);c.setAttribute('r',vertical?7:8);
      const t=document.createElementNS(NS,'text');t.textContent=m+' min';
      if(vertical){const a=base.getPointAtLength(Math.max(0,L*m/7-4)),b=base.getPointAtLength(Math.min(L,L*m/7+4));let nx=-(b.y-a.y),ny=b.x-a.x;const n=Math.hypot(nx,ny)||1;nx/=n;ny/=n;const far=(x,y)=>samples.reduce((mn,s)=>Math.min(mn,Math.hypot(s.x-x,s.y-y)),1e9);const c1=[pt.x+nx*30,pt.y+ny*30],c2=[pt.x-nx*30,pt.y-ny*30];const[cx,cy]=far(...c1)>=far(...c2)?c1:c2;const right=cx>=pt.x;t.setAttribute('x',cx);t.setAttribute('y',cy+5);t.setAttribute('text-anchor',right?'start':'end')}
      else{t.setAttribute('x',pt.x);t.setAttribute('y',pt.y+34)}
      mins.append(c,t);dots.push(c)}
    return{svg,base,done,w,L,dots};
  });
  walkUpdate=()=>{
    const r=route.getBoundingClientRect();
    // starts when the card's top reaches 85% of the viewport, ends when its centre passes 40%
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
let ticking=false;
function onScroll(){
  ticking=false;
  const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  bar.style.transform=`scaleX(${h>0?y/h:0})`;
  nav.classList.toggle('s',y>24);
  if(dock){const dr=day&&day.getBoundingClientRect();const inDay=dr&&dr.top<innerHeight*.5&&dr.bottom>innerHeight*.5;const fin=document.querySelector('.final');const inFinal=fin&&fin.getBoundingClientRect().top<innerHeight*.7;dock.classList.toggle('on',y>innerHeight*.8&&!inDay&&!inFinal)}
  dayUpdate();walkUpdate();
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
addEventListener('resize',onScroll);
onScroll();

/* faq: one open at a time */
$$('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)$$('details').forEach(o=>{if(o!==d&&o.parentElement===d.parentElement)o.open=false})}));
})();
