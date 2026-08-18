import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const DEFAULT_PLAYLIST_ID = 'PLenw-C64yBCo';

  // Helper to scrape YouTube playlist live items
  async function fetchYouTubePlaylist(playlistId: string) {
    try {
      const res = await fetch(`https://www.youtube.com/playlist?list=${playlistId}`, {
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
      console.error('Error fetching YouTube playlist:', err);
      return null;
    }
  }

  // Fallback songs from the exact user playlist
  const fallbackSongs = [
    {
      id: '2RR-GcqTfhU',
      videoId: '2RR-GcqTfhU',
      title: 'Devo Chhath Uga Hey Surujdev | Kalpana Patowary',
      artist: 'कल्पना पटवारी (Kalpana Patowary)',
      tag: 'भिनसरवा अरघ',
      duration: '5:40'
    },
    {
      id: 'BKoD7bTLc2k',
      videoId: 'BKoD7bTLc2k',
      title: 'जोड़े जोड़े फलवा सुरुज देव (Jode Jode Falwa)',
      artist: 'पवन सिंह (Pawan Singh)',
      tag: 'घाट शोभायात्रा',
      duration: '5:15'
    },
    {
      id: '8MzoVsjL4QU',
      videoId: '8MzoVsjL4QU',
      title: 'उग हो सुरुज देव भेल भिनसरवा (Uga Hai Suraj Dev)',
      artist: 'अनुराधा पौडवाल (Anuradha Paudwal)',
      tag: 'प्रातः अर्घ्य',
      duration: '5:24'
    },
    {
      id: 'KWvgJvM2zT0',
      videoId: 'KWvgJvM2zT0',
      title: 'हो दीनानाथ (Ho Deenanath - New Version)',
      artist: 'पद्म भूषण शारदा सिन्हा (Sharda Sinha)',
      tag: 'सर्वकालिक अमर गीत',
      duration: '6:12'
    }
  ];

  // API endpoint for dynamic playlist fetching
  app.get('/api/playlist', async (req, res) => {
    const playlistId = (req.query.list as string) || DEFAULT_PLAYLIST_ID;
    const songs = await fetchYouTubePlaylist(playlistId);
    if (songs && songs.length > 0) {
      return res.json({ success: true, source: 'live_youtube', playlistId, songs });
    }
    return res.json({ success: true, source: 'fallback', playlistId, songs: fallbackSongs });
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
