/* Parchment docs — reveal the Integration Journey on scroll.
   Scoped to .pm-journey only; safe for Mintlify's SPA navigation. */
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

  function scan() {
    document.querySelectorAll(".pm-journey:not(.pm-in)").forEach(function (el) {
      io.observe(el);
    });
  }

  // Initial pass + catch client-side route changes (Mintlify is a SPA).
  scan();
  var mo = new MutationObserver(function () {
    window.requestAnimationFrame(scan);
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
