/**
 * Node.js Generator Script for SmartHub's 39 Functional Tool Pages
 * Run: node generate-all-tools.js
 */

const fs = require('fs');
const path = require('path');

// Include tools registry
const { SMARTHUB_CATEGORIES, SMARTHUB_TOOLS } = require('./assets/js/tools-data.js');

const toolsDir = path.join(__dirname, 'tools');
if (!fs.existsSync(toolsDir)) {
  fs.mkdirSync(toolsDir, { recursive: true });
}

// Helper to escape HTML strings
function esc(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// Generate shared header HTML
function getHeader(activePage = '') {
  return `
  <!-- Site Header -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="../index.html" class="brand-logo" aria-label="SmartHub Home">
        <img src="../assets/images/logo.svg" alt="SmartHub Logo" width="170" height="36">
      </a>
      
      <nav class="nav-menu" aria-label="Main Navigation">
        <a href="../index.html" class="nav-link">Home</a>
        <a href="../tools.html" class="nav-link active">All Tools</a>
        
        <div class="nav-dropdown">
          <a href="#" class="nav-link" aria-haspopup="true">Categories ▾</a>
          <div class="dropdown-menu">
            ${SMARTHUB_CATEGORIES.map(cat => `
              <a href="../tools.html?category=${cat.id}" class="dropdown-item">
                ${cat.icon}
                <span>${cat.name}</span>
              </a>
            `).join('')}
          </div>
        </div>

        <a href="../about.html" class="nav-link">About Us</a>
        <a href="../contact.html" class="nav-link">Contact</a>
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

// Generate shared footer HTML
function getFooter() {
  return `
  <!-- Site Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="../index.html" class="brand-logo">
            <img src="../assets/images/logo.svg" alt="SmartHub Logo" width="160" height="34">
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
            <li><a href="../tools.html?category=image">Image Tools</a></li>
            <li><a href="../tools.html?category=pdf">PDF Tools</a></li>
            <li><a href="../tools.html?category=calculators">Calculators</a></li>
            <li><a href="../tools.html?category=qr">QR Code Tools</a></li>
            <li><a href="../tools.html?category=text">Text Tools</a></li>
            <li><a href="../tools.html?category=developer">Developer Tools</a></li>
            <li><a href="../tools.html?category=converters">Unit Converters</a></li>
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
          <h4>Company & Legal</h4>
          <ul class="footer-links">
            <li><a href="../about.html">About Us</a></li>
            <li><a href="../contact.html">Contact Support</a></li>
            <li><a href="../privacy-policy.html">Privacy Policy</a></li>
            <li><a href="../terms.html">Terms & Conditions</a></li>
            <li><a href="../disclaimer.html">Disclaimer</a></li>
            <li><a href="../sitemap.xml">Sitemap</a></li>
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

// Generate Top and Bottom Ad Slots
function getAdSlot(type = 'leaderboard') {
  return `
  <!-- AdSense Compliant Unit -->
  <div class="ad-slot-wrapper">
    <span class="ad-label">Advertisement</span>
    <div class="ad-slot ${type === 'leaderboard' ? 'ad-slot-leaderboard' : 'ad-slot-responsive'}">
      <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
        <span style="font-size:0.75rem; color:var(--text-light);">Google AdSense Display Unit (Responsive)</span>
        <span style="font-size:0.7rem; color:var(--text-muted); opacity:0.6;">Ad slot ready for publisher ID</span>
      </div>
    </div>
  </div>`;
}

// Generate Related Tools Cards
function getRelatedTools(currentTool) {
  const related = SMARTHUB_TOOLS
    .filter(t => t.category === currentTool.category && t.id !== currentTool.id)
    .slice(0, 3);

  if (related.length === 0) return '';

  return `
  <section class="section" style="padding-top:2rem;">
    <div class="container">
      <div class="section-header" style="margin-bottom:1.5rem;">
        <div class="section-title-group">
          <h3 class="heading-md">Related ${currentTool.categoryName}</h3>
          <p>Explore other fast and private tools in this category</p>
        </div>
      </div>
      <div class="tools-grid">
        ${related.map(t => `
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
  </section>`;
}

// Function to generate tool-specific SEO content (About, Steps, FAQs)
function getToolSEOContent(tool) {
  const steps = [
    { title: "Select or Enter Input", desc: `Upload your files or input your text/parameters directly into the ${tool.name} interface above.` },
    { title: "Customize Settings", desc: `Configure compression, dimensions, rate, or conversion options according to your requirements.` },
    { title: "Process & Download", desc: `Get instant results processed securely in your browser and click Download or Copy to save your output.` }
  ];

  const faqs = [
    {
      q: `Is ${tool.name} completely free to use?`,
      a: `Yes, 100%! SmartHub's ${tool.name} is completely free with no registration, no watermarks, and no usage limitations.`
    },
    {
      q: `Are my files and data private and secure?`,
      a: `Absolutely. SmartHub processes your data locally right inside your web browser using modern client-side APIs. Your files never get uploaded to external servers, guaranteeing total privacy.`
    },
    {
      q: `Does this tool work on mobile devices?`,
      a: `Yes! ${tool.name} is fully responsive and optimized to run seamlessly on iPhones, Android smartphones, tablets, and desktop computers.`
    },
    {
      q: `Do I need to install any software or extensions?`,
      a: `No installation required. You only need a standard modern web browser like Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari.`
    }
  ];

  return `
  <!-- SEO Educational Content & FAQs -->
  <div class="tool-seo-content">
    <div class="seo-card">
      <h2>About ${tool.name}</h2>
      <p>SmartHub's <strong>${tool.name}</strong> is an intuitive, fast, and free online utility designed to simplify your digital workflow. Whether you are a professional, student, developer, or creator, this tool eliminates tedious tasks with zero installation and instant client-side execution.</p>
      <p>${tool.desc} It delivers premium precision while keeping your sensitive documents, images, and calculations completely private on your local device.</p>
      
      <h3 style="font-size:1.15rem; font-weight:700; margin:1.5rem 0 0.75rem;">How to use ${tool.name}</h3>
      <div class="steps-list">
        ${steps.map((s, idx) => `
          <div class="step-item">
            <div class="step-number">${idx + 1}</div>
            <div class="step-text">
              <h4>${s.title}</h4>
              <p>${s.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="seo-card">
      <h2>Frequently Asked Questions</h2>
      <div class="faq-accordion">
        ${faqs.map(f => `
          <details class="faq-item">
            <summary>${f.q}</summary>
            <div class="faq-answer">${f.a}</div>
          </details>
        `).join('')}
      </div>
    </div>
  </div>`;
}

console.log('Base generator helpers prepared.');
module.exports = {
  SMARTHUB_CATEGORIES,
  SMARTHUB_TOOLS,
  getHeader,
  getFooter,
  getAdSlot,
  getRelatedTools,
  getToolSEOContent
};
