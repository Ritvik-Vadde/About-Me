const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
};

applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

const buttons = document.querySelectorAll('.button');
buttons.forEach((button) => {
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-2px) scale(1.03)';
  });
  button.addEventListener('mouseleave', () => {
    button.style.transform = '';
  });
});

const revealSections = document.querySelectorAll('.section.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
revealSections.forEach((section) => observer.observe(section));

const projectToggle = document.querySelector('.project-toggle-btn');
const projectCard = document.querySelector('.project-card');
if (projectToggle && projectCard) {
  projectToggle.addEventListener('click', () => {
    projectCard.classList.toggle('show-details');
    projectToggle.textContent = projectCard.classList.contains('show-details')
      ? 'Hide research details'
      : 'Show research details';
    // brief pop animation for minimal interactivity
    if (projectCard.classList.contains('show-details')) {
      projectCard.classList.add('pop-animate');
      setTimeout(() => projectCard.classList.remove('pop-animate'), 520);
    }
  });
}

const researchToggle = document.querySelector('.research-toggle-btn');
const researchDocument = document.querySelector('.research-document');
if (researchToggle && researchDocument) {
  researchToggle.addEventListener('click', () => {
    const isOpen = researchDocument.classList.toggle('show');
    document.body.classList.toggle('research-open', isOpen);
    document.documentElement.classList.toggle('research-open', isOpen);
    researchToggle.textContent = isOpen
      ? 'Hide the full research document'
      : 'Read the full research document';
    researchDocument.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    // add a pop animation when opening
    if (isOpen) {
      researchDocument.classList.add('pop-animate');
      setTimeout(() => researchDocument.classList.remove('pop-animate'), 520);
    }
  });
}

/* Modal popup handling */
const modalTriggers = document.querySelectorAll('[data-modal]');
const modals = document.querySelectorAll('.modal');

const openModal = (id) => {
  const modal = document.getElementById(id);
  if (!modal) return;
  const panel = modal.querySelector('.modal-panel');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  // animate
  panel.classList.add('pop-animate');
  setTimeout(() => panel.classList.remove('pop-animate'), 520);
  // simple focus management
  const focusEl = panel.querySelector('button, [href], input, textarea, select') || panel;
  focusEl.focus();
  modal.__previousActive = document.activeElement;
};

const closeModal = (modal) => {
  if (!modal) return;
  const panel = modal.querySelector('.modal-panel');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  panel.classList.add('popOut');
  setTimeout(() => panel.classList.remove('popOut'), 300);
  if (modal.__previousActive) modal.__previousActive.focus();
};

modalTriggers.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const id = btn.getAttribute('data-modal');
    openModal(id);
  });
});

modals.forEach((m) => {
  // close on overlay or close buttons
  m.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-modal-close') || e.target === m) {
      closeModal(m);
    }
  });
  // close on ESC
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && m.getAttribute('aria-hidden') === 'false') {
      closeModal(m);
    }
  });
  // capture form submit (demo only)
  const form = m.querySelector('.modal-form');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      // simple success feedback
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sent ✓';
      setTimeout(() => closeModal(m), 900);
    });
  }
});

// Apply 'popable' to commonly interactive elements for immediate micro-interactions
document.querySelectorAll('.button, .contact-card, .project-card, .skill-card, .hero-card, .project-badge, .hero-actions a').forEach((el) => {
  el.classList.add('popable');
  // ensure focusability for non-button anchors
  if (el.tagName === 'A') el.setAttribute('tabindex', '0');
});

// Add simple tooltips to hero action links if missing
const heroLinks = document.querySelectorAll('.hero-actions a');
if (heroLinks[0] && !heroLinks[0].hasAttribute('data-tooltip')) heroLinks[0].setAttribute('data-tooltip', 'View the electronics app');
if (heroLinks[1] && !heroLinks[1].hasAttribute('data-tooltip')) heroLinks[1].setAttribute('data-tooltip', 'Open research summary');

/* Theme selector handling (light/dark/retro) */
/* Mini quiz implementation */
const quizData = [
  {
    q: 'What grade is Ritvik in, and where does he go to school?',
    a: 'He is a sophomore (Grade 10) at Walnut Grove High School in Prosper, Texas — expected to graduate in 2028.'
  },
  {
    q: 'What does Ritvik do on VEX Robotics Team 2474V?',
    a: 'He is the team programmer, coding and testing robots in Python, HTML, and CSS, and helping improve automation and movement accuracy for competitions.'
  },
  {
    q: 'Has Ritvik led a robotics team before?',
    a: 'Yes — he previously held multiple leadership positions and led his robotics team in India to win 2 awards.'
  },
  {
    q: 'What two subjects did Ritvik tutor, and who did he teach?',
    a: 'He tutored middle schoolers in Algebra 1 and Geometry as a Math Tutor, and taught chess fundamentals as a Chess Tutor.'
  },
  {
    q: 'What sports and activities does Ritvik enjoy?',
    a: 'He is an active badminton player and also competed in basketball and swimming for his school.'
  },
  {
    q: "What's one of Ritvik's competition wins?",
    a: 'He won the Math Olympiad and was the SFO Chess champion / interschool champion (2023–2024).'
  },
  {
    q: 'What is Ritvik hoping to learn more about?',
    a: 'Leadership skills, entrepreneurship, and software development — he is a quick learner who is curious and motivated.'
  }
];

