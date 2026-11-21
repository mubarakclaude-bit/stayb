(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const bar=$('#bar'),nav=$('nav.top'),dock=$('.dock'),glow=$('#glow');
/* scroll state */
let ticking=false;
function onScroll(){
  const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  bar.style.transform='scaleX('+(y/h)+')';
  nav.classList.toggle('s',y>40);
  dock&&dock.classList.toggle('on',y>innerHeight*.7);
  const sb=$('.hero .sunball');
  if(sb&&!reduce&&y<innerHeight*1.2){sb.style.transform='translateY('+y*.35+'px) scale('+(1+y/2500)+')'}
  const sk=$('.hero .skyline');if(sk&&!reduce&&y<innerHeight*1.2)sk.style.transform='translateY('+y*.12+'px)';
  journey();
  ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));
const mo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');mo.unobserve(e.target)}}),{threshold:.3});
$$('.map').forEach(el=>mo.observe(el));
/* counters */
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);
  const el=e.target,to=+el.dataset.to,t0=performance.now();
  (function f(t){const p=Math.min(1,(t-t0)/1400);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)}),{threshold:.6});
$$('[data-to]').forEach(el=>co.observe(el));
/* cursor glow + magnetic */
if(glow&&matchMedia('(hover:hover)').matches&&!reduce){
  addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true});
  $$('.btn').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.25)+'px)'});b.addEventListener('pointerleave',()=>b.style.transform='')});
}
/* day journey (scroll-scrubbed) */
const track=$('.day .track');
const moments=[
 {t:'06:45',sky:'linear-gradient(180deg,#c4743a 0%,#5b4b6b 55%,#1c2a1f 100%)'},
 {t:'08:50',sky:'linear-gradient(180deg,#2d6f96 0%,#4f93a8 60%,#2f5233 100%)'},
 {t:'13:00',sky:'linear-gradient(180deg,#1f5f8b 0%,#3f87a6 70%,#2f5233 100%)'},
 {t:'19:30',sky:'linear-gradient(180deg,#1a1f3a 0%,#3a2e52 55%,#1c2a1f 100%)'}];
function journey(){
  if(!track)return;
  const r=track.getBoundingClientRect(),total=r.height-innerHeight;
  const p=Math.min(1,Math.max(0,-r.top/total));
  const i=Math.min(moments.length-1,Math.floor(p*moments.length));
  const sun=$('.sun2'),arc=$('.arc');
  const W=arc.clientWidth,H=arc.clientHeight;
  const x=p*(W-90),y=H*.85-Math.sin(p*Math.PI)*H*.7;
  sun.style.transform='translate('+x+'px,'+y+'px)';
  if(journey.i!==i){journey.i=i;
    $('.sky').style.background=moments[i].sky;
    $$('.step').forEach((s,k)=>s.classList.toggle('on',k===i));
    $$('.dots i').forEach((s,k)=>s.classList.toggle('on',k===i));
    $('.clock').textContent=moments[i].t}
}
journey.i=-1;
/* calculator */
const R=$$('.calc input');
function calc(){
  if(!R.length)return;
  const [a,b,c]=R.map(x=>+x.value);
  $('#v1').textContent='₹'+a.toLocaleString('en-IN');$('#v2').textContent='₹'+b.toLocaleString('en-IN');$('#v3').textContent='₹'+c.toLocaleString('en-IN');
  const cur=a+b+c,sb=7000,d=cur-sb;
  $('#cur').textContent='₹'+cur.toLocaleString('en-IN');
  const s=$('#save');s.textContent=(d>=0?'₹':'-₹')+Math.abs(d).toLocaleString('en-IN');
  $('#savel').textContent=d>=0?'you could save every month':'more than StayB all-in';
}
R.forEach(x=>x.addEventListener('input',calc));calc();
/* faq: close others */
$$('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)$$('details').forEach(o=>{if(o!==d&&o.parentElement===d.parentElement)o.open=false})}));
onScroll();
})();
