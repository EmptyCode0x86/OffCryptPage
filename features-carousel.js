/**
 * Features carousel — horizontal scroll-snap for #features only.
 * Arrows, dots, keyboard; native swipe via scroll-snap.
 */
(function () {
  'use strict';

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initCarousel(root) {
    const track = root.querySelector('.features-carousel-track');
    const prevBtn = root.querySelector('.features-carousel-btn.prev');
    const nextBtn = root.querySelector('.features-carousel-btn.next');
    const dotsHost = root.querySelector('.features-carousel-dots');
    if (!track || !prevBtn || !nextBtn || !dotsHost) return;

    const cards = () => Array.from(track.querySelectorAll('.feature-card'));

    function cardStep() {
      const list = cards();
      if (!list.length) return track.clientWidth;
      const first = list[0];
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return first.getBoundingClientRect().width + gap;
    }

    function maxScroll() {
      return Math.max(0, track.scrollWidth - track.clientWidth);
    }

    function scrollToIndex(index, instant) {
      const list = cards();
      if (!list.length) return;
      const i = Math.max(0, Math.min(index, list.length - 1));
      const left = list[i].offsetLeft - track.offsetLeft;
      track.scrollTo({
        left,
        behavior: instant || prefersReducedMotion() ? 'auto' : 'smooth'
      });
    }

    function nearestIndex() {
      const list = cards();
      if (!list.length) return 0;
      const left = track.scrollLeft;
      let best = 0;
      let bestDist = Infinity;
      list.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - track.offsetLeft - left);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    }

    function pageCount() {
      const list = cards();
      if (!list.length) return 0;
      const step = cardStep();
      if (step <= 0) return list.length;
      const visible = Math.max(1, Math.round(track.clientWidth / step));
      return Math.max(1, list.length - visible + 1);
    }

    function rebuildDots() {
      const pages = pageCount();
      dotsHost.innerHTML = '';
      for (let i = 0; i < pages; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'features-carousel-dot';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', 'Go to feature group ' + (i + 1));
        btn.setAttribute('aria-selected', 'false');
        btn.addEventListener('click', () => scrollToIndex(i));
        dotsHost.appendChild(btn);
      }
      syncUi();
    }

    function syncUi() {
      const index = nearestIndex();
      const max = maxScroll();
      const atStart = track.scrollLeft <= 2;
      const atEnd = track.scrollLeft >= max - 2;
      prevBtn.disabled = atStart;
      nextBtn.disabled = atEnd;

      const dots = dotsHost.querySelectorAll('.features-carousel-dot');
      const pages = dots.length;
      const pageIndex = Math.min(index, Math.max(0, pages - 1));
      dots.forEach((dot, i) => {
        const active = i === pageIndex;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    prevBtn.addEventListener('click', () => {
      track.scrollBy({
        left: -cardStep(),
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
    });

    nextBtn.addEventListener('click', () => {
      track.scrollBy({
        left: cardStep(),
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
    });

    let scrollRaf = 0;
    track.addEventListener(
      'scroll',
      () => {
        if (scrollRaf) cancelAnimationFrame(scrollRaf);
        scrollRaf = requestAnimationFrame(syncUi);
      },
      { passive: true }
    );

    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevBtn.click();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextBtn.click();
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        const list = cards();
        scrollToIndex(list.length - 1);
      }
    });

    if (!track.hasAttribute('tabindex')) {
      track.setAttribute('tabindex', '0');
    }

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        rebuildDots();
        syncUi();
      }, 100);
    };
    window.addEventListener('resize', onResize);

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(onResize);
      ro.observe(track);
    }

    rebuildDots();
    syncUi();
  }

  function boot() {
    document.querySelectorAll('[data-features-carousel]').forEach(initCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
