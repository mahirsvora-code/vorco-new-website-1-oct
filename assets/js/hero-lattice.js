
const initHeroLattice = () => {
  const lattice = document.querySelector('.hero-lattice');
  if (!lattice) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lines = [...lattice.querySelectorAll('.lattice-line')];
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) {
    lines.forEach((line) => { line.style.strokeDashoffset = '0'; });
    return;
  }
  const seen = sessionStorage.getItem('vorco-hero-intro');
  lines.forEach((line) => { line.style.strokeDasharray = '600'; line.style.strokeDashoffset = '600'; });
  if (!seen && window.gsap) {
    gsap.to(lines, {
      strokeDashoffset: 0,
      duration: 1.6,
      ease: 'expo.out',
      stagger: 0.08,
      onComplete: () => sessionStorage.setItem('vorco-hero-intro', 'true')
    });
  } else {
    lines.forEach((line) => { line.style.strokeDashoffset = '0'; });
  }
  const wrap = document.querySelector('.hero-lattice-wrap');
  if (!wrap) return;
  wrap.addEventListener('pointermove', (event) => {
    const rect = wrap.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    lines.forEach((line, index) => {
      const cx = rect.width * ((index % 5) + 1) / 6;
      const cy = rect.height * (Math.floor(index / 5) + 1) / 6;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const delta = Math.max(0, 180 - dist) / 180;
      const offsetX = (dx / dist) * delta * 6;
      const offsetY = (dy / dist) * delta * 6;
      line.setAttribute('transform', delta > 0.05 ? `translate(${offsetX} ${offsetY})` : 'translate(0 0)');
    });
  });
  wrap.addEventListener('pointerleave', () => {
    lines.forEach((line) => line.setAttribute('transform', 'translate(0 0)'));
  });
};

if (document.body.dataset.page === 'home') { initHeroLattice(); }
