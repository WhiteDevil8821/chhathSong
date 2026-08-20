import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Volume2,
  Mic2,
  Calendar,
  Share2,
  Check,
  Sparkles,
  BookOpen,
  Music,
  Heart,
  ArrowRight,
  ArrowLeft,
  Home,
  Tag,
  Disc3,
  Sun,
  Video,
  ListMusic,
  ExternalLink,
  SkipForward,
  SkipBack
} from 'lucide-react';
import { ChhathSong } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getSongSlug, getSongPath, getSongCanonicalUrl } from '../utils/songSlug';
import { trackEvent, updateCanonicalUrl } from '../utils/analytics';

interface SongPageProps {
  song: ChhathSong;
  allSongs: ChhathSong[];
  isPlaying: boolean;
  currentPlayingId: string;
  onPlaySong: (song: ChhathSong) => void;
  onNavigate: (path: string) => void;
}

export const SongPage: React.FC<SongPageProps> = ({
  song,
  allSongs,
  isPlaying,
  currentPlayingId,
  onPlaySong,
  onNavigate,
}) => {
  const { isHindi } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showEmbedVideo, setShowEmbedVideo] = useState(false);

  const slug = getSongSlug(song);
  const canonicalUrl = getSongCanonicalUrl(song);
  const isCurrentPlaying = song.id === currentPlayingId && isPlaying;

  // Find index in playlist to calculate sequential previous and next songs
  const currentIndex = useMemo(() => {
    return allSongs.findIndex((s) => s.id === song.id || s.youtubeId === song.youtubeId);
  }, [allSongs, song]);

  const prevSong = useMemo(() => {
    if (allSongs.length === 0) return null;
    if (currentIndex <= 0) return allSongs[allSongs.length - 1];
    return allSongs[currentIndex - 1];
  }, [allSongs, currentIndex]);

  const nextSong = useMemo(() => {
    if (allSongs.length === 0) return null;
    if (currentIndex >= allSongs.length - 1) return allSongs[0];
    return allSongs[currentIndex + 1];
  }, [allSongs, currentIndex]);

  // Resolve related songs safely against the single source of truth
  const relatedSongs: ChhathSong[] = useMemo(() => {
    let resolved: ChhathSong[] = [];
    if (song.relatedSongIds && song.relatedSongIds.length > 0) {
      resolved = song.relatedSongIds
        .map((id) => allSongs.find((s) => s.id === id || s.youtubeId === id))
        .filter((s): s is ChhathSong => Boolean(s) && s.id !== song.id);
    }

    // Fallback if fewer than 4 related songs are explicitly mapped
    if (resolved.length < 4) {
      const additional = allSongs
        .filter(
          (s) =>
            s.id !== song.id &&
            !resolved.some((r) => r.id === s.id) &&
            (s.singer === song.singer || s.category === song.category || s.festivalPhase === song.festivalPhase)
        )
        .slice(0, 4 - resolved.length);
      resolved = [...resolved, ...additional];
    }

    return resolved.slice(0, 4);
  }, [song, allSongs]);

  // Set document title, canonical link, meta tags & structured data for SEO
  useEffect(() => {
    const pageTitle = `${song.title} – Chhath Song, Singer & Meaning | ChhathSong.in`;
    document.title = pageTitle;

    // 1. Strictly maintain one canonical link tag in document head
    updateCanonicalUrl(canonicalUrl);

    // 2. Meta description
    const singerName = song.singer || song.artist || 'पारंपरिक लोकगायक';
    const rawDescription = song.meaning
      ? `${song.title} - स्वर: ${singerName}। ${song.meaning}`
      : `${song.title} - पावन छठ महापर्व लोकगीत, स्वर: ${singerName}। जानें गीत का आध्यात्मिक भावार्थ व सांस्कृतिक महत्व।`;
    const metaDescription = rawDescription.length > 160 ? `${rawDescription.substring(0, 157)}...` : rawDescription;

    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', metaDescription);

    // 3. OpenGraph tags
    const updateOrCreateMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateOrCreateMeta('og:title', pageTitle);
    updateOrCreateMeta('og:description', metaDescription);
    updateOrCreateMeta('og:url', canonicalUrl);
    updateOrCreateMeta('og:type', 'music.song');
    if (song.youtubeId) {
      updateOrCreateMeta('og:image', `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg`);
    }

    // 4. Structured Data: BreadcrumbList & MusicRecording
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.chhathsong.in/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Chhath Songs',
          item: 'https://www.chhathsong.in/songs',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: song.title,
          item: canonicalUrl,
        },
      ],
    };

    const musicSchema = {
      '@context': 'https://schema.org',
      '@type': 'MusicRecording',
      name: song.title,
      byArtist: {
        '@type': 'MusicGroup',
        name: song.singer || song.artist,
      },
      inAlbum: 'Chhath Mahaparv Folk Collection',
      genre: 'Devotional / Chhath Folk',
      url: canonicalUrl,
      ...(song.duration ? { duration: song.duration } : {}),
      description: song.meaning || song.culturalContext,
    };

    let scriptTag = document.getElementById('song-jsonld-schema') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'song-jsonld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify([breadcrumbSchema, musicSchema]);

    // Reset embed video state on song change
    setShowEmbedVideo(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      // Clean up JSON-LD on unmount
      const tag = document.getElementById('song-jsonld-schema');
      if (tag) tag.remove();
    };
  }, [song, canonicalUrl]);

  const handleShare = () => {
    trackEvent('song_share', {
      song_id: song.id,
      title: song.title
    });

    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${song.title} - Chhath Geet: ${canonicalUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePlay = (targetSong: ChhathSong) => {
    trackEvent('song_play', {
      song_id: targetSong.id,
      title: targetSong.title,
      singer: targetSong.singer || targetSong.artist || 'Unknown'
    });
    onPlaySong(targetSong);
  };

  return (
    <article
      id={`song-page-${song.id}`}
      className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 font-sans pb-12"
    >
      {/* 1. Breadcrumbs Navigation (Visible + Crawlable) */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs sm:text-sm text-[#FFF5E1]/70 flex-wrap px-2"
      >
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="inline-flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors"
        >
          <Home className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{isHindi ? 'मुख्य पृष्ठ' : 'Home'}</span>
        </a>
        <span className="text-[#D4AF37]/50">/</span>
        <a
          href="/songs"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/songs');
          }}
          className="hover:text-[#D4AF37] transition-colors"
        >
          <span>{isHindi ? `छठ गीत संग्रह (${allSongs.length})` : `Chhath Songs (${allSongs.length})`}</span>
        </a>
        <span className="text-[#D4AF37]/50">/</span>
        <span className="text-[#D4AF37] font-medium truncate max-w-[200px] sm:max-w-md">
          {song.title}
        </span>
      </nav>

      {/* 2. Hero Card: Single H1, Artist Details, and Playback Controls */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#1F1209] via-[#160D06] to-[#0D0704] border border-[#D4AF37]/40 p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top Badges & Actions */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3.5 py-1.5 rounded-full bg-black/60 border border-[#D4AF37]/40 text-xs sm:text-sm font-bold text-[#D4AF37] flex items-center gap-1.5 shadow-sm">
                <Mic2 className="w-4 h-4 text-[#D4AF37]" />
                <span>{song.singer || song.artist}</span>
              </span>

              {song.whenSung && (
                <span className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs text-[#FFF5E1]/80 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{song.whenSung}</span>
                </span>
              )}

              {song.tag && (
                <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs text-[#FFE5B4]">
                  {song.tag}
                </span>
              )}
            </div>

            {/* Quick Share / Copy URL Button */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs font-semibold text-[#FFF5E1] transition-all cursor-pointer shadow-sm"
              title={isHindi ? 'गीत का लिंक कॉपी करें' : 'Copy canonical song link'}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{isHindi ? 'कॉपी हो गया' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isHindi ? 'शेयर करें' : 'Share Song'}</span>
                </>
              )}
            </button>
          </div>

          {/* Primary H1 Heading (Mandatory Single H1) */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#FFF5E1] leading-tight tracking-wide">
            {song.title}
          </h1>

          {/* Lyrics Highlight Quote Banner */}
          {song.lyricsHighlight && (
            <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border-l-4 border-[#D4AF37] border-y border-r border-[#D4AF37]/20 shadow-inner">
              <p className="text-sm sm:text-base font-serif italic text-[#FFE5B4] leading-relaxed">
                "{song.lyricsHighlight}"
              </p>
            </div>
          )}

          {/* Interactive Playback Action Bar */}
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => handlePlay(song)}
              className={`px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-lg cursor-pointer ${
                isCurrentPlaying
                  ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-[#D4AF37] via-[#F28C28] to-[#C87D32] text-[#180F08] hover:opacity-95 hover:scale-[1.02] shadow-[0_0_20px_rgba(212,175,55,0.3)]'
              }`}
            >
              {isCurrentPlaying ? (
                <>
                  <Volume2 className="w-5 h-5 animate-pulse" />
                  <span>{isHindi ? 'गीत चल रहा है (Now Playing)' : 'Now Playing'}</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>{isHindi ? 'छठ गीत सुनें (Play Song)' : 'Play Chhath Geet'}</span>
                </>
              )}
            </button>

            {song.youtubeId && (
              <button
                onClick={() => setShowEmbedVideo(!showEmbedVideo)}
                className="px-5 py-3.5 rounded-2xl bg-black/50 hover:bg-black/80 border border-[#D4AF37]/35 text-xs sm:text-sm font-semibold text-[#FFF5E1] flex items-center gap-2 transition-all cursor-pointer"
              >
                <Video className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  {showEmbedVideo
                    ? isHindi
                      ? 'वीडियो छुपाएं'
                      : 'Hide Video'
                    : isHindi
                    ? 'वीडियो देखें'
                    : 'Watch Video'}
                </span>
              </button>
            )}

            <a
              href="/songs"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/songs');
              }}
              className="px-4 py-3.5 rounded-2xl bg-black/30 hover:bg-black/60 border border-white/10 text-xs sm:text-sm font-semibold text-[#FFF5E1]/80 hover:text-white flex items-center gap-2 transition-all"
            >
              <ListMusic className="w-4 h-4 text-[#D4AF37]" />
              <span>{isHindi ? `सभी ${allSongs.length} गीत देखें` : `All ${allSongs.length} Songs`}</span>
            </a>
          </div>

          {/* YouTube Video Player Frame if toggled */}
          {showEmbedVideo && song.youtubeId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 overflow-hidden"
            >
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${song.youtubeId}?autoplay=1&rel=0`}
                  title={`${song.title} - YouTube Devotional Player`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 3. Meaning & Spiritual Significance */}
      <section
        id="song-meaning-section"
        className="rounded-3xl bg-[#180F08]/90 border border-[#D4AF37]/30 p-6 sm:p-8 shadow-xl space-y-4"
      >
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#D4AF37]/15">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FFF5E1]">
            {isHindi ? 'आध्यात्मिक भावार्थ एवं महिमा' : 'Spiritual Meaning & Significance'}
          </h2>
        </div>

        <p className="text-sm sm:text-base text-[#FFF5E1]/90 leading-relaxed">
          {song.meaning}
        </p>

        {song.culturalContext && (
          <div className="mt-4 p-4 rounded-2xl bg-black/35 border border-[#D4AF37]/15 space-y-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-[#D4AF37]" />
              <span>{isHindi ? 'सांस्कृतिक परंपरा एवं संदर्भ' : 'Cultural Tradition & Context'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#FFF5E1]/80 leading-relaxed">
              {song.culturalContext}
            </p>
          </div>
        )}
      </section>

      {/* 4. Dedicated Lyrics Section (Prepared for Future Full Lyrics) */}
      <section
        id="song-lyrics-section"
        className="rounded-3xl bg-[#180F08]/90 border border-[#D4AF37]/30 p-6 sm:p-8 shadow-xl space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/15 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FFF5E1]">
              {isHindi ? 'छठ गीत के बोल (Lyrics)' : 'Song Lyrics & Verses'}
            </h2>
          </div>

          <span className="text-[10px] sm:text-xs px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold">
            {isHindi ? 'पावन बोल संग्रह' : 'Sacred Hymn Archive'}
          </span>
        </div>

        {/* Highlight verse if available */}
        {song.lyricsSnippetHindi && (
          <div className="p-5 rounded-2xl bg-black/40 border border-[#D4AF37]/20 space-y-2">
            <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              {isHindi ? 'प्रमुख पंक्तियाँ (Highlight Verse)' : 'Key Verse'}
            </div>
            <p className="text-base sm:text-lg font-serif text-[#FFE5B4] leading-relaxed whitespace-pre-line">
              {song.lyricsSnippetHindi}
            </p>
            {song.lyricsSnippetEnglish && (
              <p className="text-xs sm:text-sm text-[#FFF5E1]/70 italic pt-1 border-t border-white/5">
                {song.lyricsSnippetEnglish}
              </p>
            )}
          </div>
        )}

        {/* Future Lyrics State Notice (Non-misleading & cleanly prepared) */}
        <div className="p-4 rounded-2xl bg-black/25 border border-white/10 text-center space-y-2">
          <p className="text-xs sm:text-sm text-[#FFF5E1]/75">
            {isHindi
              ? 'इस पावन छठ गीत के संपूर्ण पारंपरिक बोल एवं छंद शीघ्र ही यहाँ जोड़े जा रहे हैं। इसी स्थाई पृष्ठ पर आप पूर्ण बोल पढ़ सकेंगे।'
              : 'Full verse-by-verse authentic lyrics for this hymn are being curated and will be available right on this permanent page soon.'}
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37]">
            <Disc3 className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{isHindi ? 'स्थाई यूआरएल (Permanent URL): ' : 'Permanent URL: '}</span>
            <code className="bg-black/50 px-2 py-0.5 rounded text-[11px] font-mono text-[#FFF5E1]/80">
              /songs/{slug}
            </code>
          </div>
        </div>
      </section>

      {/* 5. Strong "Continue Listening" Experience — Next Track Spotlight */}
      {nextSong && (
        <section
          id="continue-listening-spotlight"
          className="rounded-3xl bg-gradient-to-r from-[#2A1608] via-[#1D1006] to-[#120904] border border-[#D4AF37]/50 p-5 sm:p-7 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full border border-[#D4AF37]/40">
                <SkipForward className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{isHindi ? 'अगला पावन छठ गीत (Next Hymn):' : 'Continue Listening (Next Hymn):'}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#FFF5E1] line-clamp-1">
                {nextSong.title}
              </h3>
              <p className="text-xs text-[#FFF5E1]/70 line-clamp-1">
                स्वर: <span className="text-[#FFE5B4] font-semibold">{nextSong.singer || nextSong.artist}</span>
                {nextSong.whenSung && <span className="opacity-75"> • {nextSong.whenSung}</span>}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                onClick={() => {
                  trackEvent('next_song_play', {
                    from_song: song.title,
                    to_song: nextSong.title
                  });
                  handlePlay(nextSong);
                }}
                className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#D4AF37] hover:bg-[#FFE5B4] text-[#180F08] transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isHindi ? 'अगला गीत सुनें' : 'Play Next Song'}</span>
              </button>

              <a
                href={getSongPath(nextSong)}
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent('next_song_navigate', {
                    from_song: song.title,
                    to_song: nextSong.title
                  });
                  onNavigate(getSongPath(nextSong));
                }}
                className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-black/50 text-[#FFF5E1] hover:bg-black/80 border border-[#D4AF37]/35 transition-all flex items-center gap-1.5"
              >
                <span>{isHindi ? 'गीत का पेज देखें' : 'View Song Page'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 6. Related Chhath Songs (Internal Linking Architecture) */}
      {relatedSongs.length > 0 && (
        <section
          id="related-chhath-songs"
          className="rounded-3xl bg-[#180F08]/90 border border-[#D4AF37]/30 p-6 sm:p-8 shadow-xl space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/15">
            <div className="flex items-center gap-2.5">
              <Music className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FFF5E1]">
                {isHindi ? 'संबंधित पावन छठ गीत संग्रह' : 'Related Chhath Folk Classics'}
              </h2>
            </div>

            <a
              href="/songs"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/songs');
              }}
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>{isHindi ? `सभी ${allSongs.length} गीत देखें` : `View All ${allSongs.length}`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedSongs.map((relSong) => {
              const relSlug = getSongSlug(relSong);
              const relPath = getSongPath(relSong);
              const isRelPlaying = relSong.id === currentPlayingId && isPlaying;

              const isSameSinger = relSong.singer === song.singer || relSong.artist === song.artist;
              const relationBadge = isSameSinger
                ? isHindi ? `स्वर: ${relSong.singer || relSong.artist}` : `By ${relSong.singer || relSong.artist}`
                : relSong.category === song.category
                ? isHindi ? 'समान अनुष्ठान' : 'Same Ritual Phase'
                : isHindi ? 'पारंपरिक धुन' : 'Devotional Classic';

              return (
                <div
                  key={relSong.id}
                  className="rounded-2xl p-4 bg-black/40 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                        {relationBadge}
                      </span>
                      {relSong.whenSung && (
                        <span className="text-[10px] text-[#FFF5E1]/60 truncate max-w-[120px]">
                          {relSong.whenSung}
                        </span>
                      )}
                    </div>

                    <a
                      href={relPath}
                      onClick={(e) => {
                        e.preventDefault();
                        trackEvent('related_song_click', {
                          from_song: song.title,
                          to_song: relSong.title
                        });
                        onNavigate(relPath);
                      }}
                      className="block text-sm sm:text-base font-serif font-bold text-[#FFF5E1] group-hover:text-[#FFE5B4] transition-colors leading-snug line-clamp-2"
                    >
                      {relSong.title}
                    </a>

                    <p className="text-xs text-[#FFF5E1]/70 line-clamp-2 leading-relaxed">
                      {relSong.meaning}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#D4AF37]/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handlePlay(relSong)}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isRelPlaying
                          ? 'bg-emerald-500 text-black'
                          : 'bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#180F08] border border-[#D4AF37]/40'
                      }`}
                    >
                      {isRelPlaying ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                          <span>{isHindi ? 'चल रहा है' : 'Playing'}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{isHindi ? 'गीत सुनें' : 'Play'}</span>
                        </>
                      )}
                    </button>

                    <a
                      href={relPath}
                      onClick={(e) => {
                        e.preventDefault();
                        trackEvent('related_song_click', {
                          from_song: song.title,
                          to_song: relSong.title
                        });
                        onNavigate(relPath);
                      }}
                      className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-black/50 text-[#FFF5E1]/80 hover:text-white hover:bg-black/80 border border-white/10 transition-all flex items-center gap-1"
                    >
                      <span>{isHindi ? 'पेज खोलें' : 'View Page'}</span>
                      <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 7. Sequential Previous / Next Chhath Song Quick Navigator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {prevSong && (
          <a
            href={getSongPath(prevSong)}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(getSongPath(prevSong));
            }}
            className="p-3.5 rounded-2xl bg-black/40 hover:bg-[#D4AF37]/15 border border-[#D4AF37]/30 transition-all flex items-center gap-3 group"
          >
            <div className="p-2 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-[#D4AF37] group-hover:-translate-x-1 transition-transform">
              <SkipBack className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold">
                {isHindi ? '← पिछला गीत' : '← Previous Song'}
              </div>
              <div className="text-xs sm:text-sm font-serif font-bold text-[#FFF5E1] truncate">
                {prevSong.title}
              </div>
            </div>
          </a>
        )}

        {nextSong && (
          <a
            href={getSongPath(nextSong)}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(getSongPath(nextSong));
            }}
            className="p-3.5 rounded-2xl bg-black/40 hover:bg-[#D4AF37]/15 border border-[#D4AF37]/30 transition-all flex items-center justify-between gap-3 group sm:text-right"
          >
            <div className="min-w-0 order-2 sm:order-1 flex-1">
              <div className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold">
                {isHindi ? 'अगला गीत →' : 'Next Song →'}
              </div>
              <div className="text-xs sm:text-sm font-serif font-bold text-[#FFF5E1] truncate">
                {nextSong.title}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-[#D4AF37] group-hover:translate-x-1 transition-transform order-1 sm:order-2">
              <SkipForward className="w-4 h-4" />
            </div>
          </a>
        )}
      </div>

      {/* 8. Bottom Navigation & Chhath Cultural Information Links */}
      <div className="pt-4 flex items-center justify-between flex-wrap gap-3 border-t border-[#D4AF37]/20">
        <a
          href="/songs"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/songs');
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/40 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs sm:text-sm font-semibold text-[#D4AF37] hover:text-[#FFF5E1] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHindi ? `सम्पूर्ण ${allSongs.length} छठ गीत संग्रह देखें` : `Back to All ${allSongs.length} Songs`}</span>
        </a>

        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/40 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs sm:text-sm font-semibold text-[#FFF5E1]/80 hover:text-white transition-all"
        >
          <Home className="w-4 h-4 text-[#D4AF37]" />
          <span>{isHindi ? 'मुख्य पृष्ठ पर जाएँ' : 'Back to Home'}</span>
        </a>
      </div>
    </article>
  );
};

