(() => {
  const root = document.documentElement;
  const sections = Array.from(document.querySelectorAll(".reveal-up"));
  if (!sections.length) return;

  root.classList.add("has-scroll-reveal");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsObserver = "IntersectionObserver" in window;
  const heroSection = document.querySelector("#top.reveal-up");

  const sectionSelectors = [
    ":scope > .container > .hero-grid",
    ":scope > .container > .hero-grid > *",
    ":scope > .container > .hero-secondary",
    ":scope > .container > .hero-secondary > *",
    ":scope > .container > .section-head",
    ":scope > .container > .page-link-row",
    ":scope > .container > .section-shell",
    ":scope > .container > article",
    ":scope > .container > .card",
    ":scope > .container > .row > *",
    ":scope > .container > h3",
    ":scope > .container > details",
    ":scope > .container > .cta-card",
    ":scope > .container > .section-shell > .section-head",
    ":scope > .container > .section-shell > .hero-image-shell",
    ":scope > .container > .section-shell > article",
    ":scope > .container > .section-shell > .row > *",
    ":scope > .container > .section-shell > ol > li",
    ":scope > .container > .section-shell > h3",
    ":scope > .container > .section-shell > details"
  ];

  const heroSelectors = [
    ".hero-badge",
    "h1",
    ".hero-subtitle",
    ".hero-lead",
    ".hero-list",
    ".hero-actions",
    ".hero-inline-orb",
    ".summary-card",
    ".hero-image-shell"
  ];

  const applyStagger = (targets, delayStep, delayCap, initialDelay = 0) => {
    targets.forEach((target, index) => {
      const delay = Math.min(initialDelay + index * delayStep, delayCap);
      target.classList.add("reveal-node");
      target.style.setProperty("--reveal-delay", `${delay}ms`);
    });
  };

  const collectTargets = (section) => {
    const uniqueTargets = new Set();
    sectionSelectors.forEach((selector) => {
      section.querySelectorAll(selector).forEach((element) => uniqueTargets.add(element));
    });

    if (uniqueTargets.size === 0) {
      uniqueTargets.add(section);
    }

    return Array.from(uniqueTargets);
  };

  const revealTargets = new Set();

  sections.forEach((section) => {
    const targets = collectTargets(section);
    const isHero = section === heroSection;
    applyStagger(targets, isHero ? 88 : 76, isHero ? 740 : 560);
    targets.forEach((target) => revealTargets.add(target));
  });

  if (heroSection) {
    const heroTargets = new Set();
    heroSelectors.forEach((selector) => {
      heroSection.querySelectorAll(selector).forEach((element) => heroTargets.add(element));
    });
    if (heroTargets.size) {
      const heroTargetList = Array.from(heroTargets);
      applyStagger(heroTargetList, 92, 760, 32);
      heroTargetList.forEach((target) => revealTargets.add(target));
    }
  }

  const items = Array.from(revealTargets);
  const showItem = (item) => {
    item.classList.add("is-visible");
  };

  if (prefersReducedMotion || !supportsObserver) {
    items.forEach(showItem);
  } else {
    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          showItem(entry.target);
          activeObserver.unobserve(entry.target);
        });
      },
      {
        root: null,
        threshold: 0.16,
        rootMargin: "0px 0px -12% 0px"
      }
    );

    items.forEach((item) => observer.observe(item));
  }

  if (heroSection && !prefersReducedMotion) {
    const heroItems = items.filter((item) => heroSection.contains(item));
    window.requestAnimationFrame(() => {
      window.setTimeout(() => heroItems.forEach(showItem), 110);
    });
  }

  const orb = document.querySelector(".hero-orb-wrap");
  if (!orb || prefersReducedMotion) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  const damping = 0.08;

  const getRange = () => (window.innerWidth < 992 ? 8 : 16);

  const onPointerMove = (event) => {
    const range = getRange();
    targetX = ((event.clientX / window.innerWidth) - 0.5) * range;
    targetY = ((event.clientY / window.innerHeight) - 0.5) * range;
  };

  const clearOffset = () => {
    targetX = 0;
    targetY = 0;
  };

  const tick = () => {
    currentX += (targetX - currentX) * damping;
    currentY += (targetY - currentY) * damping;
    orb.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    window.requestAnimationFrame(tick);
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerup", clearOffset, { passive: true });
  window.addEventListener("blur", clearOffset, { passive: true });
  tick();
})();
