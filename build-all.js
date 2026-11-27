/**
 * SmartHub Master Page Generator
 * Builds all 39 tool pages, sitemap.xml, and robots.txt
 */

const fs = require('fs');
const path = require('path');

const {
  SMARTHUB_CATEGORIES,
  SMARTHUB_TOOLS,
  getHeader,
  getFooter,
  getAdSlot,
  getRelatedTools,
  getToolSEOContent
} = require('./generate-all-tools.js');

// Merge all tool definitions
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

const toolsDir = path.join(__dirname, 'tools');
if (!fs.existsSync(toolsDir)) {
  fs.mkdirSync(toolsDir, { recursive: true });
}

let generatedCount = 0;

SMARTHUB_TOOLS.forEach(tool => {
  const def = toolDefs[tool.id];
  if (!def) {
    console.error(`Missing definition for tool: ${tool.id}`);
    return;
  }

  const pageTitle = `${tool.name} – Free Online Tool | SmartHub`;
  const metaDesc = `${tool.desc} 100% free, private browser-based tool on SmartHub with no file upload limits or registration.`;
  const canonicalUrl = `https://smarthub.online/tools/${tool.id}.html`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDesc}">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph / Social Media -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="SmartHub">
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="../assets/images/favicon.svg">
  
  <!-- CSS Stylesheets -->
  <link rel="stylesheet" href="../assets/css/style.css">
  <link rel="stylesheet" href="../assets/css/tools.css">
  
  <!-- Extra Tool-specific Libraries -->
  ${def.extraHead || ''}
  
  <!-- JSON-LD Structured Data Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "${tool.name}",
    "description": "${tool.desc}",
    "url": "${canonicalUrl}",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }
  </script>
</head>
<body>
  ${getHeader(tool.id)}

  <main class="section" style="padding-top:2rem;">
    <div class="container">
      <!-- Breadcrumbs Navigation -->
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="separator">/</span>
        <a href="../tools.html?category=${tool.category}">${tool.categoryName}</a>
        <span class="separator">/</span>
        <span class="current" aria-current="page">${tool.name}</span>
      </nav>

      <!-- Tool Header -->
      <div class="tool-header-section">
        <div class="tool-header-top">
          <div class="tool-header-left">
            <div class="tool-header-icon">
              ${tool.icon}
            </div>
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

      <!-- Tool Interactive Workspace -->
      <div class="tool-workspace">
        ${def.renderWorkspace()}
      </div>

      ${getAdSlot('responsive')}

      <!-- Tool SEO Description, How-To, & FAQs -->
      ${getToolSEOContent(tool)}

      <!-- Related Tools in this Category -->
      ${getRelatedTools(tool)}

      <!-- Newsletter Section -->
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

  ${getFooter()}

  <!-- Core Scripts -->
  <script src="../assets/js/tools-data.js"></script>
  <script src="../assets/js/main.js"></script>
  <script>
    ${def.script}
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(toolsDir, `${tool.id}.html`), html, 'utf8');
  generatedCount++;
});

console.log(`Generated all ${generatedCount} tool pages in tools/ successfully!`);
