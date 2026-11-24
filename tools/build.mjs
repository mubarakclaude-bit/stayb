// Run: node tools/build.mjs  -> writes static pages into /site
import fs from 'fs'; import {fileURLToPath} from 'url';
// PREVIEW=<github-user> -> client preview for GitHub Pages at https://<user>.github.io/stayb/ (noindex, /stayb prefix, output in docs/)
const PV = process.env.PREVIEW;
const OUT = fileURLToPath(new URL(PV ? '../docs/' : '../site/', import.meta.url));
const PFX = PV ? '/stayb' : '';
const BASE = PV ? `https://${PV}.github.io/stayb` : 'https://staybin.vercel.app'; // change when a custom domain is attached
const PHONE = '+919633310117', PHONE_DISP = '96333 10117';
const WA = 'https://wa.me/919633310117?text=' + encodeURIComponent("Hi, I'm looking for a bed at StayB near Infopark. Is there availability?");
const MAPS = 'https://maps.google.com/?q=StayB+Hostel+Infopark+Kochi';

const FAQ = [
 ['How far is StayB from Infopark Phase 2?', 'StayB is a 7-minute walk from Infopark Phase 2 in Kakkanad, Kochi. Most residents walk to work, so there is no bus, auto or bike expense.'],
 ['What is the rent at StayB men\'s hostel?', 'Rent is ₹7,000 per month, all-inclusive: breakfast, packed lunch for office, dinner, WiFi, laundry and ironing. The first month is ₹8,000, which includes the refundable deposit and admission.'],
 ['Is food included in the hostel rent?', 'Yes. Three meals a day are covered: breakfast, a packed lunch you can carry to office, and dinner. There are no separate mess bills.'],
 ['Is the security deposit refundable?', 'Yes. The deposit is fully returned when you move out.'],
 ['Is there a curfew?', 'No fixed curfew. You get your own key and can enter and exit freely. Quiet hours start at 11 PM.'],
 ['Are guests allowed?', 'Guests are allowed in common areas only. There are no overnight guests.'],
 ['Who stays at StayB?', 'Working professionals, freshers and interns from Infopark companies such as TCS, Infosys and UST. It is a men\'s hostel.'],
 ['How do I book a bed?', 'Tap Check Availability to WhatsApp us, or call 96333 10117. Beds are limited, so message before you travel.']
];

