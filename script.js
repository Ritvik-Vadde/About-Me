/* ============ Theme toggle ============ */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');

const themeColorMeta = document.getElementById('themeColorMeta');

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  if (themeToggle) themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  if (themeColorMeta) themeColorMeta.setAttribute('content', theme === 'dark' ? '#11140F' : '#F1EEE3');
  localStorage.setItem('theme', theme);
};

applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ============ Custom cursor ============ */
const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;

if (supportsFinePointer) {
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  const cursorRing = document.createElement('div');
  cursorRing.className = 'cursor-ring';
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);
  root.classList.add('custom-cursor-active');

  const reducedMotionCursor = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let cursorRevealed = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    if (reducedMotionCursor) {
      cursorRing.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }
    if (!cursorRevealed) {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
      cursorRevealed = true;
    }
  });

  if (!reducedMotionCursor) {
    function followRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(followRing);
    }
    requestAnimationFrame(followRing);
  }

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    if (cursorRevealed) {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    }
  });
  document.addEventListener('mousedown', () => cursorRing.classList.add('is-pressed'));
  document.addEventListener('mouseup', () => cursorRing.classList.remove('is-pressed'));

  const interactiveSelector = 'a, button, [data-toggle], [role="button"], input, textarea, select';
  document.querySelectorAll(interactiveSelector).forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
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

/* ============ Stat counters (count up on scroll) ============ */
const statNumbers = document.querySelectorAll('.stat-number');
const prefersReducedMotionGlobal = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCount(el) {
  const target = parseInt(el.dataset.target, 10) || 0;
  if (prefersReducedMotionGlobal) {
    el.textContent = target;
    return;
  }
  const duration = 900;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(step);
}

if (statNumbers.length) {
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statNumbers.forEach((el) => statObserver.observe(el));
}

/* ============ Skill bars (fill on scroll) ============ */
const skillBars = document.querySelectorAll('.skill-bar');

if (skillBars.length) {
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector('.skill-bar-fill');
          const level = entry.target.dataset.level || '0';
          if (fill) {
            requestAnimationFrame(() => { fill.style.width = level + '%'; });
          }
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillBars.forEach((bar) => skillObserver.observe(bar));
}


const terminalBody = document.getElementById('terminalBody');
const codeResult = document.getElementById('codeResult');

function runCodeAnimation() {
  if (!terminalBody) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lines = Array.from(terminalBody.querySelectorAll('.code-line:not(.code-line--result):not(.code-line--cursor)'));

  // Parse token data and build empty spans up front.
  const parsedLines = lines.map((line) => {
    let tokens = [];
    try {
      tokens = JSON.parse(line.dataset.tokens || '[]');
    } catch (e) {
      tokens = [];
    }
    line.textContent = '';
    const spans = tokens.map((tok) => {
      const span = document.createElement('span');
      span.className = 'tok-' + (tok.c || 'pln');
      line.appendChild(span);
      return { span, text: tok.t };
    });
    return spans;
  });

  if (prefersReducedMotion) {
    parsedLines.forEach((spans) => spans.forEach(({ span, text }) => { span.textContent = text; }));
    if (codeResult) {
      codeResult.removeAttribute('hidden');
      codeResult.classList.add('is-visible');
    }
    return;
  }

  let lineIdx = 0;
  let tokenIdx = 0;
  let charIdx = 0;

  function typeStep() {
    if (lineIdx >= parsedLines.length) {
      if (codeResult) {
        setTimeout(() => {
          codeResult.removeAttribute('hidden');
          requestAnimationFrame(() => codeResult.classList.add('is-visible'));
        }, 280);
      }
      return;
    }

    const spans = parsedLines[lineIdx];

    if (spans.length === 0) {
      // blank line — just a short pause
      lineIdx += 1;
      setTimeout(typeStep, 160);
      return;
    }

    const current = spans[tokenIdx];
    if (charIdx < current.text.length) {
      current.span.textContent += current.text[charIdx];
      charIdx += 1;
      setTimeout(typeStep, 26);
    } else {
      tokenIdx += 1;
      charIdx = 0;
      if (tokenIdx >= spans.length) {
        lineIdx += 1;
        tokenIdx = 0;
        setTimeout(typeStep, 200);
      } else {
        setTimeout(typeStep, 26);
      }
    }
  }

  typeStep();
}

if (terminalBody) {
  const codeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCodeAnimation();
          codeObserver.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );
  codeObserver.observe(terminalBody);
}

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
