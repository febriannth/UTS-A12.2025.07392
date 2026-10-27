'use strict';

/* =========================================================
   VINZ FITNESS GYM - Landing Page
   Data, rendering, carousel, navigasi, dan validasi form
   ========================================================= */

/* ---------- Data ---------- */
const SERVICES = [
  {
    title: 'THe GYM',
    image: 'assets/img/Cards.png',
    text: 'Everything from traditional iron plates to modern Nautilus equipment perfectly suited to any athlete.'
  },
  {
    title: 'CARDIO',
    image: 'assets/img/tread.jpeg',
    text: 'The latest range of cardiovascular equipment, Ideal for your cardio routine or as a pre-training warm-up!'
  },
  {
    title: 'Classes',
    image: 'assets/img/class.png',
    text: 'We offer a wide range of classes, boot camps and one to one personal training sessions.'
  },
  {
    title: 'cafe',
    image: 'assets/img/vinzcof.png',
    text: 'We provide house-made barista-style coffees, protein shakes, pre-workouts, intra-workouts and more.'
  }
];

/* Nama dan jabatan coach */
const TEAM = Array.from({ length: 1 }, (_, i) => ({
  name: 'Syofiq',
  role: 'Owner & Trainer',
  photo: `assets/img/coach1.jpeg`,
}));

/* Review. */
const REVIEWS = [
  {
    name: 'Jason King',
    role: 'Member since 2025',
    photo: 'assets/img/profile.jpeg',
    text: "recommended, harganya mureh."
  },
  {
    name: 'Jeki',
    role: 'Member since 2024',
    photo: 'assets/img/profile.jpeg',
    text: 'Alatnya lengkap, ga terlalu rame.'
  },
  {
    name: ' Roy',
    role: 'Member since 2025',
    photo: 'assets/img/pprofile.jpeg',
    text: 'Josjis.'
  }
];


const SOCIALS = [
  { name: 'Facebook', icon: 'assets/icons/facebook.svg', letter: 'f', href: '#' },
  { name: 'Instagram', icon: 'assets/icons/instagram.svg', letter: 'ig', href: '#' },
  { name: 'X', icon: 'assets/icons/x.svg', letter: 'X', href: '#' },
  { name: 'YouTube', icon: 'assets/icons/youtube.svg', letter: 'yt', href: '#' }
];

/* ---------- Helpers ---------- */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function create(tag, className = '', attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Render: What we offer ---------- */
function renderServices() {
  const wrap = $('#cards');
  SERVICES.forEach(({ title, image, text }) => {
    const card = create('article', 'card reveal');
    card.innerHTML = `
      <img class="card__img" src="${image}" alt="">
      <div class="card__text">
        <h3>${title}</h3>
        <p>${text}</p>
      </div>`;
    wrap.appendChild(card);
  });
}

/* ---------- Render: Team ---------- */
function renderTeam() {
  const grid = $('#teamGrid');
  TEAM.forEach(({ name, role, photo, sign }) => {
    const member = create('article', 'member reveal');
    member.innerHTML = `
      <div class="member__photo">
        <img class="photo" src="${photo}" alt="${name}, ${role}">
        ${sign ? `<img class="member__sign" src="${sign}" alt="">` : ''}
      </div>
      <div>
        <strong>${name}</strong>
        <span>${role}</span>
      </div>`;
    grid.appendChild(member);
  });
}

/* ---------- Render: Socials ---------- */
function renderSocials() {
  const wrap = $('#socials');
  SOCIALS.forEach(({ name, icon, letter, href }) => {
    const link = create('a', 'social', { href, 'aria-label': name, 'data-letter': letter });
    link.innerHTML = `<img src="${icon}" alt="">`;
    wrap.appendChild(link);
  });
}

/* ---------- Review carousel ---------- */
const carousel = {
  index: 0,
  timer: null,
  card: null,
  delay: 6000,

  init() {
    this.card = $('#reviewCard');
    this.renderAvatars();
    this.show(0);
    $('#nextReview').addEventListener('click', () => {
      this.next();
      this.restart();
    });
    this.card.addEventListener('mouseenter', () => this.stop());
    this.card.addEventListener('mouseleave', () => this.start());
    this.bindKeyboard();
    this.bindSwipe();
    this.start();
  },

  renderAvatars() {
    const wrap = $('#avatars');
    REVIEWS.forEach(({ photo, name }) => {
      const img = create('img', 'avatar', { src: photo, alt: name });
      wrap.appendChild(img);
    });
  },

  show(i) {
    this.index = (i + REVIEWS.length) % REVIEWS.length;
    const { name, role, photo, text } = REVIEWS[this.index];
    this.card.innerHTML = `
      <span class="review-card__stars" aria-label="5 out of 5 stars">★★★★★</span>
      <blockquote>"${text}"</blockquote>
      <div class="review-card__by">
        <img class="avatar" src="${photo}" alt="${name}">
        <div>
          <span class="review-card__name">${name}</span>
          <span class="review-card__role">${role}</span>
        </div>
      </div>
      <div class="dots" role="tablist"></div>`;
    this.renderDots();
  },

  renderDots() {
    const dots = $('.dots', this.card);
    REVIEWS.forEach((_, i) => {
      const dot = create('button', 'dot' + (i === this.index ? ' is-active' : ''), {
        type: 'button',
        role: 'tab',
        'aria-label': `Review ${i + 1}`,
        'aria-selected': String(i === this.index)
      });
      dot.addEventListener('click', () => {
        this.show(i);
        this.restart();
      });
      dots.appendChild(dot);
    });
  },

  next() {
    this.show(this.index + 1);
  },

  prev() {
    this.show(this.index - 1);
  },

  start() {
    if (reducedMotion) return;
    this.stop();
    this.timer = setInterval(() => this.next(), this.delay);
  },

  stop() {
    clearInterval(this.timer);
  },

  restart() {
    this.stop();
    this.start();
  },

  bindKeyboard() {
    document.addEventListener('keydown', (event) => {
      if (!this.card.contains(document.activeElement)) return;
      if (event.key === 'ArrowRight') this.next();
      if (event.key === 'ArrowLeft') this.prev();
    });
  },

  bindSwipe() {
    let startX = 0;
    this.card.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });
    this.card.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) < 40) return;
      diff < 0 ? this.next() : this.prev();
      this.restart();
    }, { passive: true });
  }
};

