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

  // 4. Individual Song Pages (/songs/<slug> and /songs/<slug>/index.html)
  let count = 0;
  for (const song of CHHATH_SONGS) {
    const slug = getSongSlug(song);
    const songHtml = renderSongPageHtml(song, baseHtml);

    // Write /dist/songs/<slug>.html
    fs.writeFileSync(path.join(distDir, 'songs', `${slug}.html`), songHtml, 'utf-8');

    // Also write /dist/songs/<slug>/index.html for directory-style trailing-slash support
    const individualSongDir = path.join(distDir, 'songs', slug);
    if (!fs.existsSync(individualSongDir)) {
      fs.mkdirSync(individualSongDir, { recursive: true });
    }
    fs.writeFileSync(path.join(individualSongDir, 'index.html'), songHtml, 'utf-8');
    count++;
  }

  console.log(`[Prerender] Successfully generated static pages for Homepage, /songs directory, 404, and ${count} individual song pages!`);
}

runPrerender();
