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
  initCarousels();
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
// Se llama desde el atributo onclick="toggleAccordion(this)" en cada página de case study (rgr.html, etc.)
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

// --- Carrusel "Cómo trabajo" (1 tarjeta por pantalla) -------------
function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(setupCarousel);
}

function setupCarousel(root) {
  const track = root.querySelector('[data-carousel-track]');
  const slides = Array.from(root.querySelectorAll('.carousel__slide'));
  const prevBtn = root.querySelector('[data-carousel-prev]');
  const nextBtn = root.querySelector('[data-carousel-next]');
  const dots = Array.from(root.querySelectorAll('[data-carousel-dot]'));
  if (!track || !slides.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;

  function goTo(newIndex) {
    index = (newIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      dot.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
  }

  if (prefersReducedMotion) track.style.transition = 'none';

  prevBtn && prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Swipe táctil básico
  let touchStartX = null;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) goTo(delta < 0 ? index + 1 : index - 1);
    touchStartX = null;
  }, { passive: true });

  goTo(0);
}
