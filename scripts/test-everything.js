const fs = require('fs');
const path = require('path');
const vm = require('vm');

const issues = [];
console.log('====================================================');
console.log('       SMARTHUB COMPLETE SYSTEM DEEP-TEST          ');
console.log('====================================================');

// 1. Check all HTML files in root and tools/
const rootHtmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html')).map(f => path.join('.', f));
const toolsHtmlFiles = fs.existsSync('tools') ? fs.readdirSync('tools').filter(f => f.endsWith('.html')).map(f => path.join('tools', f)) : [];
const allHtmlFiles = [...rootHtmlFiles, ...toolsHtmlFiles];

console.log(`Checking ${allHtmlFiles.length} HTML files...`);

allHtmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // HTML structure
  if (!content.includes('<!DOCTYPE html>')) issues.push({ file, type: 'HTML', msg: 'Missing <!DOCTYPE html>' });
  if (!content.includes('</html>')) issues.push({ file, type: 'HTML', msg: 'Missing closing </html>' });
  if (!content.includes('</body>')) issues.push({ file, type: 'HTML', msg: 'Missing closing </body>' });
  if (!content.includes('</head>')) issues.push({ file, type: 'HTML', msg: 'Missing closing </head>' });
  if (!content.includes('viewport')) issues.push({ file, type: 'Responsive', msg: 'Missing viewport meta tag' });

  // Check script tags
  const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
  let sm;
  while ((sm = scriptRegex.exec(content)) !== null) {
    const attrs = sm[1];
    const code = sm[2];
    
    // Skip external scripts
    if (/src=/i.test(attrs)) continue;

    // JSON-LD scripts
    if (/type=["']application\/ld\+json["']/i.test(attrs)) {
      try {
        JSON.parse(code);
      } catch (err) {
        issues.push({ file, type: 'JSON-LD Schema Error', msg: err.message });
      }
      continue;
    }

    // Standard JavaScript
    if (code.trim().length > 0) {
      try {
        new vm.Script(code, { filename: file });
      } catch (err) {
        issues.push({ file, type: 'JS Syntax Error', msg: err.message });
      }
    }
  }

  // Check internal href links (ignoring template string tokens like ${...})
  const hrefRegex = /href=["']([^"':#]+?\.html)(\?[^"']*)?["']/g;
  let hm;
  const baseDir = path.dirname(file);
  while ((hm = hrefRegex.exec(content)) !== null) {
    const target = hm[1];
    if (target.includes('${')) continue; // Skip template placeholders in client-side generator templates
    const resolvedPath = path.resolve(baseDir, target);
    if (!fs.existsSync(resolvedPath)) {
      issues.push({ file, type: 'Broken Link', msg: `Link target does not exist: ${target} (resolved: ${resolvedPath})` });
    }
  }

  // Check internal img src (ignoring template string tokens)
  const imgRegex = /<img[^>]+src=["']([^"':]+)["']/g;
  let im;
  while ((im = imgRegex.exec(content)) !== null) {
    const src = im[1];
    if (src.includes('${') || src.startsWith('data:') || src.startsWith('blob:')) continue;
    const resolvedImg = path.resolve(baseDir, src);
    if (!fs.existsSync(resolvedImg)) {
      issues.push({ file, type: 'Broken Image', msg: `Image file does not exist: ${src}` });
    }
  }
});

// 2. Check PWA Manifest
console.log('Checking PWA Manifest & Icons...');
if (!fs.existsSync('manifest.json')) {
  issues.push({ file: 'manifest.json', type: 'PWA', msg: 'manifest.json file is missing' });
} else {
  try {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    if (!manifest.icons || manifest.icons.length === 0) {
      issues.push({ file: 'manifest.json', type: 'PWA', msg: 'No icons specified in manifest.json' });
    } else {
      manifest.icons.forEach(icon => {
        if (!fs.existsSync(icon.src)) {
          issues.push({ file: 'manifest.json', type: 'PWA', msg: `Manifest icon does not exist: ${icon.src}` });
        } else {
          const stats = fs.statSync(icon.src);
          if (stats.size === 0) {
            issues.push({ file: 'manifest.json', type: 'PWA', msg: `Manifest icon is 0 bytes: ${icon.src}` });
          }
        }
      });
    }
  } catch (err) {
    issues.push({ file: 'manifest.json', type: 'PWA', msg: `manifest.json JSON parse error: ${err.message}` });
  }
}

