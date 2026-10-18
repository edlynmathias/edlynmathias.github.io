/**
 * app.js - Personal Portfolio Interactive Engine
 * Handles:
 * 1. Flat green plant cursor physics & blooming interaction
 * 2. Navigation smooth scroll & active scrollspy
 * 3. Skill pill copy interaction
 * 4. Experience Content & Design deliverables grid
 * 5. Projects filter
 * 6. Course Certification modal previewer (view only)
 * 7. Extracurricular activity image lightbox
 * 8. Contact direct actions & message form
 * 9. Sidebar scroll tracker progress rail
 * 10. Scroll-triggered reveal animations, hero parallax & navbar state
 * 11. Blurred image backdrops so photos are never awkwardly cropped
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initPlantCursor();
  initNavigation();
  initSidebarScrollTracker();
  initSkillsFilter();
  initDesignGallery();
  initProjectsFilter();
  initCertificateModal();
  initExtracurricularLightbox();
  initContactActions();
  initImageBackdrops();
  initScrollEffects();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. FLAT GREEN PLANT CURSOR ENGINE
   -------------------------------------------------------------------------- */
function initPlantCursor() {
  const tracker = document.getElementById('plant-cursor-tracker');
  if (!tracker) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(renderCursor);
    }
  });

  function renderCursor() {
    currentX += (mouseX - currentX) * 0.45;
    currentY += (mouseY - currentY) * 0.45;
    tracker.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

    if (Math.abs(mouseX - currentX) > 0.1 || Math.abs(mouseY - currentY) > 0.1) {
      requestAnimationFrame(renderCursor);
    } else {
      isMoving = false;
    }
  }

  // Hover reactive bloom on interactive elements
  const interactives = 'a, button, input, textarea, select, .project-card, .cert-card, .extra-img-frame, .skill-pill, .deliverable-tile';
  document.addEventListener('mouseover', (e) => {
    tracker.classList.toggle('hovering', !!e.target.closest(interactives));
  });

  // Sprout particle effect on mouse click
  window.addEventListener('mousedown', (e) => {
    tracker.classList.add('clicking');
    spawnSproutParticle(e.clientX, e.clientY);
  });

  window.addEventListener('mouseup', () => {
    tracker.classList.remove('clicking');
  });

  function spawnSproutParticle(x, y) {
    const leaf = document.createElement('div');
    leaf.className = 'sprout-particle';
    leaf.innerHTML = '<svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M16 26C16 19 14.5 13 8 11C8 18 11.5 24 16 26Z" fill="#22c55e"/><path d="M16 26C16 17 19.5 8 26 7C26 15 22 23 16 26Z" fill="#4ade80"/><path d="M16 29V24" stroke="#166534" stroke-width="2.5"/></svg>';
    leaf.style.left = `${x}px`;
    leaf.style.top = `${y}px`;
    leaf.style.setProperty('--tx', `${(Math.random() - 0.5) * 40}px`);
    leaf.style.setProperty('--ty', `${-20 - Math.random() * 30}px`);
    document.body.appendChild(leaf);
    setTimeout(() => leaf.remove(), 700);
  }
}

/* --------------------------------------------------------------------------
   2. NAVIGATION & SCROLLSPY
   -------------------------------------------------------------------------- */
