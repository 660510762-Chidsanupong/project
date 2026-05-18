// Main App Controller
const pages = [
  { id: 'page-0', render: renderPage1, navId: 'nav-0' },
  { id: 'page-1', render: renderPage2, navId: 'nav-1' },
  { id: 'page-2', render: renderPage3, navId: 'nav-2' },
  { id: 'page-3', render: renderPage4, navId: 'nav-3' },
];

let currentPage = -1;

function switchPage(index) {
  if (currentPage === index) return;
  currentPage = index;

  // Update nav active state
  document.querySelectorAll('.sb-nav .ni').forEach((el, i) => {
    el.classList.toggle('on', i === index);
    // Update SVG colors
    const svgs = el.querySelectorAll('svg *');
    svgs.forEach(s => {
      if (i === index) {
        if (s.getAttribute('fill') && s.getAttribute('fill') !== 'none') s.setAttribute('fill', '#fff');
        if (s.getAttribute('stroke') && s.getAttribute('stroke') !== 'none') s.setAttribute('stroke', '#fff');
      } else {
        if (s.getAttribute('fill') && s.getAttribute('fill') !== 'none') s.setAttribute('fill', '#94A3B8');
        if (s.getAttribute('stroke') && s.getAttribute('stroke') !== 'none') s.setAttribute('stroke', '#94A3B8');
      }
    });
  });

  // Show/hide pages
  pages.forEach((p, i) => {
    const el = document.getElementById(p.id);
    if (i === index) {
      el.classList.add('active');
      el.style.display = 'flex';
      // Only render once
      if (!el.dataset.rendered) {
        p.render(el);
        el.dataset.rendered = 'true';
      }
    } else {
      el.classList.remove('active');
      el.style.display = 'none';
    }
  });
}

// ===== THEME MANAGEMENT =====
function initTheme() {
  const saved = localStorage.getItem('hr-theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  if (current === 'light') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('hr-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('hr-theme', 'light');
  }
  // Update all toggle buttons across pages
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    updateToggleIcon(btn);
  });
}

function updateToggleIcon(btn) {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const moon = btn.querySelector('.icon-moon');
  const sun = btn.querySelector('.icon-sun');
  if (moon) moon.style.display = isLight ? 'none' : 'block';
  if (sun) sun.style.display = isLight ? 'block' : 'none';
}

// Global HTML for theme toggle button — reusable across all pages
function themeToggleHTML() {
  return `<button class="theme-toggle" onclick="toggleTheme()" title="สลับธีม Light/Dark">
    <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
    <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  </button>`;
}

// Auto-update all toggle icons after page render
function refreshThemeToggles() {
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    updateToggleIcon(btn);
  });
}

// Initialize theme before rendering
initTheme();

// Initialize with page 0 only if already logged in
if (sessionStorage.getItem('hr-logged-in') === 'true') {
  switchPage(0);
}