let quizIndex = 0;
const quizContent = document.getElementById('quizContent');
const quizPrev = document.getElementById('quizPrev');
const quizNext = document.getElementById('quizNext');
const quizShow = document.getElementById('quizShow');

const renderQuiz = () => {
  if (!quizContent) return;
  const item = quizData[quizIndex];
  quizContent.innerHTML = `
    <p style="font-weight:700; font-family:var(--font-display); font-size:0.8rem; text-transform:uppercase;">Question ${quizIndex+1} of ${quizData.length}</p>
    <p style="margin-top:10px; font-size:1.05rem;">${item.q}</p>
    <div id="quizAnswer" style="margin-top:12px; color:var(--muted); display:none;">${item.a}</div>`;
  // disable prev/next appropriately
  if (quizPrev) quizPrev.disabled = quizIndex === 0;
  if (quizNext) quizNext.disabled = quizIndex === quizData.length - 1;
  if (quizShow) quizShow.textContent = 'Show Answer';
};

if (quizPrev) quizPrev.addEventListener('click', () => { quizIndex = Math.max(0, quizIndex - 1); renderQuiz(); });
if (quizNext) quizNext.addEventListener('click', () => { quizIndex = Math.min(quizData.length - 1, quizIndex + 1); renderQuiz(); });
if (quizShow) quizShow.addEventListener('click', () => {
  const answerEl = document.getElementById('quizAnswer');
  if (!answerEl) return;
  if (answerEl.style.display === 'none') {
    answerEl.style.display = 'block';
    quizShow.textContent = 'Hide Answer';
  } else {
    answerEl.style.display = 'none';
    quizShow.textContent = 'Show Answer';
  }
});

// render first quiz when modal opens
const quizModal = document.getElementById('quizModal');
if (quizModal) {
  quizModal.addEventListener('click', (e) => {
    if (e.target === quizModal || e.target.hasAttribute('data-modal-close')) return;
  });
}

// Whenever a modal opens, if it's the quiz modal, reset and render
const originalOpenModal = openModal;
openModal = (id) => {
  originalOpenModal(id);
  if (id === 'quizModal') {
    quizIndex = 0;
    renderQuiz();
  }
};

/* ---------- Fun facts: floating button + panel ---------- */
const funFacts = [
  "I'm an 11th grader, but I already think in product features and user flows.",
  "I built this entire site from scratch — HTML, CSS, and JS, no templates.",
  "My long-term goal is to become an AI engineer who ships things people actually use.",
  "I play basketball and badminton to balance out all the screen time.",
  "Research is my favorite part of any project — I like understanding the 'why' before the 'how'.",
  "I rebuilt this portfolio more than once just to get the small details right.",
  "I'm most productive late at night with one tab open and zero notifications.",
  "The electronics recycling app started as a school idea and became a real obsession.",
  "I enjoy prototyping quickly in the browser to test ideas.",
  "I prefer simple, clear interfaces over flashy features.",
  "I often sketch UI ideas on paper before coding.",
  "I'm learning AI by building small projects that solve real problems.",
  "I like combining electronics knowledge with software to make useful tools.",
  "My favorite debugging tool is console.log — simple and effective.",
  "I like to keep a list of small projects to practice new skills.",
  "I sometimes turn school projects into portfolio pieces, like the recycling app."
];

let factIndex = -1;
const factButton = document.getElementById('factButton');
const factPanel = document.getElementById('factPanel');
const factPanelText = document.getElementById('factPanelText');
const factNextBtn = document.querySelector('.fact-next-btn');
const factCloseBtn = document.querySelector('.fact-panel-close');

const showNextFact = () => {
  let next = Math.floor(Math.random() * funFacts.length);
  if (funFacts.length > 1 && next === factIndex) {
    next = (next + 1) % funFacts.length;
  }
  factIndex = next;
  factPanelText.textContent = funFacts[factIndex];
};

const openFactPanel = () => {
  showNextFact();
  factPanel.setAttribute('aria-hidden', 'false');
  factButton.setAttribute('aria-expanded', 'true');
};

