
/* ====================================================
   イントロ：白フラッシュ → 暗い背景＋テキスト表示
   ==================================================== */
(function () {
  const cvs = document.getElementById('introCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let W, H;
  const resize = () => { W = cvs.width = innerWidth; H = cvs.height = innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  const easeOutExpo = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);

  /* ---- タイムライン（秒） ---- */
  const TF   = 0.0;   // フラッシュ開始（即時）
  const TP   = 0.55;  // 白フラッシュピーク
  const TD   = 3.6;   // テキスト完了 → メイン表示へ

  /* ---- テキスト制御 ---- */
  const triggers = [
    [TP + 0.10, () => document.getElementById('iBrand')?.classList.add('on')],
    [TP + 0.50, () => document.getElementById('iL1')?.classList.add('up')],
    [TP + 0.90, () => document.getElementById('iL2')?.classList.add('up')],
    [TP + 1.40, () => document.getElementById('iSub')?.classList.add('on')],
    [TD + 0.6,  () => {
      const introEl = document.getElementById('intro');
      if (!introEl) return;
      introEl.style.opacity = '0';
      document.body.style.overflow = '';
      setTimeout(() => { introEl.style.visibility = 'hidden'; }, 820);
    }],
  ];
  const fired = new Set();

  let t0 = null;

  function draw(ts) {
    if (!t0) t0 = ts;
    const t = (ts - t0) / 1000;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#030D0F'; ctx.fillRect(0, 0, W, H);

    // フラッシュ（白が瞬く）
    if (t < TP) {
      const p = easeOutExpo(t / TP);
      ctx.fillStyle = `rgba(255,255,255,${p * p * 0.95})`; ctx.fillRect(0, 0, W, H);
    }

    // 暗い背景＋グローが定着
    if (t >= TP) {
      const p = Math.min((t - TP) / 0.7, 1);
      if (t < TP + 0.3) {
        ctx.fillStyle = `rgba(255,255,255,${(1 - (t - TP) / 0.3) * 0.9})`; ctx.fillRect(0, 0, W, H);
      }
      ctx.fillStyle = `rgba(3,13,15,${p * 0.94})`; ctx.fillRect(0, 0, W, H);
      const glow = ctx.createRadialGradient(W * 0.15, H * 0.72, 0, W * 0.15, H * 0.72, W * 0.5);
      glow.addColorStop(0, `rgba(0,200,215,${p * 0.18})`);
      glow.addColorStop(1, 'rgba(0,200,215,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    }

    /* トリガー発火 */
    triggers.forEach(([time, fn], i) => {
      if (t >= time && !fired.has(i)) { fn(); fired.add(i); }
    });

    /* キャンバス終了 */
    if (t > TD + 1.8) {
      const fo = Math.min((t - TD - 1.8) / 0.8, 1);
      cvs.style.opacity = String(1 - fo);
      if (fo >= 1) return;
    }

    requestAnimationFrame(draw);
  }

  document.body.style.overflow = 'hidden';
  requestAnimationFrame(draw);
})();


/* イントロは自動遷移（約6秒）のため、スクロール操作ブロックは不要 */

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
