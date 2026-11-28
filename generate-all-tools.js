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

function getCategoryFAQs(tool) {
  if (tool.id === 'invoice-generator') {
    return [
      { q: `Is this invoice generator free for commercial business use?`, a: `Yes, 100% free with no watermarks, subscriptions, or hidden charges. Freelancers, shopkeepers, and agencies can generate unlimited professional invoices.` },
      { q: `Can I add GST / Tax and discounts to the invoice?`, a: `Yes! You can specify 0%, 5%, 12%, 18%, or 28% GST per item line, and add flat or percentage discounts with automatic tax breakdown.` },
      { q: `How do I download the invoice as a PDF?`, a: `Click the 'Print / Save as PDF' button at the top. In your browser's print dialog, select 'Save as PDF' to instantly save a clean, professional PDF.` },
      { q: `Are my client and billing details stored on your server?`, a: `No. All invoice details remain strictly inside your browser. No client information or financial data is ever stored or transmitted to external servers.` }
    ];
  }
  if (tool.id === 'gst-calculator') {
    return [
      { q: `What are the current GST tax slabs in India?`, a: `India currently levies GST under 5 major slabs: 0% (Nil / Exempt for basic food & grains), 5% (Essentials & transport), 12% (Standard goods/processed food), 18% (Most services & capital goods), and 28% (Luxury items, cars & aerated drinks).` },
      { q: `What is the difference between CGST, SGST, and IGST?`, a: `CGST (Central GST) and SGST (State GST) apply to intra-state sales within the same state (split 50:50). IGST (Integrated GST) applies to inter-state sales and imports, collected directly by the Central Government.` },
      { q: `How does GST Inclusive vs Exclusive calculation work?`, a: `GST Exclusive means GST is added on top of the base amount: Total = Base + (Base × Rate%). GST Inclusive means the entered price already includes tax: Base = Total / (1 + Rate%), and GST = Total - Base.` },
      { q: `Can I copy or print the GST calculation summary?`, a: `Yes, click the 'Copy Calculation Summary' button to copy the breakdown or use browser print to save a record.` }
    ];
  }
  if (tool.id === 'image-resizer') {
    return [
      { q: `What are the standard dimensions for an Indian Passport photo?`, a: `Indian passport photos require 3.5 cm × 4.5 cm (approximately 350 × 450 pixels or 413 × 531 pixels at 300 DPI) with white background.` },
      { q: `What dimensions should I use for Instagram and YouTube?`, a: `Use 1080 × 1080 px for standard square Instagram posts, 1080 × 1920 px for Stories/Reels, and 1280 × 720 px for YouTube video thumbnails.` },
      { q: `Does resizing reduce image sharpness or quality?`, a: `SmartHub uses high-performance HTML5 Canvas bicubic interpolation to maintain clean, crisp edges when scaling down or adjusting dimensions.` },
      { q: `Can I convert the format while resizing?`, a: `Yes! You can choose to export your resized picture as JPG, lossless PNG, or modern lightweight WEBP.` }
    ];
  }
  const cat = tool.category || '';
  if (cat === 'image') {
    return [
      { q: `Does using ${tool.name} reduce visible picture quality?`, a: `No. SmartHub uses high-performance HTML5 Canvas and bicubic scaling algorithms to preserve crisp details and sharp colors while optimizing file size efficiently.` },
      { q: `What image formats are supported?`, a: `This tool supports all popular modern formats including JPG, JPEG, PNG, and WEBP.` },
      { q: `Are my private photos uploaded to a cloud server?`, a: `Never. All image processing takes place directly inside your device's browser memory. Your personal photos never touch an external server.` },
      { q: `Can I use ${tool.name} on my Android phone or iPhone?`, a: `Yes! The tool is 100% mobile-friendly with responsive touch controls, working smoothly across all smartphone browsers.` }
    ];
  } else if (cat === 'pdf') {
    return [
      { q: `Is it safe to process confidential documents with ${tool.name}?`, a: `Yes, completely safe. All PDF parsing, merging, splitting, and rendering happens client-side using WebAssembly and PDF-Lib. Your documents remain strictly on your device.` },
      { q: `Is there any page limit or file size restriction?`, a: `SmartHub does not impose artificial limits. You can process documents of any reasonable size supported by your browser's memory.` },
      { q: `Does this PDF tool require installing software or plugins?`, a: `No installation, extensions, or Adobe Acrobat licenses are needed. Everything runs instantly inside your web browser.` },
      { q: `Can I download the processed PDF immediately?`, a: `Yes, as soon as processing completes, click the Download button to save the ready PDF directly to your device storage.` }
    ];
  } else if (cat === 'calculators') {
    return [
      { q: `How accurate are the results of ${tool.name}?`, a: `SmartHub uses standard financial and mathematical banking formulas to deliver exact, precision-verified calculations.` },
      { q: `Can I use this for official financial or educational planning?`, a: `Yes, the formulas adhere to standard international calculation guidelines suitable for loans, tax computations, and everyday estimates.` },
      { q: `Do I need to sign in or save my financial details?`, a: `No login or registration is required. None of your entered numbers or personal figures are stored or transmitted.` },
      { q: `Does the calculator work smoothly on mobile screens?`, a: `Yes, all inputs and interactive sliders are optimized for mobile touchscreens with instant real-time computation.` }
    ];
  } else if (cat === 'qr') {
    return [
      { q: `Do QR codes generated by ${tool.name} ever expire?`, a: `No, standard static QR codes generated here never expire. They directly encode your destination text or URL permanently.` },
      { q: `Can I use the generated QR code for commercial printing?`, a: `Yes! You can download high-resolution QR images ready for print on business cards, menus, posters, and merchandise.` },
      { q: `Is there a scan limit for these QR codes?`, a: `There are zero scan limits. Anyone can scan your QR code unlimited times with any standard smartphone camera.` },
      { q: `Are these QR codes free for commercial use?`, a: `Yes, 100% free with no watermarks, licenses, or recurring fees.` }
    ];
  } else if (cat === 'text') {
    return [
      { q: `Is my text copied or stored on any server?`, a: `No. All text processing and manipulation occurs strictly within your browser's local sandbox memory.` },
      { q: `Can I process long articles or essays?`, a: `Yes, you can paste or type lengthy documents, essays, code snippets, or articles with instant real-time output.` },
      { q: `Does ${tool.name} support one-click copy?`, a: `Yes! Click the 'Copy Result' button to instantly copy your output directly to your device clipboard.` },
      { q: `Does this tool work on mobile devices?`, a: `Yes, the layout adjusts automatically to mobile screens with touch-friendly action buttons.` }
    ];
  } else {
    return [
      { q: `Is ${tool.name} completely free to use?`, a: `Yes, 100%! SmartHub's ${tool.name} is completely free with no registration, no watermarks, and no usage limitations.` },
      { q: `Are my data and parameters private and secure?`, a: `Absolutely. SmartHub processes your data locally right inside your web browser using modern client-side APIs. Your files never get uploaded to external servers, guaranteeing total privacy.` },
      { q: `Does this tool work on mobile devices?`, a: `Yes! ${tool.name} is fully responsive and optimized to run seamlessly on iPhones, Android smartphones, tablets, and desktop computers.` },
      { q: `Do I need to install any software or extensions?`, a: `No installation required. You only need a standard modern web browser like Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari.` }
    ];
  }
}

