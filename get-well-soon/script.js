/* ═══════════════════════════════════════════════
   GET WELL SOON, LATIFAH — Script
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  var entry = document.getElementById('entry');
  var openBtn = document.getElementById('open-btn');
  var bottle = document.getElementById('bottle');
  var site = document.getElementById('site');

  // ─── Floating Bubbles ──────────────────────
  var bubblesContainer = document.getElementById('bubbles');

  function spawnBubble() {
    var bubble = document.createElement('div');
    bubble.className = 'bubble';
    var size = Math.random() * 20 + 8;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = Math.random() * 100 + 'vw';
    bubble.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    bubble.style.animationDuration = (Math.random() * 6 + 5) + 's';
    bubblesContainer.appendChild(bubble);
    setTimeout(function () { bubble.remove(); }, 12000);
  }

  setInterval(spawnBubble, 1200);
  for (var b = 0; b < 5; b++) setTimeout(spawnBubble, b * 300);

  // ─── Entry ─────────────────────────────────
  var opened = false;
  function openMedicine() {
    if (opened) return;
    opened = true;

    bottle.style.animation = 'none';
    bottle.style.transform = 'rotate(0deg)';

    launchConfetti(80);
    launchEmoji(['&#128138;', '&#128154;', '&#10084;&#65039;', '&#127801;', '&#11088;'], 20);

    setTimeout(function () {
      entry.classList.add('entry--hidden');
      site.classList.add('site--visible');
      initScrollReveals();
      initPrescription();
      initFinalRain();
    }, 1200);
  }

  openBtn.addEventListener('click', openMedicine);
  bottle.addEventListener('click', openMedicine);

  // ─── Confetti ──────────────────────────────
  function launchConfetti(count) {
    var colors = ['#34d399', '#a7f3d0', '#fbbf24', '#f43f5e', '#fecdd3', '#8b5cf6', '#ddd6fe', '#fb923c', '#93c5fd'];
    for (var i = 0; i < count; i++) {
      var el = document.createElement('div');
      el.className = 'confetti';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top = '-10px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.width = (Math.random() * 10 + 4) + 'px';
      el.style.height = (Math.random() * 10 + 4) + 'px';
      el.style.setProperty('--spin', (Math.random() * 1080) + 'deg');
      el.style.animationDuration = (Math.random() * 2 + 2) + 's';
      el.style.animationDelay = (Math.random() * 0.6) + 's';
      if (Math.random() > 0.5) el.style.borderRadius = '50%';
      document.body.appendChild(el);
      setTimeout(function (e) { e.remove(); }.bind(null, el), 5000);
    }
  }

  // ─── Emoji Burst ───────────────────────────
  function launchEmoji(emojis, count) {
    for (var i = 0; i < count; i++) {
      setTimeout(function () {
        var el = document.createElement('span');
        el.className = 'float-emoji';
        el.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.position = 'fixed';
        el.style.zIndex = '10000';
        el.style.left = Math.random() * 100 + 'vw';
        el.style.bottom = '-20px';
        el.style.fontSize = (Math.random() * 16 + 16) + 'px';
        el.style.animationDuration = (Math.random() * 2 + 3) + 's';
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 5000);
      }, i * 100);
    }
  }

  // ─── Scroll Reveals ────────────────────────
  function initScrollReveals() {
    var sections = document.querySelectorAll(
      '.prescription, .hugs, .mood, .promises, .healing, .jokes, .message, .final__content'
    );

    sections.forEach(function (s) { s.classList.add('reveal'); });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  // ─── Prescription Checkboxes ───────────────
  function initPrescription() {
    var items = document.querySelectorAll('.prescription__item');
    var checked = 0;

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        if (item.classList.contains('prescription__item--checked')) return;
        item.classList.add('prescription__item--checked');
        checked++;

        if (checked === items.length) {
          launchConfetti(60);
          launchEmoji(['\u{2705}', '\u{1F389}', '\u{1F970}'], 10);
        }
      });
    });
  }

  // ─── Hug Bear ──────────────────────────────
  var hugBtn = document.getElementById('hug-btn');
  var hugCount = document.getElementById('hug-count');
  var hugMsg = document.getElementById('hug-msg');
  var bearArmLeft = document.getElementById('bear-arm-left');
  var bearArmRight = document.getElementById('bear-arm-right');
  var bearMouth = document.getElementById('bear-mouth');
  var hugs = 0;

  var hugMessages = [
    'Sending warmth your way!',
    'You are so huggable, Latifah!',
    'This hug has healing powers. Trust me.',
    'Another hug, another smile.',
    'The bear says: get well soon!',
    'Hug #' + (hugs + 1) + ' delivered with love!',
    'Wrapping you in virtual warmth!',
    'Each hug = +10 healing points.',
    'You deserve ALL the hugs.',
    'This one is extra tight!'
  ];

  hugBtn.addEventListener('click', function () {
    hugs++;
    hugCount.textContent = hugs;
    hugMsg.textContent = hugMessages[Math.floor(Math.random() * hugMessages.length)];

    // Bear hug animation
    bearArmLeft.classList.add('hugs__bear-arm--hug-left');
    bearArmRight.classList.add('hugs__bear-arm--hug-right');
    bearMouth.classList.add('hugs__bear-mouth--big');

    setTimeout(function () {
      bearArmLeft.classList.remove('hugs__bear-arm--hug-left');
      bearArmRight.classList.remove('hugs__bear-arm--hug-right');
      bearMouth.classList.remove('hugs__bear-mouth--big');
    }, 600);

    // Mini hearts
    var bearEl = document.getElementById('hug-bear');
    var rect = bearEl.getBoundingClientRect();
    for (var i = 0; i < 3; i++) {
      var heart = document.createElement('span');
      heart.className = 'float-emoji';
      heart.innerHTML = ['\u{2764}\u{FE0F}', '\u{1F9E1}', '\u{1F49B}'][i];
      heart.style.position = 'fixed';
      heart.style.zIndex = '100';
      heart.style.left = (rect.left + rect.width / 2 + (Math.random() * 40 - 20)) + 'px';
      heart.style.top = (rect.top - 10) + 'px';
      heart.style.bottom = 'auto';
      heart.style.fontSize = '20px';
      document.body.appendChild(heart);
      setTimeout(function (h) { h.remove(); }.bind(null, heart), 3500);
    }

    // Milestone
    if (hugs === 10) {
      setTimeout(function () {
        hugMsg.textContent = '10 hugs! Latifah, you are OFFICIALLY the most hugged person on the internet right now.';
        launchConfetti(50);
      }, 700);
    }
    if (hugs === 25) {
      setTimeout(function () {
        hugMsg.textContent = '25 hugs?! At this rate, you\'ll be healed by tomorrow. That\'s how this works, right?';
        launchConfetti(80);
        launchEmoji(['\u{1F917}', '\u{2764}\u{FE0F}', '\u{1F339}'], 15);
      }, 700);
    }
  });

  // ─── Mood Picker ───────────────────────────
  var moodBtns = document.querySelectorAll('.mood__face');
  var moodResponse = document.getElementById('mood-response');

  var moodResponses = {
    sick: [
      "Oh no, Latifah! Here's a virtual blanket and unlimited soup. You'll be okay, I promise.",
      "Sending you all the healing energy in the universe. And also snacks.",
      "Ugh, being sick is the WORST. But you're the BEST. So it evens out."
    ],
    tired: [
      "Then rest, beautiful. The world can wait. You come first.",
      "Sleep is literally the best medicine. Go be a professional napper.",
      "Close your eyes. Dream something nice. I'll be here when you wake up."
    ],
    meh: [
      "Meh is better than terrible! Progress! You're basically an Olympic athlete of healing.",
      "Even on a 'meh' day, you're still the most amazing person I know.",
      "Meh today, amazing tomorrow. That's the trajectory."
    ],
    okay: [
      "Okay is GREAT! You're on your way back, Latifah! I can feel it!",
      "See? You're already getting better! Your body is a healing MACHINE.",
      "From sick to okay is a whole journey. Proud of you!"
    ],
    better: [
      "YES! That's what I like to hear! The comeback is ON!",
      "Latifah is feeling better, everyone! Alert the media! This is breaking news!",
      "I KNEW you'd bounce back. You're literally unstoppable."
    ]
  };

  moodBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      moodBtns.forEach(function (b) { b.classList.remove('mood__face--selected'); });
      btn.classList.add('mood__face--selected');

      var mood = btn.getAttribute('data-mood');
      var responses = moodResponses[mood];
      moodResponse.textContent = responses[Math.floor(Math.random() * responses.length)];

      if (mood === 'better') {
        launchConfetti(40);
        launchEmoji(['\u{1F389}', '\u{2B50}', '\u{1F31F}', '\u{1F4AA}'], 10);
      }
    });
  });

  // ─── Healing Progress ──────────────────────
  var healingFill = document.getElementById('healing-fill');
  var healingPercent = document.getElementById('healing-percent');
  var healingBoost = document.getElementById('healing-boost');
  var healingStages = document.querySelectorAll('.healing__stage');
  var healingLevel = 5;

  function updateHealing() {
    healingFill.style.width = healingLevel + '%';
    healingPercent.textContent = healingLevel + '%';

    healingStages.forEach(function (stage) {
      var at = parseInt(stage.getAttribute('data-at'));
      if (healingLevel >= at) {
        stage.classList.add('healing__stage--active');
      } else {
        stage.classList.remove('healing__stage--active');
      }
    });
  }

  updateHealing();

  healingBoost.addEventListener('click', function () {
    if (healingLevel >= 100) {
      healingBoost.textContent = 'Already at 100%! You\'re healed!';
      launchConfetti(100);
      launchEmoji(['\u{1F389}', '\u{2764}\u{FE0F}', '\u{1F31F}', '\u{1F4AA}', '\u{1F339}'], 25);
      return;
    }

    var boost = Math.floor(Math.random() * 15) + 8;
    healingLevel = Math.min(100, healingLevel + boost);
    updateHealing();

    launchEmoji(['\u{2764}\u{FE0F}', '\u{1F49A}', '\u{2B50}'], 5);

    if (healingLevel >= 100) {
      healingBoost.textContent = 'YOU DID IT! 100%!';
      launchConfetti(100);
      launchEmoji(['\u{1F389}', '\u{1F973}', '\u{1F31F}', '\u{1F4AA}', '\u{1F339}'], 20);
    } else if (healingLevel >= 75) {
      healingBoost.textContent = 'Almost there! One more!';
    } else if (healingLevel >= 50) {
      healingBoost.textContent = 'Halfway! Keep going!';
    }
  });

  // ─── Joke Machine ──────────────────────────
  var jokes = [
    {
      q: "Why did the germ cross the road?",
      a: "To get to the other sneeze! \u{1F927}"
    },
    {
      q: "What did one tonsil say to the other?",
      a: "Better get dressed, the doctor is taking us out tonight!"
    },
    {
      q: "Why did the cookie go to the doctor?",
      a: "Because it was feeling crummy! \u{1F36A}"
    },
    {
      q: "What's the best way to cure acid reflux?",
      a: "Stop drinking acid! (I'm here all week)"
    },
    {
      q: "Why did the sick person bring a ladder?",
      a: "To get over their cold! \u{1F60F}"
    },
    {
      q: "What do you call a sick eagle?",
      a: "Illegal. \u{1F985} (I'm so sorry)"
    },
    {
      q: "Doctor: You need to stop eating whole meals.\nPatient: Why?",
      a: "Doctor: Because you should eat HALF meals \u2014 you'll get BETTER!"
    },
    {
      q: "Why don't scientists trust atoms when they're sick?",
      a: "Because they make up everything! Even their symptoms!"
    },
    {
      q: "What's a sick computer's favorite snack?",
      a: "Bytes of chicken soup! \u{1F4BB}\u{1F372}"
    },
    {
      q: "Latifah, what do you and a phone have in common?",
      a: "You're both running low on energy but still the most important thing in my life. \u{2764}\u{FE0F}"
    }
  ];

  var jokeQ = document.getElementById('joke-question');
  var jokeA = document.getElementById('joke-answer');
  var jokeReveal = document.getElementById('joke-reveal');
  var jokeNext = document.getElementById('joke-next');
  var jokeIndex = 0;

  function showJoke(index) {
    jokeQ.textContent = jokes[index].q;
    jokeA.textContent = jokes[index].a;
    jokeA.classList.remove('jokes__answer--visible');
    jokeReveal.classList.remove('jokes__reveal--hidden');
  }

  showJoke(0);

  jokeReveal.addEventListener('click', function () {
    jokeA.classList.add('jokes__answer--visible');
    jokeReveal.classList.add('jokes__reveal--hidden');
  });

  jokeNext.addEventListener('click', function () {
    jokeIndex = (jokeIndex + 1) % jokes.length;
    showJoke(jokeIndex);
  });

  // ─── Message Section Hearts ────────────────
  var msgObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        spawnMsgHearts();
      }
    });
  }, { threshold: 0.3 });

  var msgCard = document.querySelector('.message__card');
  if (msgCard) msgObserver.observe(msgCard);

  function spawnMsgHearts() {
    var container = document.getElementById('msg-hearts');
    if (!container) return;
    var hearts = ['\u{2764}\u{FE0F}', '\u{1F339}', '\u{1F49C}', '\u{1F49B}'];

    for (var i = 0; i < 8; i++) {
      setTimeout(function () {
        var h = document.createElement('span');
        h.className = 'float-emoji';
        h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        h.style.left = Math.random() * 100 + '%';
        h.style.bottom = '0';
        h.style.fontSize = (Math.random() * 14 + 12) + 'px';
        h.style.animationDuration = (Math.random() * 2 + 3) + 's';
        container.appendChild(h);
        setTimeout(function () { h.remove(); }, 5000);
      }, i * 250);
    }
  }

  // ─── Final Section Rain ────────────────────
  function initFinalRain() {
    var container = document.getElementById('emoji-rain');
    if (!container) return;

    var items = ['\u{2764}\u{FE0F}', '\u{1F339}', '\u{2B50}', '\u{1F31F}', '\u{1F490}', '\u{1F33B}', '\u{1F49A}'];

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          for (var i = 0; i < 15; i++) {
            setTimeout(function () {
              var el = document.createElement('span');
              el.className = 'float-emoji';
              el.textContent = items[Math.floor(Math.random() * items.length)];
              el.style.left = Math.random() * 100 + '%';
              el.style.bottom = '0';
              el.style.fontSize = (Math.random() * 18 + 14) + 'px';
              el.style.animationDuration = (Math.random() * 3 + 3) + 's';
              container.appendChild(el);
              setTimeout(function () { el.remove(); }, 6000);
            }, i * 200);
          }
        }
      });
    }, { threshold: 0.2 });

    observer.observe(container.parentElement);
  }

  // ─── Final Button ──────────────────────────
  var finalBtn = document.getElementById('final-btn');
  if (finalBtn) {
    finalBtn.addEventListener('click', function () {
      launchConfetti(100);
      launchEmoji(['\u{1F917}', '\u{2764}\u{FE0F}', '\u{1F339}', '\u{1F31F}', '\u{1F4AA}'], 25);
      finalBtn.textContent = 'Hug sent! You felt that, right?';
      setTimeout(function () {
        finalBtn.textContent = 'Send Yourself One More Hug';
      }, 3000);
    });
  }

  // ─── Sun click Easter Egg ──────────────────
  var sun = document.getElementById('hero-sun');
  if (sun) {
    var sunClicks = 0;
    sun.addEventListener('click', function () {
      sunClicks++;
      sun.style.transform = 'scale(' + (1 + sunClicks * 0.05) + ')';
      launchEmoji(['\u{2600}\u{FE0F}', '\u{1F31E}', '\u{2B50}'], 3);

      if (sunClicks >= 10) {
        sun.style.transform = 'scale(1)';
        sunClicks = 0;
        launchConfetti(60);
        launchEmoji(['\u{1F308}', '\u{2600}\u{FE0F}', '\u{1F31E}', '\u{2B50}', '\u{1F31F}'], 20);
      }
    });
  }

  // ─── Console ───────────────────────────────
  console.log(
    '%c Get well soon, Latifah! This was made with so much love. \u{2764}\u{FE0F} ',
    'background: #34d399; color: white; padding: 10px 14px; border-radius: 8px; font-size: 14px;'
  );

})();
