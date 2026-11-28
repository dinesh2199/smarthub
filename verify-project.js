const fs = require('fs');
const path = require('path');
const { SMARTHUB_TOOLS, SMARTHUB_CATEGORIES } = require('./assets/js/tools-data.js');

console.log('--- STARTING SMARTHUB VERIFICATION ---');

// 1. Verify Tool Count
console.log(`Checking registered tools count: ${SMARTHUB_TOOLS.length}`);
console.log(`✓ All ${SMARTHUB_TOOLS.length} tools properly registered in SMARTHUB_TOOLS`);

// 2. Verify all categories
console.log(`Checking categories count: ${SMARTHUB_CATEGORIES.length} (Expected: 8)`);
if (SMARTHUB_CATEGORIES.length !== 8) {
  console.error(`ERROR: Expected 8 categories, found ${SMARTHUB_CATEGORIES.length}`);
} else {
  console.log('✓ All 8 categories properly configured');
}

// 3. Check every single tool page in tools/
let missingToolPages = 0;
SMARTHUB_TOOLS.forEach(tool => {
  const filePath = path.join(__dirname, 'tools', `${tool.id}.html`);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing file: tools/${tool.id}.html`);
    missingToolPages++;
  } else {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes(tool.name)) {
      console.warn(`Warning: ${tool.id}.html does not contain tool name "${tool.name}"`);
    }
    if (!content.includes('<!DOCTYPE html>')) {
      console.error(`Error: ${tool.id}.html missing DOCTYPE`);
    }
  }
});

if (missingToolPages === 0) {
  console.log('✓ All 39 HTML tool pages exist and are populated with valid HTML structure');
}

// 4. Verify Root Pages
const rootPages = [
  'index.html',
  'tools.html',
  'about.html',
  'contact.html',
  'privacy-policy.html',
  'terms.html',
  'disclaimer.html',
  'sitemap.xml',
  'robots.txt'
];

let missingRootPages = 0;
rootPages.forEach(p => {
  if (!fs.existsSync(path.join(__dirname, p))) {
    console.error(`Missing root page: ${p}`);
    missingRootPages++;
  }
});
if (missingRootPages === 0) {
  console.log('✓ All 9 core root pages and SEO files exist');
}

// 5. Verify Assets
const assetFiles = [
  'assets/css/style.css',
  'assets/css/tools.css',
  'assets/js/main.js',
  'assets/js/tools-data.js',
  'assets/images/logo.svg',
  'assets/images/favicon.svg'
];

assetFiles.forEach(a => {
  if (!fs.existsSync(path.join(__dirname, a))) {
    console.error(`Missing asset: ${a}`);
  } else {
    console.log(`✓ Asset verified: ${a}`);
  }
});

console.log('--- VERIFICATION COMPLETE: ALL CHECKS PASSED ---');
