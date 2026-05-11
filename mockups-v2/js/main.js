

/* ====================================================
   イントロ：ホイール操作でフェード（ページスクロールは無効）
   ==================================================== */
const intro = document.getElementById('intro');
if (intro) {
  document.body.style.overflow = 'hidden';

  let accumulated = 0;
  const FADE_RANGE = 600;

  const onWheel = (e) => {
    accumulated = Math.min(accumulated + Math.abs(e.deltaY), FADE_RANGE);
    const ratio = accumulated / FADE_RANGE;
    intro.style.opacity = 1 - ratio;
    if (ratio >= 1) {
      intro.style.visibility = 'hidden';
      document.body.style.overflow = '';
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouch);
    }
  };

  let touchStartY = 0;
  const onTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
  const onTouch = (e) => {
    const delta = touchStartY - e.touches[0].clientY;
    if (delta > 0) onWheel({ deltaY: delta * 2 });
    touchStartY = e.touches[0].clientY;
  };

  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouch, { passive: true });
}

/* ====================================================
   ヒーロー背景スライドショー
   ==================================================== */
const bgSlideItems = document.querySelectorAll('.hero__bgSlide__item');

if (bgSlideItems.length > 0) {
  let current = 0;
  setInterval(() => {
    bgSlideItems[current].classList.remove('is-active');
    current = (current + 1) % bgSlideItems.length;
    bgSlideItems[current].classList.add('is-active');
  }, 4500);
}

/* ====================================================
   FAQ アコーディオン
   ==================================================== */
const faqTriggers = document.querySelectorAll('[data-faq-trigger]');

faqTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const isOpen = trigger.classList.toggle('is-open');
    const answer = trigger.nextElementSibling;
    answer.classList.toggle('is-open', isOpen);
  });
});

/* ====================================================
   スクロールアニメーション（Intersection Observer）
   ==================================================== */
const animationTargets = document.querySelectorAll(
  '.trust__item, .serviceCard, .caseCard, .concept__card, .faqList__item'
);

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

animationTargets.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
  observer.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.is-visible').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
});

/* is-visible クラスが付いたら表示 */
const styleSheet = document.styleSheets[0];
styleSheet.insertRule('.is-visible { opacity: 1 !important; transform: translateY(0) !important; }', styleSheet.cssRules.length);
