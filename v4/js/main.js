/* ═══════════════════════════════════════════════
   MAIN.JS — Cursor, Navigation, Constellation, Stats, GSAP
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Custom Cursor ───────────────────────────
  var cursor = document.getElementById('cursor');
  var cursorDot = cursor && cursor.querySelector('.cursor__dot');
  var cursorRing = cursor && cursor.querySelector('.cursor__ring');
  var mouseX = 0, mouseY = 0;
  var ringX = 0, ringY = 0;

  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) {
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
      }
    });

    // Smooth ring follow
    (function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (cursorRing) {
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
      }
      requestAnimationFrame(animateRing);
    })();

    // Cursor hover states
    document.addEventListener('mouseover', function (e) {
      var target = e.target.closest('a, button, .magnetic, input, textarea, .project-module, .film-poster, .shot-category, .gear-item');
      if (target) {
        cursor.classList.add('cursor--hover');
      }
    });

    document.addEventListener('mouseout', function (e) {
      var target = e.target.closest('a, button, .magnetic, input, textarea, .project-module, .film-poster, .shot-category, .gear-item');
      if (target) {
        cursor.classList.remove('cursor--hover');
      }
    });

    // Section-based cursor style
    var locationObserverCursor = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var cursorType = entry.target.dataset.cursor || 'default';
          cursor.className = 'cursor';
          if (cursorType !== 'default') {
            cursor.classList.add('cursor--' + cursorType);
          }
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    document.querySelectorAll('[data-cursor]').forEach(function (el) {
      locationObserverCursor.observe(el);
    });
  } else if (cursor) {
    cursor.style.display = 'none';
  }

  // ─── Magnetic Buttons ────────────────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  // ─── DOM References ──────────────────────────
  var nav = document.getElementById('nav');
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileLinks = document.querySelectorAll('.mobile-menu__link');
  var navLinks = document.querySelectorAll('.nav__link');
  var scrollFill = document.getElementById('scroll-fill');

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
      if (mobileMenu.classList.contains('open')) toggleMobileMenu();
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

  // ─── Scroll Progress & Nav ───────────────────
  window.addEventListener('scroll', function () {
    // Nav background
    if (window.scrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    // Scroll progress
    if (scrollFill) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      scrollFill.style.height = pct + '%';
    }
  }, { passive: true });

  // ─── Active Nav Highlighting ─────────────────
  var locations = document.querySelectorAll('.location');

  var locationObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  locations.forEach(function (loc) {
    locationObserver.observe(loc);
  });

  // ─── Scroll Reveal ───────────────────────────
  function initScrollReveal() {
    var selectors = [
      '.location__header', '.project-module', '.film-poster',
      '.shot-category', '.gear-item', '.experiment',
      '.timeline__entry', '.final-scene__message', '.final-scene__grid',
      '.code-studio__text', '.terminal', '.code-stats',
      '.skills-constellation', '.shots-section__title', '.gear-section__title'
    ];

    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('reveal');
      });
    });

    var revealElements = document.querySelectorAll('.reveal');
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ─── Code Stats Counter ──────────────────────
  function initStatsCounter() {
    var stats = document.querySelectorAll('.code-stat');

    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    stats.forEach(function (stat) {
      statsObserver.observe(stat);
    });
  }

  function animateStat(el) {
    var target = parseInt(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var numEl = el.querySelector('.code-stat__number');
    var duration = 2000;
    var start = Date.now();

    el.classList.add('counted');

    function update() {
      var elapsed = Date.now() - start;
      var progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);

      numEl.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ─── Skills Constellation (Canvas Lines) ─────
  function initConstellation() {
    var canvas = document.getElementById('constellation-canvas');
    var container = document.getElementById('skills-constellation');
    if (!canvas || !container) return;

    var ctx = canvas.getContext('2d');
    var nodes = container.querySelectorAll('.skill-node');

    function resize() {
      var rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    function draw() {
      resize();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var positions = [];
      nodes.forEach(function (node) {
        var rect = node.getBoundingClientRect();
        var containerRect = container.getBoundingClientRect();
        positions.push({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2
        });
      });

      // Draw connections
      ctx.strokeStyle = 'rgba(200, 169, 110, 0.06)';
      ctx.lineWidth = 1;

      for (var i = 0; i < positions.length; i++) {
        for (var j = i + 1; j < positions.length; j++) {
          var dx = positions[i].x - positions[j].x;
          var dy = positions[i].y - positions[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 250) {
            var alpha = 0.06 * (1 - dist / 250);
            ctx.strokeStyle = 'rgba(200, 169, 110, ' + alpha + ')';
            ctx.beginPath();
            ctx.moveTo(positions[i].x, positions[i].y);
            ctx.lineTo(positions[j].x, positions[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    // Only draw when visible
    var constellationObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          draw();
        }
      });
    }, { threshold: 0.1 });

    constellationObserver.observe(container);
  }

  // ─── Mouse Parallax ──────────────────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 2;
      var y = (e.clientY / window.innerHeight - 0.5) * 2;

      document.querySelectorAll('.skill-node').forEach(function (el) {
        var speed = parseFloat(el.dataset.speed) || 1;
        el.style.transform = 'translate(' + (x * 8 * speed) + 'px, ' + (y * 5 * speed) + 'px)';
      });
    });
  }

  // ─── Interactive Terminal ────────────────────
  function initTerminal() {
    var input = document.getElementById('terminal-input');
    var body = document.getElementById('terminal-body');
    if (!input || !body) return;

    var terminalEl = document.getElementById('terminal');
    if (terminalEl) {
      terminalEl.addEventListener('click', function () {
        input.focus();
      });
    }

    var commands = {
      help: 'Available: whoami, skills, projects, gear, clear, coffee',
      whoami: 'Toby — Software Engineer & Cinematographer\nBased in the Netherlands. Building systems and capturing stories.',
      skills: 'Frontend: React, Next.js, TypeScript, Three.js\nBackend: Node.js, Express, PostgreSQL, GraphQL\nCinema: Sony A7III, DaVinci Resolve, Premiere Pro',
      projects: '1. Swift Finance — Fintech (React)\n2. Todoly — Task management (React, GraphQL)\n3. Team Work — Social network (Full-stack)\n4. Geo Search — Maps & weather\n5. Trimer — URL shortener (Node)',
      gear: 'Sony A7III + Samyang 35mm f1.8\nMist 1/4 Filter\niPhone 15 Pro + Blackmagic Camera\nDJI RS 3 Mini',
      coffee: '☕ Brewing... done. Enjoy your coffee.\nFun fact: This portfolio was fueled by 2847+ cups.',
      clear: '__CLEAR__',
      secret: '🎬 You found a secret! There is a hidden film reel... coming 2027.'
    };

    input.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;

      var cmd = input.value.trim().toLowerCase();
      input.value = '';

      if (!cmd) return;

      // Add command line
      var cmdLine = document.createElement('div');
      cmdLine.className = 'terminal__line';
      cmdLine.innerHTML = '<span class="terminal__prompt">$</span> <span class="terminal__cmd">' + escapeHtml(cmd) + '</span>';

      // Find the active line and insert before it
      var activeLine = body.querySelector('.terminal__line--active');
      body.insertBefore(cmdLine, activeLine);

      if (cmd === 'clear') {
        // Clear all except active line
        var children = Array.from(body.children);
        children.forEach(function (child) {
          if (!child.classList.contains('terminal__line--active')) {
            body.removeChild(child);
          }
        });
      } else {
        var response = commands[cmd] || 'Command not found: ' + cmd + '. Try "help"';
        var output = document.createElement('div');
        output.className = 'terminal__output';
        output.style.whiteSpace = 'pre-wrap';
        output.textContent = response;
        body.insertBefore(output, activeLine);
      }

      // Scroll to bottom
      body.scrollTop = body.scrollHeight;
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ─── Timeline Active State ───────────────────
  function initTimeline() {
    var entries = document.querySelectorAll('.timeline__entry');
    var fill = document.getElementById('timeline-fill');

    var timelineObserver = new IntersectionObserver(function (observerEntries) {
      observerEntries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.5 });

    entries.forEach(function (e) {
      timelineObserver.observe(e);
    });

    // Animate timeline line fill
    if (fill) {
      var timelineSection = document.getElementById('location-journey');
      if (timelineSection) {
        window.addEventListener('scroll', function () {
          var rect = timelineSection.getBoundingClientRect();
          var sectionHeight = rect.height;
          var scrolled = -rect.top + window.innerHeight * 0.5;
          var pct = Math.max(0, Math.min(100, (scrolled / sectionHeight) * 100));
          fill.style.height = pct + '%';
        }, { passive: true });
      }
    }
  }

  // ─── GSAP ScrollTrigger ──────────────────────
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Location headers cinematic reveal
    gsap.utils.toArray('.location__header').forEach(function (header) {
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      tl.fromTo(header.querySelector('.location__number'),
        { opacity: 0, y: 20, letterSpacing: '0.8em' },
        { opacity: 1, y: 0, letterSpacing: '0.4em', duration: 0.6, ease: 'power2.out' }
      )
      .fromTo(header.querySelector('.location__title'),
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo(header.querySelector('.location__subtitle'),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.4'
      );
    });

    // Film posters staggered zoom
    gsap.utils.toArray('.film-poster').forEach(function (poster, i) {
      gsap.fromTo(poster,
        { scale: 0.85, opacity: 0, rotateY: 5 },
        {
          scale: 1, opacity: 1, rotateY: 0,
          duration: 1, delay: i * 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: poster, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    // Project modules fly up with stagger
    gsap.utils.toArray('.project-module').forEach(function (mod, i) {
      gsap.fromTo(mod,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.7, delay: (i % 3) * 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: mod, start: 'top 90%', toggleActions: 'play none none none' }
        }
      );
    });

    // Final scene typewriter feel
    gsap.utils.toArray('.final-scene__line').forEach(function (line, i) {
      gsap.fromTo(line,
        { opacity: 0, y: 30, clipPath: 'inset(0 100% 0 0)' },
        {
          opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)',
          duration: 0.8, delay: i * 0.25,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.final-scene__message', start: 'top 75%', toggleActions: 'play none none none' }
        }
      );
    });

    // Light leak parallax
    gsap.utils.toArray('.light-leak').forEach(function (leak) {
      gsap.fromTo(leak,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: leak.parentElement,
            start: 'top bottom',
            end: 'top center',
            scrub: 1
          }
        }
      );
    });

    // Credits marquee speed change on scroll
    gsap.utils.toArray('.credits-marquee__track').forEach(function (track) {
      gsap.to(track, {
        x: -100,
        scrollTrigger: {
          trigger: track.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2
        }
      });
    });
  }

  // ─── Init After Viewfinder Exit ──────────────
  window.initMainSite = function () {
    initScrollReveal();
    initStatsCounter();
    initConstellation();
    initTerminal();
    initTimeline();
    initGSAP();
  };

  // ─── Console Easter Egg ──────────────────────
  console.log(
    '%c\n  ██████████████████████████████████████\n  █                                    █\n  █   Welcome, engineer.               █\n  █   You found the hidden terminal.   █\n  █                                    █\n  ██████████████████████████████████████\n',
    'color: #C8A96E; font-family: monospace; font-size: 11px;'
  );
  console.log('%c Commands: whois() | projects() | playSecretFilm() | stack()', 'color: #7A7570; font-size: 11px; font-family: monospace;');

  window.whois = function () {
    console.log('%c Toby%c — Software Engineer & Cinematographer', 'color: #C8A96E; font-size: 16px; font-weight: bold;', 'color: #E8E4DE; font-size: 14px;');
    console.log('%c Netherlands / Building systems and capturing stories', 'color: #7A7570;');
    return '> toby.whoami()';
  };

  window.projects = function () {
    ['Swift Finance', 'Todoly', 'Team Work', 'Geo Search', 'Trimer'].forEach(function (p, i) {
      console.log('%c ' + (i + 1) + '. ' + p, 'color: #E8E4DE; font-size: 12px;');
    });
    return '5 projects loaded';
  };

  window.stack = function () {
    console.log('%c Frontend:%c React, Next.js, TypeScript, Three.js', 'color: #C8A96E;', 'color: #E8E4DE;');
    console.log('%c Backend:%c  Node.js, Express, PostgreSQL, GraphQL', 'color: #C8A96E;', 'color: #E8E4DE;');
    console.log('%c Cinema:%c  Sony A7III, DaVinci Resolve', 'color: #C8A96E;', 'color: #E8E4DE;');
    return '> loaded';
  };

  window.playSecretFilm = function () {
    console.log('%c [CLASSIFIED] %c The secret film has not been shot yet...', 'background: #C0392B; color: white; padding: 2px 6px;', 'color: #7A7570; font-style: italic;');
    console.log('%c But when it is, you\'ll be the first to see it.', 'color: #C8A96E;');
    return 'Coming 2027...';
  };

})();
