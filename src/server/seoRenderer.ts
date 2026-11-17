import { CHHATH_SONGS } from '../data/chhathData';
import { ChhathSong } from '../types';
import { getSongSlug, getSongCanonicalUrl } from '../utils/songSlug';

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
 * Replaces or injects head tags (title, description, keywords, canonical, OG, Twitter, JSON-LD) into the HTML template.
 */
function injectHeadMetadata(
  templateHtml: string,
  options: {
    title: string;
    description: string;
    canonicalUrl: string;
    keywords?: string;
    ogImage?: string;
    ogType?: string;
    robots?: string;
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

  // 4. Replace or inject meta name="keywords"
  if (options.keywords) {
    const escapedKw = escapeHtml(options.keywords);
    if (/<meta\s+name=["']keywords["'][^>]*?>/i.test(html)) {
      html = html.replace(/<meta\s+name=["']keywords["'][^>]*?>/i, `<meta name="keywords" content="${escapedKw}" />`);
    } else {
      html = html.replace('</head>', `  <meta name="keywords" content="${escapedKw}" />\n  </head>`);
    }
  }

  // 5. Replace or inject canonical link (or remove if empty)
  const canonicalRegex = /<link\s+[^>]*?rel=["']canonical["'][^>]*?>/i;
  if (options.canonicalUrl) {
    if (canonicalRegex.test(html)) {
      html = html.replace(canonicalRegex, `<link rel="canonical" href="${options.canonicalUrl}" />`);
    } else {
      html = html.replace('</head>', `  <link rel="canonical" href="${options.canonicalUrl}" />\n  </head>`);
    }
  } else {
    html = html.replace(canonicalRegex, '');
  }

  // 5b. Override robots meta if specified (e.g., noindex on 404)
  if (options.robots) {
    html = html.replace(
      /<meta\s+name=["']robots["'][^>]*?>/i,
      `<meta name="robots" content="${escapeHtml(options.robots)}" />`
    );
  }

  // 6. Replace OpenGraph & Twitter tags
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

  // 7. Replace JSON-LD schema
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
  const title = 'Chhath Song 2027 (चैती छठ): 107+ अमर छठ गीत, शारदा सिन्हा Lyrics & सम्पूर्ण विधि | ChhathSong.in';
  const description =
    'सुनें 107+ अमर Chhath Songs (छठ गीत), शारदा सिन्हा, पवन सिंह, अनुराधा पौडवाल व खेसारी लाल के पारंपरिक छठ भजन, सम्पूर्ण बोल (Lyrics), चैती छठ 2027 तिथियाँ (10-13 अप्रैल) व पावन विधि | ChhathSong.in';
  const canonicalUrl = `${CANONICAL_DOMAIN}/`;
  const keywords =
    'chhath song, chhath songs, chhathsong, chhathsong.in, chaiti chhath 2027, चैती छठ 2027, छठ गीत, छठ पूजा गीत, chhath geet, sharda sinha chhath geet, pawan singh chhath song, anuradha paudwal chhath geet, khesari lal chhath song, kelwa ke paat par, ho deenanath, kaanch hi baans ke bahangiya, ug ho surujdev, bihar chhath puja 2027, arghya timings, chhath puja song mp3 lyrics, marbo re sugwa dhanukh se';

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ChhathSong.in',
    alternateName: ['Chhath Song', 'छठ गीत', 'Chhath Songs Collection', 'Chhath: The Pride of Bihar'],
    url: canonicalUrl,
    description: description,
    inLanguage: ['hi', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${CANONICAL_DOMAIN}/songs?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
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
    description: 'लोक आस्था का महापर्व छठ एवं 106+ पारंपरिक छठ गीत व बोल (Lyrics) का संपूर्ण डिजिटल संग्रह।'
  };

  const playlistSchema = {
    '@context': 'https://schema.org',
    '@type': 'MusicPlaylist',
    name: 'Chaiti Chhath 2027 Sacred Folk Songs Playlist',
    numTracks: CHHATH_SONGS.length,
    url: `${CANONICAL_DOMAIN}/songs`,
    description: 'Complete curated collection of 107+ sacred Chhath Mahaparv folk songs, bhajans, and hymns.',
    track: CHHATH_SONGS.slice(0, 12).map((s, idx) => ({
      '@type': 'MusicRecording',
      name: s.title,
      url: getSongCanonicalUrl(s),
      byArtist: {
        '@type': 'MusicGroup',
        name: s.singer || s.artist || 'पारंपरिक छठ लोकगायक'
      },
      position: idx + 1
    }))
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'छठ पूजा के सबसे प्रसिद्ध और पारंपरिक छठ गीत (Chhath Songs) कौन से हैं?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'छठ महापर्व के सबसे लोकप्रिय पारंपरिक गीतों में "केलवा के पात पर उगेलन सुरुज मल", "काँच ही बाँस के बहँगिया", "हो दीनानाथ", "ऊ जे केरवा जे फरेला खबद से (मारबो रे सुगवा धनुष से)", "उगा हे सुरुजदेव", और "पहिले पहिल हम कईनी छठ मइया" सम्मिलित हैं। ये सभी गीत ChhathSong.in पर संपूर्ण बोल और भावार्थ सहित उपलब्ध हैं।'
        }
      },
      {
        '@type': 'Question',
        name: 'स्वर कोकिला पद्म भूषण शारदा सिन्हा के प्रसिद्ध छठ गीत कौन-कौन से हैं?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'पद्म भूषण शारदा सिन्हा जी के अमर छठ गीतों में "हो दीनानाथ", "केलवा के पात पर", "पहिले पहिल छठी मइया", "दुखवा मिटाईं छठी मइया", "नदिया के तीरे तीरे", "कार्तिक मास इजोरिया", और "बरतिन के अंगना में" प्रमुख हैं, जिनके बिना छठ महापर्व का अनुष्ठान अधूरा माना जाता है।'
        }
      },
      {
        '@type': 'Question',
        name: 'ChhathSong.in पर क्या-क्या सुविधाएँ उपलब्ध हैं?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ChhathSong.in पर 107+ अमर छठ गीतों का संपूर्ण संग्रह, शारदा सिन्हा, पवन सिंह, अनुराधा पौडवाल व खेसारी लाल के भजन, देवनागरी एवं अंग्रेजी में संपूर्ण बोल (Lyrics), भावार्थ, सजीव ऑडियो प्लेयर, चैती छठ 2027 का शुभ पंचांग (नहाय-खाय, लोहंडा व खरना, संध्या व उषा अर्घ्य) और 3D वर्चुअल अर्घ्य अनुभव पूर्णतः निःशुल्क उपलब्ध है।'
        }
      },
      {
        '@type': 'Question',
        name: 'चैती छठ पूजा 2027 के चारों दिन कौन-कौन से गीत गाए जाते हैं?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'प्रथम दिन नहाय-खाय पर गंगा स्नान व शुद्धता के गीत; द्वितीय दिन लोहंडा और खरना पर गुड़ की खीर व मौन पूजन के गीत; तृतीय दिन संध्या अर्घ्य पर दउरा-बहंगी उठाने, फल सजाने व अस्ताचलगामी सूर्य को अर्घ्य देने के गीत; और चतुर्थ दिन उषा अर्घ्य पर "उग हो सुरुजदेव भइले भिनुसारवा" जैसे उदीयमान सूर्य की वंदना के गीत गाए जाते हैं।'
        }
      },
      {
        '@type': 'Question',
        name: 'चैती छठ 2027 में नहाय-खाय, खरना, संध्या अर्घ्य और उषा अर्घ्य की तिथियां क्या हैं?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'चैती छठ 2027 में नहाय-खाय (चतुर्थी) शनिवार 10 अप्रैल 2027, लोहंडा और खरना (पंचमी) रविवार 11 अप्रैल 2027, संध्या अर्घ्य (षष्ठी - डूबते सूर्य को अर्घ्य) सोमवार 12 अप्रैल 2027, तथा उषा अर्घ्य और पारण (सप्तमी - उगते सूर्य को अर्घ्य और व्रत समाप्त) मंगलवार 13 अप्रैल 2027 को संपन्न होगा।'
        }
      }
    ]
  };

  const topSongs = CHHATH_SONGS.slice(0, 8);
  const featuredSongsHtml = topSongs
    .map((song) => {
      const slug = getSongSlug(song);
      return `
        <li class="song-card" style="margin-bottom: 12px; padding: 14px; background: rgba(24,15,8,0.7); border: 1px solid rgba(212,175,55,0.3); border-radius: 14px;">
          <a href="/songs/${slug}" style="color: #FFF5E1; text-decoration: none; font-weight: bold; font-size: 1.05rem; display: block; line-height: 1.4;">
            ${escapeHtml(song.title)}
          </a>
          <div style="color: #D4AF37; font-size: 0.85rem; margin-top: 6px;">
            स्वर: <strong>${escapeHtml(song.singer || song.artist || 'पारंपरिक')}</strong> • श्रेणी: ${escapeHtml(song.category || 'छठ महापर्व')}
          </div>
          ${song.lyricsHighlight ? `<p style="color: #FFE5B4; font-size: 0.82rem; font-style: italic; margin-top: 6px;">"${escapeHtml(song.lyricsHighlight)}"</p>` : ''}
          ${song.meaning ? `<p style="color: rgba(255,245,225,0.8); font-size: 0.85rem; margin-top: 4px; line-height: 1.4;">${escapeHtml(song.meaning.substring(0, 110))}...</p>` : ''}
          <a href="/songs/${slug}" style="display: inline-block; margin-top: 6px; color: #D4AF37; font-size: 0.8rem; font-weight: bold; text-decoration: underline;">
            गीत के बोल (Lyrics) व भावार्थ देखें &rarr;
          </a>
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
          लोक आस्था का <span style="color: #D4AF37;">महापर्व चैती छठ</span> (Chhath Song 2027)
        </h1>
        <h2 style="font-size: 1.25rem; color: #FFE5B4; font-weight: 500; margin-bottom: 12px;">
          107+ अमर छठ गीत, शारदा सिन्हा के लोकगीत, सम्पूर्ण बोल (Lyrics) व विधि
        </h2>
        <p style="max-width: 750px; margin: 0 auto; color: rgba(255,245,225,0.9); font-size: 0.95rem; line-height: 1.6;">
          सूर्यदेव और प्रकृति की उपासना का एकमात्र पावन महापर्व, जहाँ अस्ताचलगामी और उदीयमान दोनों सूर्यों को संपूर्ण श्रद्धा से अर्घ्य अर्पित किया जाता है। सुनें स्वर कोकिला शारदा सिन्हा, पवन सिंह, अनुराधा पौडवाल, और खेसारी लाल यादव के कालजयी छठ भजन।
        </p>
      </header>

      <section style="margin-bottom: 30px; padding: 22px; background: rgba(24,15,8,0.85); border: 1px solid rgba(212,175,55,0.3); border-radius: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 10px;">
          <h2 style="font-size: 1.5rem; color: #D4AF37; margin: 0;">लोकप्रिय पावन छठ गीत (${CHHATH_SONGS.length} कुल संग्रह)</h2>
          <a href="/songs" style="color: #180F08; background: #D4AF37; padding: 8px 18px; border-radius: 20px; font-weight: bold; text-decoration: none; font-size: 0.9rem;">
            संपूर्ण 107+ गीत संग्रह देखें &rarr;
          </a>
        </div>
        <ul style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 14px;">
          ${featuredSongsHtml}
        </ul>
      </section>

      <section style="margin-bottom: 30px; padding: 22px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px;">
        <h3 style="color: #D4AF37; font-size: 1.3rem; margin-top: 0;">चैती छठ महापर्व के चार पावन दिवस एवं तिथियां 2027 (10–13 अप्रैल)</h3>
        <p style="color: rgba(255,245,225,0.9); font-size: 0.95rem; line-height: 1.6;">
          प्रथम दिवस: <strong>नहाय-खाय (चतुर्थी)</strong> (शनिवार, 10 अप्रैल 2027 - कद्दू-भात का सात्विक प्रसाद) • द्वितीय दिवस: <strong>लोहंडा और खरना (पंचमी)</strong> (रविवार, 11 अप्रैल 2027 - गुड़ की खीर व 36 घंटे का निर्जला व्रत आरंभ) • तृतीय दिवस: <strong>संध्या अर्घ्य (षष्ठी)</strong> (सोमवार, 12 अप्रैल 2027 - डूबते सूर्य को प्रथम अर्घ्य) • चतुर्थ दिवस: <strong>उषा अर्घ्य और पारण (सप्तमी)</strong> (मंगलवार, 13 अप्रैल 2027 - उगते सूर्य को अर्घ्य और व्रत समाप्त)।
        </p>
      </section>

      <section style="padding: 22px; background: rgba(24,15,8,0.7); border: 1px solid rgba(212,175,55,0.25); border-radius: 20px;">
        <h3 style="color: #D4AF37; font-size: 1.3rem; margin-top: 0; margin-bottom: 14px;">अक्सर पूछे जाने वाले प्रश्न (Frequently Asked Questions)</h3>
        <div style="space-y: 12px;">
          <div style="margin-bottom: 12px;">
            <h4 style="color: #FFE5B4; margin: 0 0 4px; font-size: 1rem;">1. छठ पूजा के सबसे प्रसिद्ध पारंपरिक छठ गीत कौन से हैं?</h4>
            <p style="color: rgba(255,245,225,0.85); font-size: 0.9rem; margin: 0; line-height: 1.5;">
              "केलवा के पात पर उगेलन सुरुज मल", "काँच ही बाँस के बहँगिया", "हो दीनानाथ", "ऊ जे केरवा जे फरेला खबद से", और "उगा हे सुरुजदेव" छठ के सबसे प्रसिद्ध पारंपरिक लोकगीत हैं।
            </p>
          </div>
          <div style="margin-bottom: 12px;">
            <h4 style="color: #FFE5B4; margin: 0 0 4px; font-size: 1rem;">2. शारदा सिन्हा के प्रसिद्ध छठ गीत कौन-कौन से हैं?</h4>
            <p style="color: rgba(255,245,225,0.85); font-size: 0.9rem; margin: 0; line-height: 1.5;">
              पद्म भूषण शारदा सिन्हा जी के "हो दीनानाथ", "केलवा के पात पर", "पहिले पहिल छठी मइया", "दुखवा मिटाईं छठी मइया", "नदिया के तीरे तीरे", और "कार्तिक मास इजोरिया" अमर छठ भजन हैं।
            </p>
          </div>
          <div>
            <h4 style="color: #FFE5B4; margin: 0 0 4px; font-size: 1rem;">3. ChhathSong.in पर कौन-कौन से गाने और सुविधाएं उपलब्ध हैं?</h4>
            <p style="color: rgba(255,245,225,0.85); font-size: 0.9rem; margin: 0; line-height: 1.5;">
              ChhathSong.in पर 106+ अमर छठ गीतों का संपूर्ण संग्रह, संपूर्ण बोल (Lyrics), भावार्थ, सजीव संगीत प्लेयर और शुभ अर्घ्य मुहूर्त उपलब्ध है।
            </p>
          </div>
        </div>
      </section>
    </main>
  `;

  let htmlWithHead = injectHeadMetadata(baseHtml, {
    title,
    description,
    canonicalUrl,
    keywords,
    jsonLd: [websiteSchema, orgSchema, playlistSchema, faqSchema]
  });

  // Inject pre-rendered semantic HTML directly inside #root for immediate crawlability
  return htmlWithHead.replace(
    /<div\s+id=["']root["']>([\s\S]*?)<\/div>/i,
    `<div id="root">${preRenderedBody}</div>`
  );
}

/**
 * Generates crawl-ready pre-rendered HTML for the Songs Directory (/songs).
 */
export function renderSongsDirectoryHtml(baseHtml: string): string {
  const title = '106+ Chhath Songs (छठ गीत) Lyrics, Singer & MP3 Collection | ChhathSong.in';
  const description =
    'पद्म भूषण शारदा सिन्हा, अनुराधा पौडवाल, पवन सिंह व खेसारी लाल के 106+ पारंपरिक छठ गीतों का संपूर्ण संग्रह, बोल (Lyrics), गायक व भावार्थ | ChhathSong.in';
  const canonicalUrl = `${CANONICAL_DOMAIN}/songs`;
  const keywords =
    'chhath songs, chhath geet lyrics, all chhath songs list, 106 chhath geet, sharda sinha songs, pawan singh chhath geet, anuradha paudwal chhath, devi chhath song, kalpana patowary chhath, chhath song mp3 download lyrics, bihar folk songs';

  const songItemsSchema = CHHATH_SONGS.map((song, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    url: getSongCanonicalUrl(song),
    name: song.title
  }));

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '106+ Chhath Mahaparv Sacred Folk Songs Collection',
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
      <article style="padding: 16px; background: rgba(24,15,8,0.9); border: 1px solid rgba(212,175,55,0.25); border-radius: 14px;">
        <span style="font-size: 0.75rem; color: #D4AF37; font-weight: bold; font-family: monospace;">#${idx + 1}</span>
        <h2 style="font-size: 1.15rem; margin: 4px 0 6px; color: #FFF5E1; line-height: 1.35;">
          <a href="/songs/${slug}" style="color: #FFF5E1; text-decoration: none;">
            ${escapeHtml(song.title)}
          </a>
        </h2>
        <div style="font-size: 0.85rem; color: #FFE5B4; margin-bottom: 6px;">
          स्वर: <strong>${escapeHtml(song.singer || song.artist || 'पारंपरिक लोकगायक')}</strong>
        </div>
        ${song.lyricsHighlight ? `<p style="font-size: 0.8rem; font-style: italic; color: #FFE5B4; margin: 4px 0;">"${escapeHtml(song.lyricsHighlight)}"</p>` : ''}
        ${song.meaning ? `<p style="font-size: 0.82rem; color: rgba(255,245,225,0.75); margin: 4px 0; line-height: 1.4;">${escapeHtml(song.meaning.substring(0, 100))}...</p>` : ''}
        <a href="/songs/${slug}" style="display: inline-block; margin-top: 8px; color: #D4AF37; font-size: 0.85rem; font-weight: bold; text-decoration: underline;">
          गीत के संपूर्ण बोल (Lyrics) व भावार्थ देखें &rarr;
        </a>
      </article>`;
  }).join('');

  const preRenderedBody = `
    <main id="app-container" style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #FFF5E1;">
      <nav aria-label="Breadcrumb" style="font-size: 0.85rem; color: rgba(255,245,225,0.7); margin-bottom: 20px;">
        <a href="/" style="color: #D4AF37; text-decoration: none;">मुख्य पृष्ठ (Home)</a> &gt; <span>छठ गीत संग्रह (${CHHATH_SONGS.length} Chhath Songs)</span>
      </nav>

      <header style="margin-bottom: 24px;">
        <h1 style="font-size: 2.2rem; color: #FFF5E1; margin: 0 0 8px; font-family: 'Rozha One', Georgia, serif;">
          पारंपरिक छठ गीत संग्रह (106+ Chhath Songs & Lyrics)
        </h1>
        <p style="color: rgba(255,245,225,0.85); font-size: 0.95rem; max-width: 850px; margin: 0; line-height: 1.6;">
          पद्म भूषण शारदा सिन्हा, अनुराधा पौडवाल, पवन सिंह, खेसारी लाल यादव, देवी, और कल्पना पटवारी के अमर स्वर में रचे-बसे 106 पावन छठ गीतों का संपूर्ण संग्रह, बोल (Lyrics) और आध्यात्मिक अर्थ।
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
    keywords,
    jsonLd: [breadcrumbsSchema, collectionSchema]
  });

  return htmlWithHead.replace(
    /<div\s+id=["']root["']>([\s\S]*?)<\/div>/i,
    `<div id="root">${preRenderedBody}</div>`
  );
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
    : `${song.title} – Chhath Song Lyrics, Singer & Meaning | ChhathSong.in`;

  const rawDescription = song.lyrics
    ? `${song.title} - सम्पूर्ण बोल (Lyrics), स्वर: ${singerName}। ${song.meaning || 'छठ महापर्व की महिमा व लोक आस्था का पावन लोकगीत।'}`
    : song.meaning
    ? `${song.title} - स्वर: ${singerName}। ${song.meaning}`
    : `${song.title} - पावन छठ महापर्व लोकगीत, स्वर: ${singerName}। जानें गीत का आध्यात्मिक भावार्थ व सांस्कृतिक महत्व।`;

  const description = rawDescription.length > 155 ? `${rawDescription.substring(0, 152)}...` : rawDescription;
  const ogImage = song.youtubeId ? `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg` : `${CANONICAL_DOMAIN}/chhath-share-banner.svg`;

  const keywords = `${song.title}, ${singerName} Chhath Song, ${song.title} lyrics, छठ गीत, ${singerName} छठ गीत, Chhath Geet 2027, Chaiti Chhath 2027, Chhath Songs, ChhathSong.in, Bihar Chhath Puja, Surya Dev Arghya, Chhathi Maiya Bhajan`;

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

  const songFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `‘${song.title}’ छठ गीत के मुख्य गायक कौन हैं?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `इस पावन छठ गीत को ${singerName} द्वारा भावपूर्ण स्वर में प्रस्तुत किया गया है।`
        }
      },
      {
        '@type': 'Question',
        name: 'यह छठ गीत महापर्व के किस अनुष्ठान या अवसर पर गाया जाता है?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: song.whenSung || 'यह पावन छठ गीत छठ पूजा के अर्घ्य, घाट यात्रा व सूर्यदेव की आराधना के समय गाया जाता है।'
        }
      },
      {
        '@type': 'Question',
        name: 'इस पावन छठ गीत का आध्यात्मिक भावार्थ क्या है?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: song.meaning || 'यह छठ गीत सूर्यदेव व छठी मइया के प्रति अगाध श्रद्धा, परिवार की खुशहाली और लोक आस्था का पवित्र प्रतीक है।'
        }
      }
    ]
  };

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
          <h2 style="font-size: 1.3rem; color: #D4AF37; margin-bottom: 8px;">आध्यात्मिक भावार्थ एवं महिमा (Meaning)</h2>
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
            <h2 style="font-size: 1.1rem; color: #D4AF37; margin: 0 0 6px;">छठ गीत के बोल एवं छंद (Lyrics)</h2>
            ${song.lyricsSnippetHindi ? `<p style="font-size: 0.95rem; color: #FFE5B4; margin: 0 0 6px;">${escapeHtml(song.lyricsSnippetHindi)}</p>` : ''}
            <p style="font-size: 0.85rem; color: rgba(255,245,225,0.75); margin: 0;">
              स्वर: ${escapeHtml(singerName)} • यह पावन छठ गीत छठ महापर्व के अर्घ्य अनुष्ठान में अत्यंत श्रद्धा से गाया जाता है।
            </p>
          </section>
        `}

        <section style="margin-top: 24px; padding: 16px; background: rgba(0,0,0,0.3); border-radius: 16px;">
          <h3 style="font-size: 1.1rem; color: #D4AF37; margin-top: 0; margin-bottom: 10px;">गीत से जुड़े प्रश्न एवं उत्तर (FAQs)</h3>
          <div style="margin-bottom: 10px;">
            <strong style="color: #FFE5B4; font-size: 0.9rem;">प्र: ‘${escapeHtml(song.title)}’ के गायक कौन हैं?</strong>
            <p style="color: rgba(255,245,225,0.85); font-size: 0.88rem; margin: 2px 0 0;">उ: इस पावन छठ गीत को ${escapeHtml(singerName)} ने गाया है।</p>
          </div>
          <div style="margin-bottom: 10px;">
            <strong style="color: #FFE5B4; font-size: 0.9rem;">प्र: यह गीत छठ पूजा में कब गाया जाता है?</strong>
            <p style="color: rgba(255,245,225,0.85); font-size: 0.88rem; margin: 2px 0 0;">उ: ${escapeHtml(song.whenSung || 'छठ पूजा के अर्घ्य व घाट पूजन के समय।')}</p>
          </div>
          <div>
            <strong style="color: #FFE5B4; font-size: 0.9rem;">प्र: इस गीत का मुख्य भावार्थ क्या है?</strong>
            <p style="color: rgba(255,245,225,0.85); font-size: 0.88rem; margin: 2px 0 0;">उ: ${escapeHtml(song.meaning || 'छठ मइया व सूर्यदेव की महिमा और लोक आस्था।')}</p>
          </div>
        </section>
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
    keywords,
    ogImage,
    ogType: 'music.song',
    jsonLd: [breadcrumbSchema, musicSchema, songFaqSchema]
  });

  return htmlWithHead.replace(
    /<div\s+id=["']root["']>([\s\S]*?)<\/div>/i,
    `<div id="root">${preRenderedBody}</div>`
  );
}

/**
 * Generates crawl-ready 404 HTML for missing songs.
 */
export function renderNotFoundHtml(slug: string, baseHtml: string): string {
  const title = '404 — छठ गीत नहीं मिला (Page Not Found) | ChhathSong.in';
  const description = 'आप जिस छठ गीत के लिंक पर आए हैं, वह मौजूद नहीं है। कृपया संपूर्ण 106+ छठ गीत संग्रह में खोजें।';
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
    canonicalUrl: '',
    robots: 'noindex, follow'
  });

  return htmlWithHead.replace(
    /<div\s+id=["']root["']>([\s\S]*?)<\/div>/i,
    `<div id="root">${preRenderedBody}</div>`
  );
}
