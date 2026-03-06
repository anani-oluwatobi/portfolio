(function () {
  'use strict';

  // ─── DOM ───────────────────────────────────
  var header   = document.getElementById('header');
  var menuBtn  = document.getElementById('menu-btn');
  var mobileNav = document.getElementById('mobile-nav');
  var hero      = document.getElementById('hero');

  // ─── Mobile Menu ──────────────────────────
  function toggleMenu() {
    var isOpen = mobileNav.classList.toggle('open');
    menuBtn.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  menuBtn.addEventListener('click', toggleMenu);

  document.querySelectorAll('.mobile-nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (mobileNav.classList.contains('open')) toggleMenu();
    });
  });

  // ─── Header scroll ────────────────────────
  var heroObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      header.classList.toggle('header--scrolled', !e.isIntersecting);
    });
  }, { threshold: 0.05 });
  heroObs.observe(hero);

  // ─── Active nav highlight ─────────────────
  var navLinks = document.querySelectorAll('.nav__link');
  var sections = document.querySelectorAll('section[id]');

  var sectionObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (s) { sectionObs.observe(s); });

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

  // ─── Custom Cursor (desktop) ──────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    var cursor = document.getElementById('cursor');
    var mx = 0, my = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
    });

    // Enlarge cursor over interactive elements
    var interactives = document.querySelectorAll('a, button, [data-cursor]');
    interactives.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.classList.add('cursor--link');
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('cursor--link');
      });
    });
  }

  // ─── Gallery Lightbox ─────────────────────
  var lightbox       = document.getElementById('lightbox');
  var lightboxImg    = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var closeBtn       = document.getElementById('lightbox-close');
  var prevBtn        = document.getElementById('lightbox-prev');
  var nextBtn        = document.getElementById('lightbox-next');
  var galleryItems   = document.querySelectorAll('.gallery__item');
  var currentIdx     = 0;

  var images = [];
  galleryItems.forEach(function (item) {
    var img   = item.querySelector('img');
    var title = item.querySelector('.gallery__item-title');
    var loc   = item.querySelector('.gallery__item-loc');
    images.push({
      src: img.src,
      alt: img.alt,
      caption: (title ? title.textContent : '') + (loc ? ' — ' + loc.textContent : '')
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
    if (e.target === lightbox || e.target.closest('.lightbox__body') === e.target) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Touch swipe for lightbox
  var touchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    var diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? showNext() : showPrev();
    }
  }, { passive: true });

  // ─── Contact Form ─────────────────────────
  var form      = document.getElementById('contact-form');
  var submitBtn = document.getElementById('submit-btn');
  var statusEl  = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameVal  = form.querySelector('#name').value.trim();
      var emailVal = form.querySelector('#email').value.trim();
      var msgVal   = form.querySelector('#message').value.trim();

      statusEl.textContent = '';
      statusEl.className = 'form-status';

      if (!nameVal) { showFormStatus('Please enter your name.', 'error'); return; }
      if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        showFormStatus('Please enter a valid email.', 'error');
        return;
      }
      if (!msgVal) { showFormStatus('Please enter a message.', 'error'); return; }

      submitBtn.classList.add('contact__submit--loading');
      submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) {
          submitBtn.classList.remove('contact__submit--loading');
          submitBtn.disabled = false;
          if (res.ok) {
            showFormStatus("Message sent! I'll get back to you soon.", 'success');
            form.reset();
          } else {
            res.json().then(function (d) {
              var msg = d.errors ? d.errors.map(function (e) { return e.message; }).join(', ') : 'Something went wrong.';
              showFormStatus(msg, 'error');
            });
          }
        })
        .catch(function () {
          submitBtn.classList.remove('contact__submit--loading');
          submitBtn.disabled = false;
          showFormStatus('Network error. Please try again.', 'error');
        });
    });
  }

  function showFormStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = 'form-status form-status--' + type;
  }
})();
