/**
 * Build 100% Standalone & Self-Contained SmartHub for GitHub Pages
 * Inlines CSS, SVG logo, tools data, and scripts so nothing ever breaks on GitHub!
 */

const fs = require('fs');
const path = require('path');

const cssStyle = fs.readFileSync(path.join(__dirname, 'assets', 'css', 'style.css'), 'utf8');
const cssTools = fs.readFileSync(path.join(__dirname, 'assets', 'css', 'tools.css'), 'utf8');
const logoSvg = fs.readFileSync(path.join(__dirname, 'assets', 'images', 'logo.svg'), 'utf8');
const faviconSvg = fs.readFileSync(path.join(__dirname, 'assets', 'images', 'favicon.svg'), 'utf8');
const toolsDataJs = fs.readFileSync(path.join(__dirname, 'assets', 'js', 'tools-data.js'), 'utf8');
const mainJs = fs.readFileSync(path.join(__dirname, 'assets', 'js', 'main.js'), 'utf8');

const {
  SMARTHUB_CATEGORIES,
  SMARTHUB_TOOLS,
  getAdSlot,
  getToolSEOContent
} = require('./generate-all-tools.js');

const toolDefs = {
  ...require('./tools-definitions-image.js'),
  ...require('./tools-definitions-pdf.js'),
  ...require('./tools-definitions-calc.js'),
  ...require('./tools-definitions-qr.js'),
  ...require('./tools-definitions-text.js'),
  ...require('./tools-definitions-dev.js'),
  ...require('./tools-definitions-conv.js'),
  ...require('./tools-definitions-other.js')
};

// Standalone Header
function getStandaloneHeader(activePage = '') {
  return `
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="brand-logo" aria-label="SmartHub Home">
        ${logoSvg}
      </a>
      
      <nav class="nav-menu" aria-label="Main Navigation">
        <a href="index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a>
        <a href="tools.html" class="nav-link ${activePage === 'tools' ? 'active' : ''}">All Tools</a>
        
        <div class="nav-dropdown">
          <a href="#" class="nav-link" aria-haspopup="true">Categories ▾</a>
          <div class="dropdown-menu">
            ${SMARTHUB_CATEGORIES.map(cat => `
              <a href="tools.html?category=${cat.id}" class="dropdown-item">
                ${cat.icon}
                <span>${cat.name}</span>
              </a>
            `).join('')}
          </div>
        </div>

        <a href="about.html" class="nav-link ${activePage === 'about' ? 'active' : ''}">About Us</a>
        <a href="contact.html" class="nav-link ${activePage === 'contact' ? 'active' : ''}">Contact</a>
      </nav>

      <div class="header-actions">
        <button class="btn-icon theme-toggle" title="Toggle Theme" aria-label="Toggle Theme">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <button class="btn-icon mobile-toggle" aria-label="Open Mobile Menu">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </div>
  </header>`;
}