// 3. Check Service Worker (sw.js)
console.log('Checking Service Worker...');
if (!fs.existsSync('sw.js')) {
  issues.push({ file: 'sw.js', type: 'PWA', msg: 'sw.js file is missing' });
} else {
  const swCode = fs.readFileSync('sw.js', 'utf8');
  try {
    new vm.Script(swCode, { filename: 'sw.js' });
  } catch (err) {
    issues.push({ file: 'sw.js', type: 'PWA', msg: `sw.js syntax error: ${err.message}` });
  }
  
  // Verify cached assets
  const cacheMatches = swCode.match(/'\.\/([^']+)'/g);
  if (cacheMatches) {
    cacheMatches.forEach(item => {
      const cleanAsset = item.replace(/[']/g, '').replace(/^\.\//, '');
      if (cleanAsset && cleanAsset !== '' && !fs.existsSync(cleanAsset)) {
        issues.push({ file: 'sw.js', type: 'PWA Cache', msg: `Service Worker cached asset not found: ${cleanAsset}` });
      }
    });
  }
}

// 4. Check CSS files
console.log('Checking CSS styles...');
['assets/css/style.css', 'assets/css/tools.css'].forEach(cssPath => {
  if (!fs.existsSync(cssPath)) {
    issues.push({ file: cssPath, type: 'CSS', msg: 'CSS file missing' });
  } else {
    const css = fs.readFileSync(cssPath, 'utf8');
    // Check balanced braces
    const openBraces = (css.match(/\{/g) || []).length;
    const closeBraces = (css.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      issues.push({ file: cssPath, type: 'CSS', msg: `Unbalanced CSS braces: { count = ${openBraces}, } count = ${closeBraces}` });
    }
  }
});

// 5. Check JS Source files
console.log('Checking JS Source files...');
[
  'assets/js/main.js',
  'assets/js/tools-data.js',
  'tools-definitions-ai.js',
  'tools-definitions-calc.js',
  'tools-definitions-conv.js',
  'tools-definitions-dev.js',
  'tools-definitions-image.js',
  'tools-definitions-other.js',
  'tools-definitions-pdf.js',
  'tools-definitions-qr.js',
  'tools-definitions-text.js'
].forEach(jsPath => {
  if (!fs.existsSync(jsPath)) {
    issues.push({ file: jsPath, type: 'JS', msg: 'JS file missing: ' + jsPath });
  } else {
    const js = fs.readFileSync(jsPath, 'utf8');
    try {
      new vm.Script(js, { filename: jsPath });
    } catch (err) {
      issues.push({ file: jsPath, type: 'JS Syntax Error', msg: err.message });
    }
  }
});

// 6. Check sitemap and robots.txt
console.log('Checking SEO files (sitemap.xml, robots.txt, ads.txt)...');
if (!fs.existsSync('sitemap.xml')) issues.push({ file: 'sitemap.xml', type: 'SEO', msg: 'sitemap.xml missing' });
if (!fs.existsSync('robots.txt')) issues.push({ file: 'robots.txt', type: 'SEO', msg: 'robots.txt missing' });
if (!fs.existsSync('ads.txt')) issues.push({ file: 'ads.txt', type: 'Monetization', msg: 'ads.txt missing' });

console.log('====================================================');
console.log(`AUDIT FINISHED: Total Issues Found = ${issues.length}`);
console.log('====================================================');

if (issues.length > 0) {
  console.log(JSON.stringify(issues, null, 2));
  process.exit(1);
} else {
  console.log('✅ 100% PERFECT: Zero syntax errors, zero broken links, zero missing assets!');
  process.exit(0);
}
