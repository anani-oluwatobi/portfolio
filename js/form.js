/* ═══════════════════════════════════════════════
   FORM.JS — Contact Form Validation & Submission
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  var submitBtn = document.getElementById('submit-btn');
  var statusEl = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation
    var name = form.querySelector('#name');
    var email = form.querySelector('#email');
    var message = form.querySelector('#message');

    // Reset status
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    if (!name.value.trim()) {
      showStatus('Please enter your name.', 'error');
      name.focus();
      return;
    }

    if (!email.value.trim() || !isValidEmail(email.value)) {
      showStatus('Please enter a valid email address.', 'error');
      email.focus();
      return;
    }

    if (!message.value.trim()) {
      showStatus('Please enter a message.', 'error');
      message.focus();
      return;
    }

    // Submit via Formspree
    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;

    var formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(function (response) {
        submitBtn.classList.remove('btn--loading');
        submitBtn.disabled = false;

        if (response.ok) {
          showStatus('Message sent! I\'ll get back to you soon.', 'success');
          form.reset();
        } else {
          return response.json().then(function (data) {
            if (data.errors) {
              var errorMsg = data.errors.map(function (err) { return err.message; }).join(', ');
              showStatus(errorMsg, 'error');
            } else {
              showStatus('Something went wrong. Please try again.', 'error');
            }
          });
        }
      })
      .catch(function () {
        submitBtn.classList.remove('btn--loading');
        submitBtn.disabled = false;
        showStatus('Network error. Please check your connection and try again.', 'error');
      });
  });

  function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = 'form-status form-status--' + type;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();