/* ---------- Navigation ---------- */
function initNav() {
  const nav = $('#nav');
  const toggle = $('#navToggle');
  const links = $('#navLinks');

  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setOpen = (open) => {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!links.classList.contains('is-open')));
  $$('a', links).forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));

  highlightActiveLink();
}

function highlightActiveLink() {
  const anchors = $$('.nav__links a:not(.btn)');
  const targets = anchors
    .map((a) => $(a.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      anchors.forEach((a) => {
        a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  targets.forEach((section) => observer.observe(section));
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window) || reducedMotion) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  items.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 90}ms`;
    observer.observe(el);
  });
}

/* ---------- Promo code ---------- */
function initPromoCode() {
  const button = $('#copyCode');
  const original = button.textContent;

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(original);
      button.textContent = 'COPIED!';
    } catch (error) {
      button.textContent = 'PRESS CTRL+C';
      const range = document.createRange();
      range.selectNodeContents(button);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
    setTimeout(() => (button.textContent = original), 1800);
  });
}

/* ---------- Gambar yang belum tersedia ---------- */
function initImageFallback() {
  document.addEventListener('error', (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || img.classList.contains('is-missing')) return;
    img.classList.add('is-missing');

    // Ikon kecil diganti huruf singkat supaya tombol tetap terbaca
    const letter = img.dataset.fallback || img.closest('.social')?.dataset.letter;
    if (letter) {
      img.insertAdjacentText('afterend', letter);
      img.style.display = 'none';
    }
  }, true);

  $$('img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) img.dispatchEvent(new Event('error'));
  });
}

/* ---------- Scroll progress & back to top ---------- */
function initScrollUi() {
  const bar = $('#progress');
  const toTop = $('#toTop');
  let ticking = false;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${ratio})`;
    toTop.hidden = window.scrollY < 600;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });
  update();
}

/* ---------- Smooth scroll untuk link anchor ---------- */
function initAnchors() {
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      const target = id.length > 1 ? $(id) : null;
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });
}

/* ---------- Pill hero membawa ke bagian layanan ---------- */
function initPills() {
  $$('.pill').forEach((pill) => {
    pill.tabIndex = 0;
    pill.setAttribute('role', 'link');
    const go = () => $('#classes').scrollIntoView({ behavior: 'smooth' });
    pill.addEventListener('click', go);
    pill.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && go());
  });
}

/* ---------- Form "Get in touch" (Bootstrap): Nama, Alamat, Kota, Hobi ---------- */
function initRegister() {
  const form = $('#regForm');
  if (!form) return;
  const result = $('#regResult');
  const hobiError = $('#regHobiError');

  const rules = {
    regName: (v) => v.trim().length >= 3,
    regAddress: (v) => v.trim().length >= 5,
    regCity: (v) => v !== ''
  };

  const checkField = (el) => {
    const valid = rules[el.id](el.value);
    el.classList.toggle('is-invalid', !valid);
    el.classList.toggle('is-valid', valid);
    return valid;
  };

  const checkHobi = () => {
    const chosen = $$('input[name="hobi"]:checked', form);
    hobiError.classList.toggle('d-block', chosen.length === 0);
    return chosen.map((c) => c.value);
  };

  Object.keys(rules).forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => el.classList.contains('is-invalid') && checkField(el));
    el.addEventListener('change', () => el.classList.contains('is-invalid') && checkField(el));
  });
  $$('input[name="hobi"]', form).forEach((c) => c.addEventListener('change', checkHobi));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let firstInvalid = null;
    Object.keys(rules).forEach((id) => {
      const el = document.getElementById(id);
      if (!checkField(el) && !firstInvalid) firstInvalid = el;
    });
    const hobi = checkHobi();
    if (firstInvalid) return firstInvalid.focus();
    if (hobi.length === 0) return;

    // textContent dipakai agar input pengguna tidak dieksekusi sebagai HTML
    const lines = [
      ['Nama', form.elements.nama.value.trim()],
      ['Alamat', form.elements.alamat.value.trim()],
      ['Kota', form.elements.kota.value],
      ['Hobi', hobi.join(', ')]
    ];
    result.replaceChildren();
    const title = create('strong');
    title.textContent = 'Pendaftaran berhasil! Data Anda:';
    result.appendChild(title);
    const list = create('ul', 'mb-0 mt-2');
    lines.forEach(([label, value]) => {
      const li = create('li');
      li.textContent = `${label}: ${value}`;
      list.appendChild(li);
    });
    result.appendChild(list);
    result.hidden = false;
  });

  form.addEventListener('reset', () => {
    $$('.is-valid, .is-invalid', form).forEach((el) => el.classList.remove('is-valid', 'is-invalid'));
    hobiError.classList.remove('d-block');
    result.hidden = true;
  });
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initRegister();
  initScrollUi();
  initAnchors();
  initPills();
  renderServices();
  renderTeam();
  renderSocials();
  carousel.init();
  initNav();
  initReveal();
  initPromoCode();
  initImageFallback();
});
