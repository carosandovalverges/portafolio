// ============================================================
// Carola Sandoval — Portfolio UX
// JavaScript vanilla compartido por las 4 plantillas
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  initNavScroll();
  initMobileDrawer();
  initScrollTopButton();
  initProjectFilters();
  initCaseMobileToc();
  initCaseTocActiveState();
});

// --- Año dinámico en el footer -------------------------------
function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// --- Header: fondo frosted-glass al hacer scroll --------------
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// --- Menú mobile (drawer accesible) ----------------------------
function initMobileDrawer() {
  const toggle = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');
  if (!toggle || !drawer) return;

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
}

// --- Botón "Volver arriba" -------------------------------------
function initScrollTopButton() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!scrollTopBtn) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onScroll = () => {
    scrollTopBtn.classList.toggle('is-visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });
}

// --- Filtro de proyectos (Home) ---------------------------------
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !projects.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projects.forEach(project => {
        const matches = filterValue === 'all' || project.classList.contains(filterValue);
        project.style.display = matches ? '' : 'none';
      });
    });
  });
}

// --- Índice mobile del case study (acordeón sticky) -------------
function initCaseMobileToc() {
  const toggle = document.getElementById('mobileTocToggle');
  const panel = document.getElementById('mobileTocPanel');
  const chevron = document.getElementById('mobileTocChevron');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (chevron) chevron.classList.toggle('is-rotated', isOpen);
  });

  panel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      panel.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (chevron) chevron.classList.remove('is-rotated');
    });
  });
}

// --- Acordeón de secciones del case study (mobile) ---------------
// Se llama desde el atributo onclick="toggleAccordion(this)" en case-study.html
function toggleAccordion(button) {
  const panel = button.nextElementSibling;
  const chevron = button.querySelector('.chevron');
  if (!panel) return;
  panel.classList.toggle('is-open');
  if (chevron) chevron.classList.toggle('is-rotated');
}
window.toggleAccordion = toggleAccordion;

// --- Estado activo del índice lateral (case study, desktop) ------
function initCaseTocActiveState() {
  const sections = document.querySelectorAll('.case-section[id]');
  const tocLinks = document.querySelectorAll('.case-toc-link');
  if (!sections.length || !tocLinks.length || !('IntersectionObserver' in window)) return;

  const setActive = (id) => {
    tocLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}