const LANDINGS = [
 { slug:'hostel-near-infopark-kochi', kw:'Hostel near Infopark Kochi', title:'Hostel Near Infopark Kochi · 7 Min Walk · ₹7,000 with Food | StayB',
   desc:'Men\'s hostel near Infopark Kochi, 7-minute walk to Phase 2. ₹7,000/month with 3 meals, WiFi, laundry and ironing. Message StayB to check beds.',
   h1:'The hostel near <em>Infopark Kochi</em> you can walk from.',
   intro:'If you have just joined a company at Infopark, the first problem is where to stay. StayB is a men\'s hostel a 7-minute walk from Infopark Phase 2 in Kakkanad, so your commute is a stroll instead of a bus ride.',
   sections:[
    ['Why employees choose a hostel near Infopark','Travel time is the hidden cost of living far from work. Staying within walking distance gives you back an hour or more each day, removes daily transport spend and means you are never late because of traffic on the Kakkanad road.'],
    ['What you get for ₹7,000 a month','Breakfast, a packed lunch for office, dinner, WiFi, laundry and ironing are all included. The first month is ₹8,000, which includes your refundable deposit and admission.'],
   ], bullets:['7-minute walk to Infopark Phase 2','3 meals a day included','WiFi, laundry and ironing included','No fixed curfew, own key','Refundable deposit'],
   faq:[FAQ[0],FAQ[1],FAQ[6]] },
 { slug:'mens-hostel-kakkanad', kw:'Men\'s hostel in Kakkanad', title:'Men\'s Hostel in Kakkanad, Kochi · Food + WiFi Included | StayB',
   desc:'StayB is a men\'s hostel in Kakkanad, Kochi for IT professionals, freshers and interns. All-inclusive ₹7,000/month. Walk to Infopark in 7 minutes.',
   h1:'A men\'s hostel in <em>Kakkanad</em> that feels like home.',
   intro:'Kakkanad is the heart of Kochi\'s IT corridor, and StayB sits inside it. We are a men\'s hostel built around working professionals: early mornings, packed lunches, quiet nights and a short walk to work.',
   sections:[
    ['Living in Kakkanad','Staying in Kakkanad puts you close to Infopark, SmartCity and the cafes and shops around them. StayB keeps it simple: your room, shared common areas and clear house rules so everyone gets the rest they need.'],
    ['House rules that keep it calm','No fixed curfew and you carry your own key. Quiet hours start at 11 PM. Guests are welcome in common areas only, with no overnight guests. Rooms are yours, common areas are shared.'],
   ], bullets:['Men\'s hostel for working professionals','Kakkanad, Kochi','Quiet hours after 11 PM','Common-area guests only','Meals and laundry included'],
   faq:[FAQ[4],FAQ[5],FAQ[6]] },
 { slug:'pg-for-men-near-infopark', kw:'PG for men near Infopark', title:'PG for Men Near Infopark Kochi · Meals Included | StayB',
   desc:'Looking for a PG for men near Infopark? StayB offers rooms with 3 meals, WiFi, laundry and ironing for ₹7,000/month, 7 minutes from Phase 2.',
   h1:'Looking for a <em>PG for men</em> near Infopark?',
   intro:'A paying guest stay near Infopark usually means paying separately for food, WiFi and laundry, then still commuting. StayB bundles everything into one monthly price and puts you a 7-minute walk from Phase 2.',
   sections:[
    ['One price, no add-ons','Breakfast, packed lunch, dinner, WiFi, laundry and ironing are included in ₹7,000 a month. No mess bills and no WiFi add-ons. Use the calculator on our home page to compare against your current spend.'],
    ['PG vs hostel at StayB','Unlike a typical PG with a single owner\'s rules, StayB runs as a hostel with written, predictable rules and a community of Infopark professionals, so you know exactly what to expect before you move in.'],
   ], bullets:['Everything included in one price','Walk to Infopark Phase 2','Fully refundable deposit','Written house rules','Freshers and experienced staff welcome'],
   faq:[FAQ[1],FAQ[2],FAQ[3]] },
 { slug:'hostel-with-food-near-infopark', kw:'Hostel with food near Infopark', title:'Hostel With Food Near Infopark Kochi · 3 Meals Daily | StayB',
   desc:'Hostel with food near Infopark: breakfast, packed lunch for office and dinner included at ₹7,000/month. 7-minute walk to Phase 2, Kakkanad.',
   h1:'A hostel with <em>food</em> near Infopark. All three meals.',
   intro:'Eating well on a work schedule is hard when you cook for yourself or order out daily. StayB covers breakfast, a packed lunch you can take to the office, and dinner, all inside the monthly rent.',
   sections:[
    ['Meals built around your workday','Breakfast before you leave, a packed lunch for the office and dinner when you are back. No separate mess bill and no daily food spend.'],
    ['Plus the basics','WiFi, laundry and ironing are included too, so you arrive with a bag and focus on the job.'],
   ], bullets:['Breakfast','Packed lunch for office','Dinner','WiFi, laundry, ironing','₹7,000 per month all-in'],
   faq:[FAQ[2],FAQ[1],FAQ[7]] },
 { slug:'cheap-hostel-kakkanad-kochi', kw:'Affordable hostel in Kakkanad', title:'Affordable Hostel in Kakkanad, Kochi · ₹7,000 All-Inclusive | StayB',
   desc:'Affordable hostel in Kakkanad, Kochi. ₹7,000/month with meals, WiFi, laundry and ironing, and zero commute cost to Infopark Phase 2.',
   h1:'An affordable hostel in <em>Kakkanad</em>, where the rent covers it all.',
   intro:'The real cost of a cheap room is rarely the rent. Add food, WiFi, laundry and daily travel and the number grows fast. StayB is priced as one number, ₹7,000 a month, with a 7-minute walk to Infopark.',
   sections:[
    ['Count the whole bill','Our home page has a monthly cost calculator: enter what you pay now for rent, food and travel and see how it compares with StayB all-in.'],
    ['Zero commute expense','Walking to Infopark Phase 2 means travel costs nothing, and you save the time as well.'],
   ], bullets:['₹7,000/month all-inclusive','First month ₹8,000 including deposit and admission','No commute cost','No mess or WiFi extras'],
   faq:[FAQ[1],FAQ[3],FAQ[0]] },
 { slug:'hostel-for-it-employees-kochi', kw:'Hostel for IT employees in Kochi', title:'Hostel for IT Employees in Kochi · TCS, Infosys, UST Staff | StayB',
   desc:'Hostel for IT employees, freshers and interns working at Infopark Kochi. Walk to work, meals included, ₹7,000/month. Beds available in Kakkanad.',
   h1:'The hostel for <em>IT employees</em> working at Infopark.',
   intro:'StayB is home to professionals from TCS, Infosys, UST and other Infopark companies. Freshers and experienced staff share the same simple setup: a bed, three meals and a short walk to work.',
   sections:[
    ['Joining a new company in Kochi?','Relocating for a first job is stressful enough. Move in within days, walk to Infopark Phase 2 and skip the search for separate food and laundry arrangements.'],
    ['For parents','A walkable location, a fully refundable deposit, all meals covered and clear rules. Parents can see exactly what their son is signing up for before he arrives.'],
   ], bullets:['Walk to Infopark Phase 2','Fresher friendly','Meals, WiFi, laundry included','Clear rules, safe and predictable'],
   faq:[FAQ[6],FAQ[3],FAQ[7]] },
];

