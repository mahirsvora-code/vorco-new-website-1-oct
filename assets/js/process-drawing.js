
const initProcessDrawing = () => {
  const section = document.querySelector('.process-shell');
  const steps = [...document.querySelectorAll('.process-step')];
  const marker = document.querySelector('.process-marker');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 860px)').matches;
  if (!section || !marker || prefersReducedMotion || isMobile) {
    steps.forEach((step, index) => step.classList.toggle('is-active', index === 0));
    return;
  }
  const lines = [...document.querySelectorAll('.drawing-line')];
  const setActive = (index) => {
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    const topPositions = ['0.8rem', '8.4rem', '16rem'];
    marker.style.top = topPositions[index] || '0.8rem';
  };
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(lines, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      stagger: 0.18,
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        once: true
      }
    });
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        const index = Math.min(2, Math.floor(self.progress * 3));
        setActive(index);
      }
    });
  }
};

if (document.body.dataset.page === 'home') { initProcessDrawing(); }
