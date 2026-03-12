/* ============================================
   NKHUB — JavaScript
   Matrix rain, typing, scroll reveals,
   terminal animation, counters
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- CUSTOM CURSOR ---
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  const follower = document.createElement('div');
  follower.id = 'custom-cursor-follower';
  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    // Follower with slight delay
    setTimeout(() => {
      follower.style.left = e.clientX + 'px';
      follower.style.top = e.clientY + 'px';
    }, 50);
  });

  document.querySelectorAll('a, button, .package-card, .service-card, .hosting-card, .portfolio-card, .faq-question').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('cursor-active'));
    el.addEventListener('mouseleave', () => follower.classList.remove('cursor-active'));
  });

  // --- PARALLAX ORBS ---
  document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.pageX) / 40;
    const y = (window.innerHeight / 2 - e.pageY) / 40;
    document.querySelectorAll('.hero-orb').forEach(orb => {
      orb.style.transform = `translate(${x}px, ${y}px)`;
    });
  });

  // --- FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('item-active');

      // Close other items
      faqItems.forEach(i => i.classList.remove('item-active'));

      // Toggle current
      if (!isActive) {
        item.classList.add('item-active');
      }
    });
  });

  initMatrixRain();
  initTypingAnimation();
  initScrollReveal();
  initNavbarScroll();
  initCounterAnimation();
  initTerminalAnimation();
  initSmoothScroll();
});

/* ── Matrix Rain Canvas ── */
function initMatrixRain() {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = '0110001010111000101001110010101ABCDEF<>/{}[]';
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(5, 5, 8, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 215, 0, 0.2)'; // Electric Gold pulse
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 50);
}

/* ── Typing Animation ── */
function initTypingAnimation() {
  const el = document.querySelector('#heroTyping .typing-text');
  if (!el) return;

  const phrases = [
    'NKHUB: Eccellenza in Software Engineering & Design',
    'Siti Web Premium & Web App ad Alte Prestazioni',
    'Architetture Software Sicure, Veloci e Scalabili',
    'Massimizza il valore del tuo business digitale 💎',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let speed = 50;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex);
      charIndex--;
      speed = 25;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      speed = 55;
    }

    if (!isDeleting && charIndex === current.length) {
      speed = 2500;
      isDeleting = true;
    } else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      charIndex = 0;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 800);
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/* ── Navbar Scroll ── */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 60) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ── Counter Animation ── */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = `${prefix}${current}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = `${prefix}${target}${suffix}`;
    }
  }

  requestAnimationFrame(update);
}

/* ── Terminal Animation ── */
function initTerminalAnimation() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const lines = [
    { type: 'prompt', text: '$ load_requirements --target generic_business' },
    { type: 'output', text: '→ Scansione requisiti per Siti Vetrina e Dashboard Aziendali...' },
    { type: 'output', text: '→ OK. Analisi completata in 0.1s' },
    { type: 'output', text: '' },
    { type: 'prompt', text: '$ deploy_features --engineer_mode' },
    { type: 'success', text: '✓ Architettura server 200% più veloce rispetto ai CMS comuni' },
    { type: 'success', text: '✓ Codice strutturato Next.js per SEO e performance tecniche' },
    { type: 'success', text: '✓ Sicurezza di livello bancario e Data Structure personalizzabili' },
    { type: 'success', text: '✓ Hosting basato su Node.js e Database MySql configurato su misura' },
    { type: 'output', text: '' },
    { type: 'prompt', text: '$ start.sh' },
    { type: 'highlight', text: '💎 Sistema NKHUB Pronto. Prenota ora la tua call strategica!' },
  ];

  let lineIndex = 0;
  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateLines();
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(body);

  function animateLines() {
    if (lineIndex >= lines.length) return;

    const line = lines[lineIndex];
    const div = document.createElement('div');
    div.classList.add('terminal-line');

    if (line.type === 'prompt') {
      div.innerHTML = `<span class="terminal-prompt">$ </span><span class="terminal-command">${escapeHtml(line.text.replace('$ ', ''))}</span>`;
    } else if (line.type === 'success') {
      div.innerHTML = `<span class="terminal-success">${escapeHtml(line.text)}</span>`;
    } else if (line.type === 'highlight') {
      div.innerHTML = `<span class="terminal-highlight">${escapeHtml(line.text)}</span>`;
    } else {
      div.innerHTML = `<span class="terminal-output">${escapeHtml(line.text) || '&nbsp;'}</span>`;
    }

    body.appendChild(div);

    // Trigger animation
    requestAnimationFrame(() => {
      div.classList.add('visible');
    });

    lineIndex++;
    const delay = line.type === 'prompt' ? 600 : line.text === '' ? 200 : 350;
    setTimeout(animateLines, delay);
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ── Smooth Scroll ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });

        // Close mobile menu
        const navLinks = document.getElementById('navLinks');
        const hamburger = document.getElementById('hamburger');
        if (navLinks) navLinks.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
      }
    });
  });
}

/* ── Mobile Menu Toggle ── */
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
}
