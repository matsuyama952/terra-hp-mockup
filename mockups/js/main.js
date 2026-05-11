/* ====================================================
   スクロール時ヘッダー影 + ユーティリティバー非表示
   ==================================================== */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.classList.add('is-scrolled');
  } else {
    header.classList.remove('is-scrolled');
  }
}, { passive: true });

/* ====================================================
   ハンバーガーメニュー
   ==================================================== */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('is-open');
  nav.classList.toggle('is-open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// ナビリンクをクリックしたらメニューを閉じる
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('is-open');
    nav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = '';
  });
});

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