// Function to generate tool-specific SEO content (About, Highlights, Steps, FAQs)
function getToolSEOContent(tool) {
  const steps = [
    { title: "Select or Enter Input", desc: `Upload your files or enter your numbers, text, or parameters directly into the ${tool.name} interface above.` },
    { title: "Configure Settings", desc: `Adjust real-time sliders, conversion units, formats, or options according to your requirements.` },
    { title: "Instant Result & Download", desc: `View instant results calculated securely on your device. Click Download or Copy to save your output.` }
  ];

  const faqs = getCategoryFAQs(tool);

  return `
  <!-- SEO Educational Content & FAQs -->
  <div class="tool-seo-content">
    <div class="seo-card">
      <h2>About ${tool.name}</h2>
      <p>SmartHub's <strong>${tool.name}</strong> is an intuitive, fast, and free online utility designed to simplify your digital workflow. Whether you are a professional, student, developer, or creator, this tool eliminates tedious tasks with zero installation and instant client-side execution.</p>
      <p>${tool.desc} It delivers premium precision while keeping your sensitive documents, images, and calculations completely private on your local device.</p>
      
      <!-- Key Features & Highlights -->
      <h3 style="font-size:1.15rem; font-weight:700; margin:1.5rem 0 0.75rem;">Key Features &amp; Benefits</h3>
      <div class="seo-features-grid">
        <div class="seo-feature-box">
          <div class="seo-feature-icon">⚡</div>
          <div class="seo-feature-title">Instant Speed</div>
          <p class="seo-feature-desc">All calculations and processing execute in milliseconds right in your browser with zero server latency.</p>
        </div>
        <div class="seo-feature-box">
          <div class="seo-feature-icon">🔒</div>
          <div class="seo-feature-title">100% Client-Side Privacy</div>
          <p class="seo-feature-desc">Your files and data never leave your computer or phone. Guaranteed zero server storage or transmission.</p>
        </div>
        <div class="seo-feature-box">
          <div class="seo-feature-icon">📱</div>
          <div class="seo-feature-title">Mobile &amp; Touch Friendly</div>
          <p class="seo-feature-desc">Fully responsive touch-friendly controls designed for smooth operation on Android, iPhone, and desktop.</p>
        </div>
        <div class="seo-feature-box">
          <div class="seo-feature-icon">🆓</div>
          <div class="seo-feature-title">100% Free Forever</div>
          <p class="seo-feature-desc">Unlimited usage, zero subscription fees, no account registration, and no hidden watermarks.</p>
        </div>
      </div>

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
  getCategoryFAQs,
  getHeader,
  getFooter,
  getAdSlot,
  getRelatedTools,
  getToolSEOContent
};
