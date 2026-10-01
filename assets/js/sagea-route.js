
const initSageaRoute = () => {
  const route = document.querySelector('.route-svg');
  if (!route) return;
  const line = route.querySelector('.route-line');
  const destination = route.querySelector('.route-destination');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 860px)').matches;
  if (!line || prefersReducedMotion || mobile) {
    if (line) line.style.strokeDashoffset = '0';
    if (destination) destination.classList.add('is-landed');
    return;
  }
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(line, { strokeDashoffset: 800 });
    gsap.to(line, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '.sagea-route',
        start: 'top 75%',
        end: 'bottom 35%',
        scrub: 0.6,
        onUpdate: (self) => {
          if (destination) destination.classList.toggle('is-landed', self.progress > .88);
        }
      }
    });
  }
};

if (document.body.dataset.page === 'sagea') { initSageaRoute(); }
