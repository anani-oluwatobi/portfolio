/* ═══════════════════════════════════════════════
   CINEMA.JS — Viewfinder Entry, Timecode, Transitions
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  var viewfinder = document.getElementById('viewfinder');
  var enterBtn = document.getElementById('enter-btn');
  var site = document.getElementById('site');
  var timecodeEl = document.querySelector('.viewfinder__timecode');

  // ─── Timecode Counter ────────────────────────
  var startTime = Date.now();

  function updateTimecode() {
    if (!timecodeEl || viewfinder.classList.contains('viewfinder--hidden')) return;

    var elapsed = Date.now() - startTime;
    var h = Math.floor(elapsed / 3600000) % 24;
    var m = Math.floor(elapsed / 60000) % 60;
    var s = Math.floor(elapsed / 1000) % 60;
    var f = Math.floor((elapsed % 1000) / (1000 / 24)); // 24fps frame count

    timecodeEl.textContent =
      pad(h) + ':' + pad(m) + ':' + pad(s) + ':' + pad(f);

    requestAnimationFrame(updateTimecode);
  }

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  requestAnimationFrame(updateTimecode);

  // ─── Enter the Frame (Press Record) ──────────
  function enterSite() {
    // Animate viewfinder exit: zoom in + fade out
    viewfinder.classList.add('viewfinder--exiting');

    // After transition, hide viewfinder and reveal site
    setTimeout(function () {
      viewfinder.classList.add('viewfinder--hidden');
      site.classList.add('site--visible');
      document.body.style.overflow = '';

      // Initialize main site animations
      if (typeof window.initMainSite === 'function') {
        window.initMainSite();
      }
    }, 1200);

    // Lock scroll during transition
    document.body.style.overflow = 'hidden';
  }

  enterBtn.addEventListener('click', enterSite);

  // Also allow Enter key to start
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !viewfinder.classList.contains('viewfinder--hidden')) {
      enterSite();
    }
  });

  // Prevent scrolling while viewfinder is visible
  document.body.style.overflow = 'hidden';

})();
