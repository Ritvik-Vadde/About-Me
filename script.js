/* ============ Theme toggle ============ */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  if (themeToggle) themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  localStorage.setItem('theme', theme);
};

applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ============ Mobile menu ============ */
const navMenuToggle = document.getElementById('navMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (navMenuToggle && mobileMenu) {
  const closeMenu = () => {
    navMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('data-open', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  };
  navMenuToggle.addEventListener('click', () => {
    const isOpen = navMenuToggle.getAttribute('aria-expanded') === 'true';
    navMenuToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.setAttribute('data-open', String(!isOpen));
    mobileMenu.setAttribute('aria-hidden', String(isOpen));
  });
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
}

/* ============ Scroll reveal for sections ============ */
const revealSections = document.querySelectorAll('.section');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealSections.forEach((section) => revealObserver.observe(section));

/* ============ Expand / collapse toggles (project + research) ============ */
document.querySelectorAll('[data-toggle]').forEach((btn) => {
  const targetId = btn.getAttribute('data-toggle');
  const target = document.getElementById(targetId);
  if (!target) return;

  const showLabel = btn.textContent.trim();
  const hideLabel = showLabel.replace(/^Show|^Read/, (m) => (m === 'Show' ? 'Hide' : 'Hide'));

  btn.addEventListener('click', () => {
    const isHidden = target.hasAttribute('hidden');
    if (isHidden) {
      target.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
      btn.textContent = hideLabel;
    } else {
      target.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = showLabel;
    }
  });
});

/* ============ Circuit trace spine ============
   Draws a single dashed path through the left margin of each
   data-node section, with a via-dot at each node that lights up
   (copper) as that section enters the viewport.
*/
const traceSvg = document.getElementById('trace');
const tracePath = document.getElementById('tracePath');
const nodeSections = Array.from(document.querySelectorAll('[data-node]'));

let traceNodes = [];

function layoutTrace() {
  if (!traceSvg || !tracePath || window.innerWidth <= 880) return;

  // remove old node dots
  traceNodes.forEach((n) => n.remove());
  traceNodes = [];

  const docHeight = document.documentElement.scrollHeight;
  traceSvg.setAttribute('width', '100%');
  traceSvg.setAttribute('height', docHeight);
  traceSvg.style.height = docHeight + 'px';

  const x = 32; // fixed x offset from left edge of the page
  let d = '';

  nodeSections.forEach((section, i) => {
    const rect = section.getBoundingClientRect();
    const top = rect.top + window.scrollY + 6;

    d += i === 0 ? `M ${x} ${top}` : ` L ${x} ${top}`;

    const dot = document.createElement('div');
    dot.className = 'trace-node';
    dot.style.left = x + 'px';
    dot.style.top = top + 'px';
    dot.dataset.nodeFor = section.id;
    document.body.appendChild(dot);
    traceNodes.push(dot);
  });

  tracePath.setAttribute('d', d);
}

window.addEventListener('load', layoutTrace);
window.addEventListener('resize', () => requestAnimationFrame(layoutTrace));
// recompute after content/images settle and after reveal transitions
setTimeout(layoutTrace, 300);
setTimeout(layoutTrace, 1200);

const nodeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const dot = traceNodes.find((n) => n.dataset.nodeFor === entry.target.id);
      if (!dot) return;
      if (entry.isIntersecting) {
        dot.classList.add('is-active');
      } else {
        dot.classList.remove('is-active');
      }
    });
  },
  { threshold: 0.3, rootMargin: '-10% 0px -40% 0px' }
);
nodeSections.forEach((s) => nodeObserver.observe(s));
