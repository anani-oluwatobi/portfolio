(function () {
  'use strict';

  // ─── State Machine ─────────────────────────
  // States: 'split', 'code', 'photo'
  var currentState = 'split';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── DOM: Split ────────────────────────────
  var split       = document.getElementById('split');
  var panelCode   = document.getElementById('panel-code');
  var panelPhoto  = document.getElementById('panel-photo');
  var divider     = document.getElementById('divider');
  var codeCanvas  = document.getElementById('code-canvas');
  var photoCanvas = document.getElementById('photo-canvas');
  var codeTyper   = document.getElementById('code-typer');

  // ─── DOM: Worlds ───────────────────────────
  var worldCode   = document.getElementById('world-code');
  var worldPhoto  = document.getElementById('world-photo');

  // ─── DOM: Code World ───────────────────────
  var header      = document.getElementById('header');
  var burger      = document.getElementById('burger');
  var mobMenu     = document.getElementById('mob-menu');
  var hero        = document.getElementById('hero');
  var heroCanvas  = document.getElementById('hero-canvas');
  var photoHeroTime = document.getElementById('photo-hero-time');
  var logoHome    = document.getElementById('logo-home');
  var switchWorld = document.getElementById('switch-world');
  var mobSwitchWorld = document.getElementById('mob-switch-world');

  // ─── DOM: Photo World ──────────────────────
  var headerPhoto       = document.getElementById('header-photo');
  var burgerPhoto       = document.getElementById('burger-photo');
  var mobMenuPhoto      = document.getElementById('mob-menu-photo');
  var logoHomePhoto     = document.getElementById('logo-home-photo');
  var switchWorldPhoto  = document.getElementById('switch-world-photo');
  var mobSwitchPhoto    = document.getElementById('mob-switch-world-photo');
  var photoHeroCanvas   = document.getElementById('photo-hero-canvas');
  var pwHero            = document.getElementById('pw-hero');

  // ─── Transition overlay ────────────────────
  var fadeOverlay = document.createElement('div');
  fadeOverlay.className = 'world-fade';
  document.body.appendChild(fadeOverlay);

  // ═══════════════════════════════════════════
  // SPLIT SCREEN: Divider drag logic
  // ═══════════════════════════════════════════
  var isDragging = false;
  var isMobile = window.innerWidth < 768;

  window.addEventListener('resize', function () {
    isMobile = window.innerWidth < 768;
  });

  if (divider) {
    divider.addEventListener('pointerdown', function (e) {
      if (isMobile) return;
      isDragging = true;
      split.classList.add('split--dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });

    window.addEventListener('pointermove', function (e) {
      if (!isDragging) return;
      var pct = (e.clientX / window.innerWidth) * 100;
      pct = Math.max(15, Math.min(85, pct));
      document.documentElement.style.setProperty('--split-pos', pct + '%');
    });

    window.addEventListener('pointerup', function () {
      if (!isDragging) return;
      isDragging = false;
      split.classList.remove('split--dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      var pos = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--split-pos'));

      if (pos < 30) {
        enterWorld('photo');
      } else if (pos > 70) {
        enterWorld('code');
      } else {
        // Spring back to 50%
        split.classList.add('split--transitioning');
        document.documentElement.style.setProperty('--split-pos', '50%');
        setTimeout(function () {
          split.classList.remove('split--transitioning');
        }, 600);
      }
    });
  }

  // ═══════════════════════════════════════════
  // SPLIT SCREEN: Enter buttons
  // ═══════════════════════════════════════════
  document.querySelectorAll('.split__enter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      enterWorld(this.dataset.world);
    });
  });

  // ═══════════════════════════════════════════
  // STATE TRANSITIONS
  // ═══════════════════════════════════════════
  function enterWorld(world) {
    if (currentState === world) return;

    if (reducedMotion) {
      // Instant transition
      split.style.display = 'none';
      worldCode.style.display = world === 'code' ? '' : 'none';
      worldPhoto.style.display = world === 'photo' ? '' : 'none';
      currentState = world;
      history.pushState(null, '', '#' + world);
      if (world === 'code') initCodeWorld();
      if (world === 'photo') initPhotoWorld();
      return;
    }

    // Animate: expand chosen panel
    split.classList.add('split--transitioning');

    if (world === 'code') {
      document.documentElement.style.setProperty('--split-pos', '100%');
    } else {
      document.documentElement.style.setProperty('--split-pos', '0%');
    }

    // After panel expansion animation
    setTimeout(function () {
      split.style.display = 'none';
      split.classList.remove('split--transitioning');

      if (world === 'code') {
        worldCode.style.display = '';
        window.scrollTo(0, 0);
        initCodeWorld();
      } else {
        worldPhoto.style.display = '';
        window.scrollTo(0, 0);
        initPhotoWorld();
      }

      currentState = world;
      history.pushState(null, '', '#' + world);
    }, 600);
  }

  function exitToSplit() {
    if (currentState === 'split') return;

    if (reducedMotion) {
      worldCode.style.display = 'none';
      worldPhoto.style.display = 'none';
      split.style.display = '';
      document.documentElement.style.setProperty('--split-pos', '50%');
      currentState = 'split';
      history.pushState(null, '', window.location.pathname);
      return;
    }

    // Fade out current world
    fadeOverlay.classList.add('world-fade--active');

    setTimeout(function () {
      worldCode.style.display = 'none';
      worldPhoto.style.display = 'none';
      document.documentElement.style.setProperty('--split-pos', '50%');
      split.style.display = '';
      currentState = 'split';
      history.pushState(null, '', window.location.pathname);

      // Close mobile menus if open
      if (mobMenu && mobMenu.classList.contains('open')) {
        toggleMenu();
      }
      if (mobMenuPhoto && mobMenuPhoto.classList.contains('open')) {
        toggleMenuPhoto();
      }

      // Fade in split
      setTimeout(function () {
        fadeOverlay.classList.remove('world-fade--active');
      }, 50);
    }, 300);
  }

  function switchToWorld(world) {
    if (currentState === world) return;

    if (reducedMotion) {
      worldCode.style.display = world === 'code' ? '' : 'none';
      worldPhoto.style.display = world === 'photo' ? '' : 'none';
      currentState = world;
      history.pushState(null, '', '#' + world);
      window.scrollTo(0, 0);
      if (world === 'code') initCodeWorld();
      if (world === 'photo') initPhotoWorld();
      return;
    }

    fadeOverlay.classList.add('world-fade--active');

    setTimeout(function () {
      worldCode.style.display = world === 'code' ? '' : 'none';
      worldPhoto.style.display = world === 'photo' ? '' : 'none';
      currentState = world;
      history.pushState(null, '', '#' + world);
      window.scrollTo(0, 0);
      if (world === 'code') initCodeWorld();
      if (world === 'photo') initPhotoWorld();

      // Close mobile menus if open
      if (mobMenu && mobMenu.classList.contains('open')) {
        toggleMenu();
      }
      if (mobMenuPhoto && mobMenuPhoto.classList.contains('open')) {
        toggleMenuPhoto();
      }

      setTimeout(function () {
        fadeOverlay.classList.remove('world-fade--active');
      }, 50);
    }, 300);
  }

  // ═══════════════════════════════════════════
  // NAVIGATION BUTTONS
  // ═══════════════════════════════════════════
  if (logoHome) {
    logoHome.addEventListener('click', function (e) {
      e.preventDefault();
      exitToSplit();
    });
  }
  if (logoHomePhoto) {
    logoHomePhoto.addEventListener('click', function (e) {
      e.preventDefault();
      exitToSplit();
    });
  }
  if (switchWorld) {
    switchWorld.addEventListener('click', function () {
      switchToWorld('photo');
    });
  }
  if (mobSwitchWorld) {
    mobSwitchWorld.addEventListener('click', function () {
      switchToWorld('photo');
    });
  }
  if (switchWorldPhoto) {
    switchWorldPhoto.addEventListener('click', function () {
      switchToWorld('code');
    });
  }
  if (mobSwitchPhoto) {
    mobSwitchPhoto.addEventListener('click', function () {
      switchToWorld('code');
    });
  }

  // ═══════════════════════════════════════════
  // URL ROUTING
  // ═══════════════════════════════════════════
  function handleHash() {
    var hash = window.location.hash.replace('#', '');
    if (hash === 'code') {
      split.classList.remove('split--entering');
      split.style.display = 'none';
      worldCode.style.display = '';
      worldPhoto.style.display = 'none';
      currentState = 'code';
      initCodeWorld();
    } else if (hash === 'photo') {
      split.classList.remove('split--entering');
      split.style.display = 'none';
      worldCode.style.display = 'none';
      worldPhoto.style.display = '';
      currentState = 'photo';
      initPhotoWorld();
    } else {
      split.style.display = '';
      worldCode.style.display = 'none';
      worldPhoto.style.display = 'none';
      document.documentElement.style.setProperty('--split-pos', '50%');
      currentState = 'split';
    }
  }

  window.addEventListener('popstate', function () {
    handleHash();
  });

  // ═══════════════════════════════════════════
  // CODE WORLD FUNCTIONALITY
  // ═══════════════════════════════════════════
  var codeWorldInitialized = false;

  function initCodeWorld() {
    if (codeWorldInitialized) {
      // Re-observe reveals that may not have been visible
      reobserveReveals();
      return;
    }
    codeWorldInitialized = true;
    initScrollReveal();
    initSmoothScroll();
    initHeaderScroll();
    initActiveNavLinks();
    initHeroCanvas();
    initContactForm();
  }

  // ─── Mobile Menu ──────────────────────────
  function toggleMenu() {
    if (!mobMenu || !burger) return;
    var open = mobMenu.classList.toggle('open');
    burger.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (burger) {
    burger.addEventListener('click', toggleMenu);
  }
  document.querySelectorAll('.mob-menu__link').forEach(function (l) {
    l.addEventListener('click', function () {
      if (mobMenu && mobMenu.classList.contains('open')) toggleMenu();
    });
  });

  // ─── Scroll Reveal ────────────────────────
  var revealObs;

  function initScrollReveal() {
    revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('reveal--visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    reobserveReveals();
  }

  function reobserveReveals() {
    if (!revealObs) return;
    worldCode.querySelectorAll('.reveal:not(.reveal--visible)').forEach(function (el) {
      revealObs.observe(el);
    });
  }

  // ─── Smooth Scroll ────────────────────────
  function initSmoothScroll() {
    worldCode.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ─── Header Scroll ────────────────────────
  function initHeaderScroll() {
    if (!hero || !header) return;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        header.classList.toggle('header--scrolled', !e.isIntersecting);
      });
    }, { threshold: 0.05 }).observe(hero);
  }

  // ─── Active Nav Link ──────────────────────
  function initActiveNavLinks() {
    var navLinks = worldCode.querySelectorAll('.nav__link');
    var sections = worldCode.querySelectorAll('section[id]');

    sections.forEach(function (s) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            navLinks.forEach(function (l) {
              l.classList.toggle('active', l.dataset.section === id);
            });
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px' }).observe(s);
    });
  }

  // ─── Photo Hero Timer ────────────────────
  function initPhotoHeroTimer() {
    var startTime = Date.now();
    function updateTimer() {
      var elapsed = Math.floor((Date.now() - startTime) / 1000);
      var h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
      var m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
      var s = String(elapsed % 60).padStart(2, '0');
      if (photoHeroTime) photoHeroTime.textContent = h + ':' + m + ':' + s;
      requestAnimationFrame(updateTimer);
    }
    requestAnimationFrame(updateTimer);
  }

  // ─── Photo Hero Interactions ──────────────
  function initPhotoHeroInteractions() {
    var hero = document.getElementById('pw-hero');
    var vf = document.getElementById('pw-vf');
    var focusRing = document.getElementById('pw-focus-ring');
    var crosshair = document.getElementById('pw-crosshair');
    var shutter = document.getElementById('pw-shutter');
    var recBtn = document.getElementById('pw-rec-btn');
    var recDot = document.getElementById('pw-rec-dot');
    var afBtn = document.getElementById('pw-af-btn');
    var settingsBtn = document.getElementById('pw-settings-btn');
    var frameCounter = document.getElementById('pw-frame-counter');
    var frameNum = document.getElementById('pw-frame-num');
    var exposure = document.getElementById('pw-exposure');
    var expTrack = document.getElementById('pw-exp-track');
    var expVal = document.getElementById('pw-exp-val');

    if (!hero || !vf) return;

    // ── Focus ring follows mouse ──
    var ringX = 50, ringY = 50; // percentages
    var targetX = 50, targetY = 50;
    var isAfMode = true;
    var focusLocked = false;

    hero.addEventListener('mousemove', function (e) {
      if (!isAfMode) return;
      var rect = vf.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 100;
      targetY = ((e.clientY - rect.top) / rect.height) * 100;
      // Clamp within viewfinder
      targetX = Math.max(10, Math.min(90, targetX));
      targetY = Math.max(10, Math.min(90, targetY));
    });

    function animateFocusRing() {
      if (isAfMode && !focusLocked) {
        ringX += (targetX - ringX) * 0.06;
        ringY += (targetY - ringY) * 0.06;
        if (focusRing) {
          focusRing.style.left = ringX + '%';
          focusRing.style.top = ringY + '%';
        }
        if (crosshair) {
          crosshair.style.left = ringX + '%';
          crosshair.style.top = ringY + '%';
        }
      }
      requestAnimationFrame(animateFocusRing);
    }
    requestAnimationFrame(animateFocusRing);

    // ── Click to focus-lock ──
    hero.addEventListener('click', function (e) {
      // Don't lock if clicking an interactive element
      if (e.target.closest('.pw-vf__data--btn, .pw-vf__af--btn, .pw-hero__exposure, .pw-hero__frame-counter, .pw-hero__cta, a, button')) return;
      if (!isAfMode) return;

      focusLocked = !focusLocked;
      if (focusRing) {
        focusRing.classList.toggle('pw-vf__focus-ring--locked', focusLocked);
      }
    });

    // ── Parallax on viewfinder corners ──
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      var my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      var corners = vf.querySelectorAll('.pw-vf__corner');
      corners.forEach(function (c, i) {
        var dir = i < 2 ? 1 : -1;
        var dirX = i % 2 === 0 ? 1 : -1;
        c.style.transform = 'translate(' + (mx * 3 * dirX) + 'px, ' + (my * 3 * dir) + 'px)';
      });
    });

    // ── Shutter / REC button — triggers flash ──
    if (recBtn) {
      recBtn.addEventListener('click', function () {
        fireShutter();
      });
    }

    function fireShutter() {
      if (!shutter) return;
      shutter.classList.remove('pw-hero__shutter--flash');
      // Force reflow
      void shutter.offsetWidth;
      shutter.classList.add('pw-hero__shutter--flash');

      // Advance frame counter
      advanceFrame();

      // Brief focus lock effect
      if (focusRing) {
        focusRing.classList.add('pw-vf__focus-ring--locked');
        setTimeout(function () {
          if (!focusLocked) focusRing.classList.remove('pw-vf__focus-ring--locked');
        }, 400);
      }
    }

    // ── AF / MF toggle ──
    if (afBtn) {
      afBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        isAfMode = !isAfMode;
        afBtn.textContent = isAfMode ? 'AF' : 'MF';
        afBtn.classList.toggle('pw-vf__af--mf', !isAfMode);

        // If switching to MF, lock focus in place
        if (!isAfMode) {
          focusLocked = true;
          if (focusRing) focusRing.classList.add('pw-vf__focus-ring--locked');
        } else {
          focusLocked = false;
          if (focusRing) focusRing.classList.remove('pw-vf__focus-ring--locked');
        }
      });
    }

    // ── Camera settings cycle ──
    var settingsPresets = [
      { aperture: 'f/2.8', speed: '1/125s', iso: 'ISO 400' },
      { aperture: 'f/1.4', speed: '1/500s', iso: 'ISO 100' },
      { aperture: 'f/4.0', speed: '1/60s',  iso: 'ISO 800' },
      { aperture: 'f/5.6', speed: '1/250s', iso: 'ISO 200' },
      { aperture: 'f/1.8', speed: '1/1000s', iso: 'ISO 50' },
      { aperture: 'f/8.0', speed: '1/30s',  iso: 'ISO 1600' }
    ];
    var settingsIdx = 0;

    if (settingsBtn) {
      settingsBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        settingsIdx = (settingsIdx + 1) % settingsPresets.length;
        var p = settingsPresets[settingsIdx];
        var apEl = document.getElementById('pw-aperture');
        var spEl = document.getElementById('pw-shutter-speed');
        var isoEl = document.getElementById('pw-iso');
        if (apEl) apEl.textContent = p.aperture;
        if (spEl) spEl.textContent = p.speed;
        if (isoEl) isoEl.textContent = p.iso;

        // Flash feedback
        settingsBtn.classList.add('pw-vf__data--flash');
        setTimeout(function () {
          settingsBtn.classList.remove('pw-vf__data--flash');
        }, 300);
      });
    }

    // ── Frame counter advance ──
    var currentFrame = 27;

    function advanceFrame() {
      if (!frameNum || !frameCounter) return;
      currentFrame++;
      if (currentFrame > 36) currentFrame = 1;
      frameCounter.classList.add('pw-hero__frame-counter--advance');
      setTimeout(function () {
        frameNum.textContent = currentFrame;
        frameCounter.classList.remove('pw-hero__frame-counter--advance');
      }, 150);
    }

    if (frameCounter) {
      frameCounter.addEventListener('click', function (e) {
        e.stopPropagation();
        advanceFrame();
        fireShutter();
      });
    }

    // ── Exposure meter cycle ──
    var evValues = ['-1.0', '-0.7', '-0.3', '0.0', '+0.3', '+0.7', '+1.0', '+1.3', '+1.7'];
    var evIdx = 4; // starts at +0.3

    if (exposure) {
      exposure.addEventListener('click', function (e) {
        e.stopPropagation();
        evIdx = (evIdx + 1) % evValues.length;
        if (expVal) expVal.textContent = evValues[evIdx];

        // Move active marker
        var marks = expTrack.querySelectorAll('.pw-hero__exp-mark');
        marks.forEach(function (m) {
          m.classList.remove('pw-hero__exp-mark--active');
        });
        // Map evIdx to mark index (7 marks, 9 values — wrap)
        var markIdx = Math.min(evIdx, marks.length - 1);
        marks[markIdx].classList.add('pw-hero__exp-mark--active');

        // Update vignette intensity based on EV
        var vignetteEl = hero.querySelector('.pw-hero__vignette');
        if (vignetteEl) {
          var evNum = parseFloat(evValues[evIdx]);
          // Lower EV = darker vignette, higher = lighter
          var darkness = 0.85 - (evNum * 0.15);
          darkness = Math.max(0.4, Math.min(0.95, darkness));
          vignetteEl.style.background = 'radial-gradient(ellipse 70% 60% at 30% 50%, transparent 0%, rgba(10, 9, 8, 0.4) 60%, rgba(10, 9, 8, ' + darkness + ') 100%)';
        }
      });
    }

    // ── Keyboard shortcut: Space = shutter ──
    document.addEventListener('keydown', function (e) {
      if (currentState !== 'photo') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space' && hero.getBoundingClientRect().top < window.innerHeight * 0.5) {
        e.preventDefault();
        fireShutter();
      }
    });
  }

  // ─── Photo Easter Eggs ──────────────────────
  function initPhotoEasterEggs() {
    initLightPainting();
    initFilmNegative();
    initDarkroom();
    initFilmRewind();
    initContactSheet();
    initDoubleExposure();
  }

  // ── 1. Light Painting (drag on hero) ──
  function initLightPainting() {
    var canvas = document.getElementById('pw-lightpaint');
    var hero = document.getElementById('pw-hero');
    if (!canvas || !hero) return;

    var ctx = canvas.getContext('2d');
    var isPainting = false;
    var lastX = 0, lastY = 0;
    var trails = []; // store trail segments for fade
    var hue = 30; // start warm amber

    function resizeCanvas() {
      var rect = hero.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    hero.addEventListener('mousedown', function (e) {
      if (e.target.closest('a, button, .pw-vf__data--btn, .pw-vf__af--btn, .pw-hero__exposure, .pw-hero__frame-counter')) return;
      if (e.button !== 0) return;
      isPainting = true;
      var rect = canvas.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
      hue = 20 + Math.random() * 40; // vary warm tones
    });

    hero.addEventListener('mousemove', function (e) {
      if (!isPainting) return;
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      // Draw glowing trail
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'hsla(' + hue + ', 80%, 65%, 0.8)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.shadowColor = 'hsla(' + hue + ', 90%, 60%, 0.6)';
      ctx.shadowBlur = 12;
      ctx.stroke();

      // Core bright line
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'hsla(' + hue + ', 60%, 90%, 0.9)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 4;
      ctx.stroke();

      ctx.shadowBlur = 0;

      trails.push({ time: Date.now() });
      lastX = x;
      lastY = y;
    });

    window.addEventListener('mouseup', function () {
      isPainting = false;
    });

    // Slowly fade the canvas
    function fadeTrails() {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.008)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(fadeTrails);
    }
    requestAnimationFrame(fadeTrails);
  }

  // ── 2. Film Negative Mode (press N) ──
  function initFilmNegative() {
    var isNegative = false;

    document.addEventListener('keydown', function (e) {
      if (currentState !== 'photo') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'n' || e.key === 'N') {
        isNegative = !isNegative;
        worldPhoto.classList.toggle('pw-negative', isNegative);
      }
    });
  }

  // ── 3. Darkroom Mode (type "darkroom") ──
  function initDarkroom() {
    var darkroom = document.getElementById('pw-darkroom');
    if (!darkroom) return;

    var buffer = '';
    var isActive = false;

    document.addEventListener('keydown', function (e) {
      if (currentState !== 'photo') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      buffer += e.key.toLowerCase();
      if (buffer.length > 10) buffer = buffer.slice(-10);

      if (buffer.endsWith('darkroom')) {
        isActive = !isActive;
        darkroom.classList.toggle('pw-darkroom--active', isActive);
        buffer = '';

        if (isActive) {
          // After 4 seconds, images start to "develop" (remove the filter)
          setTimeout(function () {
            var imgs = worldPhoto.querySelectorAll('img');
            imgs.forEach(function (img) {
              img.style.transition = 'filter 6s ease-in-out';
              img.style.filter = 'sepia(0.3) brightness(0.6) contrast(1.2) saturate(0.5)';
            });
          }, 4000);
        } else {
          // Reset images
          var imgs = worldPhoto.querySelectorAll('img');
          imgs.forEach(function (img) {
            img.style.transition = 'filter 1s ease';
            img.style.filter = '';
          });
        }
      }
    });
  }

  // ── 4. Film Rewind (press R at top) ──
  function initFilmRewind() {
    var rewindEl = document.getElementById('pw-rewind');
    var rewindCounter = document.getElementById('pw-rewind-counter');
    var frameNum = document.getElementById('pw-frame-num');
    var isRewinding = false;

    document.addEventListener('keydown', function (e) {
      if (currentState !== 'photo') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (isRewinding) return;
      if ((e.key === 'r' || e.key === 'R') && window.scrollY < 200) {
        isRewinding = true;
        if (rewindEl) rewindEl.classList.add('pw-rewind--active');

        var count = parseInt(frameNum ? frameNum.textContent : '27') || 27;
        var interval = setInterval(function () {
          count--;
          if (rewindCounter) rewindCounter.textContent = count;
          if (count <= 0) {
            clearInterval(interval);
            setTimeout(function () {
              if (rewindEl) rewindEl.classList.remove('pw-rewind--active');
              if (frameNum) frameNum.textContent = '1';
              isRewinding = false;
            }, 500);
          }
        }, 80);
      }
    });
  }

  // ── 5. Contact Sheet Mode (press C in gallery) ──
  function initContactSheet() {
    var gallery = document.getElementById('pw-gallery');
    var isContactSheet = false;

    document.addEventListener('keydown', function (e) {
      if (currentState !== 'photo') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'c' || e.key === 'C') {
        isContactSheet = !isContactSheet;
        if (gallery) gallery.classList.toggle('pw-contact-sheet', isContactSheet);
      }
    });
  }

  // ── 6. Double Exposure (press D) ──
  function initDoubleExposure() {
    var dblExp = document.getElementById('pw-double-exposure');
    var img1 = document.getElementById('pw-dblexp-img1');
    var img2 = document.getElementById('pw-dblexp-img2');
    var closeBtn = document.getElementById('pw-dblexp-close');
    if (!dblExp || !img1 || !img2) return;

    var isOpen = false;

    function getGalleryImages() {
      var imgs = worldPhoto.querySelectorAll('.pw-proof img');
      var srcs = [];
      imgs.forEach(function (i) { srcs.push(i.src); });
      return srcs;
    }

    function openDoubleExposure() {
      var srcs = getGalleryImages();
      if (srcs.length < 2) return;

      // Pick two random different images
      var idx1 = Math.floor(Math.random() * srcs.length);
      var idx2 = idx1;
      while (idx2 === idx1) idx2 = Math.floor(Math.random() * srcs.length);

      img1.src = srcs[idx1];
      img2.src = srcs[idx2];
      isOpen = true;
      dblExp.classList.add('pw-double-exposure--active');
      document.body.style.overflow = 'hidden';
    }

    function closeDoubleExposure() {
      isOpen = false;
      dblExp.classList.remove('pw-double-exposure--active');
      document.body.style.overflow = '';
    }

    document.addEventListener('keydown', function (e) {
      if (currentState !== 'photo') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'd' || e.key === 'D') {
        if (isOpen) {
          closeDoubleExposure();
        } else {
          openDoubleExposure();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        closeDoubleExposure();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDoubleExposure);
    dblExp.addEventListener('click', function (e) {
      if (e.target === dblExp) closeDoubleExposure();
    });
  }

  // ─── Contact Form ─────────────────────────
  function initContactForm() {
    var form      = document.getElementById('contact-form');
    var submitBtn = document.getElementById('submit-btn');
    var statusEl  = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var n   = form.querySelector('#name').value.trim();
      var em  = form.querySelector('#email').value.trim();
      var msg = form.querySelector('#message').value.trim();
      statusEl.textContent = '';
      statusEl.className = 'form-status';

      if (!n)  { showStatus('Please enter your name.', 'error'); return; }
      if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        showStatus('Please enter a valid email.', 'error'); return;
      }
      if (!msg) { showStatus('Please enter a message.', 'error'); return; }

      submitBtn.classList.add('contact__btn--loading');
      submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        submitBtn.classList.remove('contact__btn--loading');
        submitBtn.disabled = false;
        if (res.ok) {
          showStatus("Message sent! I'll get back to you soon.", 'success');
          form.reset();
        } else {
          res.json().then(function (d) {
            showStatus(d.errors ? d.errors.map(function (e) { return e.message; }).join(', ') : 'Something went wrong.', 'error');
          });
        }
      }).catch(function () {
        submitBtn.classList.remove('contact__btn--loading');
        submitBtn.disabled = false;
        showStatus('Network error. Please try again.', 'error');
      });
    });

    function showStatus(msg, type) {
      statusEl.textContent = msg;
      statusEl.className = 'form-status form-status--' + type;
    }
  }

  // ═══════════════════════════════════════════
  // PHOTO WORLD FUNCTIONALITY
  // ═══════════════════════════════════════════
  var photoWorldInitialized = false;
  var photoRevealObs;

  function initPhotoWorld() {
    if (photoWorldInitialized) {
      reobservePhotoReveals();
      return;
    }
    photoWorldInitialized = true;
    initPhotoScrollReveal();
    initPhotoSmoothScroll();
    initPhotoHeaderScroll();
    initPhotoActiveNavLinks();
    initPhotoHeroCanvas();
    initPhotoHeroTimer();
    initPhotoHeroInteractions();
    initPhotoEasterEggs();
    initPhotoGalleryLightbox();
    initPhotoContactForm();
    initPhotoMobileMenu();
  }

  // ─── Photo Mobile Menu ─────────────────────
  function toggleMenuPhoto() {
    if (!mobMenuPhoto || !burgerPhoto) return;
    var open = mobMenuPhoto.classList.toggle('open');
    burgerPhoto.classList.toggle('open');
    burgerPhoto.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function initPhotoMobileMenu() {
    if (burgerPhoto) {
      burgerPhoto.addEventListener('click', toggleMenuPhoto);
    }
    worldPhoto.querySelectorAll('.mob-menu__link').forEach(function (l) {
      l.addEventListener('click', function () {
        if (mobMenuPhoto && mobMenuPhoto.classList.contains('open')) toggleMenuPhoto();
      });
    });
  }

  // ─── Photo Scroll Reveal ──────────────────
  function initPhotoScrollReveal() {
    photoRevealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('reveal--visible');
          photoRevealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    reobservePhotoReveals();
  }

  function reobservePhotoReveals() {
    if (!photoRevealObs) return;
    worldPhoto.querySelectorAll('.reveal:not(.reveal--visible)').forEach(function (el) {
      photoRevealObs.observe(el);
    });
  }

  // ─── Photo Smooth Scroll ──────────────────
  function initPhotoSmoothScroll() {
    worldPhoto.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ─── Photo Header Scroll ──────────────────
  function initPhotoHeaderScroll() {
    if (!pwHero || !headerPhoto) return;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        headerPhoto.classList.toggle('header--scrolled', !e.isIntersecting);
      });
    }, { threshold: 0.05 }).observe(pwHero);
  }

  // ─── Photo Active Nav Links ───────────────
  function initPhotoActiveNavLinks() {
    var navLinks = worldPhoto.querySelectorAll('.nav__link');
    var sections = worldPhoto.querySelectorAll('section[id]');

    sections.forEach(function (s) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            navLinks.forEach(function (l) {
              l.classList.toggle('active', l.dataset.section === id);
            });
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px' }).observe(s);
    });
  }

  // ─── Photo Hero Canvas (warm gradient) ────
  function initPhotoHeroCanvas() {
    createGradientMesh(photoHeroCanvas, [
      'rgba(232, 150, 75, 0.10)',
      'rgba(196, 122, 58, 0.08)',
      'rgba(255, 180, 100, 0.06)',
      'rgba(180, 100, 40, 0.05)'
    ]);
  }

  // ─── Photo Gallery Lightbox ───────────────
  function initPhotoGalleryLightbox() {
    var galleryItems = worldPhoto.querySelectorAll('.pw-proof');
    var images = [];
    var currentIdx = 0;

    galleryItems.forEach(function (item) {
      var img   = item.querySelector('img');
      var title = item.querySelector('.pw-proof__title');
      var loc   = item.querySelector('.pw-proof__loc');
      images.push({
        src: img.src,
        alt: img.alt,
        caption: (title ? title.textContent : '') + (loc ? ' \u2014 ' + loc.textContent : '')
      });
    });

    function openLightbox(i) {
      currentIdx = i;
      updateLb();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function updateLb() {
      if (!images[currentIdx]) return;
      lightboxImg.src = images[currentIdx].src;
      lightboxImg.alt = images[currentIdx].alt;
      lightboxCaption.textContent = images[currentIdx].caption;
    }

    function showNext() { currentIdx = (currentIdx + 1) % images.length; updateLb(); }
    function showPrev() { currentIdx = (currentIdx - 1 + images.length) % images.length; updateLb(); }

    galleryItems.forEach(function (item, i) {
      item.addEventListener('click', function () { openLightbox(i); });
    });

    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);

    document.addEventListener('keydown', function (e) {
      if (!lightbox || !lightbox.classList.contains('open')) return;
      if (currentState !== 'photo') return;
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

    // Touch swipe
    var touchStartX = 0;
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (currentState !== 'photo') return;
      var diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
    }, { passive: true });
  }

  // ─── Photo Contact Form ───────────────────
  function initPhotoContactForm() {
    var form      = document.getElementById('contact-form-photo');
    var submitBtn = document.getElementById('submit-btn-photo');
    var statusEl  = document.getElementById('form-status-photo');

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var n   = form.querySelector('#pw-name').value.trim();
      var em  = form.querySelector('#pw-email').value.trim();
      var msg = form.querySelector('#pw-message').value.trim();
      statusEl.textContent = '';
      statusEl.className = 'form-status';

      if (!n)  { showSt('Please enter your name.', 'error'); return; }
      if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        showSt('Please enter a valid email.', 'error'); return;
      }
      if (!msg) { showSt('Please enter a message.', 'error'); return; }

      submitBtn.classList.add('contact__btn--loading');
      submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        submitBtn.classList.remove('contact__btn--loading');
        submitBtn.disabled = false;
        if (res.ok) {
          showSt("Message sent! I'll get back to you soon.", 'success');
          form.reset();
        } else {
          res.json().then(function (d) {
            showSt(d.errors ? d.errors.map(function (e) { return e.message; }).join(', ') : 'Something went wrong.', 'error');
          });
        }
      }).catch(function () {
        submitBtn.classList.remove('contact__btn--loading');
        submitBtn.disabled = false;
        showSt('Network error. Please try again.', 'error');
      });
    });

    function showSt(msg, type) {
      statusEl.textContent = msg;
      statusEl.className = 'form-status form-status--' + type;
    }
  }

  // ═══════════════════════════════════════════
  // GRADIENT MESH CANVAS (shared logic)
  // ═══════════════════════════════════════════
  function createGradientMesh(canvas, colors) {
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w, h;
    var blobs = [];
    var mouse = { x: 0.5, y: 0.5 };
    var animId;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    }

    function createBlobs() {
      blobs = colors.map(function (color, i) {
        return {
          x: (0.2 + Math.random() * 0.6) * w,
          y: (0.2 + Math.random() * 0.6) * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.min(w, h) * (0.25 + Math.random() * 0.15),
          color: color,
          phase: i * 1.2
        };
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      blobs.forEach(function (blob) {
        // Autonomous drift
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Mouse influence
        var dx = mouse.x * w - blob.x;
        var dy = mouse.y * h - blob.y;
        blob.x += dx * 0.002;
        blob.y += dy * 0.002;

        // Bounce off edges
        if (blob.x < -blob.radius * 0.5) blob.vx = Math.abs(blob.vx);
        if (blob.x > w + blob.radius * 0.5) blob.vx = -Math.abs(blob.vx);
        if (blob.y < -blob.radius * 0.5) blob.vy = Math.abs(blob.vy);
        if (blob.y > h + blob.radius * 0.5) blob.vy = -Math.abs(blob.vy);

        // Gentle oscillation
        blob.phase += 0.005;
        var oscillateX = Math.sin(blob.phase) * 20;
        var oscillateY = Math.cos(blob.phase * 0.7) * 20;

        var gradient = ctx.createRadialGradient(
          blob.x + oscillateX, blob.y + oscillateY, 0,
          blob.x + oscillateX, blob.y + oscillateY, blob.radius
        );
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, 'transparent');

        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      });

      animId = requestAnimationFrame(draw);
    }

    canvas.parentElement.addEventListener('mousemove', function (e) {
      var rect = canvas.parentElement.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
    });

    resize();
    createBlobs();
    draw();

    window.addEventListener('resize', function () {
      resize();
      createBlobs();
    });

    return function stop() {
      cancelAnimationFrame(animId);
    };
  }

  // ═══════════════════════════════════════════
  // HERO CANVAS (blue gradient mesh)
  // ═══════════════════════════════════════════
  function initHeroCanvas() {
    createGradientMesh(heroCanvas, [
      'rgba(91, 141, 239, 0.12)',
      'rgba(61, 107, 199, 0.10)',
      'rgba(100, 160, 255, 0.08)',
      'rgba(50, 80, 180, 0.06)'
    ]);
  }

  // ═══════════════════════════════════════════
  // SPLIT SCREEN CANVAS (blue gradient)
  // ═══════════════════════════════════════════
  if (codeCanvas) {
    createGradientMesh(codeCanvas, [
      'rgba(91, 141, 239, 0.15)',
      'rgba(61, 107, 199, 0.12)',
      'rgba(100, 160, 255, 0.10)'
    ]);
  }

  // ═══════════════════════════════════════════
  // PHOTO PANEL CANVAS (warm amber gradient)
  // ═══════════════════════════════════════════
  if (photoCanvas) {
    createGradientMesh(photoCanvas, [
      'rgba(232, 150, 75, 0.12)',
      'rgba(196, 122, 58, 0.10)',
      'rgba(255, 180, 100, 0.08)'
    ]);
  }

  // ═══════════════════════════════════════════
  // ENTRANCE ANIMATION
  // ═══════════════════════════════════════════
  if (split && split.classList.contains('split--entering')) {
    if (reducedMotion) {
      split.classList.remove('split--entering');
    } else {
      setTimeout(function () {
        split.classList.remove('split--entering');
      }, 1500);
    }
  }

  // Remove divider pulse after animation completes
  if (divider && divider.classList.contains('split__divider--pulse')) {
    if (reducedMotion) {
      divider.classList.remove('split__divider--pulse');
    } else {
      setTimeout(function () {
        divider.classList.remove('split__divider--pulse');
      }, 3200);
    }
  }

  // ═══════════════════════════════════════════
  // TERMINAL TYPING ANIMATION
  // ═══════════════════════════════════════════
  if (codeTyper) {
    var phrases = [
      'npm run build',
      'git push origin main',
      'node server.js',
      'docker compose up',
      'npx create-next-app',
      'vim ~/.config'
    ];
    var phraseIdx = 0;
    var charIdx = 0;
    var isDeleting = false;
    var typingTimeout;

    function typeLoop() {
      var current = phrases[phraseIdx];
      if (!isDeleting) {
        codeTyper.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx >= current.length) {
          isDeleting = true;
          typingTimeout = setTimeout(typeLoop, 1800);
          return;
        }
        typingTimeout = setTimeout(typeLoop, 60 + Math.random() * 40);
      } else {
        codeTyper.textContent = current.substring(0, charIdx);
        charIdx--;
        if (charIdx < 0) {
          isDeleting = false;
          charIdx = 0;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          typingTimeout = setTimeout(typeLoop, 400);
          return;
        }
        typingTimeout = setTimeout(typeLoop, 30);
      }
    }

    setTimeout(typeLoop, 1200);
  }

  // ═══════════════════════════════════════════
  // LIGHTBOX (for future Photo World use)
  // ═══════════════════════════════════════════
  var lightbox        = document.getElementById('lightbox');
  var lightboxImg     = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var closeBtn        = document.getElementById('lightbox-close');
  var prevBtn         = document.getElementById('lightbox-prev');
  var nextBtn         = document.getElementById('lightbox-next');

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
  });

  // ═══════════════════════════════════════════
  // INITIAL ROUTE
  // ═══════════════════════════════════════════
  handleHash();
})();
