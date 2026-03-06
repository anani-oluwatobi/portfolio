/* ═══════════════════════════════════════════════
   MAIN.JS — Navigation, Scroll Reveal, Cursor Spotlight
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── DOM References ──────────────────────────
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');
  const heroSpotlight = document.getElementById('hero-spotlight');
  const hero = document.getElementById('hero');

  // ─── Mobile Menu Toggle ──────────────────────
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a link is clicked
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (mobileMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // ─── Nav Scroll Effect ───────────────────────
  // Use IntersectionObserver on the hero section to toggle nav background
  var heroObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          nav.classList.remove('nav--scrolled');
        } else {
          nav.classList.add('nav--scrolled');
        }
      });
    },
    { threshold: 0.1 }
  );
  heroObserver.observe(hero);

  // ─── Active Nav Link Highlighting ────────────
  var sections = document.querySelectorAll('section[id]');

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          // Update desktop nav
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px'
    }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // ─── Scroll Reveal ───────────────────────────
  var revealElements = document.querySelectorAll('.reveal');

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target); // Only animate once
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ─── Hero Cursor Spotlight (Desktop Only) ────
  if (window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      heroSpotlight.style.setProperty('--mouse-x', x + '%');
      heroSpotlight.style.setProperty('--mouse-y', y + '%');
    });
  }

  // ─── Smooth Scroll for Nav Links ─────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
