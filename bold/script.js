const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
const fine = matchMedia('(pointer: fine)').matches;
const mobile = () => innerWidth <= 760;

/* ---------- Loader ---------- */
document.body.classList.add('loading');
let p = 0;
const loadTimer = setInterval(() => {
  p = Math.min(100, p + Math.ceil(Math.random() * 12));
  $('#loadNum').textContent = p;
  if (p === 100) {
    clearInterval(loadTimer);
    setTimeout(() => {
      $('#loader').classList.add('done');
      document.body.classList.remove('loading');
      document.body.classList.add('ready');
    }, 250);
  }
}, 60);

/* ---------- Custom cursor ---------- */
const cursor = $('#cursor');
let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function loop() {
  cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
  cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
  requestAnimationFrame(loop);
})();
$$('a, button, .sticker, input').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});
$$('[data-cursor]').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('big'); $('#cursorText').textContent = el.dataset.cursor; });
  el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
});

/* ---------- Magnetic buttons ---------- */
if (fine) $$('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
  });
  el.addEventListener('mouseleave', () => (el.style.transform = ''));
});

/* ---------- Mobile menu ---------- */
$('#menuBtn').addEventListener('click', () => {
  $('#menuBtn').classList.toggle('open');
  $('#navLinks').classList.toggle('open');
});
$$('#navLinks a').forEach(a => a.addEventListener('click', () => {
  $('#menuBtn').classList.remove('open');
  $('#navLinks').classList.remove('open');
}));

/* ---------- Phone tilt ---------- */
const phone = $('#phone');
if (fine) addEventListener('mousemove', e => {
  const x = (e.clientX / innerWidth - 0.5) * 16;
  const y = (e.clientY / innerHeight - 0.5) * -16;
  phone.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) rotate(6deg)`;
});

/* ---------- Reel ad slideshow ---------- */
const reels = [
  { brand: 'aurum.men', hook: "Silver that<br>doesn't fade.", cta: 'Shop now ›', bg: 'linear-gradient(135deg,#feda75,#fa7e1e 25%,#d62976 50%,#962fbf 75%,#4f5bd5)' },
  { brand: 'glowlab.in', hook: 'Dark spots?<br>Gone in 21 days.', cta: 'Get 20% off ›', bg: 'linear-gradient(160deg,#ff4fd8,#ff9a8b)' },
  { brand: 'nest.interiors', hook: 'Your 3BHK.<br>Done in 45 days.', cta: 'Free consultation ›', bg: 'linear-gradient(160deg,#0b0b0b,#3a3a3a)' },
];
const bars = $$('.reel-bar i');
let ri = 0;
function showReel() {
  const r = reels[ri];
  $('#reel').style.background = r.bg;
  $('#reel').style.animation = ri === 0 ? '' : 'none';
  $('#reelBrand').textContent = r.brand;
  const hook = $('#reelHook');
  hook.innerHTML = r.hook;
  hook.classList.remove('swap'); void hook.offsetWidth; hook.classList.add('swap');
  $('#reelCta').textContent = r.cta;
  bars.forEach((b, i) => { b.className = i < ri ? 'done' : i === ri ? 'fill' : ''; });
  ri = (ri + 1) % reels.length;
}
showReel();
setInterval(showReel, 3000);
let likes = 12400;
setInterval(() => {
  likes += Math.floor(Math.random() * 40);
  $('#likes').textContent = (likes / 1000).toFixed(1) + 'K';
}, 700);

/* ---------- Draggable stickers ---------- */
$$('.drag').forEach(el => {
  let sx, sy, ox = 0, oy = 0, rot = getComputedStyle(el).transform;
  el.addEventListener('pointerdown', e => {
    el.setPointerCapture(e.pointerId);
    sx = e.clientX - ox; sy = e.clientY - oy;
    el.style.zIndex = 20;
    const move = ev => {
      ox = ev.clientX - sx; oy = ev.clientY - sy;
      el.style.transform = `translate(${ox}px, ${oy}px) rotate(${ox * 0.05}deg) scale(1.08)`;
    };
    const up = () => {
      el.style.transform = `translate(${ox}px, ${oy}px) rotate(${ox * 0.05}deg)`;
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  });
});

/* ---------- Count-up numbers ---------- */
const countIO = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, dec = +(el.dataset.dec || 0);
  const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
  const t0 = performance.now();
  const tick = now => {
    const k = Math.min((now - t0) / 1800, 1);
    const v = end * (1 - Math.pow(1 - k, 4));
    el.textContent = pre + v.toFixed(dec) + suf;
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  countIO.unobserve(el);
}), { threshold: 0.6 });
$$('[data-count]').forEach(el => countIO.observe(el));

/* ---------- Scroll reveals ---------- */
$$('.num, .svc-list li, .cr-head, .calc-left, .calc-card, .contact-grid, .q-wrap').forEach(el => el.classList.add('rv'));
const rvIO = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); rvIO.unobserve(e.target); }
}), { threshold: 0.15 });
$$('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 90 + 'ms'; rvIO.observe(el); });

/* ---------- Horizontal case studies ---------- */
const hs = $('#work'), track = $('#hsTrack'), hsBar = $('#hsBar');
function hscroll() {
  if (mobile()) { track.style.transform = ''; return; }
  const r = hs.getBoundingClientRect();
  const total = hs.offsetHeight - innerHeight;
  const prog = Math.min(1, Math.max(0, -r.top / total));
  const dist = track.scrollWidth - innerWidth;
  track.style.transform = `translateX(${-prog * dist}px)`;
  hsBar.style.width = prog * 100 + '%';
}
addEventListener('scroll', hscroll, { passive: true });
addEventListener('resize', hscroll);

/* ---------- ROAS calculator ---------- */
const budget = $('#budget'), aov = $('#aov');
let roas = 3.2;
function calc() {
  const monthly = budget.value * 30;
  const rev = monthly * roas;
  $('#budgetOut').textContent = inr(budget.value);
  $('#aovOut').textContent = inr(aov.value);
  $('#spend').textContent = inr(monthly);
  $('#orders').textContent = Math.round(rev / aov.value).toLocaleString('en-IN');
  $('#roas').textContent = roas + 'x';
  animateTo($('#rev'), rev);
  [budget, aov].forEach(s => {
    const pct = (s.value - s.min) / (s.max - s.min) * 100;
    s.style.background = `linear-gradient(90deg, #0b0b0b ${pct}%, rgba(0,0,0,.15) ${pct}%)`;
  });
}
let revNow = 0, revRaf;
function animateTo(el, target) {
  cancelAnimationFrame(revRaf);
  const from = revNow, t0 = performance.now();
  const step = now => {
    const k = Math.min((now - t0) / 500, 1);
    revNow = from + (target - from) * (1 - Math.pow(1 - k, 3));
    el.textContent = inr(revNow);
    if (k < 1) revRaf = requestAnimationFrame(step);
  };
  revRaf = requestAnimationFrame(step);
}
budget.addEventListener('input', calc);
aov.addEventListener('input', calc);
$('#industry').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  $$('#industry button').forEach(x => x.classList.toggle('on', x === b));
  roas = +b.dataset.r;
  calc();
});
calc();