function scrollToSection(target) {
  const navHeight = document.querySelector('.navbar-header')?.offsetHeight || 65;
  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 2;
  window.scrollTo({ top: targetPosition, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-item a');
  const sections = document.querySelectorAll('section[id]');

  // Smooth scroll for every in-page link (nav + hero scroll cue)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const targetSection = targetId.length > 1 && document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        scrollToSection(targetSection);
      }
    });
  });

  // Active scrollspy
  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset + 140;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { passive: true });

  // Back to top button
  const btt = document.getElementById('btn-back-to-top');
  if (btt) {
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   3. SKILL PILL COPY INTERACTION
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  document.querySelectorAll('.skill-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const skillName = pill.textContent.trim();
      navigator.clipboard.writeText(skillName).then(() => {
        showToast(`Copied skill: "${skillName}"`);
      }).catch(() => {
        showToast(`Skill: ${skillName}`);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. EXPERIENCE CONTENT & DESIGN GALLERY
   -------------------------------------------------------------------------- */
function initDesignGallery() {
  const tabBtns = document.querySelectorAll('.gallery-tab-btn');
  const grid = document.getElementById('mun-deliverables-grid');

  const galleryData = {
    'mumbai-mun': {
      title: 'MumbaiMUN Deliverables',
      images: [
        { src: 'assets/mumbai-mun-1.jpg', caption: 'MumbaiMUN Social Media Carousel Grid' },
        { src: 'assets/mumbai-mun-2.jpg', caption: 'MumbaiMUN Delegate Study Guide & Booklet' },
        { src: 'assets/mumbai-mun-3.jpg', caption: 'MumbaiMUN Official Secretariat & Delegate Badge' },
        { src: 'assets/mumbai-mun-4.jpg', caption: 'MumbaiMUN Keynote Outdoor Display & Billboard' }
      ]
    },
    'intra-mun': {
      title: 'IntraMUN Deliverables',
      images: [
        { src: 'assets/intramun-1.jpg', caption: 'IntraMUN Official Chits & Notepad System' },
        { src: 'assets/intramun-2.jpg', caption: 'IntraMUN Council Live Presentation Display' },
        { src: 'assets/intramun-3.jpg', caption: 'IntraMUN Event Identity & Social Media Grid' }
      ]
    }
  };

  function renderGallery(category) {
    const data = galleryData[category];
    if (!data || !grid) return;

    grid.innerHTML = '';
    data.images.forEach((item, idx) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'deliverable-tile';
      tile.title = item.caption;
      tile.style.setProperty('--backdrop', `url("${item.src}")`);
      tile.style.animationDelay = `${idx * 70}ms`;
      tile.innerHTML = `
        <span class="deliverable-img-box"><img src="${item.src}" alt="${item.caption}" loading="lazy"></span>
        <span class="deliverable-caption">${item.caption}</span>`;
      tile.addEventListener('click', () => openLightbox(item.src, data.title, item.caption));
      grid.appendChild(tile);
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.target);
    });
  });

  renderGallery('mumbai-mun');
}

/* --------------------------------------------------------------------------
   5. PROJECTS FILTER
   -------------------------------------------------------------------------- */
function initProjectsFilter() {
  const filterChips = document.querySelectorAll('.filter-chip');
  const projectCards = document.querySelectorAll('.project-card');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;

      let shown = 0;
      projectCards.forEach(card => {
        const match = filter === 'all'
          || (filter === 'ongoing' && card.dataset.status === 'ongoing')
          || (card.dataset.domain || '').split(',').includes(filter);
        card.style.display = match ? 'flex' : 'none';
        card.classList.remove('filter-in');
        if (match && !prefersReducedMotion) {
          // Restart the entrance animation with a small stagger
          void card.offsetWidth;
          card.style.animationDelay = `${shown * 50}ms`;
          card.classList.add('filter-in');
          shown++;
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. CERTIFICATION MODAL PREVIEWER (VIEW ONLY)
   -------------------------------------------------------------------------- */
function initCertificateModal() {
  const certModal = document.getElementById('certificate-modal');
  const certImg = document.getElementById('cert-modal-img');
  const certTitle = document.getElementById('cert-modal-title');
  const certIssuer = document.getElementById('cert-modal-issuer');
  const certCredId = document.getElementById('cert-modal-credid');

  const certData = {
    'rag-langgraph': {
      img: 'assets/cert-coursera-rag.png',
      title: 'RAG Systems & Agentic Workflows with Pinecone and LangGraph',
      issuer: 'Coursera // DeepLearning.AI Partner',
      credId: 'Verified Certificate of Completion'
    },
    'python': {
      img: 'assets/cert-datacamp-python.png',
      title: 'Introduction to Python',
      issuer: 'DataCamp Professional Statement of Accomplishment',
      credId: 'DataCamp Verified Certificate'
    },
    'sql': {
      img: 'assets/cert-datacamp-sql.png',
      title: 'Intermediate SQL',
      issuer: 'DataCamp Professional Statement of Accomplishment',
      credId: 'DataCamp Verified Certificate'
    },
    'java': {
      img: 'assets/cert-datacamp-java.png',
      title: 'Introduction to Java',
      issuer: 'DataCamp Professional Statement of Accomplishment',
      credId: 'DataCamp Verified Certificate'
    }
  };

  document.querySelectorAll('.btn-view-cert').forEach(btn => {
    btn.addEventListener('click', () => {
      const data = certData[btn.dataset.cert];
      if (data && certModal) {
        certImg.src = data.img;
        certTitle.textContent = data.title;
        certIssuer.textContent = `ISSUED BY: ${data.issuer}`;
        certCredId.textContent = `STATUS: ${data.credId}`;
        openModal(certModal);
      }
    });
  });

  // Close modals on click
  document.querySelectorAll('.modal-close-trigger').forEach(btn => {
    btn.addEventListener('click', closeModals);
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeModals();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModals();
  });
}

function openModal(modal) {
  modal.classList.add('active');
  document.body.classList.add('modal-open');
}

function closeModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  document.body.classList.remove('modal-open');
}

/* --------------------------------------------------------------------------
   7. EXTRACURRICULAR LIGHTBOX
   -------------------------------------------------------------------------- */
function initExtracurricularLightbox() {
  document.querySelectorAll('.extra-img-frame').forEach(frame => {
    frame.addEventListener('click', () => {
      const img = frame.querySelector('img');
      const caption = frame.querySelector('.caption-text');
      const title = frame.closest('.extra-activity-card')?.querySelector('.extra-title')?.textContent || 'Extracurricular Achievement';
      if (img) {
        openLightbox(img.src, title, caption ? caption.textContent : '');
      }
    });
  });
}

function openLightbox(src, title, caption) {
  const lightbox = document.getElementById('lightbox-modal');
  const imgEl = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const captionEl = document.getElementById('lightbox-caption');

  if (lightbox && imgEl) {
    imgEl.src = src;
    if (titleEl) titleEl.textContent = title;
    if (captionEl) captionEl.textContent = caption;
    openModal(lightbox);
  }
}

/* --------------------------------------------------------------------------
   8. CONTACT ACTIONS & MESSAGE FORM
   -------------------------------------------------------------------------- */
function initContactActions() {
  const emailBtn = document.getElementById('btn-copy-email');
  const emailAddr = 'edlynmath@gmail.com';

  if (emailBtn) {
    emailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(emailAddr).then(() => {
        showToast(`Copied email (${emailAddr}) to clipboard! Opening mail client...`);
        setTimeout(() => {
          window.location.href = `mailto:${emailAddr}?subject=Portfolio%20Inquiry%20-%20Data%20Science%20Collaboration`;
        }, 600);
      }).catch(() => {
        window.location.href = `mailto:${emailAddr}`;
      });
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('input-name').value.trim();
      const email = document.getElementById('input-email').value.trim();
      const message = document.getElementById('input-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please complete all required fields.');
        return;
      }

      // No backend on GitHub Pages: hand the message to the visitor's mail client
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`${message}\n\n- ${name} (${email})`);
      showToast('Opening your mail app to send the message...');
      window.location.href = `mailto:${emailAddr}?subject=${subject}&body=${body}`;
      contactForm.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   9. SIDEBAR SCROLL TRACKER (Aesthetic Progress Rail)
   -------------------------------------------------------------------------- */
function initSidebarScrollTracker() {
  const tracker = document.getElementById('sidebar-scroll-tracker');
  const rail = tracker?.querySelector('.scroll-tracker-rail');
  const progressLine = document.getElementById('tracker-progress-line');
  const diamond = document.getElementById('tracker-diamond-indicator');
  const nodes = document.querySelectorAll('.tracker-node');
  const sections = Array.from(nodes).map(node => document.querySelector(node.dataset.target)).filter(Boolean);

  if (!tracker || !progressLine || !diamond || nodes.length === 0) return;

  // Click on any node to smoothly scroll to target section
  nodes.forEach(node => {
    node.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(node.dataset.target);
      if (target) scrollToSection(target);
    });
  });

  function updateTracker() {
    const scrollPos = window.pageYOffset + 220;
    let activeIndex = 0;

    // Detect which section is currently active
    sections.forEach((sec, idx) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        activeIndex = idx;
      }
    });

    // If near bottom of the page, activate the last node
    if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 60) {
      activeIndex = nodes.length - 1;
    }

    // Update active node & diamond position
    const activeNode = nodes[activeIndex];
    if (activeNode) {
      const activeNodeCenter = activeNode.offsetTop + activeNode.offsetHeight / 2;
      diamond.style.top = `${activeNodeCenter}px`;

      // Update progress fill line
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollRatio = Math.min(1, Math.max(0, window.pageYOffset / (docHeight || 1)));
      const railInnerHeight = (rail?.offsetHeight || 380) - 20;
      const fillHeight = Math.max(activeNodeCenter - 10, scrollRatio * railInnerHeight);
      progressLine.style.height = `${Math.min(railInnerHeight, Math.max(0, fillHeight))}px`;

      // Update visited / active / future state classes
      nodes.forEach((node, i) => {
        node.classList.remove('is-active', 'is-visited', 'is-future');
        if (i === activeIndex) {
          node.classList.add('is-active');
        } else if (i < activeIndex) {
          node.classList.add('is-visited');
        } else {
          node.classList.add('is-future');
        }

        // Surface contrast detection (light vs dark section under each dot)
        const rect = node.getBoundingClientRect();
        const nodeY = rect.top + rect.height / 2;
        let isLight = false;

        document.querySelectorAll('section').forEach(sec => {
          const sRect = sec.getBoundingClientRect();
          if (nodeY >= sRect.top && nodeY < sRect.bottom) {
            if (sec.classList.contains('field-petal') || sec.classList.contains('field-bubblegum')) {
              isLight = true;
            }
          }
        });

        node.classList.toggle('on-light-surface', isLight);
        node.classList.toggle('on-dark-surface', !isLight);
      });
    }
  }

  window.addEventListener('scroll', updateTracker, { passive: true });
  window.addEventListener('resize', updateTracker);
  // Initial run
  updateTracker();
}

