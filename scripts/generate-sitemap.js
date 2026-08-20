const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://crecibv.com';
const today = new Date().toISOString().split('T')[0];

const pages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/donaciones', changefreq: 'monthly', priority: '0.8' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap, 'utf8');
console.log(`Sitemap generated: ${outputPath} (lastmod: ${today})`);
