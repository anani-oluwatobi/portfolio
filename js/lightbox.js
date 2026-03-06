/* ═══════════════════════════════════════════════
   LIGHTBOX.JS — Gallery Lightbox with Keyboard & Swipe
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var closeBtn = document.getElementById('lightbox-close');
  var prevBtn = document.getElementById('lightbox-prev');
  var nextBtn = document.getElementById('lightbox-next');

  var galleryItems = document.querySelectorAll('.gallery__item');
  var currentIndex = 0;
  var touchStartX = 0;
  var touchEndX = 0;

  // Build array of gallery image data
  var images = [];
  galleryItems.forEach(function (item, i) {
    var img = item.querySelector('img');
    var title = item.querySelector('.gallery__photo-title');
    var location = item.querySelector('.gallery__photo-location');
    images.push({
      src: img.src,
      alt: img.alt,
      caption: (title ? title.textContent : '') + (location ? ' — ' + location.textContent : '')
    });
  });

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    if (images[currentIndex]) {
      lightboxImg.src = images[currentIndex].src;
      lightboxImg.alt = images[currentIndex].alt;
      lightboxCaption.textContent = images[currentIndex].caption;
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxImage();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  }

  // ─── Click Handlers ──────────────────────────
  galleryItems.forEach(function (item, i) {
    item.addEventListener('click', function () {
      openLightbox(i);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // Close on backdrop click
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox__img-wrapper')) {
      closeLightbox();
    }
  });

  // ─── Keyboard Navigation ─────────────────────
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrev();
        break;
      case 'ArrowRight':
        showNext();
        break;
    }
  });

  // ─── Touch / Swipe Navigation ────────────────
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    var diff = touchStartX - touchEndX;
    var threshold = 50;

    if (Math.abs(diff) < threshold) return;

    if (diff > 0) {
      showNext(); // Swipe left → next
    } else {
      showPrev(); // Swipe right → prev
    }
  }
})();
