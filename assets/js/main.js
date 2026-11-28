/**
 * SMARTHUB - Global Main JavaScript
 * Handles Theme, Real-time Search, Mobile Navigation, Toasts, and UI Helpers.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initGlobalSearch();
  initNewsletter();
});

/* ===================================================================
   Path Resolver Helpers
=================================================================== */
function isSubPage() {
  return window.location.pathname.includes('/tools/');
}

function getBaseUrl() {
  return isSubPage() ? '../' : './';
}

function getToolUrl(toolId) {
  return isSubPage() ? `${toolId}.html` : `tools/${toolId}.html`;
}

/* ===================================================================
   Theme Management (Light / Dark Mode)
=================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('smarthub_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(currentTheme);

  const toggleBtns = document.querySelectorAll('.theme-toggle');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(activeTheme);
      localStorage.setItem('smarthub_theme', activeTheme);
      showToast(`Switched to ${activeTheme} mode`, 'info');
    });
  });
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  updateThemeIcons(theme === 'dark');
}

function updateThemeIcons(isDark) {
  const toggleBtns = document.querySelectorAll('.theme-toggle');
  toggleBtns.forEach(btn => {
    btn.innerHTML = isDark
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  });
}

/* ===================================================================
   Mobile Navigation Drawer
=================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', isOpen);
    document.body.classList.toggle('mobile-menu-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen
      ? `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
      : `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Mobile dropdown toggles
  const navDropdowns = document.querySelectorAll('.nav-dropdown');
  navDropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-link');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          dropdown.classList.toggle('active');
        }
      });
    }
  });

  // Close menu when clicking any nav link (except category dropdown toggle)
  navMenu.querySelectorAll('a:not(.nav-dropdown > .nav-link)').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        toggleMenu(false);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && navMenu.classList.contains('open')) {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        toggleMenu(false);
      }
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* ===================================================================
   Live Instant Search
=================================================================== */
function initGlobalSearch() {
  const searchInput = document.getElementById('global-search-input');
  const searchDropdown = document.getElementById('search-dropdown');
  const searchClear = document.getElementById('search-clear');

  if (!searchInput) return;

  // Keyboard shortcut Ctrl+K or / to focus search
  document.addEventListener('keydown', (e) => {
    if ((e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (e.key === 'Escape' && searchDropdown) {
      searchDropdown.style.display = 'none';
      searchInput.blur();
    }
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    
    if (searchClear) {
      searchClear.style.display = query.length > 0 ? 'block' : 'none';
    }

    if (!searchDropdown) return;

    if (query.length < 1) {
      searchDropdown.style.display = 'none';
      searchDropdown.innerHTML = '';
      return;
    }

    if (typeof SMARTHUB_TOOLS === 'undefined') return;

    const filtered = SMARTHUB_TOOLS.filter(tool => {
      return tool.name.toLowerCase().includes(query) ||
             tool.desc.toLowerCase().includes(query) ||
             tool.categoryName.toLowerCase().includes(query) ||
             (tool.keywords && tool.keywords.some(k => k.toLowerCase().includes(query)));
    });

    renderSearchResults(filtered, query, searchDropdown);
  });

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.style.display = 'none';
      if (searchDropdown) {
        searchDropdown.style.display = 'none';
      }
      searchInput.focus();
    });
  }

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container') && searchDropdown) {
      searchDropdown.style.display = 'none';
    }
  });
}

function renderSearchResults(results, query, container) {
  if (results.length === 0) {
    container.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.9375rem;">
        No tools found matching "<strong>${escapeHtml(query)}</strong>". Try searching for <em>PDF, image, calculator, QR</em>.
      </div>
    `;
    container.style.display = 'block';
    return;
  }

  container.innerHTML = results.slice(0, 7).map(tool => `
    <a href="${getToolUrl(tool.id)}" class="search-result-item">
      <div class="search-result-icon">${tool.icon}</div>
      <div class="search-result-info">
        <h4>${highlightMatch(tool.name, query)} <span class="badge badge-primary" style="font-size:0.65rem; margin-left:0.5rem;">${tool.categoryName}</span></h4>
        <p>${tool.desc}</p>
      </div>
    </a>
  `).join('');

  container.style.display = 'block';
}

function highlightMatch(text, query) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return escapeHtml(text);
  const before = text.substring(0, index);
  const match = text.substring(index, index + query.length);
  const after = text.substring(index + query.length);
  return `${escapeHtml(before)}<strong style="color:var(--primary);">${escapeHtml(match)}</strong>${escapeHtml(after)}`;
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

/* ===================================================================
   Toast System
=================================================================== */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  } else {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div style="flex-grow:1;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ===================================================================
   Copy to Clipboard Utility
=================================================================== */
function copyToClipboard(text, btnElement = null) {
  if (!text) {
    showToast('Nothing to copy', 'error');
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard!', 'success');
    if (btnElement) {
      const originalHTML = btnElement.innerHTML;
      btnElement.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
      btnElement.classList.add('btn-success');
      setTimeout(() => {
        btnElement.innerHTML = originalHTML;
        btnElement.classList.remove('btn-success');
      }, 2000);
    }
  }).catch(() => {
    // Fallback for older browsers
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast('Copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy text', 'error');
    }
    document.body.removeChild(tempInput);
  });
}

/* ===================================================================
   Newsletter Form
=================================================================== */
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    showToast('🎉 Thank you for subscribing to SmartHub updates!', 'success');
    input.value = '';
  });
}

// Global exports
window.showToast = showToast;
window.copyToClipboard = copyToClipboard;
window.getToolUrl = getToolUrl;
