const fs = require('fs');
const { SMARTHUB_TOOLS } = require('./assets/js/tools-data.js');

const baseUrl = 'https://smarthub.rk-solutions.co.in';
const today = '2026-11-28';

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

const staticPages = [
  { url: 'index.html', priority: '1.0', freq: 'daily' },
  { url: 'tools.html', priority: '0.9', freq: 'daily' },
  { url: 'about.html', priority: '0.7', freq: 'monthly' },
  { url: 'contact.html', priority: '0.7', freq: 'monthly' },
  { url: 'privacy-policy.html', priority: '0.5', freq: 'monthly' },
  { url: 'terms.html', priority: '0.5', freq: 'monthly' },
  { url: 'disclaimer.html', priority: '0.5', freq: 'monthly' }
];

staticPages.forEach(p => {
  xml += '  <url>\n';
  xml += '    <loc>' + baseUrl + '/' + p.url + '</loc>\n';
  xml += '    <lastmod>' + today + '</lastmod>\n';
  xml += '    <changefreq>' + p.freq + '</changefreq>\n';
  xml += '    <priority>' + p.priority + '</priority>\n';
  xml += '  </url>\n';
});

SMARTHUB_TOOLS.forEach(t => {
  xml += '  <url>\n';
  xml += '    <loc>' + baseUrl + '/' + t.id + '.html</loc>\n';
  xml += '    <lastmod>' + today + '</lastmod>\n';
  xml += '    <changefreq>weekly</changefreq>\n';
  xml += '    <priority>0.8</priority>\n';
  xml += '  </url>\n';
});

xml += '</urlset>\n';

fs.writeFileSync('sitemap.xml', xml, 'utf8');
console.log('sitemap.xml successfully generated with ' + (staticPages.length + SMARTHUB_TOOLS.length) + ' URLs.');
