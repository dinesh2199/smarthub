/**
 * SMARTHUB - Global Main JavaScript
 * Handles Theme, Real-time Search, Mobile Navigation, Toasts, and UI Helpers.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initGlobalSearch();
  initNewsletter();
  trackCurrentTool();
  initPWA();
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

/* ===================================================================
   User Experience (UX): Favorites, Recents, Rating & Share
=================================================================== */
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('smarthub_favorites')) || [];
  } catch (e) {
    return [];
  }
}

function isFavorite(toolId) {
  return getFavorites().includes(toolId);
}

function toggleFavorite(toolId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  let favs = getFavorites();
  const index = favs.indexOf(toolId);
  let isFav = false;
  if (index > -1) {
    favs.splice(index, 1);
    showToast('Removed from favorites', 'info');
  } else {
    favs.push(toolId);
    isFav = true;
    showToast('Saved to favorites! ⭐', 'success');
  }
  localStorage.setItem('smarthub_favorites', JSON.stringify(favs));
  updateFavoriteButtons(toolId, isFav);
  if (typeof renderFavoritesSection === 'function') {
    renderFavoritesSection();
  }
  return isFav;
}

function updateFavoriteButtons(toolId, isFav) {
  document.querySelectorAll(`.favorite-btn[data-tool-id="${toolId}"]`).forEach(btn => {
    btn.classList.toggle('active', isFav);
    btn.setAttribute('aria-label', isFav ? 'Remove from favorites' : 'Add to favorites');
    btn.innerHTML = isFav 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  });
}

function trackCurrentTool() {
  const currentPath = window.location.pathname;
  const match = currentPath.match(/([a-z0-9-]+)\.html$/i);
  if (!match) return;
  const toolId = match[1];
  const ignored = ['index', 'tools', 'about', 'contact', 'privacy-policy', 'terms', 'disclaimer'];
  if (ignored.includes(toolId)) return;

  try {
    let recent = JSON.parse(localStorage.getItem('smarthub_recent_tools')) || [];
    recent = recent.filter(id => id !== toolId);
    recent.unshift(toolId);
    if (recent.length > 8) recent = recent.slice(0, 8);
    localStorage.setItem('smarthub_recent_tools', JSON.stringify(recent));
  } catch (e) {}
}

function getRecentTools() {
  try {
    return JSON.parse(localStorage.getItem('smarthub_recent_tools')) || [];
  } catch (e) {
    return [];
  }
}

function shareTool(toolName, url = window.location.href) {
  if (navigator.share) {
    navigator.share({
      title: `${toolName} - Free Online Tool on SmartHub`,
      text: `Use ${toolName} for free in your browser with 100% privacy!`,
      url: url
    }).catch(() => {});
  } else {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent('Check out this free tool: ' + toolName + ' - ' + url)}`;
    window.open(whatsappUrl, '_blank');
  }
}

function initToolRating(toolId) {
  const ratingBox = document.querySelector('.tool-rating-box');
  if (!ratingBox) return;

  const savedRating = localStorage.getItem(`smarthub_rating_${toolId}`);
  const starsContainer = ratingBox.querySelector('.rating-stars');
  const countEl = ratingBox.querySelector('.rating-count');

  if (savedRating) {
    highlightStars(savedRating);
    if (countEl) countEl.textContent = 'Thanks for your rating! ⭐';
  }

  if (starsContainer) {
    starsContainer.querySelectorAll('.star-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.value;
        localStorage.setItem(`smarthub_rating_${toolId}`, val);
        highlightStars(val);
        showToast(`Rated ${val}/5! Thank you for your feedback 🙏`, 'success');
        if (countEl) countEl.textContent = 'Thanks for your feedback! ⭐';
      });
      btn.addEventListener('mouseenter', () => highlightStars(btn.dataset.value));
      btn.addEventListener('mouseleave', () => {
        const cur = localStorage.getItem(`smarthub_rating_${toolId}`) || 5;
        highlightStars(cur);
      });
    });
  }

  function highlightStars(val) {
    if (!starsContainer) return;
    starsContainer.querySelectorAll('.star-btn').forEach(btn => {
      const active = parseInt(btn.dataset.value) <= parseInt(val);
      btn.classList.toggle('active', active);
    });
  }
}

/* ===================================================================
   Progressive Web App (PWA) & Offline Mobile Installation
=================================================================== */
let deferredInstallPrompt = null;

function initPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    showPWAInstallBanner();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    hidePWAInstallBanner();
    showToast('SmartHub App installed successfully! 📱', 'success');
  });
}

function showPWAInstallBanner() {
  let banner = document.getElementById('pwa-install-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.style.cssText = 'position:fixed; bottom:76px; left:50%; transform:translateX(-50%); z-index:99998; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:9999px; padding:0.45rem 1rem; box-shadow:0 10px 25px rgba(0,0,0,0.25); display:flex; align-items:center; gap:0.75rem; max-width:90vw;';
    banner.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; font-weight:600; color:var(--text-main); white-space:nowrap;">
        <span>📱 Install SmartHub App</span>
        <span style="font-size:0.75rem; color:var(--text-muted);">(No Login)</span>
      </div>
      <button id="btn-pwa-install" class="btn btn-sm btn-primary" style="padding:0.3rem 0.75rem; font-size:0.8rem; border-radius:9999px;">Install</button>
      <button id="btn-pwa-close" style="background:none; border:none; color:var(--text-muted); font-size:16px; cursor:pointer; padding:0 4px;" title="Dismiss">✕</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('btn-pwa-install').addEventListener('click', () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            hidePWAInstallBanner();
          }
          deferredInstallPrompt = null;
        });
      }
    });

    document.getElementById('btn-pwa-close').addEventListener('click', hidePWAInstallBanner);
  }
  banner.style.display = 'flex';
}

function hidePWAInstallBanner() {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) banner.style.display = 'none';
}

// Global exports
window.showToast = showToast;
window.copyToClipboard = copyToClipboard;
window.getToolUrl = getToolUrl;
window.getFavorites = getFavorites;
window.isFavorite = isFavorite;
window.toggleFavorite = toggleFavorite;
window.updateFavoriteButtons = updateFavoriteButtons;
window.trackCurrentTool = trackCurrentTool;
window.getRecentTools = getRecentTools;
window.shareTool = shareTool;
window.initToolRating = initToolRating;
