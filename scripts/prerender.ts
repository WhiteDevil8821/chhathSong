import fs from 'fs';
import path from 'path';
import { CHHATH_SONGS } from '../src/data/chhathData';
import { getSongSlug } from '../src/utils/songSlug';
import {
  renderHomepageHtml,
  renderSongsDirectoryHtml,
  renderSongPageHtml,
  renderNotFoundHtml
} from '../src/server/seoRenderer';

export function runPrerender() {
  const distDir = path.join(process.cwd(), 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.warn('[Prerender] dist/index.html not found. Skipping prerender step.');
    return;
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  console.log('[Prerender] Starting static HTML generation for all canonical routes...');

  // 1. Homepage (/)
  const homeHtml = renderHomepageHtml(baseHtml);
  fs.writeFileSync(indexHtmlPath, homeHtml, 'utf-8');

  // 2. Songs Directory (/songs and /songs/index.html)
  const songsDir = path.join(distDir, 'songs');
  if (!fs.existsSync(songsDir)) {
    fs.mkdirSync(songsDir, { recursive: true });
  }

  const songsHtml = renderSongsDirectoryHtml(baseHtml);
  fs.writeFileSync(path.join(distDir, 'songs.html'), songsHtml, 'utf-8');
  fs.writeFileSync(path.join(songsDir, 'index.html'), songsHtml, 'utf-8');

  // 3. 404 Fallback page
  const notFoundHtml = renderNotFoundHtml('not-found', baseHtml);
  fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf-8');

  // 4. Individual Song Pages (/songs/<slug>.html and /songs/<slug>/index.html)
  let count = 0;
  for (const song of CHHATH_SONGS) {
    const slug = getSongSlug(song);
    const songHtml = renderSongPageHtml(song, baseHtml);

    // Primary cleanUrls static file: /dist/songs/<slug>.html
    fs.writeFileSync(path.join(songsDir, `${slug}.html`), songHtml, 'utf-8');

    // Directory index fallback: /dist/songs/<slug>/index.html (reliable across all CDNs)
    const slugSubDir = path.join(songsDir, slug);
    if (!fs.existsSync(slugSubDir)) {
      fs.mkdirSync(slugSubDir, { recursive: true });
    }
    fs.writeFileSync(path.join(slugSubDir, 'index.html'), songHtml, 'utf-8');

    // Also write percent-encoded filename when safe for ext4 (< 240 bytes)
    const encodedSlug = encodeURIComponent(slug);
    if (encodedSlug !== slug && Buffer.byteLength(`${encodedSlug}.html`, 'utf8') < 240) {
      try {
        fs.writeFileSync(path.join(songsDir, `${encodedSlug}.html`), songHtml, 'utf-8');
      } catch {
        // Safe fallback
      }
    }
    count++;
  }

  console.log(`[Prerender] Successfully generated static pages for Homepage, /songs directory, 404, and ${count} individual song pages!`);
}

runPrerender();
