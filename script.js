const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
const fine = matchMedia('(pointer: fine)').matches;
const mobile = () => innerWidth <= 760;

/* ---------- Split hero headline into words ---------- */
const h1 = $('.split');
const wrapWords = node => {
  [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(part); return; }
        const w = document.createElement('span'); w.className = 'w';
        const i = document.createElement('span'); i.textContent = part;
        w.append(i); frag.append(w);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1) {
      const w = document.createElement('span'); w.className = 'w';
      const i = document.createElement('span');
      n.replaceWith(w); i.append(n); w.append(i);
    }
  });
};
wrapWords(h1);
$$('.split .w > span').forEach((s, i) => (s.style.transitionDelay = 0.1 + i * 0.06 + 's'));

/* ---------- Loader ---------- */
document.body.classList.add('loading');
let lp = 0;
const lt = setInterval(() => {
  lp = Math.min(100, lp + 8 + Math.random() * 14);
  $('#loadBar').style.width = lp + '%';
  if (lp >= 100) {
    clearInterval(lt);
    setTimeout(() => {
      $('#loader').classList.add('done');
      document.body.classList.remove('loading');
      document.body.classList.add('ready');
    }, 300);
  }
}, 90);

/* ---------- Cursor ---------- */
if (fine) {
  const dot = $('#dot'), ring = $('#ring');
  let mx = -100, my = -100, rx = mx, ry = my;
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`; });
  (function loop() {
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
  $$('a, button, input, textarea, .cs, .sk').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  /* Magnetic buttons */
  $$('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    el.addEventListener('mouseleave', () => (el.style.transform = ''));
  });

  /* Phone tilt */
  const phone = $('#phone');
  addEventListener('mousemove', e => {
    if (scrollY > innerHeight) return;
    const x = (e.clientX / innerWidth - 0.5) * 14;
    const y = (e.clientY / innerHeight - 0.5) * -10;
    phone.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
  });
}

/* ---------- Nav: scrolled state, active link, progress ---------- */
const nav = $('#nav'), bar = $('#progress');
const sections = $$('section[id]');
function onScroll() {
  nav.classList.toggle('scrolled', scrollY > 20);
  bar.style.width = (scrollY / (document.documentElement.scrollHeight - innerHeight)) * 100 + '%';
  let current = '';
  sections.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * 0.4) current = s.id; });
  $$('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  hscroll();
  timeline();
}
addEventListener('scroll', onScroll, { passive: true });

/* Mobile menu */
$('#menuBtn').addEventListener('click', () => { $('#menuBtn').classList.toggle('open'); $('#navLinks').classList.toggle('open'); });
$$('#navLinks a').forEach(a => a.addEventListener('click', () => { $('#menuBtn').classList.remove('open'); $('#navLinks').classList.remove('open'); }));

/* ---------- Reel ad in phone ---------- */
const reels = [
  { brand: 'aurum.men', hook: "Silver that<br>doesn't fade.", cta: 'Shop now', bg: 'linear-gradient(160deg,#1877f2,#6a3cff)' },
  { brand: 'glowlab.in', hook: 'Clear skin<br>in 21 days.', cta: 'Get 20% off', bg: 'linear-gradient(160deg,#f472b6,#fb923c)' },
  { brand: 'nest.interiors', hook: 'Your 3BHK,<br>done in 45 days.', cta: 'Book a free consult', bg: 'linear-gradient(160deg,#0f766e,#0b1220)' },
];
const rbars = $$('.reel-bar i');
let ri = 0;
function showReel() {
  const r = reels[ri];
  $('#reel').style.background = r.bg;
  $('#reelBrand').textContent = r.brand;
  const hook = $('#reelHook');
  hook.innerHTML = r.hook;
  hook.classList.remove('swap'); void hook.offsetWidth; hook.classList.add('swap');
  $('#reelCta').textContent = r.cta;
  rbars.forEach((b, i) => (b.className = i < ri ? 'done' : i === ri ? 'fill' : ''));
  ri = (ri + 1) % reels.length;
}
showReel();
setInterval(showReel, 3200);
let likes = 12400;
setInterval(() => { likes += Math.floor(Math.random() * 30); $('#likes').textContent = (likes / 1000).toFixed(1) + 'K'; }, 800);

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.15 });
$$('.reveal, .cs, #meters').forEach(el => io.observe(el));
$$('.stats .reveal, .skill-cards .reveal, .certs .reveal').forEach((el, i) => (el.style.transitionDelay = (i % 4) * 0.1 + 's'));

/* ---------- Count-up ---------- */
const cio = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, dec = +(el.dataset.dec || 0);
  const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
  const t0 = performance.now();
  const tick = now => {
    const k = Math.min((now - t0) / 1800, 1);
    el.textContent = pre + (end * (1 - Math.pow(1 - k, 4))).toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  cio.unobserve(el);
}), { threshold: 0.6 });
$$('[data-count]').forEach(el => cio.observe(el));

/* ---------- Timeline fill ---------- */
const tl = $('#timeline'), tlFill = $('#tlFill');
function timeline() {
  const r = tl.getBoundingClientRect();
  const k = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
  tlFill.style.height = k * 100 + '%';
}

/* ---------- Horizontal case studies ---------- */
const hs = $('#work'), track = $('#hsTrack'), hsBar = $('#hsBar'), hsNow = $('#hsNow');
const csCount = $$('.cs').length;
function hscroll() {
  if (mobile()) { track.style.transform = ''; return; }
  const r = hs.getBoundingClientRect();
  const prog = Math.min(1, Math.max(0, -r.top / (hs.offsetHeight - innerHeight)));
  track.style.transform = `translateX(${-prog * (track.scrollWidth - innerWidth)}px)`;
  hsBar.style.width = prog * 100 + '%';
  hsNow.textContent = String(Math.min(csCount, Math.floor(prog * csCount) + 1)).padStart(2, '0');
}
addEventListener('resize', onScroll);
onScroll();

/* ---------- Campaign planner ---------- */
const budget = $('#budget'), aov = $('#aov');
let roas = 3.2, revNow = 0, raf;
function paintRange(s) {
  const pct = (s.value - s.min) / (s.max - s.min) * 100;
  s.style.background = `linear-gradient(90deg, #1877f2 ${pct}%, #1f2937 ${pct}%)`;
}
function calc() {
  const monthly = budget.value * 30, rev = monthly * roas;
  $('#budgetOut').textContent = inr(budget.value);
  $('#aovOut').textContent = inr(aov.value);
  $('#spend').textContent = inr(monthly);
  $('#orders').textContent = Math.round(rev / aov.value).toLocaleString('en-IN');
  $('#roas').textContent = roas + 'x';
  paintRange(budget); paintRange(aov);
  cancelAnimationFrame(raf);
  const from = revNow, t0 = performance.now();
  const step = now => {
    const k = Math.min((now - t0) / 500, 1);
    revNow = from + (rev - from) * (1 - Math.pow(1 - k, 3));
    $('#rev').textContent = inr(revNow);
    if (k < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}
budget.addEventListener('input', calc);
aov.addEventListener('input', calc);
$('#industry').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  $$('#industry button').forEach(x => x.classList.toggle('on', x === b));
  roas = +b.dataset.r; calc();
});
calc();

/* ---------- Testimonials ---------- */
const quotes = [
  ['First time our ad report matched what we saw in Shopify. Clear, honest and always on top of the numbers.', 'Client Name', 'Founder, D2C jewellery brand'],
  ['The leads got better, not just cheaper. Our front desk now converts far more of them into appointments.', 'Client Name', 'Director, hair clinic'],
  ['Takes ownership of results and communicates clearly. A dependable person to have on any marketing team.', 'Manager Name', 'Team Lead, The Website Makers'],
];
let qi = 0;
function showQuote(i) {
  qi = i;
  const parts = [$('#qText'), $('.q-who')];
  parts.forEach(p => p.classList.add('fade'));
  setTimeout(() => {
    $('#qText').textContent = quotes[i][0];
    $('#qName').textContent = quotes[i][1];
    $('#qRole').textContent = quotes[i][2];
    $('#qAv').textContent = quotes[i][1][0];
    parts.forEach(p => p.classList.remove('fade'));
  }, 350);
  $$('#qDots button').forEach((d, j) => d.classList.toggle('on', j === i));
}
$$('#qDots button').forEach((d, i) => d.addEventListener('click', () => showQuote(i)));
setInterval(() => showQuote((qi + 1) % quotes.length), 6500);

/* ---------- Contact form (opens email app) ---------- */
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(e.target);
  const body = `${d.get('msg') || ''}\n\n${d.get('name')}${d.get('company') ? ', ' + d.get('company') : ''}\n${d.get('email')}`;
  location.href = `mailto:hello@example.com?subject=${encodeURIComponent('Portfolio enquiry from ' + d.get('name'))}&body=${encodeURIComponent(body)}`;
  $('#formNote').textContent = 'Opening your email app. Thanks for reaching out!';
  e.target.reset();
});

$('#year').textContent = new Date().getFullYear();

/* Until resume.pdf is uploaded, CV buttons point to the contact section */
fetch('resume.pdf', { method: 'HEAD' }).then(r => { if (!r.ok) throw 0; }).catch(() => {
  $$('a[href="resume.pdf"]').forEach(a => { a.href = '#contact'; a.removeAttribute('download'); });
});

/* ---------- Ads Manager proof screenshots (lightbox) ---------- */
const lb = document.createElement('div');
lb.className = 'lightbox';
lb.innerHTML = '<button class="lb-close" aria-label="Close">×</button><img alt="Ads Manager report">';
document.body.append(lb);
const closeLb = () => lb.classList.remove('open');
lb.addEventListener('click', e => { if (e.target !== lb.querySelector('img')) closeLb(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
$$('.proof-btn').forEach(btn => {
  const probe = new Image();
  probe.onerror = () => btn.classList.add('missing');   // hide until the screenshot is added
  probe.src = btn.dataset.proof;
  btn.addEventListener('click', () => { lb.querySelector('img').src = btn.dataset.proof; lb.classList.add('open'); });
});
