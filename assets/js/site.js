
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const touchDevice = window.matchMedia('(pointer: coarse)').matches;
const header = document.querySelector('.site-header');
const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.menu-toggle');

const initSmoothScroll = () => {
  if (!window.Lenis || reduceMotion || touchDevice) return null;
  const lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
  lenis.on('scroll', () => window.ScrollTrigger?.update());
  const frame = (time) => { lenis.raf(time); requestAnimationFrame(frame); };
  requestAnimationFrame(frame);
  return lenis;
};
const lenis = initSmoothScroll();

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle('is-solid', window.scrollY > 40);
};
let previous = 0;
const handleScroll = () => {
  setHeaderState();
  if (!header) return;
  const movingDown = window.scrollY > previous && window.scrollY > 120;
  header.classList.toggle('is-hidden', movingDown);
  previous = window.scrollY;
};

if (toggle && nav) {
  const closeMenu = () => {
    nav.classList.remove('is-open');
    document.body.classList.remove('is-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-menu-open', open);
    if (lenis) open ? lenis.stop() : lenis.start();
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });
}

window.addEventListener('scroll', handleScroll, { passive: true });
setHeaderState();

const setCurrentNav = () => {
  const page = document.body.dataset.page || 'home';
  document.querySelectorAll('.site-nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const matches = href === page + '.html' || (page === 'home' && (href === 'index.html' || href === '/'));
    if (matches) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};
setCurrentNav();

const requestedNeed = new URLSearchParams(window.location.search).get('need');
const needSelect = document.querySelector('#need');
if (requestedNeed && needSelect) {
  const requestedOption = [...needSelect.options].find((option) => option.textContent.toLowerCase().includes(requestedNeed.toLowerCase()));
  if (requestedOption) needSelect.value = requestedOption.value;
}

const footerYear = document.querySelector('[data-footer-year]');
if (footerYear) footerYear.textContent = String(new Date().getFullYear());

const capabilityRows = [...document.querySelectorAll('[data-capability]')];
capabilityRows.forEach((row) => {
  row.addEventListener('mouseenter', () => setCapability(row));
  row.addEventListener('focus', () => setCapability(row));
  row.addEventListener('click', () => setCapability(row));
});
function setCapability(selected) {
  capabilityRows.forEach((row) => {
    const active = row === selected;
    row.classList.toggle('is-selected', active);
    row.setAttribute('aria-pressed', String(active));
  });
}

const model = document.querySelector('[data-assumption-model]');
if (model) {
  const labels = {
    project: ['Early brief', 'Medium', 'Expanded scope'],
    cost: ['Initial range', 'Working estimate', 'Detailed estimate'],
    timeline: ['Open window', 'Defined window', 'Committed window']
  };
  const updateModel = () => {
    const values = {};
    model.querySelectorAll('[data-model-input]').forEach((input) => {
      values[input.dataset.modelInput] = Number(input.value);
      const output = model.querySelector(`[data-model-${input.dataset.modelInput}]`);
      if (output) output.textContent = labels[input.dataset.modelInput][Number(input.value) - 1];
    });
    const total = Object.values(values).reduce((sum, value) => sum + value, 0);
    const state = total <= 4 ? 'Explore the range' : total >= 8 ? 'Prepare for delivery' : 'Balanced view';
    model.querySelector('[data-model-state]').textContent = state;
    model.querySelector('[data-model-scenario]').textContent = total <= 4 ? 'Early scenario' : total >= 8 ? 'Delivery scenario' : 'Compare assumptions';
    model.querySelector('[data-model-capital]').textContent = values.cost >= 3 ? 'Higher exposure' : values.cost <= 1 ? 'Lower exposure' : 'Working range';
    model.querySelector('[data-model-pressure]').textContent = values.timeline >= 3 ? 'Compressed' : values.timeline <= 1 ? 'Open' : 'Defined';
  };
  model.addEventListener('input', updateModel);
  updateModel();
}

const decisionField = document.querySelector('[data-decision-field]');
if (decisionField) {
  const stages = {
    understand: { number: '01', copy: 'Map the problem before changing the system.' },
    improve: { number: '02', copy: 'Find leverage in the way work is organised.' },
    execute: { number: '03', copy: 'Bring the right system and partners into reality.' }
  };
  const nodes = [...decisionField.querySelectorAll('[data-decision-stage]')];
  const labels = [...decisionField.querySelectorAll('[data-decision-label]')];
  const setDecisionStage = (stage) => {
    const current = stages[stage] || stages.understand;
    nodes.forEach((node) => {
      const active = node.dataset.decisionStage === stage;
      node.classList.toggle('is-active', active);
      node.setAttribute('aria-pressed', String(active));
    });
    labels.forEach((label) => label.classList.toggle('is-active', label.dataset.decisionLabel === stage));
    decisionField.querySelector('[data-decision-kicker]').textContent = `${current.number} / ${stage}`;
    decisionField.querySelector('[data-decision-copy]').textContent = current.copy;
  };
  nodes.forEach((node) => {
    node.addEventListener('mouseenter', () => setDecisionStage(node.dataset.decisionStage));
    node.addEventListener('focus', () => setDecisionStage(node.dataset.decisionStage));
    node.addEventListener('click', () => setDecisionStage(node.dataset.decisionStage));
  });
}

const partnershipFlow = document.querySelector('[data-partnership-flow]');
if (partnershipFlow) {
  const captions = {
    opportunity: 'VORCO opens the enterprise conversation and identifies where a practical opportunity exists.',
    understanding: 'VORCO and SAGEA understand the organisation, workflow and operating requirement together.',
    evaluation: 'SAGEA evaluates the technical fit, data environment and delivery conditions.',
    engineering: 'SAGEA leads model development, engineering and system architecture for the use case.',
    deployment: 'SAGEA leads technical delivery while VORCO supports the local enterprise relationship.'
  };
  const steps = [...partnershipFlow.querySelectorAll('[data-flow-step]')];
  const caption = document.querySelector('[data-flow-caption]');
  steps.forEach((step) => {
    step.addEventListener('click', () => {
      steps.forEach((item) => {
        const active = item === step;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      if (caption) caption.textContent = captions[step.dataset.flowStep];
    });
  });
}

const validateField = (field) => {
  const message = field.parentElement.querySelector('.error-text');
  if (!message) return true;
  let error = '';
  const value = field.value.trim();
  if (field.name === 'name' && !value) error = 'Please enter your name.';
  if (field.name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Enter a valid email address.';
  if (field.name === 'need' && !value) error = 'Please select the type of enquiry.';
  if (field.name === 'message' && value.length < 20) error = 'Please add a few more details.';
  field.setAttribute('aria-invalid', String(Boolean(error)));
  message.textContent = error;
  return !error;
};

const form = document.querySelector('[data-contact-form]');
if (form) {
  const fields = [...form.querySelectorAll('input, select, textarea')].filter((field) => field.name && !field.hasAttribute('data-nonrequired'));
  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const valid = fields.every(validateField);
    if (!valid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      firstInvalid && firstInvalid.focus();
      return;
    }
    const data = new FormData(form);
    const subject = 'New VORCO website enquiry';
    const body = [
      `Name: ${data.get('name') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Organisation: ${data.get('organisation') || ''}`,
      `Phone: ${data.get('phone') || ''}`,
      `Need: ${data.get('need') || ''}`,
      '',
      data.get('message') || ''
    ].join('\n');
    const status = form.querySelector('.form-status');
    if (status) {
      status.classList.add('is-success');
      status.textContent = 'Your email client is opening with the message prepared.';
    }
    form.classList.add('is-sent');
    window.location.href = `mailto:info@vorco.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

const initProcessSteps = () => {
  const section = document.querySelector('.process-shell');
  const steps = [...document.querySelectorAll('.stage')];
  const marker = document.querySelector('.process-marker');
  if (!section || !marker || !steps.length) return;
  const setActive = (index) => {
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    const positions = ['0.7rem', '8.5rem', '16.3rem'];
    marker.style.top = positions[index] || '0.7rem';
  };
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const lines = section.querySelectorAll('.drawing-line');
    gsap.to(lines, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      stagger: 0.12,
      scrollTrigger: { trigger: section, start: 'top 60%', once: true }
    });
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${Math.max(window.innerHeight * 1.35, section.offsetHeight - window.innerHeight)}`,
      pin: !reduceMotion && window.innerWidth > 900,
      pinSpacing: true,
      invalidateOnRefresh: true,
      scrub: 0.8,
      onUpdate: (self) => {
        const idx = Math.min(2, Math.floor(self.progress * 3));
        setActive(idx);
        section.dataset.stage = String(idx + 1);
      }
    });
  }
};
if (document.body.dataset.page === 'home') initProcessSteps();

const initHeroIntro = () => {
  const intro = document.querySelector('[data-hero-intro]');
  if (!intro) return;
  const finish = () => {
    intro.classList.add('is-complete');
    intro.setAttribute('aria-hidden', 'true');
    sessionStorage.setItem('vorco-hero-intro', 'seen');
  };
  intro.querySelector('[data-skip-intro]')?.addEventListener('click', finish);
  if (reduceMotion || sessionStorage.getItem('vorco-hero-intro')) { finish(); return; }
  intro.removeAttribute('aria-hidden');
  window.setTimeout(finish, 2350);
};
if (document.body.dataset.page === 'home') initHeroIntro();

const initPageTransitions = () => {
  if (reduceMotion) return;
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname === window.location.pathname && url.hash) return;
    event.preventDefault();
    document.body.classList.add('is-leaving');
    window.setTimeout(() => { window.location.href = url.href; }, 200);
  });
};
initPageTransitions();
