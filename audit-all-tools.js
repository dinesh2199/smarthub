const fs = require('fs');
const path = require('path');

const { SMARTHUB_CATEGORIES, SMARTHUB_TOOLS } = require('./assets/js/tools-data.js');

console.log('====================================================');
console.log('   SMARTHUB 40-TOOLS DEEP AUDIT & HEALTH CHECK      ');
console.log('====================================================\n');

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

let results = {
  functional: { pass: 0, fail: 0, issues: [] },
  seo: { pass: 0, fail: 0, issues: [] },
  mobileAndForms: { pass: 0, fail: 0, issues: [] }
};

SMARTHUB_TOOLS.forEach((tool, index) => {
  const rootFile = path.join(__dirname, `${tool.id}.html`);
  const subFile = path.join(__dirname, 'tools', `${tool.id}.html`);
  const fileToTest = fs.existsSync(rootFile) ? rootFile : subFile;

  if (!fs.existsSync(fileToTest)) {
    results.functional.fail++;
    results.functional.issues.push(`[${tool.id}] HTML file missing completely!`);
    return;
  }

  const html = fs.readFileSync(fileToTest, 'utf8');

  // 1. Functional Logic Check
  const def = toolDefs[tool.id];
  if (!def) {
    results.functional.fail++;
    results.functional.issues.push(`[${tool.id}] No definition found in tools-definitions!`);
  } else {
    // Check if script has JS syntax errors
    if (def.script) {
      try {
        new Function(def.script);
        results.functional.pass++;
      } catch (e) {
        results.functional.fail++;
        results.functional.issues.push(`[${tool.id}] JavaScript Syntax Error: ${e.message}`);
      }
    } else {
      results.functional.fail++;
      results.functional.issues.push(`[${tool.id}] Missing client-side JavaScript!`);
    }
  }

  // 2. SEO Check
  let seoIssues = [];
  if (!html.includes('<title>') || html.includes('<title></title>')) seoIssues.push('Missing Title');
  if (!html.includes('name="description"')) seoIssues.push('Missing Meta Description');
  if (!html.includes('<h1')) seoIssues.push('Missing H1 tag');
  if (!html.includes('application/ld+json')) seoIssues.push('Missing Schema JSON-LD');
  if (!html.includes('rel="canonical"')) seoIssues.push('Missing Canonical Link');
  if (!html.includes('How to use') && !html.includes('FAQ')) seoIssues.push('Thin Content');

  if (seoIssues.length === 0) {
    results.seo.pass++;
  } else {
    results.seo.fail++;
    results.seo.issues.push(`[${tool.id}] SEO issues: ${seoIssues.join(', ')}`);
  }

  // 3. Mobile Speed & Form Check
  let mobileIssues = [];
  if (!html.includes('name="viewport"')) mobileIssues.push('Missing viewport');
  if (!html.includes('@media') && !html.includes('grid-template-columns')) mobileIssues.push('Missing responsive rules');
  if (!html.includes('<button') && !html.includes('<input')) mobileIssues.push('No interactive controls');

  if (mobileIssues.length === 0) {
    results.mobileAndForms.pass++;
  } else {
    results.mobileAndForms.fail++;
    results.mobileAndForms.issues.push(`[${tool.id}] Mobile/Form issues: ${mobileIssues.join(', ')}`);
  }
});

console.log('--- AUDIT SUMMARY ---');
console.log(`1. Functional Logic: ${results.functional.pass}/${SMARTHUB_TOOLS.length} Passed, ${results.functional.fail} Failed`);
if (results.functional.issues.length) console.log('   Issues:', results.functional.issues);

console.log(`2. SEO & Google Ranking: ${results.seo.pass}/${SMARTHUB_TOOLS.length} Passed, ${results.seo.fail} Failed`);
if (results.seo.issues.length) console.log('   Issues:', results.seo.issues);

console.log(`3. Mobile & Form Usability: ${results.mobileAndForms.pass}/${SMARTHUB_TOOLS.length} Passed, ${results.mobileAndForms.fail} Failed`);
if (results.mobileAndForms.issues.length) console.log('   Issues:', results.mobileAndForms.issues);