// Standalone Footer
function getStandaloneFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="brand-logo">
            ${logoSvg}
          </a>
          <p>Everything You Need, All in One Smart Place. 100% free, browser-processed, privacy-first online tools for everyone.</p>
          <div class="social-links">
            <a href="#" class="social-btn" aria-label="Twitter"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
            <a href="#" class="social-btn" aria-label="GitHub"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a>
            <a href="#" class="social-btn" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Tool Categories</h4>
          <ul class="footer-links">
            <li><a href="tools.html?category=image">Image Tools</a></li>
            <li><a href="tools.html?category=pdf">PDF Tools</a></li>
            <li><a href="tools.html?category=calculators">Calculators</a></li>
            <li><a href="tools.html?category=qr">QR Code Tools</a></li>
            <li><a href="tools.html?category=text">Text Tools</a></li>
            <li><a href="tools.html?category=developer">Developer Tools</a></li>
            <li><a href="tools.html?category=converters">Unit Converters</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Popular Tools</h4>
          <ul class="footer-links">
            <li><a href="image-compressor.html">Image Compressor</a></li>
            <li><a href="merge-pdf.html">Merge PDF</a></li>
            <li><a href="age-calculator.html">Age Calculator</a></li>
            <li><a href="emi-calculator.html">EMI Calculator</a></li>
            <li><a href="qr-code-generator.html">QR Code Generator</a></li>
            <li><a href="json-formatter.html">JSON Formatter</a></li>
            <li><a href="word-counter.html">Word Counter</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Company &amp; Legal</h4>
          <ul class="footer-links">
            <li><a href="about.html">About Us</a></li>
            <li><a href="contact.html">Contact Support</a></li>
            <li><a href="privacy-policy.html">Privacy Policy</a></li>
            <li><a href="terms.html">Terms &amp; Conditions</a></li>
            <li><a href="disclaimer.html">Disclaimer</a></li>
            <li><a href="sitemap.xml">Sitemap</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 SmartHub. All rights reserved. Processed safely in your browser.</p>
        <p>Built with ❤️ for speed, simplicity, and privacy.</p>
      </div>
    </div>
  </footer>`;
}

// 1. Build Standalone index.html
function buildStandaloneIndex() {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SmartHub – All-in-One Online Tools Website | Free, Fast & Easy</title>
  <meta name="description" content="SmartHub is your all-in-one suite of 39+ free, fast, and secure online tools for images, PDFs, calculations, QR codes, text, and development. 100% browser-based & private.">
  <link rel="canonical" href="https://smarthub.online/">
  
  <meta property="og:type" content="website">
  <meta property="og:title" content="SmartHub – Everything You Need, All in One Smart Place">
  <meta property="og:description" content="Free, fast & easy online tools for everyone. Compress images, merge PDFs, calculate EMI, generate QR codes, format JSON and more.">
  <meta property="og:url" content="https://smarthub.online/">
  <meta property="og:site_name" content="SmartHub">
  
  <style>
    ${cssStyle}
  </style>
</head>
<body>
  ${getStandaloneHeader('home')}

  <!-- Hero Section -->
  <section class="hero-section">
    <div class="container">
      <div class="hero-badge">
        <span>🚀 100% Free &amp; Private Browser Processing</span>
      </div>

      <h1 class="heading-xl hero-title">
        All Your Online Tools in <span class="text-gradient">One Smart Place</span>
      </h1>
      
      <p class="lead-text hero-subtitle">
        Free, Fast &amp; Easy Online Tools for Everyone. Transform images, convert PDFs, run financial calculations, generate QR codes, and format code—all right inside your browser.
      </p>

      <!-- Instant Functional Search Bar -->
      <div class="search-container">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" class="search-input" id="global-search-input" placeholder="Search any tool... (Press '/' or 'Ctrl+K' to focus)" autocomplete="off">
          <button class="search-clear" id="search-clear" title="Clear Search">✕</button>
        </div>
        <div class="search-results-dropdown" id="search-dropdown"></div>

        <!-- Quick Search Tags -->
        <div class="quick-tags">
          <span style="font-size:0.8125rem; color:var(--text-muted); align-self:center;">Popular Searches:</span>
          <a href="image-compressor.html" class="quick-tag">Compress Image</a>
          <a href="merge-pdf.html" class="quick-tag">Merge PDF</a>
          <a href="age-calculator.html" class="quick-tag">Age Calculator</a>
          <a href="emi-calculator.html" class="quick-tag">EMI Calculator</a>
          <a href="qr-code-generator.html" class="quick-tag">QR Code</a>
          <a href="word-counter.html" class="quick-tag">Word Counter</a>
          <a href="json-formatter.html" class="quick-tag">JSON Formatter</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Compliant AdSense Banner (Top Leaderboard) -->
  <div class="container">
    <div class="ad-slot-wrapper">
      <span class="ad-label">Advertisement</span>
      <div class="ad-slot ad-slot-leaderboard">
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
          <span style="font-size:0.75rem; color:var(--text-light);">Google AdSense Display Unit (Leaderboard 728x90)</span>
          <span style="font-size:0.7rem; color:var(--text-muted); opacity:0.6;">Ready for AdSense Publisher ID</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Popular Tools Section -->
  <section class="section">
    <div class="container">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="heading-lg">🔥 Popular Tools</h2>
          <p>The most used utilities by millions of creators, developers, and students.</p>
        </div>
        <a href="tools.html" class="btn btn-secondary">
          <span>View All 39 Tools</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      </div>

      <div class="tools-grid" id="popular-tools-grid"></div>
    </div>
  </section>

  <!-- Browse Tools by Categories -->
  <section class="section section-alt">
    <div class="container">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="heading-lg">📂 Browse by Category</h2>
          <p>Organized toolboxes built for every need and discipline.</p>
        </div>
      </div>

      <div class="categories-grid" id="categories-grid"></div>
    </div>
  </section>

  <!-- Recently Added Tools Section -->
  <section class="section">
    <div class="container">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="heading-lg">✨ Recently Added Tools</h2>
          <p>Discover our newly launched utilities and enhancements.</p>
        </div>
      </div>

      <div class="tools-grid" id="recent-tools-grid"></div>
    </div>
  </section>

  <!-- Why Choose SmartHub Section -->
  <section class="section section-alt">
    <div class="container">
      <div style="text-align:center; max-width:680px; margin:0 auto 3.5rem;">
        <h2 class="heading-lg" style="margin-bottom:0.75rem;">Why Choose SmartHub?</h2>
        <p class="lead-text">Crafted with high engineering standards to prioritize speed, simplicity, and your privacy above everything else.</p>
      </div>

      <div class="features-grid">
        <div class="feature-box">
          <div class="feature-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3>100% Client-Side Privacy</h3>
          <p>Your documents, photos, and files are never uploaded to remote servers. All compression, conversion, and processing occurs securely right on your local device.</p>
        </div>

        <div class="feature-box">
          <div class="feature-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <h3>Lightning Fast Execution</h3>
          <p>No waiting in server queues or uploading heavy files over slow connections. Get instant results powered by modern browser WebAssembly and JavaScript engines.</p>
        </div>

        <div class="feature-box">
          <div class="feature-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="18" x2="12" y2="20"/><line x1="12" y1="4" x2="12" y2="6"/></svg>
          </div>
          <h3>100% Free Forever</h3>
          <p>No hidden paywalls, no watermarks, no forced sign-ups, and no monthly credit cards. SmartHub is completely free for everyone across the world.</p>
        </div>

        <div class="feature-box">
          <div class="feature-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          </div>
          <h3>Mobile &amp; Cross-Platform</h3>
          <p>Fully responsive, mobile-first design. Use SmartHub seamlessly on iPhones, Android smartphones, tablets, MacBooks, and Windows laptops.</p>
        </div>

        <div class="feature-box">
          <div class="feature-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <h3>Zero Installation</h3>
          <p>No bulky software downloads or browser extensions required. Simply bookmark SmartHub and launch whichever tool you need with a single click.</p>
        </div>

        <div class="feature-box">
          <div class="feature-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3>AdSense Compliant &amp; Safe</h3>
          <p>Clean non-intrusive layout, genuine client-side utility, clear privacy terms, and zero misleading advertisements or pop-ups.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Compliant AdSense Banner (Middle Responsive) -->
  <div class="container">
    <div class="ad-slot-wrapper">
      <span class="ad-label">Advertisement</span>
      <div class="ad-slot ad-slot-responsive">
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
          <span style="font-size:0.75rem; color:var(--text-light);">Google AdSense Display Unit (Responsive Banner)</span>
          <span style="font-size:0.7rem; color:var(--text-muted); opacity:0.6;">Ready for AdSense Publisher ID</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Newsletter Subscription Section -->
  <section class="section" style="padding-top:1rem;">
    <div class="container">
      <div class="newsletter-card">
        <div class="newsletter-content">
          <h2>Never Miss a New Smart Tool</h2>
          <p>Subscribe to our newsletter for weekly product updates, productivity shortcuts, and newly released tools. Free forever, no spam.</p>
          <form class="newsletter-form">
            <input type="email" class="newsletter-input" placeholder="Enter your email address..." required>
            <button type="submit" class="newsletter-btn">Subscribe Free</button>
          </form>
          <span class="newsletter-privacy">🔒 100% Privacy. Unsubscribe anytime with 1-click.</span>
        </div>
      </div>
    </div>
  </section>

  ${getStandaloneFooter()}

  <script>
    ${toolsDataJs}
  </script>
  <script>
    // URL Helper: directly links to tool pages in root!
    function getToolUrl(toolId) {
      return toolId + '.html';
    }
    ${mainJs}
  </script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Render Popular Tools
      const popularGrid = document.getElementById('popular-tools-grid');
      if (popularGrid && typeof SMARTHUB_TOOLS !== 'undefined') {
        const popular = SMARTHUB_TOOLS.filter(t => t.popular).slice(0, 8);
        popularGrid.innerHTML = popular.map(tool => \`
          <a href="\${tool.id}.html" class="tool-card">
            <div class="tool-card-header">
              <div class="tool-icon-wrapper">\${tool.icon}</div>
              <span class="badge badge-primary">\${tool.categoryName}</span>
            </div>
            <h3 class="tool-card-title">\${tool.name}</h3>
            <p class="tool-card-desc">\${tool.desc}</p>
            <div class="tool-card-footer">
              <span>Open Tool</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </a>
        \`).join('');
      }

      // Render Categories Grid
      const catGrid = document.getElementById('categories-grid');
      if (catGrid && typeof SMARTHUB_CATEGORIES !== 'undefined') {
        catGrid.innerHTML = SMARTHUB_CATEGORIES.map(cat => \`
          <a href="tools.html?category=\${cat.id}" class="category-card">
            <div class="category-icon">\${cat.icon}</div>
            <div class="category-info">
              <h3>\${cat.name}</h3>
              <p>\${cat.desc}</p>
              <span class="badge badge-purple" style="margin-top:0.5rem;">\${cat.badge}</span>
            </div>
          </a>
        \`).join('');
      }

      // Render Recently Added Tools
      const recentGrid = document.getElementById('recent-tools-grid');
      if (recentGrid && typeof SMARTHUB_TOOLS !== 'undefined') {
        const recent = SMARTHUB_TOOLS.filter(t => t.recent).slice(0, 6);
        recentGrid.innerHTML = recent.map(tool => \`
          <a href="\${tool.id}.html" class="tool-card">
            <div class="tool-card-header">
              <div class="tool-icon-wrapper">\${tool.icon}</div>
              <span class="badge badge-success">New</span>
            </div>
            <h3 class="tool-card-title">\${tool.name}</h3>
            <p class="tool-card-desc">\${tool.desc}</p>
            <div class="tool-card-footer">
              <span>Open Tool</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </a>
        \`).join('');
      }
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtml, 'utf8');
}

// 2. Build Standalone Tools in Root Directory (e.g. image-compressor.html, etc.)
function buildStandaloneToolsInRoot() {
  SMARTHUB_TOOLS.forEach(tool => {
    const def = toolDefs[tool.id];
    if (!def) return;

    const pageTitle = `${tool.name} – Free Online Tool | SmartHub`;
    const metaDesc = `${tool.desc} 100% free, private browser-based tool on SmartHub with no file upload limits or registration.`;
    const canonicalUrl = `https://smarthub.online/${tool.id}.html`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDesc}">
  <link rel="canonical" href="${canonicalUrl}">
  
  <style>
    ${cssStyle}
    ${cssTools}
  </style>
  
  ${def.extraHead || ''}
