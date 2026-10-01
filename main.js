const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

document.querySelectorAll('.brand').forEach((brand) => {
  brand.setAttribute('aria-label', 'VORCO home');
  brand.setAttribute('role', 'img');
});
document.querySelectorAll('.footer-bottom').forEach((footer) => {
  footer.innerHTML = footer.innerHTML.replace(/©\s*2024/g, `© ${new Date().getFullYear()}`);
});

const pageMeta = {
  home: ['VORCO | Better systems. Smarter decisions.', 'Business transformation and solutions for clearer decisions and stronger businesses.', 'https://vorco.in/'],
  about: ['About VORCO | Better systems. Smarter decisions.', 'VORCO helps businesses, developers and organisations understand complexity, improve operations and execute with clarity.', 'https://vorco.in/about.html'],
  product: ['OptiBuild | VORCO solutions', 'OptiBuild helps real estate developers test feasibility, cost, cash flow and timeline risk before execution.', 'https://vorco.in/product.html'],
  contact: ['Contact VORCO | Start a conversation', 'Start a conversation with VORCO about business transformation, operations, technology or strategic growth.', 'https://vorco.in/contact.html'],
};

const currentMeta = pageMeta[body.dataset.page];
if (!document.head.querySelector('link[href="support.css"]')) {
  const supportStyles = document.createElement('link');
  supportStyles.rel = 'stylesheet';
  supportStyles.href = 'support.css';
  document.head.appendChild(supportStyles);
}
if (!document.head.querySelector('link[href="brand.css"]')) {
  const brandStyles = document.createElement('link');
  brandStyles.rel = 'stylesheet';
  brandStyles.href = 'brand.css';
  document.head.appendChild(brandStyles);
}
if (!document.head.querySelector('link[href="responsive.css"]')) {
  const responsiveStyles = document.createElement('link');
  responsiveStyles.rel = 'stylesheet';
  responsiveStyles.href = 'responsive.css';
  document.head.appendChild(responsiveStyles);
}
if (!document.head.querySelector('link[href="founder.css"]')) {
  const founderStyles = document.createElement('link');
  founderStyles.rel = 'stylesheet';
  founderStyles.href = 'founder.css';
  document.head.appendChild(founderStyles);
}
if (!document.head.querySelector('link[href="content.css"]')) {
  const contentStyles = document.createElement('link');
  contentStyles.rel = 'stylesheet';
  contentStyles.href = 'content.css';
  document.head.appendChild(contentStyles);
}
if (body.dataset.page === 'home' && !document.head.querySelector('link[href="capabilities.css"]')) {
  const capabilityStyles = document.createElement('link');
  capabilityStyles.rel = 'stylesheet';
  capabilityStyles.href = 'capabilities.css';
  document.head.appendChild(capabilityStyles);
}
if (!document.head.querySelector('link[href="polish.css"]')) {
  const polishStyles = document.createElement('link');
  polishStyles.rel = 'stylesheet';
  polishStyles.href = 'polish.css';
  document.head.appendChild(polishStyles);
}
if (body.dataset.page === 'home' && !document.head.querySelector('link[href="intro.css"]')) {
  const introStyles = document.createElement('link');
  introStyles.rel = 'stylesheet';
  introStyles.href = 'intro.css';
  document.head.appendChild(introStyles);
}
if (currentMeta) {
  const [title, description, canonical] = currentMeta;
  document.title = title;
  const setMeta = (selector, attributes) => {
    let element = document.head.querySelector(selector);
    if (!element) { element = document.createElement('meta'); document.head.appendChild(element); }
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  };
  setMeta('meta[name="description"]', { name: 'description', content: description });
  setMeta('meta[property="og:title"]', { property: 'og:title', content: title });
  setMeta('meta[property="og:description"]', { property: 'og:description', content: description });
  setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
  setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
  setMeta('meta[property="og:image"]', { property: 'og:image', content: 'https://vorco.in/social-preview.svg' });
  setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
  link.href = canonical;
  if (!document.head.querySelector('link[rel="icon"]')) { const icon = document.createElement('link'); icon.rel = 'icon'; icon.type = 'image/svg+xml'; icon.href = 'favicon.svg'; document.head.appendChild(icon); }
}

if (location.protocol === 'http:' && !['localhost', '127.0.0.1'].includes(location.hostname)) location.replace(`https:${location.href.substring(5)}`);

const siteIntro = document.querySelector('[data-site-intro]');
if (siteIntro) {
  const finishIntro = () => {
    siteIntro.classList.add('is-done');
    window.setTimeout(() => siteIntro.remove(), 850);
    sessionStorage.setItem('vorco-intro-seen', 'true');
  };
  const introSkip = siteIntro.querySelector('[data-intro-skip]');
  introSkip?.addEventListener('click', finishIntro);
  if (sessionStorage.getItem('vorco-intro-seen') === 'true' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finishIntro();
  } else {
    window.setTimeout(finishIntro, 2600);
  }
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    siteNav.classList.toggle('is-open', !isOpen);
  });
  siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false'); siteNav.classList.remove('is-open');
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      menuToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
    }
  });
}

const onScroll = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 16);
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  document.documentElement.style.setProperty('--scroll-progress', `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`);
};
onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, instance) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); instance.unobserve(entry.target); }
  }), { threshold: 0.12 });
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
    observer.observe(item);
  });
} else revealItems.forEach((item) => item.classList.add('is-visible'));

const cookieKey = 'vorco-cookie-choice';
if (!localStorage.getItem(cookieKey)) {
  const banner = document.createElement('aside');
  banner.className = 'cookie-banner';
  banner.innerHTML = '<p>We use essential cookies to remember your preferences. Optional analytics are not active.</p><button type="button" data-cookie-choice="accept">Okay</button><button type="button" class="cookie-dismiss" data-cookie-choice="dismiss">Dismiss</button>';
  document.body.appendChild(banner);
  banner.querySelectorAll('[data-cookie-choice]').forEach((button) => button.addEventListener('click', () => {
    localStorage.setItem(cookieKey, button.dataset.cookieChoice); banner.remove();
  }));
}

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const startedAt = Date.now();
  contactForm.insertAdjacentHTML('beforeend', '<input type="text" name="website" tabindex="-1" autocomplete="off" class="trap-field" aria-hidden="true">');
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = contactForm.querySelector('button'); const status = contactForm.querySelector('.form-status');
    if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
    const data = new FormData(contactForm);
    if (data.get('website') || Date.now() - startedAt < 2500) { status.textContent = 'Please wait a moment and try again.'; return; }
    const original = button.textContent; button.textContent = 'Sending...'; button.disabled = true;
    fetch(contactForm.action, { method: 'POST', headers: { Accept: 'application/json' }, body: data })
      .then((response) => { if (!response.ok) throw new Error('Request failed'); status.textContent = 'Message sent. We will reply by email.'; contactForm.reset(); })
      .catch(() => { status.textContent = 'Please email info@vorco.in directly.'; })
      .finally(() => { button.textContent = original; button.disabled = false; });
  });
}
