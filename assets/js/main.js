
const body = document.body;
const header = document.querySelector('.site-header');
const nav = document.querySelector('.site-nav');
const navToggle = document.querySelector('.nav-toggle');

const setCurrentNav = () => {
  const current = body.dataset.page || 'home';
  document.querySelectorAll('.site-nav a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const isPageMatch = href === current + '.html' || (current === 'home' && (href === 'index.html' || href === '/'));
    if (isPageMatch) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('active');
    } else {
      link.removeAttribute('aria-current');
      link.classList.remove('active');
    }
  });
};

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle('is-solid', window.scrollY > 80);
};

let lastScrollY = 0;
const handleScroll = () => {
  setHeaderState();
  if (!header) return;
  const scrolledDown = window.scrollY > lastScrollY && window.scrollY > 120;
  header.classList.toggle('is-hidden', scrolledDown);
  lastScrollY = window.scrollY;
};

const wireNav = () => {
  if (!navToggle || !nav) return;
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
};

const setFooterYear = () => {
  document.querySelectorAll('[data-footer-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
};

const setupAnchorLinks = () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
};

const warnForPlaceholders = () => {
  const matches = [...document.body.innerText.matchAll(/\[[^\]]+\]/g)].map((m) => m[0]);
  if (matches.length) {
    console.warn('Placeholder content still visible in the page:', matches);
  }
};

const setSmoothScroll = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (window.Lenis && !prefersReducedMotion && !isTouch) {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.08 });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
};

setCurrentNav();
setFooterYear();
wireNav();
setupAnchorLinks();
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();
setSmoothScroll();
warnForPlaceholders();

window.VORCO_SITE = {
  endpoint: {
    mode: 'mailto',
    target: 'mailto:info@vorco.in'
  }
};
