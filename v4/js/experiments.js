/* ═══════════════════════════════════════════════
   EXPERIMENTS.JS — Comparison, Grain, Color Grading, Form
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Before/After Comparison Slider ──────────
  var comparison = document.getElementById('comparison');
  var compAfter = document.getElementById('comparison-after');
  var compSlider = document.getElementById('comparison-slider');

  if (comparison && compAfter && compSlider) {
    var isDragging = false;

    function updateComparison(clientX) {
      var rect = comparison.getBoundingClientRect();
      var x = clientX - rect.left;
      var pct = Math.max(0, Math.min(100, (x / rect.width) * 100));

      compAfter.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      compSlider.style.left = pct + '%';
    }

    comparison.addEventListener('mousedown', function (e) {
      isDragging = true;
      updateComparison(e.clientX);
    });

    document.addEventListener('mousemove', function (e) {
      if (isDragging) {
        e.preventDefault();
        updateComparison(e.clientX);
      }
    });

    document.addEventListener('mouseup', function () {
      isDragging = false;
    });

    // Touch support
    comparison.addEventListener('touchstart', function (e) {
      isDragging = true;
      updateComparison(e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
      if (isDragging) {
        updateComparison(e.touches[0].clientX);
      }
    }, { passive: true });

    document.addEventListener('touchend', function () {
      isDragging = false;
    });
  }

  // ─── Film Grain Simulator ────────────────────
  var grainSize = document.getElementById('grain-size');
  var grainIntensity = document.getElementById('grain-intensity');
  var grainTemp = document.getElementById('grain-temp');
  var grainSizeVal = document.getElementById('grain-size-val');
  var grainIntensityVal = document.getElementById('grain-intensity-val');
  var grainTempVal = document.getElementById('grain-temp-val');
  var grainCanvas = document.getElementById('grain-canvas');
  var grainPreview = document.getElementById('grain-preview');

  if (grainCanvas && grainPreview) {
    var ctx = grainCanvas.getContext('2d');
    var grainAnimFrame = null;

    function resizeGrainCanvas() {
      var rect = grainPreview.getBoundingClientRect();
      grainCanvas.width = Math.min(rect.width, 800);
      grainCanvas.height = Math.min(rect.height, 450);
    }

    function renderGrain() {
      var size = parseInt(grainSize.value);
      var intensity = parseInt(grainIntensity.value);
      var temp = parseInt(grainTemp.value);
      var w = grainCanvas.width;
      var h = grainCanvas.height;

      if (w === 0 || h === 0) {
        grainAnimFrame = requestAnimationFrame(renderGrain);
        return;
      }

      var imageData = ctx.createImageData(w, h);
      var data = imageData.data;
      var step = Math.max(1, Math.floor(size / 15));
      var tempR = temp > 50 ? (temp - 50) / 50 * 35 : 0;
      var tempB = temp < 50 ? (50 - temp) / 50 * 35 : 0;

      for (var y = 0; y < h; y += step) {
        for (var x = 0; x < w; x += step) {
          var noise = (Math.random() - 0.5) * intensity * 2.55;

          for (var dy = 0; dy < step && y + dy < h; dy++) {
            for (var dx = 0; dx < step && x + dx < w; dx++) {
              var i = ((y + dy) * w + (x + dx)) * 4;
              data[i]     = Math.max(0, Math.min(255, 128 + noise + tempR));
              data[i + 1] = Math.max(0, Math.min(255, 128 + noise));
              data[i + 2] = Math.max(0, Math.min(255, 128 + noise + tempB));
              data[i + 3] = Math.floor(intensity * 1.5);
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      grainAnimFrame = requestAnimationFrame(renderGrain);
    }

    function updateGrainValues() {
      grainSizeVal.textContent = grainSize.value;
      grainIntensityVal.textContent = grainIntensity.value;
      grainTempVal.textContent = grainTemp.value;
    }

    [grainSize, grainIntensity, grainTemp].forEach(function (slider) {
      slider.addEventListener('input', updateGrainValues);
    });

    var grainObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          resizeGrainCanvas();
          if (!grainAnimFrame) renderGrain();
        } else {
          if (grainAnimFrame) {
            cancelAnimationFrame(grainAnimFrame);
            grainAnimFrame = null;
          }
        }
      });
    }, { threshold: 0.1 });

    grainObserver.observe(grainPreview);
    window.addEventListener('resize', resizeGrainCanvas);
  }

  // ─── Color Grading Tool ──────────────────────
  var gradeBrightness = document.getElementById('grade-brightness');
  var gradeContrast = document.getElementById('grade-contrast');
  var gradeSaturate = document.getElementById('grade-saturate');
  var gradeHue = document.getElementById('grade-hue');
  var gradeBrightnessVal = document.getElementById('grade-brightness-val');
  var gradeContrastVal = document.getElementById('grade-contrast-val');
  var gradeSaturateVal = document.getElementById('grade-saturate-val');
  var gradeHueVal = document.getElementById('grade-hue-val');
  var gradeImg = document.getElementById('grade-img');
  var gradeReset = document.getElementById('grade-reset');

  if (gradeImg) {
    function updateColorGrade() {
      var b = gradeBrightness.value;
      var c = gradeContrast.value;
      var s = gradeSaturate.value;
      var h = gradeHue.value;

      gradeBrightnessVal.textContent = b;
      gradeContrastVal.textContent = c;
      gradeSaturateVal.textContent = s;
      gradeHueVal.textContent = h + '\u00B0';

      gradeImg.style.filter =
        'brightness(' + (b / 100) + ') ' +
        'contrast(' + (c / 100) + ') ' +
        'saturate(' + (s / 100) + ') ' +
        'hue-rotate(' + h + 'deg)';
    }

    [gradeBrightness, gradeContrast, gradeSaturate, gradeHue].forEach(function (slider) {
      slider.addEventListener('input', updateColorGrade);
    });

    if (gradeReset) {
      gradeReset.addEventListener('click', function () {
        gradeBrightness.value = 100;
        gradeContrast.value = 100;
        gradeSaturate.value = 100;
        gradeHue.value = 0;
        updateColorGrade();
      });
    }
  }

  // ─── Contact Form ────────────────────────────
  var form = document.getElementById('contact-form');
  var submitBtn = document.getElementById('submit-btn');
  var statusEl = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.querySelector('#name');
      var email = form.querySelector('#email');
      var message = form.querySelector('#message');

      statusEl.textContent = '';
      statusEl.className = 'contact-form__status';

      if (!name.value.trim()) {
        showStatus('Please enter your name.', 'error');
        name.focus();
        return;
      }

      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showStatus('Please enter a valid email address.', 'error');
        email.focus();
        return;
      }

      if (!message.value.trim()) {
        showStatus('Please enter a message.', 'error');
        message.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'SENDING...';

      var formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          submitBtn.disabled = false;
          submitBtn.textContent = "LET'S CREATE SOMETHING";

          if (response.ok) {
            showStatus('Message sent! I\'ll get back to you soon.', 'success');
            form.reset();
          } else {
            return response.json().then(function (data) {
              if (data.errors) {
                showStatus(data.errors.map(function (err) { return err.message; }).join(', '), 'error');
              } else {
                showStatus('Something went wrong. Please try again.', 'error');
              }
            });
          }
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "LET'S CREATE SOMETHING";
          showStatus('Network error. Please check your connection.', 'error');
        });
    });

    function showStatus(msg, type) {
      statusEl.textContent = msg;
      statusEl.className = 'contact-form__status contact-form__status--' + type;
    }
  }

})();
