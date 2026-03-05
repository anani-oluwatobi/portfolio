(function () {
  'use strict';

  // ─── DOM ───────────────────────────────────
  var header   = document.getElementById('header');
  var burger   = document.getElementById('burger');
  var mobMenu  = document.getElementById('mob-menu');
  var hero     = document.getElementById('hero');
  var heroTime = document.getElementById('hero-time');

  // ─── Mobile Menu ──────────────────────────
  function toggleMenu() {
    var open = mobMenu.classList.toggle('open');
    burger.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', toggleMenu);
  document.querySelectorAll('.mob-menu__link').forEach(function (l) {
    l.addEventListener('click', function () {
      if (mobMenu.classList.contains('open')) toggleMenu();
    });
  });

  // ─── Header scroll ────────────────────────
  new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      header.classList.toggle('header--scrolled', !e.isIntersecting);
    });
  }, { threshold: 0.05 }).observe(hero);

  // ─── Active nav link ──────────────────────
  var navLinks = document.querySelectorAll('.nav__link');
  var sections = document.querySelectorAll('section[id]');
  new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navLinks.forEach(function (l) {
          l.classList.toggle('active', l.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' }).observe(hero);
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

  // ─── Scroll Reveal ────────────────────────
  var reveals = document.querySelectorAll('.reveal');
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('reveal--visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(function (el) { revealObs.observe(el); });

  // ─── Smooth scroll ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
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

  // ─── Hero Interactive Parallax + Spotlight + Crosshair ──
  var heroSpotlight = document.getElementById('hero-spotlight');
  var interactiveLayer = document.getElementById('hero-interactive');
  var crosshair = document.getElementById('vf-crosshair');

  if (window.matchMedia('(pointer: fine)').matches && hero) {
    var parallaxEls = interactiveLayer ? interactiveLayer.querySelectorAll('[data-speed]') : [];
    var tiltEls = interactiveLayer ? interactiveLayer.querySelectorAll('[data-tilt]') : [];
    var mx = 0, my = 0, cx = 0, cy = 0;

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      // Spotlight follows cursor
      if (heroSpotlight) {
        var px = ((e.clientX - rect.left) / rect.width) * 100;
        var py = ((e.clientY - rect.top) / rect.height) * 100;
        heroSpotlight.style.setProperty('--spot-x', px + '%');
        heroSpotlight.style.setProperty('--spot-y', py + '%');
      }

      // Crosshair follows cursor within viewfinder bounds
      if (crosshair) {
        var vf = crosshair.parentElement;
        var vfRect = vf.getBoundingClientRect();
        var relX = e.clientX - vfRect.left;
        var relY = e.clientY - vfRect.top;
        var clampedX = Math.max(20, Math.min(relX, vfRect.width - 20));
        var clampedY = Math.max(20, Math.min(relY, vfRect.height - 20));
        crosshair.style.left = clampedX + 'px';
        crosshair.style.top = clampedY + 'px';
      }
    });

    // Smooth animation loop for parallax
    function animateParallax() {
      cx += (mx - cx) * 0.05;
      cy += (my - cy) * 0.05;

      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.dataset.speed) || 0.03;
        var moveX = cx * speed * 900;
        var moveY = cy * speed * 700;
        // Only apply translate for non-tilt elements
        if (!el.dataset.tilt && el.dataset.tilt !== '') {
          el.style.transform = el._baseTransform
            ? el._baseTransform + ' translate(' + moveX + 'px,' + moveY + 'px)'
            : 'translate(' + moveX + 'px,' + moveY + 'px)';
        }
      });

      // 3D tilt + parallax on cards
      tiltEls.forEach(function (el) {
        var speed = parseFloat(el.dataset.speed) || 0.03;
        var moveX = cx * speed * 900;
        var moveY = cy * speed * 700;
        var rotY = cx * 10;
        var rotX = -cy * 8;
        el.style.transform = 'perspective(600px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translate(' + moveX + 'px,' + moveY + 'px)';
      });

      requestAnimationFrame(animateParallax);
    }

    // Store base transforms
    parallaxEls.forEach(function (el) {
      el._baseTransform = el.style.transform || '';
    });

    requestAnimationFrame(animateParallax);
  }

  // ─── Hero Gradient Mesh Canvas ────────────
  var canvas = document.getElementById('hero-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var canvasMouseX = 0.5, canvasMouseY = 0.5;
    var smoothMouseX = 0.5, smoothMouseY = 0.5;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (hero) {
      hero.addEventListener('mousemove', function (e) {
        var rect = hero.getBoundingClientRect();
        canvasMouseX = (e.clientX - rect.left) / rect.width;
        canvasMouseY = (e.clientY - rect.top) / rect.height;
      });
    }

    var blobs = [
      { x: 0.3, y: 0.3, r: 350, color: [91, 141, 239], freqX: 0.0003, freqY: 0.0004, phaseX: 0, phaseY: 1.2 },
      { x: 0.7, y: 0.6, r: 300, color: [232, 150, 75], freqX: 0.0005, freqY: 0.0003, phaseX: 2.5, phaseY: 0.8 },
      { x: 0.5, y: 0.8, r: 250, color: [91, 141, 239], freqX: 0.0004, freqY: 0.0006, phaseX: 1.0, phaseY: 3.0 },
      { x: 0.2, y: 0.7, r: 200, color: [255, 255, 255], freqX: 0.0002, freqY: 0.0003, phaseX: 3.5, phaseY: 2.0 }
    ];

    function drawMesh(time) {
      var w = canvas.width;
      var h = canvas.height;
      ctx.fillStyle = '#0a0a0e';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      smoothMouseX += (canvasMouseX - smoothMouseX) * 0.03;
      smoothMouseY += (canvasMouseY - smoothMouseY) * 0.03;

      for (var i = 0; i < blobs.length; i++) {
        var b = blobs[i];
        var bx = b.x + Math.sin(time * b.freqX + b.phaseX) * 0.15;
        var by = b.y + Math.cos(time * b.freqY + b.phaseY) * 0.12;

        // Blob 1 (amber) follows mouse, blob 0 (blue) drifts opposite
        if (i === 1) {
          bx += (smoothMouseX - 0.5) * 0.3;
          by += (smoothMouseY - 0.5) * 0.3;
        } else if (i === 0) {
          bx -= (smoothMouseX - 0.5) * 0.15;
          by -= (smoothMouseY - 0.5) * 0.15;
        }

        var px = bx * w;
        var py = by * h;
        var radius = b.r * (Math.min(w, h) / 1000);
        var alpha = i === 3 ? 0.04 : 0.1;

        var grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
        grad.addColorStop(0, 'rgba(' + b.color[0] + ',' + b.color[1] + ',' + b.color[2] + ',' + alpha + ')');
        grad.addColorStop(0.5, 'rgba(' + b.color[0] + ',' + b.color[1] + ',' + b.color[2] + ',' + (alpha * 0.4) + ')');
        grad.addColorStop(1, 'rgba(' + b.color[0] + ',' + b.color[1] + ',' + b.color[2] + ',0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(drawMesh);
    }
    requestAnimationFrame(drawMesh);
  }

  // ─── Hero "REC" Timer ─────────────────────
  // A running timecode in the viewfinder HUD
  var startTime = Date.now();
  function updateTimer() {
    var elapsed = Math.floor((Date.now() - startTime) / 1000);
    var h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    var m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    var s = String(elapsed % 60).padStart(2, '0');
    if (heroTime) heroTime.textContent = h + ':' + m + ':' + s;
    requestAnimationFrame(updateTimer);
  }
  requestAnimationFrame(updateTimer);

  // ─── Gallery Lightbox ─────────────────────
  var lightbox       = document.getElementById('lightbox');
  var lightboxImg    = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var closeBtn       = document.getElementById('lightbox-close');
  var prevBtn        = document.getElementById('lightbox-prev');
  var nextBtn        = document.getElementById('lightbox-next');
  var galleryItems   = document.querySelectorAll('.proof-img');
  var currentIdx     = 0;

  var images = [];
  galleryItems.forEach(function (item) {
    var img   = item.querySelector('img');
    var title = item.querySelector('.proof-img__title');
    var loc   = item.querySelector('.proof-img__loc');
    images.push({
      src: img.src,
      alt: img.alt,
      caption: (title ? title.textContent : '') + (loc ? ' \u2014 ' + loc.textContent : '')
    });
  });

  function openLightbox(i) {
    currentIdx = i;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function updateLightbox() {
    if (!images[currentIdx]) return;
    lightboxImg.src = images[currentIdx].src;
    lightboxImg.alt = images[currentIdx].alt;
    lightboxCaption.textContent = images[currentIdx].caption;
  }
  function showNext() { currentIdx = (currentIdx + 1) % images.length; updateLightbox(); }
  function showPrev() { currentIdx = (currentIdx - 1 + images.length) % images.length; updateLightbox(); }

  galleryItems.forEach(function (item, i) {
    item.addEventListener('click', function () { openLightbox(i); });
  });
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Touch swipe
  var touchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    var diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
  }, { passive: true });

  // ─── Contact Form ─────────────────────────
  var form      = document.getElementById('contact-form');
  var submitBtn = document.getElementById('submit-btn');
  var statusEl  = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = form.querySelector('#name').value.trim();
      var em = form.querySelector('#email').value.trim();
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
  }

  function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = 'form-status form-status--' + type;
  }
})();