</head>
<body>
  ${getStandaloneHeader(tool.id)}

  <main class="section" style="padding-top:2rem;">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="index.html">Home</a>
        <span class="separator">/</span>
        <a href="tools.html?category=${tool.category}">${tool.categoryName}</a>
        <span class="separator">/</span>
        <span class="current" aria-current="page">${tool.name}</span>
      </nav>

      <div class="tool-header-section">
        <div class="tool-header-top">
          <div class="tool-header-left">
            <div class="tool-header-icon">${tool.icon}</div>
            <div>
              <span class="badge badge-primary" style="margin-bottom:0.35rem;">${tool.categoryName}</span>
              <h1 class="tool-header-title">${tool.name}</h1>
            </div>
          </div>
          <div class="tool-header-actions">
            <button class="btn btn-sm btn-secondary" onclick="copyToClipboard(window.location.href, this)" title="Share Tool">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share
            </button>
          </div>
        </div>
        <p class="tool-header-desc">${tool.desc}</p>
      </div>

      ${getAdSlot('leaderboard')}

      <div class="tool-workspace">
        ${def.renderWorkspace()}
      </div>

      ${getAdSlot('responsive')}

      ${getToolSEOContent(tool)}

      <!-- Related Tools in this Category -->
      <section class="section" style="padding-top:2rem;">
        <div class="container" style="padding:0;">
          <div class="section-header" style="margin-bottom:1.5rem;">
            <div class="section-title-group">
              <h3 class="heading-md">Related ${tool.categoryName}</h3>
              <p>Explore other fast and private tools in this category</p>
            </div>
          </div>
          <div class="tools-grid">
            ${SMARTHUB_TOOLS
              .filter(t => t.category === tool.category && t.id !== tool.id)
              .slice(0, 3)
              .map(t => `
                <a href="${t.id}.html" class="tool-card">
                  <div class="tool-card-header">
                    <div class="tool-icon-wrapper">${t.icon}</div>
                    <span class="badge badge-primary">${t.categoryName}</span>
                  </div>
                  <h4 class="tool-card-title">${t.name}</h4>
                  <p class="tool-card-desc">${t.desc}</p>
                  <div class="tool-card-footer">
                    <span>Open Tool</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </a>
              `).join('')}
          </div>
        </div>
      </section>

      <div style="margin-top:3.5rem;">
        <div class="newsletter-card">
          <div class="newsletter-content">
            <h2>Never Miss a New Smart Tool</h2>
            <p>Subscribe to our newsletter for weekly updates, new tool releases, and productivity tips. Free forever, no spam.</p>
            <form class="newsletter-form">
              <input type="email" class="newsletter-input" placeholder="Enter your email address..." required>
              <button type="submit" class="newsletter-btn">Subscribe Free</button>
            </form>
            <span class="newsletter-privacy">🔒 100% Privacy. Unsubscribe anytime with 1-click.</span>
          </div>
        </div>
      </div>
    </div>
  </main>

  ${getStandaloneFooter()}

  <script>
    ${toolsDataJs}
  </script>
  <script>
    function getToolUrl(toolId) { return toolId + '.html'; }
    ${mainJs}
  </script>
  <script>
    ${def.script}
  </script>
