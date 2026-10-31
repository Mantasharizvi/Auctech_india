const header=document.getElementById("header");
const progress=document.getElementById("progress");
const cursorOrb=document.getElementById("cursorOrb");
const menuBtn=document.getElementById("menuBtn");
const nav=document.getElementById("nav");

function scrollUI(){
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=`${max>0?(window.scrollY/max)*100:0}%`;
  header.classList.toggle("scrolled",window.scrollY>30);
}
window.addEventListener("scroll",scrollUI,{passive:true});scrollUI();

menuBtn?.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded",String(open));
});
nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target)}
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

document.addEventListener("mousemove",e=>{
  cursorOrb.style.left=e.clientX+"px";cursorOrb.style.top=e.clientY+"px";cursorOrb.style.opacity="1";
});
document.addEventListener("mouseleave",()=>cursorOrb.style.opacity="0");

document.querySelectorAll(".solution-card,.price-card").forEach(card=>{
  card.addEventListener("pointermove",e=>{
    if(innerWidth<900)return;
    const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`translateY(-10px) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*3).toFixed(2)}deg)`;
  });
  card.addEventListener("pointerleave",()=>card.style.transform="");
});

const modal=document.getElementById("queryModal");
const form=document.getElementById("queryForm");
const selectedPlan=document.getElementById("selectedPlan");
const WHATSAPP="919838075486";

function openQuery(plan=""){
  modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
  if(plan) selectedPlan.value=plan;
  setTimeout(()=>form?.querySelector("input")?.focus(),180);
}
function closeQuery(){
  modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow="";
}
document.querySelectorAll(".query-open").forEach(b=>b.addEventListener("click",()=>openQuery()));
document.querySelectorAll(".query-plan").forEach(b=>b.addEventListener("click",()=>openQuery(b.dataset.plan||"")));
document.querySelectorAll("[data-close-query]").forEach(el=>el.addEventListener("click",closeQuery));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))closeQuery()});

form?.addEventListener("submit",e=>{
  e.preventDefault();
  const d=new FormData(form);
  const v=k=>String(d.get(k)||"").trim();
  const message=[
    "Hello AUCTECH MARCOM! 👋","",
    "I am interested in website design & digital marketing.",
    "",
    `Name: ${v("name")}`,
    `Phone / WhatsApp: ${v("phone")}`,
    `Email: ${v("email")}`,
    `Business / Company: ${v("business")}`,
    `Industry: ${v("industry")}`,
    `Website Package: ${v("plan")}`,
    `Need Domain + Hosting: ${v("hosting")||"Not specified"}`,
    `Current Website: ${v("currentWebsite")||"Not specified"}`,
    "",
    `Requirement: ${v("message")}`,
    "",
    "Please contact me with the next steps. Thank you!"
  ].join("\n");
  const url=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

  // 1) Save the query in the admin panel (via API). keepalive lets it finish even after WhatsApp opens.
  const api=(window.AUCTECH_API||"").replace(/\/$/,"");
  if(api){
    fetch(`${api}/contact-queries`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      keepalive:true,
      body:JSON.stringify({
        name:v("name"),phone:v("phone"),email:v("email"),business:v("business"),
        industry:v("industry"),service:v("plan"),hosting:v("hosting"),
        currentWebsite:v("currentWebsite"),message:v("message")
      })
    }).catch(()=>{/* WhatsApp still opens even if saving fails */});
  }

  // 2) Open WhatsApp right away (same click, so the browser does not block it)
  window.open(url,"_blank","noopener,noreferrer");
});

document.getElementById("year").textContent=new Date().getFullYear();
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
  const t=document.querySelector(a.getAttribute("href"));if(t){e.preventDefault();t.scrollIntoView({behavior:"smooth"});}
}));


// Single scroll control: down near the top, up after the first screen.
const scrollToggle=document.getElementById('scrollToggle');
function updateScrollToggle(){
  const nearTop=window.scrollY<260;
  if(scrollToggle){
    scrollToggle.innerHTML=nearTop?'<i class="fa-solid fa-arrow-down"></i>':'<i class="fa-solid fa-arrow-up"></i>';
    scrollToggle.setAttribute('aria-label',nearTop?'Scroll down':'Scroll to top');
  }
}
window.addEventListener('scroll',updateScrollToggle,{passive:true});
updateScrollToggle();
scrollToggle?.addEventListener('click',()=>{
  if(window.scrollY<260) window.scrollBy({top:Math.max(520,window.innerHeight*.82),behavior:'smooth'});
  else window.scrollTo({top:0,behavior:'smooth'});
});

// One reel plays at a time
document.addEventListener("play",e=>{if(e.target.matches?.(".reel video"))document.querySelectorAll(".reel video").forEach(o=>{if(o!==e.target)o.pause()});},true);

// Post image lightbox (open, zoom, rotate, flip)
(()=>{
  const box=document.getElementById("lightbox"),img=document.getElementById("lbImg");
  if(!box||!img)return;
  let s=1,r=0,fx=1,fy=1;
  const apply=()=>{img.style.transform=`rotate(${r}deg) scale(${fx*s},${fy*s})`;
    box.querySelector('[data-lb="out"]').disabled=s<=0.5;box.querySelector('[data-lb="in"]').disabled=s>=4;};
  const open=el=>{img.src=el.currentSrc||el.src;img.alt=el.alt;s=1;r=0;fx=1;fy=1;apply();box.classList.add("open");box.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";};
  const close=()=>{box.classList.remove("open");box.setAttribute("aria-hidden","true");document.body.style.overflow="";};
  document.addEventListener("click",e=>{const el=e.target.closest(".post img");if(el)open(el);});
  box.addEventListener("click",e=>{
    const a=e.target.closest("[data-lb]")?.dataset.lb;
    if(a==="close"||e.target===box||e.target.classList.contains("lb-stage"))return close();
    if(a==="in")s=Math.min(4,s+.25);
    if(a==="out")s=Math.max(.5,s-.25);
    if(a==="rotl")r-=90;
    if(a==="rotr")r+=90;
    if(a==="fliph")fx*=-1;
    if(a==="flipv")fy*=-1;
    if(a)apply();
  });
  box.addEventListener("wheel",e=>{e.preventDefault();s=Math.min(4,Math.max(.5,s+(e.deltaY<0?.2:-.2)));apply();},{passive:false});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&box.classList.contains("open"))close();});
})();
