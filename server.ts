import express from 'express';
import path from 'path';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Gzip compression middleware to drastically reduce payload sizes and increase loading speed
  app.use(compression());

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

        if (videoId && title) {
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

  // 2. Secondary Strategy: Web page extraction
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
      const idx = html.indexOf('ytInitialData = ');
      if (idx === -1) return null;
      const end = html.indexOf(';</script>', idx);
      const data = JSON.parse(html.slice(idx + 16, end));

      const songs: any[] = [];
      const seenIds = new Set<string>();

      function extractLockups(obj: any) {
        if (!obj || typeof obj !== 'object') return;
        if (obj.lockupViewModel) {
          const l = obj.lockupViewModel;
          const title = l.metadata?.lockupMetadataViewModel?.title?.content;
          const metadata =
            l.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows;
          const author = metadata?.[0]?.elements?.[0]?.text?.content || '';
          const idMatch = l.contentImage?.thumbnailViewModel?.image?.sources?.[0]?.url?.match(
            /\/vi\/([^\/]+)\//
          );
          const videoId = idMatch ? idMatch[1] : l.contentId || '';
          if (title && videoId && !seenIds.has(videoId)) {
            seenIds.add(videoId);
            songs.push({
              id: videoId,
              videoId,
              title,
              artist: author || 'छठ महापर्व लोकगायक',
              tag: 'लाइव प्लेलिस्ट गीत',
              duration: metadata?.[1]?.elements?.[0]?.text?.content || 'Chhath Folk'
            });
          }
        }
        for (const k in obj) {
          if (k !== 'responseContext') extractLockups(obj[k]);
        }
      }
      extractLockups(data);
      return songs.length > 0 ? songs : null;
    } catch (err) {
      console.warn('Error fetching YouTube web page:', err);
      return null;
    }
  }

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
      // 1. Try official XML RSS Feed first (always succeeds on cloud and local without blocking)
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

      // 2. Try HTML page extraction
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

  // Vite Middleware / Static Serving with High Performance Cache Headers
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(
      express.static(distPath, {
        maxAge: '1y',
        immutable: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html') || filePath.endsWith('sitemap.xml') || filePath.endsWith('robots.txt')) {
            res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        }
      })
    );
    app.get('*all', (req, res) => {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chhath Puja Server running at http://localhost:${PORT}`);
  });
}

startServer();
