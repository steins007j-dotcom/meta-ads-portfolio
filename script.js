// Sticky nav border
const nav = document.querySelector('.nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10));

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuBtn.classList.remove('open');
  navLinks.classList.remove('open');
}));

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 80 + 'ms';
  io.observe(el);
});

// Count-up numbers
const counters = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const end = +el.dataset.count;
    const pre = el.dataset.prefix || '';
    const suf = el.dataset.suffix || '';
    const t0 = performance.now();
    const dur = 1400;
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = pre + v.toLocaleString('en-IN') + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counters.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counters.observe(el));

// Case study filters
document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === btn));
  const f = btn.dataset.f;
  document.querySelectorAll('.case').forEach(c => {
    c.classList.toggle('hide', f !== 'all' && !c.dataset.cat.split(' ').includes(f));
  });
});

// Contact form (opens WhatsApp with the details; swap for Formspree etc. if you prefer)
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(e.target);
  const text = `Hi! I'm ${d.get('name')}.\nWebsite: ${d.get('site') || '-'}\nBudget: ${d.get('budget')}\n${d.get('msg') || ''}`;
  window.open('https://wa.me/910000000000?text=' + encodeURIComponent(text), '_blank');
  document.getElementById('formNote').textContent = 'Thanks! Opening WhatsApp so you can send it.';
  e.target.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
