import { CHHATH_SONGS } from '../data/chhathData';
import { ChhathSong } from '../types';
import { getSongSlug, getSongCanonicalUrl, findSongBySlug } from '../utils/songSlug';

const CANONICAL_DOMAIN = 'https://www.chhathsong.in';

/**
 * Escapes HTML characters for safe injection.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Replaces or injects head tags (title, description, canonical, OG, Twitter, JSON-LD) into the HTML template.
 */
function injectHeadMetadata(
  templateHtml: string,
  options: {
    title: string;
    description: string;
    canonicalUrl: string;
    ogImage?: string;
    ogType?: string;
    jsonLd?: object[];
  }
): string {
  let html = templateHtml;

  // 1. Replace <title>
  const escapedTitle = escapeHtml(options.title);
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapedTitle}</title>`);

  // 2. Replace or inject meta name="title"
  if (html.includes('meta name="title"')) {
    html = html.replace(/<meta name="title" content=".*?" \/>/i, `<meta name="title" content="${escapedTitle}" />`);
  }

  // 3. Replace or inject meta name="description"
  const escapedDesc = escapeHtml(options.description);
  html = html.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${escapedDesc}" />`);

  // 4. Replace or inject canonical link
  const canonicalRegex = /<link\s+[^>]*?rel=["']canonical["'][^>]*?>/i;
  if (canonicalRegex.test(html)) {
    html = html.replace(canonicalRegex, `<link rel="canonical" href="${options.canonicalUrl}" />`);
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${options.canonicalUrl}" />\n  </head>`);
  }

  // 5. Replace OpenGraph & Twitter tags
  html = html.replace(/<meta\s+[^>]*?property=["']og:title["'][^>]*?>/i, `<meta property="og:title" content="${escapedTitle}" />`);
  html = html.replace(/<meta\s+[^>]*?property=["']og:description["'][^>]*?>/i, `<meta property="og:description" content="${escapedDesc}" />`);
  html = html.replace(/<meta\s+[^>]*?property=["']og:url["'][^>]*?>/i, `<meta property="og:url" content="${options.canonicalUrl}" />`);
  html = html.replace(/<meta\s+[^>]*?name=["']twitter:title["'][^>]*?>/i, `<meta name="twitter:title" content="${escapedTitle}" />`);
  html = html.replace(/<meta\s+[^>]*?name=["']twitter:description["'][^>]*?>/i, `<meta name="twitter:description" content="${escapedDesc}" />`);

  if (options.ogType) {
    html = html.replace(/<meta\s+[^>]*?property=["']og:type["'][^>]*?>/i, `<meta property="og:type" content="${options.ogType}" />`);
  }

  if (options.ogImage) {
    html = html.replace(/<meta\s+[^>]*?property=["']og:image["'][^>]*?>/i, `<meta property="og:image" content="${options.ogImage}" />`);
    html = html.replace(/<meta\s+[^>]*?property=["']og:image:secure_url["'][^>]*?>/i, `<meta property="og:image:secure_url" content="${options.ogImage}" />`);
    html = html.replace(/<meta\s+[^>]*?name=["']twitter:image["'][^>]*?>/i, `<meta name="twitter:image" content="${options.ogImage}" />`);
  }

  // 6. Replace JSON-LD schema
  if (options.jsonLd && options.jsonLd.length > 0) {
    const jsonLdString = JSON.stringify(options.jsonLd.length === 1 ? options.jsonLd[0] : options.jsonLd);
    const scriptReplacement = `<script type="application/ld+json">\n${jsonLdString}\n    </script>`;
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, scriptReplacement);
  }

  return html;
}

/**
 * Generates crawl-ready pre-rendered HTML for the Homepage (/).
 */
export function renderHomepageHtml(baseHtml: string): string {
  const title = 'छठ पूजा 2026: अमर छठ गीत, नहाय-खाय, खरना व अर्घ्य | ChhathSong.in';
  const description =
    'लोक आस्था का महापर्व छठ 2026: 107+ अमर छठ गीत, शारदा सिन्हा के पावन लोकगीत, संध्या व उषा अर्घ्य का शुभ मुहूर्त, विधि एवं गंगा घाट की परंपरा।';
  const canonicalUrl = `${CANONICAL_DOMAIN}/`;

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ChhathSong.in',
    alternateName: ['छठ पूजा 2026', 'Chhath: The Pride of Bihar', 'Chhath Mahaparv Songs'],
    url: canonicalUrl,
    description: description,
    inLanguage: ['hi', 'en'],
    author: {
      '@type': 'Person',
      name: 'Ankit Kumar',
      email: 'ankit.kumar221099@gmail.com'
    }
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ChhathSong.in',
    url: canonicalUrl,
    logo: `${CANONICAL_DOMAIN}/favicon.svg`,
    description: 'लोक आस्था का महापर्व छठ एवं पारंपरिक छठ गीत संग्रह'
  };

  const topSongs = CHHATH_SONGS.slice(0, 12);
  const featuredSongsHtml = topSongs
    .map((song) => {
      const slug = getSongSlug(song);
      return `
        <li class="song-card" style="margin-bottom: 12px; padding: 12px; border: 1px solid rgba(212,175,55,0.3); border-radius: 12px;">
          <a href="/songs/${slug}" style="color: #FFF5E1; text-decoration: none; font-weight: bold; font-size: 1.1rem; display: block;">
            ${escapeHtml(song.title)}
          </a>
          <div style="color: #D4AF37; font-size: 0.85rem; margin-top: 4px;">
            स्वर: ${escapeHtml(song.singer || song.artist || 'पारंपरिक')} • श्रेणी: ${escapeHtml(song.category || 'छठ महापर्व')}
          </div>
          ${song.meaning ? `<p style="color: rgba(255,245,225,0.75); font-size: 0.85rem; margin-top: 4px;">${escapeHtml(song.meaning.substring(0, 100))}...</p>` : ''}
        </li>`;
    })
    .join('');

  const preRenderedBody = `
    <main id="app-container" style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #FFF5E1;">
      <header style="text-align: center; margin-bottom: 30px;">
        <p style="color: #D4AF37; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.2em; font-weight: bold;">
          मिथिला • मगध • अंग • भोजपुरी माटी
        </p>
        <h1 style="font-size: 2.5rem; color: #FFF5E1; margin: 10px 0; font-family: 'Rozha One', Georgia, serif;">
          लोक आस्था का <span style="color: #D4AF37;">महापर्व छठ</span>
        </h1>
        <h2 style="font-size: 1.2rem; color: #FFE5B4; font-weight: 500; margin-bottom: 12px;">
          अमर छठ गीत, पावन घाट, सजीव अर्घ्य व बिहार की सांस्कृतिक धरोहर
        </h2>
        <p style="max-width: 650px; margin: 0 auto; color: rgba(255,245,225,0.9); font-size: 0.95rem; line-height: 1.6;">
          सूर्यदेव और प्रकृति की उपासना का एकमात्र पावन महापर्व, जहाँ अस्ताचलगामी और उदीयमान दोनों सूर्यों को संपूर्ण श्रद्धा से अर्घ्य अर्पित किया जाता है।
        </p>
      </header>

      <section style="margin-bottom: 30px; padding: 20px; background: rgba(24,15,8,0.85); border: 1px solid rgba(212,175,55,0.3); border-radius: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: gap;">
          <h2 style="font-size: 1.5rem; color: #D4AF37; margin: 0;">लोकप्रिय पावन छठ गीत (${CHHATH_SONGS.length} कुल संग्रह)</h2>
          <a href="/songs" style="color: #180F08; background: #D4AF37; padding: 8px 16px; border-radius: 20px; font-weight: bold; text-decoration: none; font-size: 0.9rem;">
            संपूर्ण १०७+ गीत संग्रह देखें &rarr;
          </a>
        </div>
        <ul style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px;">
          ${featuredSongsHtml}
        </ul>
      </section>

      <section style="padding: 20px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px;">
        <h3 style="color: #D4AF37; font-size: 1.2rem; margin-top: 0;">महापर्व छठ के चार पावन दिवस</h3>
        <p style="color: rgba(255,245,225,0.85); font-size: 0.9rem; line-height: 1.6;">
          प्रथम दिवस: <strong>नहाय-खाय</strong> (कद्दू-भात का सात्विक प्रसाद) • द्वितीय दिवस: <strong>खरना</strong> (गुड़ की खीर व निर्जला व्रत आरंभ) • तृतीय दिवस: <strong>संध्या अर्घ्य</strong> (अस्ताचलगामी सूर्य को प्रथम अर्घ्य) • चतुर्थ दिवस: <strong>उषा अर्घ्य व पारण</strong> (उदीयमान सूर्य को अर्घ्य व व्रत संपन्न)।
        </p>
      </section>
    </main>
  `;

  let htmlWithHead = injectHeadMetadata(baseHtml, {
    title,
    description,
    canonicalUrl,
    jsonLd: [websiteSchema, orgSchema]
  });

  return htmlWithHead.replace(/<div\s+id=["']root["']>([\s\S]*?)<\/div>/i, `<div id="root">${preRenderedBody}</div>`);
}

/**
 * Generates crawl-ready pre-rendered HTML for the Songs Directory (/songs).
 */
export function renderSongsDirectoryHtml(baseHtml: string): string {
  const title = `${CHHATH_SONGS.length} अमर छठ गीत संग्रह, बोल, भावार्थ व शारदा सिन्हा लोकगीत | ChhathSong.in`;
  const description =
    'संपूर्ण 107+ पारंपरिक छठ गीतों का विशाल संग्रह: शारदा सिन्हा, अनुराधा पौडवाल के अमर स्वर, संपूर्ण बोल (Lyrics), भावार्थ व संध्या-उषा अर्घ्य के पावन भजन।';
  const canonicalUrl = `${CANONICAL_DOMAIN}/songs`;

  const songItemsSchema = CHHATH_SONGS.map((song, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    url: `${CANONICAL_DOMAIN}/songs/${getSongSlug(song)}`,
    name: song.title
  }));

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Chhath Mahaparv Sacred Folk Songs Collection',
    description: description,
    url: canonicalUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: CHHATH_SONGS.length,
      itemListElement: songItemsSchema
    }
  };

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${CANONICAL_DOMAIN}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Chhath Songs',
        item: canonicalUrl
      }
    ]
  };

  const allSongsHtml = CHHATH_SONGS.map((song, idx) => {
    const slug = getSongSlug(song);
    return `
      <article style="padding: 14px; background: rgba(24,15,8,0.9); border: 1px solid rgba(212,175,55,0.25); border-radius: 14px;">
        <span style="font-size: 0.75rem; color: #D4AF37; font-weight: bold; font-family: monospace;">#${idx + 1}</span>
        <h2 style="font-size: 1.15rem; margin: 4px 0 6px; color: #FFF5E1;">
          <a href="/songs/${slug}" style="color: #FFF5E1; text-decoration: none;">
            ${escapeHtml(song.title)}
          </a>
        </h2>
        <div style="font-size: 0.85rem; color: #FFE5B4; margin-bottom: 6px;">
          स्वर: <strong>${escapeHtml(song.singer || song.artist || 'पारंपरिक लोकगायक')}</strong>
        </div>
        ${song.lyricsHighlight ? `<p style="font-size: 0.8rem; font-style: italic; color: rgba(255,245,225,0.7); margin: 4px 0;">"${escapeHtml(song.lyricsHighlight)}"</p>` : ''}
        <a href="/songs/${slug}" style="display: inline-block; margin-top: 6px; color: #D4AF37; font-size: 0.85rem; font-weight: bold; text-decoration: underline;">
          गीत व संपूर्ण भावार्थ देखें &rarr;
        </a>
      </article>`;
  }).join('');

  const preRenderedBody = `
    <main id="app-container" style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #FFF5E1;">
      <nav aria-label="Breadcrumb" style="font-size: 0.85rem; color: rgba(255,245,225,0.7); margin-bottom: 20px;">
        <a href="/" style="color: #D4AF37; text-decoration: none;">मुख्य पृष्ठ (Home)</a> &gt; <span>छठ गीत संग्रह (${CHHATH_SONGS.length})</span>
      </nav>

      <header style="margin-bottom: 24px;">
        <h1 style="font-size: 2.2rem; color: #FFF5E1; margin: 0 0 8px; font-family: 'Rozha One', Georgia, serif;">
          पारंपरिक छठ गीत, भजन व संपूर्ण भावार्थ
        </h1>
        <p style="color: rgba(255,245,225,0.85); font-size: 0.95rem; max-width: 800px; margin: 0;">
          पद्म भूषण शारदा सिन्हा, अनुराधा पौडवाल एवं लोक गायकों के अमर स्वर में रचे-बसे ${CHHATH_SONGS.length} पावन छठ गीतों का संपूर्ण संग्रह, बोल और आध्यात्मिक अर्थ।
        </p>
      </header>

      <section style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 14px;">
        ${allSongsHtml}
      </section>
    </main>
  `;

  let htmlWithHead = injectHeadMetadata(baseHtml, {
    title,
    description,
    canonicalUrl,
    jsonLd: [breadcrumbsSchema, collectionSchema]
  });

  return htmlWithHead.replace(/<div\s+id=["']root["']>([\s\S]*?)<\/div>/i, `<div id="root">${preRenderedBody}</div>`);
}

/**
 * Generates crawl-ready pre-rendered HTML for an individual Song Page (/songs/<slug>).
 */
export function renderSongPageHtml(song: ChhathSong, baseHtml: string): string {
  const slug = getSongSlug(song);
  const canonicalUrl = getSongCanonicalUrl(song);
  const singerName = song.singer || song.artist || 'पारंपरिक लोकगायक';

  const title = song.lyrics
    ? `${song.title} Lyrics – Chhath Song | ChhathSong.in`
    : `${song.title} – Chhath Song, Singer & Meaning | ChhathSong.in`;

  const rawDescription = song.lyrics
    ? `${song.title} - सम्पूर्ण बोल (Lyrics), स्वर: ${singerName}। ${song.meaning || 'छठ महापर्व की महिमा व लोक आस्था का पावन लोकगीत।'}`
    : song.meaning
    ? `${song.title} - स्वर: ${singerName}। ${song.meaning}`
    : `${song.title} - पावन छठ महापर्व लोकगीत, स्वर: ${singerName}। जानें गीत का आध्यात्मिक भावार्थ व सांस्कृतिक महत्व।`;

  const description = rawDescription.length > 155 ? `${rawDescription.substring(0, 152)}...` : rawDescription;
  const ogImage = song.youtubeId ? `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg` : `${CANONICAL_DOMAIN}/chhath-share-banner.svg`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${CANONICAL_DOMAIN}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Chhath Songs',
        item: `${CANONICAL_DOMAIN}/songs`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: song.title,
        item: canonicalUrl
      }
    ]
  };

  const musicSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: song.title,
    byArtist: {
      '@type': 'MusicGroup',
      name: singerName
    },
    inAlbum: 'Chhath Mahaparv Folk Collection',
    genre: 'Devotional / Chhath Folk',
    url: canonicalUrl,
    ...(song.duration ? { duration: song.duration } : {}),
    description: song.meaning || song.culturalContext || description
  };

  if (song.lyrics) {
    musicSchema.recordingOf = {
      '@type': 'MusicComposition',
      name: song.title,
      lyrics: {
        '@type': 'CreativeWork',
        text: song.lyrics
      }
    };
  }

  // Related songs links
  const related = CHHATH_SONGS.filter(s => s.id !== song.id && (s.singer === song.singer || s.category === song.category)).slice(0, 4);
  const relatedHtml = related
    .map(
      (r) =>
        `<li style="margin-bottom: 8px;"><a href="/songs/${getSongSlug(r)}" style="color: #FFE5B4; text-decoration: underline;">${escapeHtml(r.title)}</a> (${escapeHtml(r.singer || 'लोकगायक')})</li>`
    )
    .join('');

  const preRenderedBody = `
    <main id="app-container" style="max-width: 900px; margin: 0 auto; padding: 20px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #FFF5E1;">
      <nav aria-label="Breadcrumb" style="font-size: 0.85rem; color: rgba(255,245,225,0.7); margin-bottom: 16px;">
        <a href="/" style="color: #D4AF37; text-decoration: none;">Home</a> &gt;
        <a href="/songs" style="color: #D4AF37; text-decoration: none;">Chhath Songs</a> &gt;
        <span style="color: #FFE5B4;">${escapeHtml(song.title)}</span>
      </nav>

      <article style="background: rgba(24,15,8,0.9); border: 1px solid rgba(212,175,55,0.35); border-radius: 24px; padding: 24px; margin-bottom: 20px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
          <span style="background: rgba(0,0,0,0.5); border: 1px solid rgba(212,175,55,0.3); color: #D4AF37; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">
            स्वर: ${escapeHtml(singerName)}
          </span>
          ${song.whenSung ? `<span style="background: rgba(0,0,0,0.3); color: #FFE5B4; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem;">${escapeHtml(song.whenSung)}</span>` : ''}
          ${song.tag ? `<span style="background: rgba(212,175,55,0.15); color: #FFE5B4; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem;">${escapeHtml(song.tag)}</span>` : ''}
        </div>

        <h1 style="font-size: 2rem; color: #FFF5E1; margin: 8px 0 16px; font-family: 'Rozha One', Georgia, serif; line-height: 1.3;">
          ${escapeHtml(song.title)}
        </h1>

        ${song.lyricsHighlight ? `
          <div style="background: rgba(0,0,0,0.4); border-left: 4px solid #D4AF37; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px;">
            <p style="font-style: italic; color: #FFE5B4; margin: 0; font-size: 0.95rem;">"${escapeHtml(song.lyricsHighlight)}"</p>
          </div>
        ` : ''}

        <section style="margin-top: 20px;">
          <h2 style="font-size: 1.3rem; color: #D4AF37; margin-bottom: 8px;">आध्यात्मिक भावार्थ एवं महिमा</h2>
          <p style="color: rgba(255,245,225,0.9); line-height: 1.6; font-size: 0.95rem;">
            ${escapeHtml(song.meaning || 'छठ महापर्व का यह पावन लोकगीत सूर्यदेव और छठी मईया की असीम अनुकंपा का गुणगान करता है।')}
          </p>
        </section>

        ${song.culturalContext ? `
          <section style="margin-top: 16px; padding: 12px 16px; background: rgba(0,0,0,0.3); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
            <h3 style="font-size: 0.95rem; color: #D4AF37; margin: 0 0 6px;">सांस्कृतिक परंपरा एवं संदर्भ</h3>
            <p style="color: rgba(255,245,225,0.85); font-size: 0.88rem; line-height: 1.5; margin: 0;">
              ${escapeHtml(song.culturalContext)}
            </p>
          </section>
        ` : ''}

        ${song.lyrics ? `
          <section style="margin-top: 24px; padding: 16px; background: rgba(0,0,0,0.4); border: 1px solid rgba(212,175,55,0.25); border-radius: 16px;">
            <h2 style="font-size: 1.3rem; color: #D4AF37; margin: 0 0 12px;">छठ गीत के संपूर्ण बोल (Lyrics)</h2>
            <div style="white-space: pre-line; line-height: 1.7; font-size: 1rem; color: #FFF5E1;">
              ${escapeHtml(song.lyrics)}
            </div>
          </section>
        ` : `
          <section style="margin-top: 20px; padding: 14px; background: rgba(0,0,0,0.25); border-radius: 12px;">
            <h2 style="font-size: 1.1rem; color: #D4AF37; margin: 0 0 6px;">छठ गीत के बोल (Lyrics)</h2>
            ${song.lyricsSnippetHindi ? `<p style="font-size: 0.95rem; color: #FFE5B4; margin: 0 0 6px;">${escapeHtml(song.lyricsSnippetHindi)}</p>` : ''}
            <p style="font-size: 0.85rem; color: rgba(255,245,225,0.75); margin: 0;">
              इस पावन छठ गीत के संपूर्ण बोल एवं छंद इसी स्थाई पृष्ठ (<code>/songs/${slug}</code>) पर उपलब्ध रहेंगे।
            </p>
          </section>
        `}
      </article>

      <section style="background: rgba(24,15,8,0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 16px;">
        <h3 style="font-size: 1rem; color: #D4AF37; margin-top: 0;">संबंधित छठ गीत (Related Songs)</h3>
        <ul style="padding-left: 20px; margin-bottom: 0;">
          ${relatedHtml}
        </ul>
        <div style="margin-top: 12px;">
          <a href="/songs" style="color: #D4AF37; font-size: 0.9rem; font-weight: bold; text-decoration: none;">
            &larr; सभी ${CHHATH_SONGS.length} पावन छठ गीत संग्रह देखें
          </a>
        </div>
      </section>
    </main>
  `;

  let htmlWithHead = injectHeadMetadata(baseHtml, {
    title,
    description,
    canonicalUrl,
    ogImage,
    ogType: 'music.song',
    jsonLd: [breadcrumbSchema, musicSchema]
  });

  return htmlWithHead.replace(/<div\s+id=["']root["']>([\s\S]*?)<\/div>/i, `<div id="root">${preRenderedBody}</div>`);
}

/**
 * Generates crawl-ready 404 HTML for missing songs.
 */
export function renderNotFoundHtml(slug: string, baseHtml: string): string {
  const title = '404 — छठ गीत नहीं मिला (Page Not Found) | ChhathSong.in';
  const description = 'आप जिस छठ गीत के लिंक पर आए हैं, वह मौजूद नहीं है। कृपया संपूर्ण 107+ छठ गीत संग्रह में खोजें।';
  const canonicalUrl = `${CANONICAL_DOMAIN}/songs`;

  const preRenderedBody = `
    <main id="app-container" style="max-width: 700px; margin: 60px auto; padding: 30px; text-align: center; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: rgba(24,15,8,0.9); border: 1px solid rgba(212,175,55,0.3); border-radius: 24px; color: #FFF5E1;">
      <p style="color: #D4AF37; font-size: 0.85rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em;">
        404 — Song Not Found
      </p>
      <h1 style="font-size: 2rem; color: #FFF5E1; margin: 10px 0 16px;">
        यह छठ गीत उपलब्ध नहीं है
      </h1>
      <p style="color: rgba(255,245,225,0.8); font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px;">
        आप जिस छठ गीत (${escapeHtml(slug)}) पर आए हैं, वह मौजूद नहीं है या उसका पता बदल गया है। कृपया हमारे संपूर्ण ${CHHATH_SONGS.length} गीत संग्रह में खोजें।
      </p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <a href="/songs" style="background: #D4AF37; color: #180F08; padding: 10px 20px; border-radius: 12px; font-weight: bold; text-decoration: none;">
          संपूर्ण छठ गीत संग्रह देखें
        </a>
        <a href="/" style="background: rgba(0,0,0,0.5); color: #FFF5E1; border: 1px solid rgba(212,175,55,0.3); padding: 10px 20px; border-radius: 12px; font-weight: bold; text-decoration: none;">
          मुख्य पृष्ठ पर जाएँ
        </a>
      </div>
    </main>
  `;

  let htmlWithHead = injectHeadMetadata(baseHtml, {
    title,
    description,
    canonicalUrl
  });

  return htmlWithHead.replace(/<div\s+id=["']root["']>([\s\S]*?)<\/div>/i, `<div id="root">${preRenderedBody}</div>`);
}