const W=fs.writeFileSync;
fs.writeFileSync=(f,c)=>{ if(typeof c==='string'&&PV&&f.endsWith('.html')) c=c.replace(/(href|src)="\/(?!\/)/g,'$1="'+PFX+'/').replace('index,follow','noindex,nofollow'); if(PV&&/sitemap|llms|robots/.test(f)) return; return W(f,c)};
fs.mkdirSync(OUT,{recursive:true});
const esc = s => s.replace(/"/g,'&quot;');
const strip = s => s.replace(/<[^>]+>/g,'');
const faqHtml = f => f.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('');
const faqLd = f => ({"@type":"FAQPage","mainEntity":f.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))});

const lodging = {
  "@context":"https://schema.org","@graph":[
  {"@type":["Hostel","LocalBusiness"],"@id":BASE+"/#business","name":"StayB Men's Hostel","url":BASE+"/","telephone":PHONE,
   "image":BASE+"/img/p2.jpg","logo":BASE+"/img/logo.png","priceRange":"₹7000/month",
   "description":"Men's hostel 7 minutes' walk from Infopark Phase 2, Kakkanad, Kochi. Meals, WiFi, laundry and ironing included.",
   "address":{"@type":"PostalAddress","addressLocality":"Kakkanad","addressRegion":"Kerala","postalCode":"682042","addressCountry":"IN"},
   "geo":{"@type":"GeoCoordinates","latitude":10.0105,"longitude":76.3640},
   "areaServed":["Kakkanad","Infopark Kochi","Kochi"],
   "amenityFeature":["Breakfast","Packed lunch","Dinner","WiFi","Laundry","Ironing"].map(n=>({"@type":"LocationFeatureSpecification","name":n,"value":true})),
   "sameAs":[]},
  {"@type":"WebSite","@id":BASE+"/#site","url":BASE+"/","name":"StayB"}]};

function head({title,desc,path,ld,extra=''}){
  return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${BASE}${path}">
<meta name="theme-color" content="#162118"><meta name="robots" content="index,follow,max-image-preview:large">
<meta name="geo.region" content="IN-KL"><meta name="geo.placename" content="Kakkanad, Kochi">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${BASE}${path}"><meta property="og:image" content="${BASE}/img/p2.jpg"><meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/img/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css">${extra}
<script type="application/ld+json">${JSON.stringify(ld)}</script></head><body>
<div id="bar"></div><div id="glow"></div>`;
}
const nav = `<nav class="top"><div class="wrap"><a href="/" aria-label="StayB home"><img src="/img/logo-white.png" alt="StayB men's hostel logo" width="105" height="38"></a>
<ul><li><a href="/#day">A day here</a></li><li><a href="/#price">Price</a></li><li><a href="/#photos">Photos</a></li><li><a href="/#location">Location</a></li><li><a href="/#faq">FAQ</a></li></ul>
<a class="btn sun sm" href="${WA}" rel="noopener">Check Availability</a></div></nav>`;
const dock = `<div class="dock"><a class="btn sun sm" href="${WA}" rel="noopener">WhatsApp us</a><a class="btn line sm" href="tel:${PHONE}">Call ${PHONE_DISP}</a></div>`;
const footer = `<footer><div class="wrap fg"><div><img src="/img/logo-white.png" alt="StayB" width="121" height="44"><p>StayB Men's Hostel<br>Kakkanad, Kochi, Kerala · 7 min from Infopark Phase 2<br>Call <a style="display:inline" href="tel:${PHONE}">${PHONE_DISP}</a></p></div>
<div><h4>Find a hostel</h4>${LANDINGS.map(l=>`<a href="/${l.slug}">${l.kw}</a>`).join('')}</div>
<div><h4>StayB</h4><a href="/#price">Price</a><a href="/#faq">FAQ</a><a href="${MAPS}" rel="noopener">Open in Maps</a><a href="${WA}" rel="noopener">WhatsApp</a></div></div></footer>${dock}<script src="/assets/app.js" defer></script></body></html>`;

// ---------- HOME ----------
// Brand mark redrawn from the logo PDF (viewBox 0 0 240 145): two houses on a wave, sun top-right.
const MARK = `<path class="m-house" d="M34 112 V100 L80 54 L128 102"/><path class="m-house" d="M120 86 V70 L162 28 L208 74 V108"/>
<path class="m-wave" d="M6 108 C40 124 70 138 110 128 C150 118 180 104 234 126"/>`;

// stars for the night sky (deterministic so builds are stable)
let seed=7; const rnd=()=>((seed=(seed*16807)%2147483647)/2147483647);
const STARS = Array.from({length:70},()=>`<circle cx="${(rnd()*1440).toFixed(0)}" cy="${(rnd()*300).toFixed(0)}" r="${(rnd()*1.6+.5).toFixed(1)}"/>`).join('');
// Infopark towers with window grids
const TOWERS=[[1010,250,90,220],[1110,190,110,280],[1232,270,80,200],[1322,220,96,250]];
const towerBodies = TOWERS.map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>`).join('');
const towerWins = TOWERS.map(([x,y,w,h])=>{let o='';for(let yy=y+18;yy<y+h-40;yy+=22)for(let xx=x+12;xx<x+w-14;xx+=20)o+=`<rect x="${xx}" y="${yy}" width="10" height="12" rx="1.5"/>`;return o}).join('');

const home = head({
  title:"Men's Hostel Near Infopark Kochi · 7 Min Walk · ₹7,000 With Food | StayB",
  desc:"StayB men's hostel in Kakkanad, 7-minute walk to Infopark Phase 2, Kochi. ₹7,000/month with 3 meals, WiFi, laundry and ironing. Beds available now.",
  path:'/', ld:{...lodging,"@graph":[...lodging["@graph"],faqLd(FAQ)]},
  extra:`<link rel="preload" as="image" href="/img/logo-white.png">`
}) + nav + `
<header class="hero">
<div class="wrap hero-grid">
<div class="hero-copy">
<div class="eyebrow">Men's hostel · Kakkanad, Kochi</div>
<h1><span><i>Walk to</i></span><span><i>Infopark.</i></span></h1>
<p class="lead">7 minutes from your desk. Three meals a day, WiFi, laundry and ironing, all in one price.</p>
<ul class="chips"><li>Breakfast, lunch &amp; dinner</li><li>WiFi</li><li>Laundry &amp; ironing</li><li>Own key, no curfew</li></ul>
<div class="cta"><a class="btn sun" href="${WA}" rel="noopener">Check Availability <span aria-hidden="true">→</span></a><a class="btn line" href="tel:${PHONE}">Call ${PHONE_DISP}</a></div>
<p class="pricenote"><b>₹7,000</b>/month all-in · first month ₹8,000 incl. refundable deposit</p>
</div>
<div class="hero-art" aria-hidden="true">
<svg viewBox="0 0 240 145" class="mark">
<defs><radialGradient id="glow"><stop offset="0" stop-color="#f3d82b" stop-opacity=".55"/><stop offset="1" stop-color="#f3d82b" stop-opacity="0"/></radialGradient></defs>
<g class="m-sun"><circle cx="214" cy="24" r="40" fill="url(#glow)"/><circle cx="214" cy="24" r="17" fill="#f3d82b"/></g>
${MARK}</svg>
</div>
</div>
<svg class="hills" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70 C240 30 480 100 760 60 C1040 20 1240 80 1440 50 V120 H0Z" fill="#2a4630"/><path d="M0 100 C300 70 560 120 860 92 C1100 70 1300 104 1440 90 V120 H0Z" fill="#162118"/></svg>
</header>
<div class="marq" aria-hidden="true"><div>${Array(2).fill('<span>TCS</span><b>●</b><span>INFOSYS</span><b>●</b><span>UST</span><b>●</b><span>INFOPARK PHASE 2</span><b>●</b><span>KAKKANAD</span><b>●</b><span>7 MIN WALK</span><b>●</b><span>FRESHERS · INTERNS · IT PROFESSIONALS</span><b>●</b>').join('')}</div></div>

<section class="day" id="day" aria-label="A typical day at StayB"><div class="track"><div class="stick">
<div class="sky"></div>
<svg class="scene" viewBox="0 0 1440 560" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
<g class="stars" fill="#fff">${STARS}</g>
<g class="moon"><circle r="26" fill="#f4f1e2"/><circle class="moon-cut" r="24" cx="11" cy="-7"/></g>
<g class="sunb"><circle r="120" fill="url(#dglow)"/><circle r="44" fill="#f3d82b"/></g>
<defs><radialGradient id="dglow"><stop offset="0" stop-color="#ffe46b" stop-opacity=".7"/><stop offset="1" stop-color="#ffe46b" stop-opacity="0"/></radialGradient></defs>
<path class="far" d="M0 420 C200 360 380 400 560 370 C760 336 920 392 1100 360 C1260 334 1360 360 1440 350 V560 H0Z"/>
<g class="towers">${towerBodies}</g>
<path class="ground" d="M0 470 C260 440 520 488 780 462 C1040 436 1260 470 1440 456 V560 H0Z"/>
<path class="road" d="M250 488 C430 452 620 500 820 470 S1080 452 1170 476"/>
<path class="shade" d="M0 420 C200 360 380 400 560 370 C760 336 920 392 1100 360 C1260 334 1360 360 1440 350 V560 H0Z"/>
<g class="house" transform="translate(120 352) scale(1.05)">${MARK}</g>
<g class="wins">${towerWins}</g>
<g class="hwins"><rect x="178" y="438" width="16" height="16" rx="2"/><rect x="290" y="412" width="16" height="16" rx="2"/></g>
<g class="walker"><circle r="9" fill="#f3d82b"/><circle r="18" fill="none" stroke="#f3d82b" stroke-opacity=".45"/></g>
</svg>
<div class="wrap day-ui">
<div class="panel">
<div class="eyebrow">A day at StayB</div>
<div class="clock" aria-live="off">06:00</div>
<div class="evt"><h3></h3><p></p></div>
</div>
</div>
<div class="wrap tl-wrap"><div class="tl"><div class="tl-fill"></div></div><ol class="tl-ticks"></ol></div>
</div></div></section>

<section class="price" id="price"><div class="wrap">
<div class="shead rv"><div class="eyebrow">Pricing</div><h2>One price. Everything in.</h2></div>
<div class="pgrid">
<div class="rv">
<div class="big">₹7,000<small>per month</small></div>
<ul class="inc"><li><b>Breakfast</b>every morning</li><li><b>Packed lunch</b>for the office</li><li><b>Dinner</b>every night</li><li><b>WiFi</b>included</li><li><b>Laundry</b>included</li><li><b>Ironing</b>included</li></ul>
</div>
<aside class="first rv d1">
<div class="tag">First month</div>
<div class="fbig">₹8,000</div>
<p>Includes your refundable deposit and admission. The deposit is fully returned when you move out.</p>
<ul><li>No mess bills</li><li>No WiFi add-ons</li><li>₹0 commute</li></ul>
<a class="btn sun" href="${WA}" rel="noopener">Check Availability <span aria-hidden="true">→</span></a>
</aside>
</div></div></section>

<section class="gal" id="photos"><div class="wrap"><div class="shead rv"><div class="eyebrow">Photos</div><h2>Bright rooms. Green views.</h2></div>
<div class="gg">
<figure class="rv"><img src="/img/p2.jpg" alt="Laptop on the StayB balcony overlooking coconut palms and the Kakkanad skyline" loading="lazy" width="720" height="720"><figcaption>Balcony workspace</figcaption></figure>
<figure class="rv d1"><img src="/img/p1.jpg" alt="StayB men's hostel building with balconies in Kakkanad, Kochi" loading="lazy" width="720" height="720"><figcaption>The building</figcaption></figure>
<figure class="rv"><img src="/img/p3.jpg" alt="Beds and a side table inside a StayB hostel room near Infopark" loading="lazy" width="720" height="720"><figcaption>Rooms</figcaption></figure>
<figure class="rv d1"><img src="/img/p4.jpg" alt="Tiled corridor with room doors at StayB hostel, Kakkanad" loading="lazy" width="720" height="720"><figcaption>Corridors</figcaption></figure>
</div></div></section>

<section class="walk" id="location"><div class="wrap">
<div class="shead rv"><div class="eyebrow">Location</div><h2>Door to desk in 7 minutes.</h2><p class="lead">StayB is in Kakkanad, a short walk from Infopark Phase 2. No bus, no auto, no traffic.</p></div>
<div class="route rv">
<div class="timer"><span class="t">0:00</span><small>walking time</small></div>
<svg class="rsvg rh" viewBox="0 0 1200 300" role="img" aria-label="Illustration of the 7-minute walk from StayB to Infopark Phase 2">
<path class="rbase" d="M90 220 C260 220 300 96 470 120 S720 238 860 160 S1060 100 1110 118"/>
<path class="rdone" d="M90 220 C260 220 300 96 470 120 S720 238 860 160 S1060 100 1110 118"/>
<g class="mins"></g>
<g transform="translate(36 160) scale(.46)" class="rhouse">${MARK}</g>
<g class="rtower"><rect x="1088" y="40" width="46" height="64" rx="5"/><rect x="1138" y="62" width="34" height="42" rx="5"/></g>
<text x="90" y="268" text-anchor="middle" class="rl">StayB</text><text x="1112" y="146" text-anchor="middle" class="rl">Infopark Ph. 2</text>
<g class="rwalker"><circle r="10" fill="#f3d82b"/><circle r="20" fill="none" stroke="#f3d82b" stroke-opacity=".4"/></g>
</svg>
<svg class="rsvg rv-route" data-v="1" viewBox="0 0 320 600" aria-hidden="true">
<path class="rbase" d="M80 520 C80 440 240 440 240 360 S80 280 80 200 S240 120 240 70"/>
<path class="rdone" d="M80 520 C80 440 240 440 240 360 S80 280 80 200 S240 120 240 70"/>
<g class="mins"></g>
<g transform="translate(36 500) scale(.38)" class="rhouse">${MARK}</g>
<g class="rtower"><rect x="214" y="-4" width="40" height="56" rx="5"/><rect x="258" y="16" width="30" height="36" rx="5"/></g>
<text x="80" y="580" text-anchor="middle" class="rl">StayB</text><text x="200" y="34" text-anchor="end" class="rl">Infopark Ph. 2</text>
<g class="rwalker"><circle r="10" fill="#f3d82b"/><circle r="20" fill="none" stroke="#f3d82b" stroke-opacity=".4"/></g>
</svg>
<p class="note">Route drawn for illustration. Open the map for directions.</p>
</div>
<div class="wgrid">
<div class="facts rv">
<div><b>7 min</b><span>walk to Infopark Phase 2</span></div>
<div><b>₹0</b><span>daily commute cost</span></div>
<div><b>No curfew</b><span>enter any time with your key</span></div>
<div><b>Kakkanad</b><span>Kochi's IT corridor</span></div>
<a class="btn line" href="${MAPS}" rel="noopener">Open in Google Maps <span aria-hidden="true">↗</span></a>
</div>
<div class="mapf rv d1"><iframe title="Map of Infopark Phase 2, Kakkanad, Kochi" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Infopark+Phase+2,+Kakkanad,+Kochi&z=15&output=embed"></iframe></div>
</div>
</div></section>

<section class="rules" id="rules"><div class="wrap"><div class="shead rv"><div class="eyebrow">How we live</div><h2>Simple rules. No surprises.</h2></div>
<div class="rg"><div class="rc rv"><em>01</em><h3>Entry &amp; exit</h3><p>No fixed curfew. Use your key.</p></div><div class="rc rv d1"><em>02</em><h3>Guests</h3><p>Common areas only. No overnight guests.</p></div><div class="rc rv d2"><em>03</em><h3>Noise</h3><p>Quiet hours after 11 PM.</p></div><div class="rc rv d3"><em>04</em><h3>Cleanliness</h3><p>Rooms are yours. Common areas are shared.</p></div></div>
<p class="who rv">Who lives here: employees from TCS, Infosys, UST and other Infopark companies. Freshers and experienced, all professionals.</p>
<div class="parents rv"><div><div class="eyebrow">For parents</div><h2>Safe and predictable.</h2></div>
<ul><li><span>Walkable location</span><b>7 min to Infopark</b></li><li><span>Refundable deposit</span><b>Fully returned</b></li><li><span>Inclusive food</span><b>All meals covered</b></li><li><span>Clear rules</span><b>No surprises</b></li></ul></div></div></section>

<section class="areas"><div class="wrap prose"><div class="shead rv"><div class="eyebrow">Find your stay</div><h2>Hostel in Kakkanad, built for Infopark.</h2></div>
<p class="rv">StayB is a men's hostel in Kakkanad, Kochi, made for people who work at Infopark. Whether you are searching for a hostel near Infopark, a PG for men, or a hostel with food, the answer is the same: walk 7 minutes, eat well and pay one price.</p>
<div class="alinks rv">${LANDINGS.map(l=>`<a href="/${l.slug}">${l.kw} →</a>`).join('')}</div></div></section>

<section class="faq" id="faq"><div class="wrap"><div class="shead rv"><div class="eyebrow">Questions</div><h2>Everything you would ask.</h2></div><div class="rv">${faqHtml(FAQ)}</div></div></section>

<section class="final"><div class="sun3"></div><div class="wrap"><div class="eyebrow center">Ready?</div><h2>Your bed<br>is <em>7 minutes</em><br>from work.</h2>
<p class="lead">Most residents find us through word of mouth. Come see why. Beds available now in Kakkanad, Kochi.</p>
<div class="cta"><a class="btn sun" href="${WA}" rel="noopener">Check Availability →</a><a class="btn line" href="tel:${PHONE}">Call ${PHONE_DISP}</a></div></div></section>` + footer;

fs.writeFileSync(OUT+'index.html', home);

// ---------- LANDING PAGES ----------
for (const l of LANDINGS){
  const path='/'+l.slug;
  const ld={"@context":"https://schema.org","@graph":[...lodging["@graph"],faqLd(l.faq),
   {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"StayB","item":BASE+"/"},{"@type":"ListItem","position":2,"name":l.kw,"item":BASE+path}]}]};
  const html = head({title:l.title,desc:l.desc,path,ld}) + nav + `
<header class="lp-hero"><div class="sunball"></div><div class="wrap"><div class="crumbs"><a href="/">StayB</a> / ${l.kw}</div><h1>${l.h1}</h1><p class="lead">${l.intro}</p>
<div class="cta"><a class="btn sun" href="${WA}" rel="noopener">Check Availability →</a><a class="btn line" href="tel:${PHONE}">Call ${PHONE_DISP}</a></div></div></header>
<main class="lp-body"><div class="wrap">
${l.sections.map(([h,p])=>`<h2>${h}</h2><p>${p}</p>`).join('')}
<h2>Quick facts</h2><ul>${l.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>
<h2>Questions</h2>${faqHtml(l.faq)}
<h2>More ways to find us</h2><p>${LANDINGS.filter(x=>x!==l).map(x=>`<a href="/${x.slug}">${x.kw}</a>`).join(' · ')}</p>
<div class="cta"><a class="btn dark" href="${WA}" rel="noopener">Message us on WhatsApp →</a><a class="btn line-dark" href="/">See the full StayB experience</a></div>
</div></main>` + footer;
  fs.writeFileSync(OUT+l.slug+'.html', html);
}