</body>
</html>`;

    // Save in root as well as in tools/ folder!
    fs.writeFileSync(path.join(__dirname, `${tool.id}.html`), html, 'utf8');
    fs.writeFileSync(path.join(__dirname, 'tools', `${tool.id}.html`), html, 'utf8');
  });
}

// 3. Build Standalone tools.html
function buildStandaloneToolsDirectory() {
  const toolsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>All Online Tools – Directory &amp; Categories | SmartHub</title>
  <meta name="description" content="Browse all 39+ free, fast, and secure online tools on SmartHub. Filter by image tools, PDF utilities, calculators, QR tools, text tools, converters and more.">
  <link rel="canonical" href="https://smarthub.online/tools.html">
  
  <style>
    ${cssStyle}
    ${cssTools}
  </style>
</head>
<body>
  ${getStandaloneHeader('tools')}

  <main class="section" style="padding-top:2rem;">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="index.html">Home</a>
        <span class="separator">/</span>
        <span class="current">All Tools</span>
      </nav>

      <div style="text-align:center; max-width:700px; margin:0 auto 2.5rem;">
        <h1 class="heading-xl" style="margin-bottom:0.75rem;">
          Explore All <span class="text-gradient">Smart Tools</span>
        </h1>
        <p class="lead-text">
          Browse through our full library of 39+ professional online tools. Search instantly or filter by category below.
        </p>

        <div class="search-box" style="margin-top:1.5rem;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" class="search-input" id="directory-search" placeholder="Filter tools by name, description, or keywords..." autocomplete="off">
          <button class="search-clear" id="directory-clear" title="Clear">✕</button>
        </div>
      </div>

      <div style="display:flex; flex-wrap:wrap; gap:0.5rem; justify-content:center; margin-bottom:2rem;" id="category-pills">
        <button class="btn btn-sm btn-primary cat-filter-btn" data-cat="all">All Tools (39)</button>
        <button class="btn btn-sm btn-secondary cat-filter-btn" data-cat="image">Image Tools (6)</button>
        <button class="btn btn-sm btn-secondary cat-filter-btn" data-cat="pdf">PDF Tools (6)</button>
        <button class="btn btn-sm btn-secondary cat-filter-btn" data-cat="calculators">Calculators (6)</button>
        <button class="btn btn-sm btn-secondary cat-filter-btn" data-cat="qr">QR Code Tools (4)</button>
        <button class="btn btn-sm btn-secondary cat-filter-btn" data-cat="text">Text Tools (5)</button>
        <button class="btn btn-sm btn-secondary cat-filter-btn" data-cat="developer">Developer Tools (4)</button>
        <button class="btn btn-sm btn-secondary cat-filter-btn" data-cat="converters">Unit Converters (4)</button>
        <button class="btn btn-sm btn-secondary cat-filter-btn" data-cat="other">Other Tools (4)</button>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid var(--border-color); padding-bottom:0.75rem;">
        <span style="font-size:0.9375rem; font-weight:600; color:var(--text-muted);" id="showing-count">Showing 39 of 39 Tools</span>
      </div>

      <div class="tools-grid" id="directory-tools-grid"></div>

      <div id="no-results-state" style="display:none; text-align:center; padding:4rem 1rem;">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 1rem; color:var(--text-light);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:0.5rem;">No matching tools found</h3>
        <p style="color:var(--text-muted); margin-bottom:1.5rem;">Try modifying your search or picking a different category.</p>
        <button class="btn btn-primary" id="btn-reset-filters">Reset All Filters</button>
      </div>

      <div class="ad-slot-wrapper">
        <span class="ad-label">Advertisement</span>
        <div class="ad-slot ad-slot-responsive">
          <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
            <span style="font-size:0.75rem; color:var(--text-light);">Google AdSense Display Unit (Responsive Banner)</span>
            <span style="font-size:0.7rem; color:var(--text-muted); opacity:0.6;">Ready for AdSense Publisher ID</span>
          </div>
        </div>
      </div>
    </div>
  </main>

  ${getStandaloneFooter()}

  <script>
    ${toolsDataJs}
  </script>
  <script>
    function getToolUrl(toolId) { return toolId + '.html'; }
    ${mainJs}
  </script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const searchInput = document.getElementById('directory-search');
      const searchClear = document.getElementById('directory-clear');
      const grid = document.getElementById('directory-tools-grid');
      const noResults = document.getElementById('no-results-state');
      const countEl = document.getElementById('showing-count');
      const filterBtns = document.querySelectorAll('.cat-filter-btn');
      const resetBtn = document.getElementById('btn-reset-filters');

      let currentCategory = 'all';

      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('category');
      if (catParam) {
        currentCategory = catParam;
        updateActiveButton(catParam);
      }

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          currentCategory = btn.dataset.cat;
          updateActiveButton(currentCategory);
          renderFilteredTools();
        });
      });

      searchInput.addEventListener('input', () => {
        searchClear.style.display = searchInput.value.length ? 'block' : 'none';
        renderFilteredTools();
      });

      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        renderFilteredTools();
        searchInput.focus();
      });

      resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        currentCategory = 'all';
        updateActiveButton('all');
        renderFilteredTools();
      });

      function updateActiveButton(cat) {
        filterBtns.forEach(b => {
          if (b.dataset.cat === cat) {
            b.classList.remove('btn-secondary');
            b.classList.add('btn-primary');
          } else {
            b.classList.remove('btn-primary');
            b.classList.add('btn-secondary');
          }
        });
      }

      function renderFilteredTools() {
        const query = searchInput.value.trim().toLowerCase();

        const filtered = SMARTHUB_TOOLS.filter(t => {
          const matchesCat = (currentCategory === 'all' || t.category === currentCategory);
          const matchesQuery = !query || 
            t.name.toLowerCase().includes(query) ||
            t.desc.toLowerCase().includes(query) ||
            t.categoryName.toLowerCase().includes(query) ||
            (t.keywords && t.keywords.some(k => k.toLowerCase().includes(query)));
          return matchesCat && matchesQuery;
        });

        countEl.textContent = \`Showing \${filtered.length} of \${SMARTHUB_TOOLS.length} Tools\`;

        if (filtered.length === 0) {
          grid.style.display = 'none';
          noResults.style.display = 'block';
          return;
        }

        grid.style.display = 'grid';
        noResults.style.display = 'none';

        grid.innerHTML = filtered.map(tool => \`
          <a href="\${tool.id}.html" class="tool-card">
            <div class="tool-card-header">
              <div class="tool-icon-wrapper">\${tool.icon}</div>
              <span class="badge badge-primary">\${tool.categoryName}</span>
            </div>
            <h3 class="tool-card-title">\${tool.name}</h3>
            <p class="tool-card-desc">\${tool.desc}</p>
            <div class="tool-card-footer">
              <span>Open Tool</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </a>
        \`).join('');
      }

      renderFilteredTools();
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, 'tools.html'), toolsHtml, 'utf8');
}

buildStandaloneIndex();
buildStandaloneToolsInRoot();
buildStandaloneToolsDirectory();

console.log('Successfully generated 100% self-contained SmartHub website!');
