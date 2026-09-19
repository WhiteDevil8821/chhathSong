import express from 'express';
import path from 'path';
import fs from 'fs';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';
import { CHHATH_SONGS, EXCLUDED_SONG_IDS } from './src/data/chhathData';
import { getSongSlug, findSongBySlug } from './src/utils/songSlug';
import {
  renderHomepageHtml,
  renderSongsDirectoryHtml,
  renderSongPageHtml,
  renderNotFoundHtml
} from './src/server/seoRenderer';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Gzip compression middleware (skip for SSE stream to avoid buffering)
  app.use(
    compression({
      filter: (req, res) => {
        if (req.path.startsWith('/api/presence/stream')) {
          return false;
        }
        return compression.filter(req, res);
      }
    })
  );

  // Security & Best Practice HTTP Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 301 Permanent Redirect non-www (chhathsong.in) to canonical www (www.chhathsong.in), preserving exact pathname and query
  app.use((req, res, next) => {
    const rawHost = req.headers['x-forwarded-host'] || req.headers.host || '';
    const host = (Array.isArray(rawHost) ? rawHost[0] : rawHost).split(':')[0].toLowerCase();
    if (host === 'chhathsong.in') {
      return res.redirect(301, `https://www.chhathsong.in${req.originalUrl}`);
    }
    next();
  });

  // Cache in-memory for playlist data (30 seconds TTL) to prevent repeated remote calls and provide instant responses
  let playlistCache: { [key: string]: { timestamp: number; data: any } } = {};

  // Unescape XML entities helper
  function decodeXml(str: string): string {
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'");
  }

  // 1. Primary Strategy: Official YouTube XML RSS Feed (100% reliable, never blocked by cloud IP or bot checks)
  async function fetchYouTubeFeed(playlistId: string) {
    try {
      const feedUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
      const res = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (!res.ok) return null;
      const xml = await res.text();
      const entries = xml.split('<entry>');
      entries.shift(); // Remove feed header

      const songs: any[] = [];
      for (const entry of entries) {
        const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] || '';
        const rawTitle = entry.match(/<title>(.*?)<\/title>/)?.[1] || '';
        const title = decodeXml(rawTitle);
        const rawAuthor = entry.match(/<author>[\s\S]*?<name>(.*?)<\/name>/)?.[1] || 'छठ महापर्व लोकगायक';
        const artist = decodeXml(rawAuthor);

        if (videoId && title && !EXCLUDED_SONG_IDS.has(videoId)) {
          songs.push({
            id: videoId,
            videoId,
            title,
            artist,
            tag: 'लाइव प्लेलिस्ट गीत',
            duration: 'Chhath Folk'
          });
        }
      }
      return songs.length > 0 ? songs : null;
    } catch (err) {
      console.warn('Error fetching YouTube XML feed:', err);
      return null;
    }
  }

  // 2. Secondary Strategy: Complete Web page extraction with multi-page continuation pagination
  async function fetchYouTubeWebPage(playlistId: string) {
    try {
      const url = `https://www.youtube.com/playlist?list=${playlistId}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'hi,en-US;q=0.9,en;q=0.8'
        }
      });
      if (!res.ok) return null;
      const html = await res.text();

      // Extract Innertube API Key for continuation requests (e.g. videos beyond 100)
      const cfgIdx = html.indexOf('"INNERTUBE_API_KEY":"');
      const apiKey = cfgIdx !== -1 ? html.slice(cfgIdx + 21, html.indexOf('"', cfgIdx + 21)) : '';

      const idx = html.indexOf('ytInitialData = ');
      if (idx === -1) return null;
      const end = html.indexOf(';</script>', idx);
      const data = JSON.parse(html.slice(idx + 16, end));

      const songs: any[] = [];
      const seenIds = new Set<string>();
      let continuationToken = '';

      function findToken(obj: any): string {
        if (!obj || typeof obj !== 'object') return '';
        if (typeof obj.token === 'string' && obj.token.length > 20) return obj.token;
        if (obj.continuationCommand?.token) return obj.continuationCommand.token;
        for (const k in obj) {
          const t = findToken(obj[k]);
          if (t) return t;
        }
        return '';
      }

      function processItem(item: any) {
        if (!item || typeof item !== 'object') return;

        // Pattern 1: Classic desktop playlistVideoRenderer
        if (item.playlistVideoRenderer) {
          const v = item.playlistVideoRenderer;
          const videoId = v.videoId;
          const title = v.title?.runs?.[0]?.text || v.title?.simpleText || '';
          const author = v.shortBylineText?.runs?.[0]?.text || '';
          const duration = v.lengthText?.simpleText || 'Chhath Folk';
          if (videoId && title && !seenIds.has(videoId) && !EXCLUDED_SONG_IDS.has(videoId)) {
            seenIds.add(videoId);
            songs.push({
              id: videoId,
              videoId,
              title,
              artist: author || 'छठ महापर्व लोकगायक',
              tag: 'लाइव प्लेलिस्ट गीत',
              duration
            });
          }
        }

        // Pattern 2: Modern lockupViewModel
        if (item.lockupViewModel) {
          const l = item.lockupViewModel;
          const title = l.metadata?.lockupMetadataViewModel?.title?.content || '';
          const metadataRows =
            l.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows;
          const author = metadataRows?.[0]?.metadataParts?.[0]?.text?.content ||
            metadataRows?.[0]?.elements?.[0]?.text?.content || '';
          const duration = metadataRows?.[1]?.metadataParts?.[0]?.text?.content ||
            metadataRows?.[1]?.elements?.[0]?.text?.content || 'Chhath Folk';

          let videoId = '';
          if (l.contentId && l.contentId.length === 11 && !l.contentId.startsWith('PL')) {
            videoId = l.contentId;
          } else if (l.rendererContext?.commandContext?.onTap?.innertubeCommand?.watchEndpoint?.videoId) {
            videoId = l.rendererContext.commandContext.onTap.innertubeCommand.watchEndpoint.videoId;
          } else {
            const thumbUrl =
              l.contentImage?.thumbnailViewModel?.image?.sources?.[0]?.url ||
              l.contentImage?.collectionThumbnailViewModel?.primaryThumbnail?.thumbnailViewModel?.image?.sources?.[0]?.url ||
              '';
            const idMatch =
              thumbUrl.match(/\/vi\/([a-zA-Z0-9_-]{11})\//) ||
              thumbUrl.match(/\/vi_webp\/([a-zA-Z0-9_-]{11})\//);
            if (idMatch) videoId = idMatch[1];
          }

          if (title && videoId && !seenIds.has(videoId) && !EXCLUDED_SONG_IDS.has(videoId)) {
            seenIds.add(videoId);
            songs.push({
              id: videoId,
              videoId,
              title,
              artist: author || 'छठ महापर्व लोकगायक',
              tag: 'लाइव प्लेलिस्ट गीत',
              duration
            });
          }
        }

        // Check for continuation token
        if (item.continuationItemRenderer || item.continuationItemViewModel) {
          const token = findToken(item);
          if (token) continuationToken = token;
        }
      }

      // Initial page items: strictly within the playlist content section
      const initialItems =
        data.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents ||
        data.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer?.contents ||
        [];

      if (Array.isArray(initialItems)) {
        initialItems.forEach(processItem);
      }

      // If strict selector didn't find items, fallback to safe scan of main tabs only (never sidebar)
      if (songs.length === 0 && data.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]) {
        const tab = data.contents.twoColumnBrowseResultsRenderer.tabs[0];
        const scan = (obj: any) => {
          if (!obj || typeof obj !== 'object') return;
          processItem(obj);
          for (const k in obj) {
            if (k !== 'sidebar' && k !== 'topbar' && k !== 'responseContext') scan(obj[k]);
          }
        };
        scan(tab);
      }

      // Fetch all remaining pages of videos if playlist has > 100 songs (strictly continuation items)
      let pageCount = 0;
      while (continuationToken && apiKey && pageCount < 15) {
        pageCount++;
        const currentToken = continuationToken;
        continuationToken = ''; // Reset before fetch
        try {
          const contUrl = `https://www.youtube.com/youtubei/v1/browse?key=${apiKey}`;
          const contRes = await fetch(contUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept-Language': 'hi,en-US;q=0.9,en;q=0.8'
            },
            body: JSON.stringify({
              context: {
                client: {
                  clientName: 'WEB',
                  clientVersion: '2.20240101.00.00',
                  hl: 'hi',
                  gl: 'IN'
                }
              },
              continuation: currentToken
            })
          });

          if (!contRes.ok) break;
          const contData = await contRes.json();
          const prevCount = songs.length;

          // Strictly extract from onResponseReceivedActions (contains only the next playlist items)
          const actions = contData.onResponseReceivedActions || [];
          for (const action of actions) {
            const items = action.appendContinuationItemsAction?.continuationItems || [];
            if (Array.isArray(items)) {
              items.forEach(processItem);
            }
          }

          if (songs.length === prevCount || !continuationToken) break;
        } catch (pageErr) {
          console.warn('Error fetching playlist continuation page:', pageErr);
          break;
        }
      }

      return songs.length > 0 ? songs : null;
    } catch (err) {
      console.warn('Error fetching YouTube web page:', err);
      return null;
    }
  }

  // Exact real-time presence tracking for online devotees
  const activeSessions = new Map<string, { lastSeen: number; ip?: string }>();
  const sseClients = new Map<string, express.Response>();
  let dailyPeakOnline = 1;

  function broadcastPresence() {
    const currentOnline = Math.max(1, activeSessions.size);
    if (currentOnline > dailyPeakOnline) {
      dailyPeakOnline = currentOnline;
    }

    const payload = JSON.stringify({
      online: currentOnline,
      exactLive: activeSessions.size,
      peakToday: dailyPeakOnline,
      timestamp: Date.now()
    });

    for (const [cid, clientRes] of sseClients.entries()) {
      try {
        clientRes.write(`data: ${payload}\n\n`);
      } catch (err) {
        sseClients.delete(cid);
      }
    }
  }

  // Periodic cleanup of stale non-SSE sessions every 5 seconds
  setInterval(() => {
    const now = Date.now();
    let changed = false;
    for (const [id, session] of activeSessions.entries()) {
      // If client doesn't have an active SSE connection and hasn't polled in > 18s, remove
      if (!sseClients.has(id) && now - session.lastSeen > 18000) {
        activeSessions.delete(id);
        changed = true;
      }
    }
    if (changed) {
      broadcastPresence();
    }
  }, 5000);

  // Real-time SSE Stream Endpoint: Immediate connection & instant push updates
  app.get('/api/presence/stream', (req, res) => {
    const clientId =
      (req.query.cid as string) ||
      `sse_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    });

    res.write(': connected\n\n');

    activeSessions.set(clientId, { lastSeen: Date.now() });
    sseClients.set(clientId, res);

    // Broadcast instantly to all connected devices
    broadcastPresence();

    // Keep-alive ping every 12 seconds to prevent Cloud/Proxy idle connection drop
    const pingInterval = setInterval(() => {
      try {
        res.write(': ping\n\n');
        if (activeSessions.has(clientId)) {
          activeSessions.get(clientId)!.lastSeen = Date.now();
        }
      } catch {
        clearInterval(pingInterval);
      }
    }, 12000);

    req.on('close', () => {
      clearInterval(pingInterval);
      sseClients.delete(clientId);
      activeSessions.delete(clientId);
      broadcastPresence();
    });
  });

  // REST API Route: Real-time Exact Online Users / Heartbeat
  app.get('/api/presence', (req, res) => {
    const clientId =
      (req.query.cid as string) ||
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      'guest';
    const now = Date.now();
    activeSessions.set(clientId, { lastSeen: now });

    const exactCount = Math.max(1, activeSessions.size);
    if (exactCount > dailyPeakOnline) {
      dailyPeakOnline = exactCount;
    }

    // Broadcast update to any listening SSE clients
    broadcastPresence();

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({
      online: exactCount,
      exactLive: activeSessions.size,
      peakToday: dailyPeakOnline,
      isExact: true
    });
  });

  // Client Heartbeat Endpoint
  app.post('/api/presence/heartbeat', (req, res) => {
    const clientId =
      (req.query.cid as string) ||
      (req.body && req.body.cid) ||
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      'guest';
    activeSessions.set(clientId, { lastSeen: Date.now() });
    broadcastPresence();
    res.json({ status: 'ok', online: Math.max(1, activeSessions.size) });
  });

  // Client Leave / Beacon Endpoint (removes immediately upon tab close)
  app.post('/api/presence/leave', (req, res) => {
    const clientId =
      (req.query.cid as string) ||
      (req.body && req.body.cid) ||
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress;
    if (clientId) {
      activeSessions.delete(clientId);
      sseClients.delete(clientId);
    }
    broadcastPresence();
    res.json({ status: 'left', online: Math.max(1, activeSessions.size) });
  });

  // API Route: Health Check
  app.get('/api/health', (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Route: Always Dynamically Fetch YouTube Playlist with Smart Short-lived Cache
  app.get('/api/playlist', async (req, res) => {
    const playlistId = (req.query.list as string) || 'PLenw-C64yBCo';
    const forceRefresh = req.query.fresh === '1';
    const now = Date.now();

    // Return cached if fresh (30s TTL)
    if (!forceRefresh && playlistCache[playlistId] && now - playlistCache[playlistId].timestamp < 30000) {
      res.setHeader('Cache-Control', 'public, max-age=30');
      return res.json(playlistCache[playlistId].data);
    }

    try {
      // 1. Try HTML page extraction first (fetches all 19 songs)
      const pageSongs = await fetchYouTubeWebPage(playlistId);
      if (pageSongs && pageSongs.length > 0) {
        const payload = {
          source: 'youtube-web',
          playlistId,
          count: pageSongs.length,
          songs: pageSongs
        };
        playlistCache[playlistId] = { timestamp: now, data: payload };
        res.setHeader('Cache-Control', 'public, max-age=30');
        return res.json(payload);
      }

      // 2. Fallback to XML RSS feed if web page extraction fails
      const feedSongs = await fetchYouTubeFeed(playlistId);
      if (feedSongs && feedSongs.length > 0) {
        const payload = {
          source: 'youtube-feed',
          playlistId,
          count: feedSongs.length,
          songs: feedSongs
        };
        playlistCache[playlistId] = { timestamp: now, data: payload };
        res.setHeader('Cache-Control', 'public, max-age=30');
        return res.json(payload);
      }

      return res.json({
        source: 'empty',
        playlistId,
        count: 0,
        songs: []
      });
    } catch (e: any) {
      res.status(500).json({
        error: 'Failed to fetch playlist',
        message: e?.message || String(e),
        songs: []
      });
    }
  });

  // Technical SEO: Dynamic & Maintainable Sitemap Endpoint
  // Dynamically includes root homepage, /songs directory, and all 107 individual song pages
  app.get('/sitemap.xml', (req, res) => {
    const canonicalBaseUrl = 'https://www.chhathsong.in';
    const publicRoutes: { path: string; priority: string; changefreq: string }[] = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/songs', priority: '0.9', changefreq: 'daily' },
      ...CHHATH_SONGS.map((song) => ({
        path: `/songs/${getSongSlug(song)}`,
        priority: '0.8',
        changefreq: 'weekly'
      }))
    ];

    const xmlUrls = publicRoutes
      .map(
        (route) =>
          `  <url>\n    <loc>${canonicalBaseUrl}${route.path}</loc>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`
      )
      .join('\n');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlUrls}\n</urlset>\n`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    res.status(200).send(sitemapXml);
  });

  // Technical SEO: Dedicated Robots.txt Endpoint
  app.get('/robots.txt', (req, res) => {
    const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: https://www.chhathsong.in/sitemap.xml\n`;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.status(200).send(robotsTxt);
  });

  // Technical SEO: Dedicated LLMs.txt Endpoint
  app.get('/llms.txt', (req, res) => {
    const llmsPath = path.join(process.cwd(), 'public', 'llms.txt');
    if (fs.existsSync(llmsPath)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
      return res.status(200).sendFile(llmsPath);
    }
    res.status(404).send('Not Found');
  });

  // Helper function to render SEO-injected & pre-rendered HTML for any route
  function renderSeoResponse(reqPath: string, rawHtml: string, res: express.Response) {
    const cleanPath = reqPath.split('?')[0].replace(/\/+$/, '') || '/';

    if (cleanPath === '/' || cleanPath === '') {
      const html = renderHomepageHtml(rawHtml);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      return res.status(200).send(html);
    }

    if (cleanPath === '/songs') {
      const html = renderSongsDirectoryHtml(rawHtml);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      return res.status(200).send(html);
    }

    if (cleanPath.startsWith('/songs/')) {
      const rawSlug = cleanPath.substring(7);
      const song = findSongBySlug(rawSlug);
      if (song) {
        const html = renderSongPageHtml(song, rawHtml);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        return res.status(200).send(html);
      } else {
        // Explicit 404 HTTP Status for non-existent song
        const html = renderNotFoundHtml(rawSlug, rawHtml);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.status(404).send(html);
      }
    }

    // Default fallback
    const html = renderHomepageHtml(rawHtml);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    return res.status(200).send(html);
  }

  // Vite Middleware / Static Serving with High Performance Cache Headers
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);

    app.get('*', async (req, res, next) => {
      if (req.path.startsWith('/api/') || req.path.startsWith('/@') || req.path.includes('.')) {
        return next();
      }
      try {
        const templatePath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        renderSeoResponse(req.path, template, res);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexHtmlPath = path.join(distPath, 'index.html');
    let cachedIndexHtml = '';

    app.use(
      express.static(distPath, {
        maxAge: '1y',
        immutable: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html') || filePath.endsWith('sitemap.xml') || filePath.endsWith('robots.txt') || filePath.endsWith('llms.txt')) {
            res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        }
      })
    );

    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      try {
        if (!cachedIndexHtml && fs.existsSync(indexHtmlPath)) {
          cachedIndexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
        }
        const rawHtml = cachedIndexHtml || (fs.existsSync(indexHtmlPath) ? fs.readFileSync(indexHtmlPath, 'utf-8') : '');
        if (!rawHtml) {
          return res.status(500).send('Application build in progress');
        }
        renderSeoResponse(req.path, rawHtml, res);
      } catch (err) {
        next(err);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chhath Puja Server running at http://localhost:${PORT}`);
  });
}

startServer();
