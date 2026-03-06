/* ═══════════════════════════════════════════════
   MAIN.JS — Navigation, Scroll Reveal, Parallax, GSAP
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── DOM References ──────────────────────────
  var nav = document.getElementById('nav');
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileLinks = document.querySelectorAll('.mobile-menu__link');
  var navLinks = document.querySelectorAll('.nav__link');

  // ─── Mobile Menu ─────────────────────────────
  function toggleMobileMenu() {
    var isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (mobileMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // ─── Smooth Scroll ───────────────────────────
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

  // ─── Nav Scroll Effect ───────────────────────
  var firstLocation = document.querySelector('.location');
  if (firstLocation) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            nav.classList.remove('nav--scrolled');
          } else {
            nav.classList.add('nav--scrolled');
          }
        });
      },
      { threshold: 0.5 }
    );
    // Observe the first location to see if we're near the top
    // Use a simpler scroll listener for the nav
  }

  var scrollThreshold = 100;
  window.addEventListener('scroll', function () {
    if (window.scrollY > scrollThreshold) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }, { passive: true });

  // ─── Active Nav Link Highlighting ────────────
  var locations = document.querySelectorAll('.location');

  var locationObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            link.classList.toggle('active', href === '#' + id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  locations.forEach(function (loc) {
    locationObserver.observe(loc);
  });

  // ─── Scroll Reveal ───────────────────────────
  function initScrollReveal() {
    // Add reveal class to elements that should animate in
    var selectors = [
      '.location__header',
      '.location__number',
      '.location__title',
      '.location__subtitle',
      '.project-module',
      '.film-poster',
      '.shot-category',
      '.gear-item',
      '.experiment',
      '.timeline__entry',
      '.final-scene__message',
      '.final-scene__grid',
      '.code-studio__text',
      '.code-studio__skills',
      '.shots-section__title',
      '.gear-section__title'
    ];

    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.classList.add('reveal');
      });
    });

    var revealElements = document.querySelectorAll('.reveal');
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ─── Mouse Parallax on Location Headers ──────
  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 2;
      var y = (e.clientY / window.innerHeight - 0.5) * 2;

      document.querySelectorAll('.location__title').forEach(function (el) {
        el.style.transform = 'translate(' + (x * 8) + 'px, ' + (y * 4) + 'px)';
      });

      document.querySelectorAll('.skill-float').forEach(function (el) {
        var speed = parseFloat(el.dataset.speed) || 1;
        el.style.transform = 'translate(' + (x * 6 * speed) + 'px, ' + (y * 3 * speed) + 'px)';
      });
    });
  }

  // ─── GSAP ScrollTrigger Animations ───────────
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Animate location headers on scroll
    gsap.utils.toArray('.location__header').forEach(function (header) {
      gsap.fromTo(header,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Timeline entries stagger
    gsap.utils.toArray('.timeline__entry').forEach(function (entry, i) {
      gsap.fromTo(entry,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: entry,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Final scene message lines
    gsap.utils.toArray('.final-scene__line').forEach(function (line, i) {
      gsap.fromTo(line,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.final-scene__message',
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Film posters zoom in
    gsap.utils.toArray('.film-poster').forEach(function (poster) {
      gsap.fromTo(poster,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: poster,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Project modules slide up
    gsap.utils.toArray('.project-module').forEach(function (mod, i) {
      gsap.fromTo(mod,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: (i % 3) * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: mod,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Smooth parallax on scroll for location divider lines
    gsap.utils.toArray('.location').forEach(function (loc) {
      gsap.to(loc, {
        '--line-progress': '100%',
        scrollTrigger: {
          trigger: loc,
          start: 'top bottom',
          end: 'top top',
          scrub: true
        }
      });
    });
  }

  // ─── Initialize After Viewfinder Exit ────────
  // These are called from cinema.js after the viewfinder transition
  window.initMainSite = function () {
    initScrollReveal();
    initGSAP();
  };

  // ─── Developer Console Easter Egg ────────────
  console.log(
    '%c Welcome, engineer. ',
    'background: #C8A96E; color: #0A0A0A; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 4px;'
  );
  console.log(
    '%c You found the hidden terminal. ',
    'color: #7A7570; font-size: 12px;'
  );
  console.log(
    '%c Commands available: whois() | projects() | playSecretFilm() ',
    'color: #C8A96E; font-size: 12px; font-family: monospace;'
  );

  window.whois = function () {
    console.log('%c Toby — Software Engineer & Cinematographer', 'color: #E8E4DE; font-size: 14px;');
    console.log('%c Based in the Netherlands. Building systems and capturing stories.', 'color: #7A7570; font-size: 12px;');
    console.log('%c Stack: React, Node.js, TypeScript, PostgreSQL, GraphQL, Next.js', 'color: #C8A96E; font-size: 12px;');
    console.log('%c Gear: Sony A7III, Samyang 35mm, Blackmagic Camera', 'color: #C8A96E; font-size: 12px;');
    return 'Toby | engineer + cinematographer';
  };

  window.projects = function () {
    var list = [
      'Swift Finance — Fintech app (React)',
      'Todoly — Task management (React, GraphQL)',
      'Team Work — Internal social network (React, Node, PostgreSQL)',
      'Geo Search — Location & weather (Google Maps, OpenWeather)',
      'Trimer — URL shortener (Node, MongoDB)'
    ];
    console.log('%c Projects:', 'color: #C8A96E; font-size: 14px; font-weight: bold;');
    list.forEach(function (p, i) {
      console.log('%c ' + (i + 1) + '. ' + p, 'color: #E8E4DE; font-size: 12px;');
    });
    return list.length + ' projects loaded';
  };

  window.playSecretFilm = function () {
    console.log('%c [CLASSIFIED]', 'color: #C0392B; font-size: 16px; font-weight: bold;');
    console.log('%c The secret film has not been shot yet...', 'color: #7A7570; font-size: 12px; font-style: italic;');
    console.log('%c But when it is, you will be the first to see it.', 'color: #C8A96E; font-size: 12px;');
    return 'Coming soon...';
  };

})();
