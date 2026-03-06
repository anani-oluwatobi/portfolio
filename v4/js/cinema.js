/* ═══════════════════════════════════════════════
   CINEMA.JS — Viewfinder, Typing, Timecode, Entry Transition
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  var viewfinder = document.getElementById('viewfinder');
  var enterBtn = document.getElementById('enter-btn');
  var site = document.getElementById('site');
  var timecodeEl = document.getElementById('viewfinder-timecode');
  var nameEl = document.getElementById('viewfinder-name');
  var roleEl = document.getElementById('viewfinder-role');
  var scrollProgress = document.getElementById('scroll-progress');

  // ─── Typing Animation for Name ───────────────
  function typewriteName() {
    var text = 'Toby';
    nameEl.innerHTML = '';

    text.split('').forEach(function (char, i) {
      var span = document.createElement('span');
      span.className = 'char';
      span.textContent = char;
      span.style.animationDelay = (0.5 + i * 0.12) + 's';
      nameEl.appendChild(span);
    });
  }

  typewriteName();

  // Role text fade in is handled by CSS animation

  // ─── Timecode Counter ────────────────────────
  var startTime = Date.now();
  var timecodeRunning = true;

  function updateTimecode() {
    if (!timecodeRunning) return;

    var elapsed = Date.now() - startTime;
    var h = Math.floor(elapsed / 3600000) % 24;
    var m = Math.floor(elapsed / 60000) % 60;
    var s = Math.floor(elapsed / 1000) % 60;
    var f = Math.floor((elapsed % 1000) / (1000 / 24));

    if (timecodeEl) {
      timecodeEl.textContent = pad(h) + ':' + pad(m) + ':' + pad(s) + ':' + pad(f);
    }

    requestAnimationFrame(updateTimecode);
  }

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  requestAnimationFrame(updateTimecode);

  // ─── Viewfinder Mouse Parallax ───────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    var bgImg = viewfinder.querySelector('.viewfinder__bg-img');
    var brackets = viewfinder.querySelector('.viewfinder__brackets');
    var levelBar = viewfinder.querySelector('.viewfinder__level-bar');

    viewfinder.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 2;
      var y = (e.clientY / window.innerHeight - 0.5) * 2;

      // Subtle background shift
      if (bgImg) {
        bgImg.style.transform = 'scale(1.1) translate(' + (x * -15) + 'px, ' + (y * -10) + 'px)';
      }

      // Brackets shift
      if (brackets) {
        brackets.style.transform = 'translate(calc(-50% + ' + (x * 5) + 'px), calc(-50% + ' + (y * 5) + 'px))';
      }

      // Level indicator
      if (levelBar) {
        levelBar.style.marginLeft = (25 + x * 10) + '%';
      }
    });
  }

  // ─── Take Counter ───────────────────────────
  var takeCount = 1;
  var takeEl = viewfinder.querySelector('.viewfinder__slate-take');

  if (takeEl) {
    viewfinder.addEventListener('click', function (e) {
      // Don't count enter button clicks or contact links
      if (e.target.closest('#enter-btn, .viewfinder__contact-link')) return;
      takeCount++;
      takeEl.textContent = 'TAKE ' + takeCount;
      takeEl.style.color = 'rgba(200, 169, 110, 0.6)';
      setTimeout(function () { takeEl.style.color = ''; }, 400);
    });
  }

  // ─── Enter the Frame ─────────────────────────
  var clapEl = document.getElementById('viewfinder-clap');

  function enterSite() {
    // Director's slate clap
    if (clapEl) {
      clapEl.classList.add('active');
    }

    // Brief white flash behind clap
    viewfinder.style.animation = 'screen-shake 0.15s ease';

    setTimeout(function () {
      if (clapEl) clapEl.classList.remove('active');

      viewfinder.classList.add('viewfinder--exiting');
      timecodeRunning = false;

      setTimeout(function () {
        viewfinder.classList.add('viewfinder--hidden');
        site.classList.add('site--visible');
        document.body.style.overflow = '';

        // Show scroll progress
        if (scrollProgress) {
          scrollProgress.classList.add('visible');
        }

        // Init main site
        if (typeof window.initMainSite === 'function') {
          window.initMainSite();
        }
      }, 1500);
    }, 300);

    document.body.style.overflow = 'hidden';
  }

  enterBtn.addEventListener('click', enterSite);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !viewfinder.classList.contains('viewfinder--hidden')) {
      enterSite();
    }
  });

  // Lock scroll during viewfinder
  document.body.style.overflow = 'hidden';

  // Add screen-shake keyframe dynamically
  var style = document.createElement('style');
  style.textContent = '@keyframes screen-shake { 0%, 100% { transform: translate(0); } 20% { transform: translate(-3px, 2px); } 40% { transform: translate(3px, -2px); } 60% { transform: translate(-2px, -1px); } 80% { transform: translate(2px, 1px); } }';
  document.head.appendChild(style);

})();
