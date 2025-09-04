const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];
const toast = (() => {
  const el = document.createElement('div');
  el.className = 'toast'; el.id = 'toast'; document.body.appendChild(el);
  let t; return (msg) => { el.textContent = msg; el.classList.add('show'); clearTimeout(t); t = setTimeout(()=>el.classList.remove('show'), 2200); };
})();

// highlight current page
(() => {
  const path = location.pathname.replace(/\/index\.html?$/,'/'); // normalize
  $$('.navlinks a').forEach(a => {
    const href = a.getAttribute('href');
    if ((href === '/' && path === '/') || (href !== '/' && path.endsWith(href))) {
      a.setAttribute('aria-current','page');
    }
  });
})();

// intersection reveal
(() => {
  const els = $$('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(e=>e.classList.add('is-visible')); return; }
  const io = new IntersectionObserver(entries=>{
    for (const e of entries) if (e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
  },{threshold:0.12});
  els.forEach(el=>io.observe(el));
})();

// vanity counters (animate to zero, of course)
export function animateCounter(el, to=0, dur=900){
  const start = Number(el.textContent.replace(/[^\d.-]/g,'')) || 0;
  const s = performance.now();
  const step = (now)=>{
    const p = Math.min(1, (now - s) / dur);
    const v = Math.round(start + (to - start) * p);
    el.textContent = v.toLocaleString();
    if (p<1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
$$('.num[data-to]').forEach(n => animateCounter(n, Number(n.dataset.to)));

// tilt cards
$$('.tilt').forEach(container=>{
  const card = $('.card', container) || container;
  const reset = ()=> card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  const onMove = e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - r.left;
    const y = (e.clientY ?? e.touches?.[0]?.clientY) - r.top;
    const rx = ((y/r.height)-.5)*-12, ry=((x/r.width)-.5)*12;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  container.addEventListener('mousemove', onMove);
  container.addEventListener('mouseleave', reset);
  container.addEventListener('touchmove', onMove, {passive:true});
  container.addEventListener('touchend', reset);
});

// fake forms (careers + contact)
function wireFakeForm(formId, successMsg){
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]'); const txt = btn.textContent;
    btn.disabled = true; btn.textContent = 'submitting…';
    await new Promise(r=>setTimeout(r, 900)); // simulate network
    btn.textContent = 'ai screening…';
    await new Promise(r=>setTimeout(r, 800));
    btn.textContent = 'archiving…';
    await new Promise(r=>setTimeout(r, 700));
    toast(successMsg);
    btn.textContent = txt; btn.disabled = false;
    form.reset();
  });
}
wireFakeForm('careerForm', 'application discarded successfully');
wireFakeForm('contactForm', 'message filed under “misc.”');

// modal helpers (used on Home for “schedule demo”)
window.openModal = (id) => { const d = document.getElementById(id); if (d?.showModal) d.showModal(); else alert('modal: simulated.'); };

// console easter egg
console.log('%c nullcraft %c v2 — professionally useless ', 'background:linear-gradient(90deg,#6cf0ff,#9f7bff);color:#0b0f14;padding:4px 8px;border-radius:6px 0 0 6px;font-weight:800;', 'background:#111827;color:#e5f2ff;padding:4px 8px;border-radius:0 6px 6px 0;');