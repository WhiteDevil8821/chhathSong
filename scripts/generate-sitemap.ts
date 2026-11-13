import fs from 'fs';
import path from 'path';
import { CHHATH_SONGS } from '../src/data/chhathData';
import { getSongSlug } from '../src/utils/songSlug';

export function generateSitemapXml(): string {
  const canonicalBaseUrl = 'https://www.chhathsong.in';
  const today = new Date().toISOString().split('T')[0];

  const publicRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/songs', priority: '0.9', changefreq: 'daily' },
    ...CHHATH_SONGS.map((song) => ({
      path: `/songs/${encodeURIComponent(getSongSlug(song))}`,
      priority: '0.8',
      changefreq: 'weekly'
    }))
  ];

  const xmlUrls = publicRoutes
    .map(
      (route) =>
        `  <url>\n    <loc>${canonicalBaseUrl}${route.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlUrls}\n</urlset>\n`;
}

const sitemapContent = generateSitemapXml();

// 1. Write to public/sitemap.xml
const publicPath = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(publicPath, sitemapContent, 'utf-8');

// 2. Also write to dist/sitemap.xml if dist exists
const distDir = path.join(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent, 'utf-8');
}

console.log(`Successfully generated sitemap with ${CHHATH_SONGS.length + 2} total URLs and lastmod timestamps.`);