/* ---------- Services hover card ---------- */
const float = $('#svcFloat');
const floatText = { g1: 'Stop the leaks', g2: 'Track every rupee', g3: 'Hooks that hit', g4: '10x the budget', g5: 'Leads on tap' };
$$('#svcList li').forEach(li => {
  li.addEventListener('mouseenter', () => {
    float.className = 'svc-float show ' + li.dataset.img;
    float.textContent = floatText[li.dataset.img];
  });
  li.addEventListener('mouseleave', () => float.classList.remove('show'));
});
addEventListener('mousemove', e => { float.style.left = e.clientX + 'px'; float.style.top = e.clientY + 'px'; });

/* ---------- Testimonials ---------- */
const quotes = [
  ['"First time the ad report matched what we saw in Shopify. We doubled budget in month two."', 'Founder, D2C jewellery brand'],
  ['"The leads are better, not just cheaper. Our front desk actually likes calling them now."', 'Director, hair clinic'],
  ['"Honest enough to tell us when NOT to spend more. That\'s rare with ad people."', 'Owner, D2C food brand'],
];
let qi = 0;
function showQuote(i) {
  qi = i;
  const t = $('#qText'), w = $('#qWho');
  t.classList.add('fade'); w.classList.add('fade');
  setTimeout(() => {
    t.textContent = quotes[i][0]; w.textContent = quotes[i][1];
    t.classList.remove('fade'); w.classList.remove('fade');
  }, 400);
  $$('#qDots button').forEach((d, j) => d.classList.toggle('on', j === i));
}
$$('#qDots button').forEach((d, i) => d.addEventListener('click', () => showQuote(i)));
setInterval(() => showQuote((qi + 1) % quotes.length), 6000);

/* ---------- Contact form → WhatsApp ---------- */
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(e.target);
  const text = `Hi! I'm ${d.get('name')}.\nWebsite: ${d.get('site') || '-'}\nBudget: ${d.get('budget')}\n${d.get('msg') || ''}`;
  window.open('https://wa.me/910000000000?text=' + encodeURIComponent(text), '_blank');
  $('#formNote').textContent = 'Opening WhatsApp. Hit send and I\'ll reply soon.';
  e.target.reset();
});

/* ---------- Footer ---------- */
$('#year').textContent = new Date().getFullYear();
const clock = () => $('#clock').textContent = 'Bengaluru ' + new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
clock(); setInterval(clock, 30000);
