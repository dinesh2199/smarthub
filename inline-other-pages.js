const fs = require('fs');
const path = require('path');
const cssStyle = fs.readFileSync('assets/css/style.css', 'utf8');
const cssTools = fs.readFileSync('assets/css/tools.css', 'utf8');
const logoSvg = fs.readFileSync('assets/images/logo.svg', 'utf8');

const pages = ['about.html', 'contact.html', 'privacy-policy.html', 'terms.html', 'disclaimer.html'];

pages.forEach(p => {
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(
    /<link rel="stylesheet" href="assets\/css\/style\.css">\s*<link rel="stylesheet" href="assets\/css\/tools\.css">/,
    `<style>\n${cssStyle}\n${cssTools}\n</style>`
  );
  content = content.replace(
    /<img src="assets\/images\/logo\.svg"[^>]*>/g,
    logoSvg
  );
  if (!content.includes('manifest.json')) {
    content = content.replace(
      '</head>',
      `  <link rel="manifest" href="manifest.json">\n  <meta name="theme-color" content="#2563eb">\n  <meta name="apple-mobile-web-app-capable" content="yes">\n  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n  <meta name="apple-mobile-web-app-title" content="SmartHub">\n  <link rel="apple-touch-icon" href="assets/images/icon-192.png">\n</head>`
    );
  }
  fs.writeFileSync(p, content, 'utf8');
  console.log('Inlined:', p);
});

// Also create a folder with these 6 updated files
const dest = 'd:/Projects/UPDATE_THESE_6_PAGES';
if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

const filesToCopy = ['tools.html', ...pages];
filesToCopy.forEach(f => {
  fs.copyFileSync(f, path.join(dest, f));
});
console.log('Copied all 6 files to d:/Projects/UPDATE_THESE_6_PAGES');
