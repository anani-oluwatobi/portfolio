/* ═══════════════════════════════════════════════
   FOR MY LOVE — Script (Rose Edition)
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  var entry = document.getElementById('entry');
  var openBtn = document.getElementById('open-btn');
  var envelope = document.getElementById('envelope');
  var site = document.getElementById('site');

  // ─── Falling Rose Petals ───────────────────
  var petalsContainer = document.getElementById('petals');

  function spawnPetal() {
    var petal = document.createElement('div');
    var types = ['petal', 'petal petal--alt', 'petal petal--deep'];
    petal.className = types[Math.floor(Math.random() * types.length)];

    var size = Math.random() * 14 + 8;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
    petal.style.setProperty('--spin', (Math.random() * 720 - 360) + 'deg');
    petal.style.animationDuration = (Math.random() * 5 + 6) + 's';
    petal.style.animationDelay = (Math.random() * 2) + 's';

    petalsContainer.appendChild(petal);
    setTimeout(function () { petal.remove(); }, 13000);
  }

  // Spawn petals continuously
  setInterval(spawnPetal, 800);
  // Initial burst
  for (var p = 0; p < 8; p++) {
    setTimeout(spawnPetal, p * 200);
  }

  // ─── Sparkle Cursor Trail ──────────────────
  var sparkleContainer = document.getElementById('sparkle-container');
  var sparkleThrottle = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      var now = Date.now();
      if (now - sparkleThrottle < 50) return;
      sparkleThrottle = now;

      var sparkle = document.createElement('div');
      sparkle.className = Math.random() > 0.5 ? 'sparkle' : 'sparkle sparkle--rose';
      sparkle.style.left = e.clientX + 'px';
      sparkle.style.top = e.clientY + 'px';
      var size = Math.random() * 6 + 3;
      sparkle.style.width = size + 'px';
      sparkle.style.height = size + 'px';

      sparkleContainer.appendChild(sparkle);
      setTimeout(function () { sparkle.remove(); }, 800);
    });
  }

  // ─── Entry ─────────────────────────────────
  var opened = false;
  function openLetter() {
    if (opened) return;
    opened = true;
    envelope.classList.add('entry__envelope--open');

    setTimeout(function () {
      launchConfetti(120);
      launchRosePetalBurst();
    }, 300);

    setTimeout(function () {
      entry.classList.add('entry--hidden');
      site.classList.add('site--visible');
      initScrollReveals();
      startHeartRain();
      initGarden();
      initStealHeart();
    }, 1400);
  }

  openBtn.addEventListener('click', openLetter);
  envelope.addEventListener('click', openLetter);

  // ─── Mega Confetti Burst ───────────────────
  function launchConfetti(count) {
    count = count || 80;
    var colors = ['#ff6b8a', '#ffd4dc', '#c4b5fd', '#ffb088', '#86efac', '#ffd700', '#ff2d55', '#c8385a', '#9e1b3c', '#f5a0b5'];
    var shapes = ['confetti--square', 'confetti--circle', 'confetti--rose', 'confetti--strip'];

    for (var i = 0; i < count; i++) {
      var el = document.createElement('div');
      var shape = shapes[Math.floor(Math.random() * shapes.length)];
      el.className = 'confetti ' + shape;
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top = '-10px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];

      var w, h;
      if (shape === 'confetti--strip') {
        w = Math.random() * 4 + 2;
        h = Math.random() * 20 + 10;
      } else {
        w = Math.random() * 12 + 5;
        h = w;
      }
      el.style.width = w + 'px';
      el.style.height = h + 'px';
      el.style.setProperty('--confetti-spin', (Math.random() * 1080) + 'deg');
      el.style.animationDuration = (Math.random() * 2.5 + 2) + 's';
      el.style.animationDelay = (Math.random() * 0.8) + 's';
      document.body.appendChild(el);

      setTimeout(function (e) { e.remove(); }.bind(null, el), 5500);
    }
  }

  // ─── Rose Petal Burst (special confetti) ───
  function launchRosePetalBurst() {
    for (var i = 0; i < 30; i++) {
      var petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.position = 'fixed';
      petal.style.zIndex = '10000';
      petal.style.left = (40 + Math.random() * 20) + 'vw';
      petal.style.top = (40 + Math.random() * 20) + 'vh';
      petal.style.setProperty('--drift', (Math.random() * 300 - 150) + 'px');
      petal.style.setProperty('--spin', (Math.random() * 720 - 360) + 'deg');
      petal.style.animationDuration = (Math.random() * 3 + 3) + 's';
      petal.style.animationDelay = (Math.random() * 0.5) + 's';
      var size = Math.random() * 20 + 10;
      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      petal.style.opacity = '0.9';
      document.body.appendChild(petal);

      setTimeout(function (e) { e.remove(); }.bind(null, petal), 5000);
    }
  }

  // ─── Scroll Reveals ────────────────────────
  function initScrollReveals() {
    var sections = document.querySelectorAll('.reasons, .photos, .garden, .quiz, .compliments, .meter, .steal-heart, .promises, .final__content');

    sections.forEach(function (section) {
      section.classList.add('reveal');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ─── Rose Garden ───────────────────────────
  function initGarden() {
    var gardenRow = document.getElementById('garden-row');
    var roseCount = document.getElementById('rose-count');
    if (!gardenRow) return;

    var totalRoses = 30;
    var bloomed = 0;

    for (var i = 0; i < totalRoses; i++) {
      var rose = document.createElement('span');
      rose.className = 'garden__rose garden__rose--seed';
      rose.innerHTML = '&#127801;';
      rose.setAttribute('data-index', i);

      rose.addEventListener('click', function () {
        if (this.classList.contains('garden__rose--bloomed')) return;

        this.classList.remove('garden__rose--seed');
        this.classList.add('garden__rose--bloomed');
        bloomed++;
        roseCount.textContent = bloomed;

        // Mini confetti burst from this rose
        var rect = this.getBoundingClientRect();
        for (var j = 0; j < 5; j++) {
          var sparkle = document.createElement('div');
          sparkle.className = 'sparkle sparkle--rose';
          sparkle.style.left = rect.left + Math.random() * 30 + 'px';
          sparkle.style.top = rect.top + Math.random() * 30 + 'px';
          sparkle.style.width = '8px';
          sparkle.style.height = '8px';
          sparkleContainer.appendChild(sparkle);
          setTimeout(function (s) { s.remove(); }.bind(null, sparkle), 800);
        }

        if (bloomed === totalRoses) {
          roseCount.textContent = totalRoses + ' - You bloomed them all! Here\'s a garden of love for you!';
          launchConfetti(100);
          launchRosePetalBurst();
        }
      });

      gardenRow.appendChild(rose);
    }
  }

  // ─── Quiz ──────────────────────────────────
  var quizOptions = document.querySelectorAll('.quiz__option');
  var quizResult = document.getElementById('quiz-result');
  var quizAnswered = false;

  var wrongResponses = [
    'Hmm, try again. Think BIGGER.',
    'Nope! You are underestimating yourself severely.',
    'Wrong! You clearly need more compliments.',
    'Still wrong. I will wait all day if I have to.'
  ];
  var wrongIndex = 0;

  quizOptions.forEach(function (opt) {
    opt.addEventListener('click', function () {
      if (quizAnswered) return;

      if (opt.getAttribute('data-answer') === 'right') {
        quizAnswered = true;
        opt.classList.add('quiz__option--right');
        quizResult.textContent = 'CORRECT! You are literally the most amazing person. This is a fact, not an opinion. \u{1F339}';
        launchConfetti(80);
        launchRosePetalBurst();
      } else {
        opt.classList.add('quiz__option--wrong');
        quizResult.textContent = wrongResponses[wrongIndex % wrongResponses.length];
        wrongIndex++;

        setTimeout(function () {
          opt.classList.remove('quiz__option--wrong');
        }, 500);
      }
    });
  });

  // ─── Compliment Generator ──────────────────
  var compliments = [
    "You could make a grumpy cat smile. \u{1F339}",
    "You're the human equivalent of a warm blanket.",
    "If beauty were time, you'd be an eternity.",
    "You're the reason I check my phone and smile like an idiot.",
    "Your smile should be illegal. It's too powerful. \u{1F339}",
    "You're basically a walking, talking good vibe.",
    "You are more fun than bubble wrap. And that's saying something.",
    "You light up a room like you swallowed the sun. But, like, safely.",
    "If you were a vegetable, you'd be a cute-cumber. \u{1F339}",
    "You're the plot twist I didn't see coming but always needed.",
    "On a scale of 1 to 10, you're a 'my brain stopped working because you're that beautiful.'",
    "You're like a dictionary \u2014 you add meaning to my life. (I know. But it's true.)",
    "You make me want to be the best version of myself. No pressure though.",
    "You're proof that good things DO come in beautiful packages. \u{1F339}",
    "If I had a rose for every time you made me smile, I'd have a whole garden. Wait, I literally built you one.",
    "Your laugh is my favorite notification sound.",
    "You're so cool, ice cubes are jealous.",
    "Whoever said nothing is perfect clearly hasn't met you. \u{1F339}",
    "You make ordinary moments extraordinary just by being there.",
    "You're the WiFi to my phone. I feel lost without you. And I start acting weird.",
    "Even roses are jealous of how beautiful you are. \u{1F339}",
    "If I could rearrange the alphabet, I'd put U and I together. (Yes, I went there.)",
    "You deserve all the flowers in the world, but especially roses. \u{1F339}\u{1F339}\u{1F339}"
  ];

  var complimentDisplay = document.getElementById('compliment-display');
  var complimentBtn = document.getElementById('compliment-btn');
  var complimentCount = document.getElementById('compliment-count');
  var dispensed = 0;
  var lastCompliment = -1;

  complimentBtn.addEventListener('click', function () {
    var index;
    do {
      index = Math.floor(Math.random() * compliments.length);
    } while (index === lastCompliment && compliments.length > 1);

    lastCompliment = index;
    dispensed++;
    complimentCount.textContent = dispensed;

    complimentDisplay.textContent = compliments[index];
    complimentDisplay.classList.remove('compliments__display--pop');
    void complimentDisplay.offsetWidth;
    complimentDisplay.classList.add('compliments__display--pop');

    // Small confetti on every press
    launchConfetti(8);

    if (dispensed === 10) {
      setTimeout(function () {
        complimentDisplay.textContent = "10 compliments?! You're either feeling down or just addicted. Either way: You are EXTRAORDINARY. Yes, YOU. \u{1F339}";
        launchConfetti(50);
      }, 2000);
    }

    if (dispensed === 20) {
      setTimeout(function () {
        complimentDisplay.textContent = "20?! At this point you should know: you're the best thing since sliced bread. And I LOVE bread. Have some roses: \u{1F339}\u{1F339}\u{1F339}\u{1F339}\u{1F339}";
        launchConfetti(100);
        launchRosePetalBurst();
      }, 2000);
    }
  });

  // ─── Love Meter ────────────────────────────
  var meterFill = document.getElementById('meter-fill');
  var meterLabel = document.getElementById('meter-label');
  var meterBtn = document.getElementById('meter-btn');
  var meterVerdict = document.getElementById('meter-verdict');
  var meterMeasured = false;

  meterBtn.addEventListener('click', function () {
    if (meterMeasured) return;
    meterMeasured = true;

    meterLabel.textContent = 'Measuring...';

    setTimeout(function () {
      meterFill.classList.add('meter__fill--animate');
      meterLabel.textContent = '';
    }, 500);

    setTimeout(function () {
      meterFill.classList.add('meter__fill--overflow');
      meterVerdict.textContent = 'ERROR: Value exceeds maximum capacity. Love = INFINITE. \u{1F339}';
      meterBtn.textContent = 'Meter broke. Worth it.';
      meterBtn.disabled = true;

      meterFill.parentElement.style.animation = 'nope 0.3s ease';
      setTimeout(function () {
        meterFill.parentElement.style.animation = '';
      }, 300);

      launchConfetti(60);
    }, 2500);
  });

  // ─── Steal My Heart Game ───────────────────
  function initStealHeart() {
    var area = document.getElementById('steal-heart-area');
    var target = document.getElementById('steal-heart-target');
    var scoreEl = document.getElementById('steal-heart-score');
    var msgEl = document.getElementById('steal-heart-msg');
    if (!area || !target) return;

    var attempts = 0;
    var caught = false;
    var dodges = 0;

    var messages = [
      'Too slow! My heart is fast!',
      'Almost! But not quite!',
      'Haha, try again!',
      'So close! Keep trying!',
      'My heart is playing hard to get!'
    ];

    var finalMessages = [
      'Okay fine, you can have it. You already had it anyway.',
      'You caught it! But honestly, it was always yours.',
      'CAUGHT! My heart belongs to you. Always has.'
    ];

    function moveHeart() {
      if (caught) return;
      var areaRect = area.getBoundingClientRect();
      var maxX = areaRect.width - 50;
      var maxY = areaRect.height - 50;
      target.style.left = (Math.random() * maxX) + 'px';
      target.style.top = (Math.random() * maxY) + 'px';
    }

    target.addEventListener('mouseenter', function () {
      if (caught) return;
      dodges++;
      if (dodges < 5) {
        moveHeart();
        msgEl.textContent = messages[Math.floor(Math.random() * messages.length)];
      }
      // After 5 dodges, let them catch it
    });

    target.addEventListener('click', function () {
      if (caught) return;
      attempts++;
      scoreEl.textContent = 'Attempts: ' + attempts;

      if (dodges >= 5 || attempts >= 3) {
        caught = true;
        target.classList.add('steal-heart__target--caught');
        msgEl.textContent = finalMessages[Math.floor(Math.random() * finalMessages.length)];
        launchConfetti(100);
        launchRosePetalBurst();
      } else {
        moveHeart();
        msgEl.textContent = messages[Math.floor(Math.random() * messages.length)];
      }
    });

    moveHeart();
  }

  // ─── Floating Hearts & Roses (Final) ──────
  function startHeartRain() {
    var container = document.getElementById('heart-explosion');
    if (!container) return;

    var items = ['\u{2764}', '\u{1F339}', '\u{1F339}', '\u{2764}', '\u{1F490}', '\u{1F33A}', '\u{1F339}'];

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          spawnHearts();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(container.parentElement);

    function spawnHearts() {
      for (var i = 0; i < 20; i++) {
        setTimeout(function () {
          var heart = document.createElement('span');
          heart.className = 'floating-heart';
          heart.textContent = items[Math.floor(Math.random() * items.length)];
          heart.style.left = Math.random() * 100 + '%';
          heart.style.bottom = '0';
          heart.style.fontSize = (Math.random() * 24 + 16) + 'px';
          heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
          heart.style.animationDelay = (Math.random() * 0.5) + 's';
          container.appendChild(heart);

          setTimeout(function () { heart.remove(); }, 6000);
        }, i * 150);
      }
    }
  }

  // ─── Replay Button ─────────────────────────
  var replayBtn = document.getElementById('replay-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', function () {
      launchConfetti(40);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── Card Tilt Effect ──────────────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      var cards = document.querySelectorAll('[data-tilt]');
      cards.forEach(function (card) {
        var rect = card.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        var distX = e.clientX - centerX;
        var distY = e.clientY - centerY;
        var dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < 300) {
          var rotX = (distY / 300) * -5;
          var rotY = (distX / 300) * 5;
          card.style.transform = 'perspective(600px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-4px)';
        } else {
          card.style.transform = '';
        }
      });
    });
  }

  // ─── Bouquet Hover Confetti ────────────────
  var bouquetRoses = document.querySelectorAll('.final__bouquet-rose');
  bouquetRoses.forEach(function (rose) {
    rose.addEventListener('click', function () {
      launchConfetti(15);
      var rect = rose.getBoundingClientRect();
      for (var i = 0; i < 8; i++) {
        var sparkle = document.createElement('div');
        sparkle.className = 'sparkle sparkle--rose';
        sparkle.style.left = (rect.left + Math.random() * 40) + 'px';
        sparkle.style.top = (rect.top + Math.random() * 40) + 'px';
        sparkle.style.width = '10px';
        sparkle.style.height = '10px';
        sparkleContainer.appendChild(sparkle);
        setTimeout(function (s) { s.remove(); }.bind(null, sparkle), 800);
      }
    });
  });

  // ─── Console Easter Egg ────────────────────
  console.log(
    '%c \u{1F339} Hey! Snooping around the code? This was built with love (and too much caffeine) for the most amazing person. \u{1F339} ',
    'background: linear-gradient(135deg, #c8385a, #ff6b8a); color: white; padding: 12px 16px; border-radius: 8px; font-size: 14px;'
  );

})();