// ---------- SEO FILES ----------
const urls=['/',...LANDINGS.map(l=>'/'+l.slug)];
const today=new Date().toISOString().slice(0,10);
fs.writeFileSync(OUT+'sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${BASE}${u}</loc><lastmod>${today}</lastmod><priority>${u==='/'?'1.0':'0.8'}</priority></url>`).join('')}</urlset>`);
fs.writeFileSync(OUT+'robots.txt',`User-agent: *\nAllow: /\nSitemap: ${BASE}/sitemap.xml\n`);
fs.writeFileSync(OUT+'llms.txt',`# StayB Men's Hostel\n> Men's hostel in Kakkanad, Kochi, a 7-minute walk from Infopark Phase 2. ₹7,000/month including breakfast, packed lunch, dinner, WiFi, laundry and ironing. First month ₹8,000 including refundable deposit and admission. Phone ${PHONE_DISP}.\n\n${urls.map(u=>`- ${BASE}${u}`).join('\n')}\n`);
fs.writeFileSync(OUT+'404.html', head({title:'Page not found | StayB',desc:'Page not found',path:'/404',ld:{}}).replace('index,follow','noindex')+nav+`<header class="lp-hero"><div class="wrap"><h1>Lost? <em>Home</em> is 7 minutes away.</h1><div class="cta"><a class="btn sun" href="/">Back to StayB</a></div></div></header>`+footer);
if(!PV)fs.writeFileSync(OUT+"vercel.json", JSON.stringify({cleanUrls:true,headers:[
 {source:'/assets/(.*)',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]},
 {source:'/img/(.*)',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]}]},null,2));
if(PV){fs.cpSync(new URL('../site/assets/',import.meta.url),OUT+'assets',{recursive:true});fs.cpSync(new URL('../site/img/',import.meta.url),OUT+'img',{recursive:true});W(OUT+'.nojekyll','');fs.writeFileSync=W;W(OUT+'robots.txt','User-agent: *\nDisallow: /\n')}
console.log('built',urls.length,'pages');