/* --------------------------------------------------------------------------
   10. SCROLL EFFECTS: NAVBAR STATE & HERO PARALLAX
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const navbar = document.querySelector('.navbar-header');
  const hero = document.querySelector('.hero-block .container');
  let ticking = false;

  function update() {
    const y = window.pageYOffset;
    if (navbar) navbar.classList.toggle('scrolled', y > 10);

    // Hero content drifts up and fades as you scroll into the page
    if (hero && !prefersReducedMotion) {
      const h = hero.parentElement.offsetHeight || 1;
      const p = Math.min(1, y / h);
      hero.style.transform = `translate3d(0, ${p * -60}px, 0) scale(${1 - p * 0.04})`;
      hero.style.opacity = `${1 - p * 0.85}`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}

/* --------------------------------------------------------------------------
   10b. SCROLL-TRIGGERED REVEAL ANIMATIONS
   Elements are tagged here (not in the HTML) so the markup stays clean.
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  // [selector, animation variant, stagger siblings?]
  const groups = [
    ['.section-heading', 'heading', false],
    ['.profile-card-container', 'left', false],
    ['.about-bio-card', 'right', false],
    ['.skill-category-card', 'up', true],
    ['.projects-controls', 'up', false],
    ['.project-card', 'up', true],
    ['.experience-card', 'up', false],
    ['.cert-card', 'zoom', true],
    ['.extra-activity-card', 'up', false],
    ['.extra-img-frame', 'curtain', true],
    ['.contact-info-panel', 'left', false],
    ['.contact-form-panel', 'right', false],
  ];

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    document.documentElement.classList.remove('js');
    return;
  }

  const variants = groups.map(([, v]) => `reveal-${v}`);
  // Fully clip-path'd elements never count as visible, so those variants
  // are triggered by their parent instead. Map: observed element -> elements to reveal.
  const watch = new Map();
  groups.forEach(([selector, variant, stagger]) => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal', `reveal-${variant}`);
      if (stagger) {
        const siblings = Array.from(el.parentElement.children).filter(c => c.matches(selector));
        el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el), 6) * 90}ms`);
      }
      const target = (variant === 'heading' || variant === 'curtain') ? el.parentElement : el;
      if (!watch.has(target)) watch.set(target, []);
      watch.get(target).push(el);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      watch.get(entry.target).forEach(el => {
        el.classList.add('in-view');

        // Drop the reveal classes once finished so hover transitions behave normally
        const delay = parseFloat(el.style.getPropertyValue('--reveal-delay')) || 0;
        setTimeout(() => {
          el.classList.remove('reveal', 'in-view', ...variants);
          el.style.removeProperty('--reveal-delay');
        }, delay + 1200);
      });
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  watch.forEach((_, target) => observer.observe(target));
}

/* --------------------------------------------------------------------------
   11. BLURRED IMAGE BACKDROPS
   Shows the whole photo (object-fit: contain) over a soft blurred copy of
   itself, so portrait and landscape shots sit neatly in same-size frames.
   -------------------------------------------------------------------------- */
function initImageBackdrops() {
  document.querySelectorAll('.extra-img-frame .img-container').forEach(box => {
    const img = box.querySelector('img');
    if (img) box.style.setProperty('--backdrop', `url("${img.getAttribute('src')}")`);
  });
}

/* --------------------------------------------------------------------------
   TOAST HELPER
   -------------------------------------------------------------------------- */
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('action-toast');
  if (!toast) return;

  toast.innerHTML = `<span class="toast-dot"></span> ${msg}`;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
