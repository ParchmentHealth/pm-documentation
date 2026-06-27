/* Parchment docs — one-time reveal of the hero + Integration Journey.
   Scoped to .pm-hero / .pm-journey only; safe for Mintlify's SPA navigation.

   Why the hero is JS-gated: its entrance animations used to run automatically
   on first paint. On a hard load that paint happens BEFORE Mintlify (Next.js)
   hydrates, and the hydration pass restarts the in-flight animation — so the
   hero appeared to play twice and stuttered. We now hold the hero hidden
   (CSS sets the initial state) and add .pm-in to start the animation only once
   the page has settled, so nothing interrupts it. */
(function () {
  if (typeof window === "undefined") return;

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("pm-in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  // Scroll-revealed: the journey sits below the fold, so it's revealed on
  // intersection — well after hydration, so it never had the restart problem.
  function scanJourney() {
    document.querySelectorAll(".pm-journey:not(.pm-in)").forEach(function (el) {
      io.observe(el);
    });
  }

  function revealHero() {
    document.querySelectorAll(".pm-hero:not(.pm-in)").forEach(function (el) {
      el.classList.add("pm-in");
    });
  }

  // On a hard load, defer the hero until the page is fully loaded (hydration
  // is done by then), then wait two frames so any remaining main-thread work
  // has flushed before the animation starts.
  function revealHeroWhenSettled() {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(revealHero);
    });
  }

  scanJourney();
  if (document.readyState === "complete") {
    // Late-loaded (e.g. SPA route change): already hydrated, reveal at once.
    revealHero();
  } else {
    window.addEventListener("load", revealHeroWhenSettled, { once: true });
  }

  // Catch client-side route changes (Mintlify is a SPA). After the first load
  // the app is hydrated, so a freshly-mounted hero can be revealed immediately.
  var mo = new MutationObserver(function () {
    window.requestAnimationFrame(function () {
      scanJourney();
      if (document.readyState === "complete") revealHero();
    });
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