const closeFactPanel = () => {
  factPanel.setAttribute('aria-hidden', 'true');
  factButton.setAttribute('aria-expanded', 'false');
};

if (factButton && factPanel) {
  factButton.addEventListener('click', () => {
    const isOpen = factPanel.getAttribute('aria-hidden') === 'false';
    if (isOpen) {
      closeFactPanel();
    } else {
      openFactPanel();
    }
  });
  factNextBtn.addEventListener('click', showNextFact);
  factCloseBtn.addEventListener('click', closeFactPanel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && factPanel.getAttribute('aria-hidden') === 'false') {
      closeFactPanel();
    }
  });
  document.addEventListener('click', (e) => {
    const isOpen = factPanel.getAttribute('aria-hidden') === 'false';
    if (isOpen && !factPanel.contains(e.target) && e.target !== factButton) {
      closeFactPanel();
    }
  });
}

/* ---------- Scroll-triggered ambient fact bubble (gradually revealed as you scroll) ---------- */
const sectionFacts = {
  about: "Fun fact: I'm drawn to basic circuit work alongside code — debugging hardware feels a lot like debugging software.",
  experience: "Fun fact: on my VEX team I don't just write code — I help fine-tune automation and movement accuracy for competition runs.",
  skills: "Fun fact: time management is a skill I had to build the hard way, juggling tutoring, robotics, and multiple sports at once.",
  projects: "Fun fact: Robotics Club is where I get to mix mechanical builds with code integration — my favorite combo.",
  research: "Fun fact: when I tutored chess, I focused on building a strong base first, then layering skills one at a time.",
  contact: "Fun fact: I fix my mistakes quickly and try to bring that same quick-learner mindset to how I follow up with people.",
};

const scrollFactBubble = document.getElementById('scrollFactBubble');
const scrollFactText = document.getElementById('scrollFactText');
const scrollFactClose = document.querySelector('.scroll-fact-close');
const shownFacts = new Set();
let scrollFactTimer = null;

const showScrollFact = (text) => {
  if (!scrollFactBubble) return;
  scrollFactText.textContent = text;
  scrollFactBubble.setAttribute('aria-hidden', 'false');
  if (scrollFactTimer) clearTimeout(scrollFactTimer);
  scrollFactTimer = setTimeout(() => {
    scrollFactBubble.setAttribute('aria-hidden', 'true');
  }, 6000);
};

if (scrollFactBubble) {
  scrollFactClose.addEventListener('click', () => {
    scrollFactBubble.setAttribute('aria-hidden', 'true');
    if (scrollFactTimer) clearTimeout(scrollFactTimer);
  });

  const factObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting && sectionFacts[id] && !shownFacts.has(id)) {
          shownFacts.add(id);
          showScrollFact(sectionFacts[id]);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -20% 0px' }
  );

  Object.keys(sectionFacts).forEach((id) => {
    const el = document.getElementById(id);
    if (el) factObserver.observe(el);
  });
}

// Insert inline fun-fact badges under each section heading and reveal them when the section comes into view
Object.keys(sectionFacts).forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;
  // find or create a heading container
  let heading = el.querySelector('.section-heading');
  if (!heading) heading = el;
  const badge = document.createElement('span');
  badge.className = 'fun-fact';
  badge.textContent = sectionFacts[id];
  heading.appendChild(badge);
});

// Observe those badges to add .visible class when their section is scrolled into view
const badgeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const badge = entry.target.querySelector('.fun-fact');
    if (!badge) return;
    if (entry.isIntersecting) badge.classList.add('visible');
    else badge.classList.remove('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -20% 0px' });

Object.keys(sectionFacts).forEach((id) => {
  const el = document.getElementById(id);
  if (el) badgeObserver.observe(el);
});

/* ---------- Easter egg sprite popups ---------- */
const eggPopup = document.getElementById('eggPopup');
const eggPopupText = document.getElementById('eggPopupText');
let eggTimer = null;

if (eggPopup) {
  document.querySelectorAll('.sprite.egg').forEach((sprite) => {
    sprite.addEventListener('click', () => {
      const fact = sprite.getAttribute('data-fact');
      if (!fact) return;
      eggPopupText.textContent = fact;
      eggPopup.setAttribute('aria-hidden', 'false');
      if (eggTimer) clearTimeout(eggTimer);
      eggTimer = setTimeout(() => {
        eggPopup.setAttribute('aria-hidden', 'true');
      }, 4200);
    });
  });

  eggPopup.addEventListener('click', () => {
    eggPopup.setAttribute('aria-hidden', 'true');
    if (eggTimer) clearTimeout(eggTimer);
  });
}
