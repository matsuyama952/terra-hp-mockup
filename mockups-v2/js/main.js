
/* ====================================================
   イントロ：ターコイズブロブ → フラッシュ → テキスト表示
   cylinder-intro.html のアニメーションを移植
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

  /* ---- ブロブ ---- */
  class Blob {
    constructor(i, n) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.5;
      this.x  = W / 2 + Math.cos(a) * W * 0.22;
      this.y  = H / 2 + Math.sin(a) * H * 0.22;
      this.vx = (Math.random() - 0.5) * 2.2;
      this.vy = (Math.random() - 0.5) * 2.2;
      this.r  = W * (0.14 + Math.random() * 0.18);
      this.delay = i * 0.14;
      this.scale = 0;
      const palette = [
        [0,200,215],[0,229,240],[0,143,155],
        [77,220,235],[0,180,195],[26,201,218],
      ];
      [this.r0, this.g0, this.b0] = palette[i % palette.length];
    }
    update(t) {
      const e = t - this.delay;
      if (e < 0) return;
      this.scale = Math.min(easeOutExpo(e / 1.6), 1);
      if (this.scale >= 1) {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
      }
    }
    draw(alpha = 1) {
      const r = this.r * this.scale;
      if (r <= 0) return;
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
      g.addColorStop(0,    `rgba(${this.r0},${this.g0},${this.b0},${0.78 * alpha})`);
      g.addColorStop(0.55, `rgba(${this.r0},${this.g0},${this.b0},${0.42 * alpha})`);
      g.addColorStop(1,    `rgba(${this.r0},${this.g0},${this.b0},0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
    }
  }

  const N = 7;
  const blobs = Array.from({ length: N }, (_, i) => new Blob(i, N));

  /* ---- タイムライン（秒） ---- */
  const TF   = 1.3;   // フラッシュ開始
  const TP   = 2.05;  // ピーク白 → 直後にテキスト登場
  const TRING = 3.4;  // ターコイズリング拡散（テキスト表示後）
  const TD   = 5.0;   // テキスト完了 → メイン表示へ

  /* ---- テキスト制御（フラッシュピーク直後から） ---- */
  const triggers = [
    [TP + 0.08, () => document.getElementById('iBrand')?.classList.add('on')],
    [TP + 0.48, () => document.getElementById('iL1')?.classList.add('up')],
    [TP + 0.88, () => document.getElementById('iL2')?.classList.add('up')],
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

    // Phase1: ブロブ
    if (t < TF) {
      blobs.forEach(b => { b.update(t); b.draw(); });
    }

    // Phase2: フラッシュ
    if (t >= TF && t < TP) {
      blobs.forEach(b => { b.update(t); b.draw(); });
      const p = easeOutExpo((t - TF) / (TP - TF));
      ctx.fillStyle = `rgba(0,220,235,${p * 0.7})`; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = `rgba(255,255,255,${p * p * 0.92})`; ctx.fillRect(0, 0, W, H);
    }

    // Phase3: フラッシュ後 → 暗い背景＋グロー（テキスト登場）
    if (t >= TP) {
      const p = Math.min((t - TP) / 0.9, 1);
      // 白フラッシュの残光を素早く消す
      if (t < TP + 0.28) {
        ctx.fillStyle = `rgba(255,255,255,${(1 - (t - TP) / 0.28) * 0.88})`; ctx.fillRect(0, 0, W, H);
      }
      ctx.fillStyle = `rgba(3,13,15,${p * 0.92})`; ctx.fillRect(0, 0, W, H);
      const glow = ctx.createRadialGradient(W * 0.15, H * 0.72, 0, W * 0.15, H * 0.72, W * 0.5);
      glow.addColorStop(0, `rgba(0,200,215,${p * 0.18})`);
      glow.addColorStop(1, 'rgba(0,200,215,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    }

    // Phase4: ターコイズリング拡散（テキスト表示後）
    if (t >= TRING && t < TRING + 0.55) {
      const p = easeOutExpo((t - TRING) / 0.55);
      const rr = p * Math.hypot(W, H) * 0.75;
      const ga = ctx.createRadialGradient(W/2, H/2, rr * 0.55, W/2, H/2, rr);
      ga.addColorStop(0,    'rgba(0,200,215,0)');
      ga.addColorStop(0.65, `rgba(0,200,215,${(1 - p) * 0.55})`);
      ga.addColorStop(1,    'rgba(0,200,215,0)');
      ctx.fillStyle = ga; ctx.fillRect(0, 0, W, H);
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
