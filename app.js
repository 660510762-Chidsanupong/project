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
      // Only render once
      if (!el.dataset.rendered) {
        p.render(el);
        el.dataset.rendered = 'true';
      }
    } else {
      el.classList.remove('active');
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
}

// Initialize theme before rendering
initTheme();

// Initialize with page 0
switchPage(0);
