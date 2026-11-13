import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Music,
  Play,
  Pause,
  Sparkles,
  Calendar,
  Clock,
  Sun,
  Sunrise,
  Sunset,
  Share2,
  Check
} from 'lucide-react';
import { ChhathSong } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getSongSlug } from '../utils/songSlug';
import { useChhathDailyGreeting } from '../hooks/useChhathDailyGreeting';

interface ChhathHeroSectionProps {
  songs: ChhathSong[];
  currentSong?: ChhathSong;
  isPlaying?: boolean;
  onPlaySong: (song: ChhathSong) => void;
  onNavigateTo: (path: string) => void;
  onOpenSongDetail?: (song: ChhathSong) => void;
  onShareGreeting?: () => void;
}

export const ChhathHeroSection: React.FC<ChhathHeroSectionProps> = ({
  songs,
  currentSong,
  isPlaying = false,
  onPlaySong,
  onNavigateTo,
  onShareGreeting
}) => {
  const { isHindi } = useLanguage();
  const greeting = useChhathDailyGreeting();
  const [copiedGreeting, setCopiedGreeting] = useState(false);

  // Curated Popular Songs (Top 8 iconic songs for instant discovery below hero)
  const popularSongs = songs.slice(0, 8);

  const scrollToSection = (id: string) => {
    if (typeof document !== 'undefined') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCopyTodayGreeting = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(greeting.shareGreetingText);
      setCopiedGreeting(true);
      setTimeout(() => setCopiedGreeting(false), 2500);
    }
  };

  const renderGreetingIcon = () => {
    switch (greeting.dayNumber) {
      case 1:
        return <Sun className="w-5 h-5 text-[#FFD54F] shrink-0" />;
      case 2:
        return <Sparkles className="w-5 h-5 text-[#F28C28] shrink-0" />;
      case 3:
        return <Sunset className="w-5 h-5 text-[#FF8A65] shrink-0" />;
      case 4:
        return <Sunrise className="w-5 h-5 text-[#FFE082] shrink-0" />;
      default:
        return <Sun className="w-5 h-5 text-[#FFD54F] shrink-0" />;
    }
  };

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* 1. IMMERSIVE FULL-BACKGROUND CINEMATIC HERO (GHAT HERO PHOTO / ARTWORK)   */}
      {/* ========================================================================= */}
      <section
        id="chhath-hero"
        aria-label="Chhath Puja Panoramic Ghat View"
        className="relative w-full min-h-[480px] sm:min-h-[520px] md:min-h-[560px] lg:min-h-[600px] overflow-hidden border-b-2 border-[#E5A93C]/50 shadow-2xl flex flex-col justify-between p-3 sm:p-5 md:p-6 lg:p-8 select-none gap-4"
      >
        {/* Full-bleed Responsive Ganga Ghat Hero Image */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src="/images/chhath-ghat-hero-image.png"
            alt="Chhath Puja Holy Ghat"
            className="w-full h-full object-cover object-center sm:object-[center_35%] transition-transform duration-1000 scale-[1.01]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/chhath-ghat-panoramic-hero.svg';
            }}
          />
        </div>

        {/* Subtle Vignette & Scrim Overlays to guarantee crisp text legibility while preserving full artwork visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/88 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.72)_100%)] pointer-events-none" />

        {/* ===================================================================== */}
        {/* TOP BAR OVERLAY: Live IST Clock & Quick Navigation                    */}
        {/* ===================================================================== */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
          {/* Top Left: Live IST Clock & Date */}
          <div className="flex items-center gap-2.5 text-[11px] sm:text-xs text-[#FFF5E1] bg-black/65 backdrop-blur-md border border-[#E5A93C]/45 px-3.5 py-1.5 rounded-xl shadow-md">
            <Clock className="w-3.5 h-3.5 text-[#FFD54F] shrink-0" />
            <span className="font-mono font-bold tabular-nums whitespace-nowrap">
              {greeting.istTimeFormatted}
            </span>
            <span className="hidden sm:inline text-[#E5A93C]/70" aria-hidden="true">·</span>
            <span className="hidden sm:inline text-[#FFE5B4] font-medium whitespace-nowrap">
              {greeting.istDateFormatted}
            </span>
          </div>

          {/* Top Right: Songs Archive Link & Guide Anchor */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/songs"
              onClick={(e) => {
                e.preventDefault();
                onNavigateTo('/songs');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black/70 hover:bg-[#E5A93C] backdrop-blur-md border border-[#E5A93C] text-[#FFE5B4] hover:text-[#1A0A03] text-[11px] sm:text-xs font-bold transition-colors shadow-md cursor-pointer group whitespace-nowrap shrink-0"
            >
              <Music className="w-3.5 h-3.5 text-[#FFD54F] group-hover:text-[#1A0A03] transition-colors" />
              <span>{isHindi ? `${songs.length} अमर छठ गीत` : `${songs.length} Chhath Songs`}</span>
              <span className="text-[10px] text-[#FFD54F] group-hover:text-[#1A0A03] transition-colors">↗</span>
            </a>

            <button
              type="button"
              onClick={() => scrollToSection('chhath-guide-section')}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/85 backdrop-blur-md border border-[#E5A93C]/45 text-[#FFF5E1] text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sun className="w-3.5 h-3.5 text-[#FFD54F]" />
              <span>{isHindi ? 'छठ पूजा २०२६ विधि' : 'Chhath 2026 Guide'}</span>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* CENTER STAGE: MAJESTIC TITLE + TODAY'S GREETING OF THE DAY (IST SYNC) */}
        {/* ===================================================================== */}
        <div className="relative z-10 text-center my-auto py-2 sm:py-4 space-y-4 sm:space-y-5 max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-1.5"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-wide text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_25px_rgba(254,240,138,0.65),_0_4px_35px_rgba(0,0,0,0.95)] [text-wrap:balance]">
              जय छठी मैया
            </h1>

            <p className="text-xs sm:text-sm md:text-base font-serif font-semibold text-[#FFE5B4] tracking-wide max-w-xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] px-4">
              {isHindi
                ? 'लोक आस्था का महापर्व • अमर छठ गीत, पावन गंगा घाट व सजीव अर्घ्य'
                : 'The Eternal Sun Worship • Sacred Ganga Ghat Hymns & Arghya Darshan'}
            </p>
          </motion.div>

          {/* Today's Daily Greeting Spotlight Card (Automatically updates at 00:00 AM IST) */}
          <motion.div
            key={greeting.phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            aria-live="polite"
            className="mx-auto max-w-2xl rounded-2xl bg-[#160A04]/88 backdrop-blur-xl border border-[#E5A93C]/70 p-4 sm:p-5 md:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.85)] text-left sm:text-center space-y-2.5"
          >
            {/* Unboxed Metadata Header with typographic separators */}
            <div className="flex flex-wrap items-center sm:justify-center gap-x-2 gap-y-1 text-[11px] sm:text-xs font-semibold text-[#FFD54F]">
              <span className="inline-flex items-center gap-1.5">
                {renderGreetingIcon()}
                <span>{isHindi ? greeting.dayTagHi : greeting.dayTagEn}</span>
              </span>
              <span className="text-[#E5A93C]/60" aria-hidden="true">·</span>
              <span className="text-[#FFE5B4]/90">
                {isHindi ? greeting.dateDisplayHi : greeting.dateDisplayEn}
              </span>
            </div>

            {/* Greeting Headline */}
            <h2 className="text-lg sm:text-2xl md:text-[26px] font-serif font-bold text-[#FFF5E1] leading-snug [text-wrap:balance]">
              {isHindi ? greeting.greetingTitleHi : greeting.greetingTitleEn}
            </h2>

            {/* Greeting Warm Message */}
            <p className="text-xs sm:text-sm text-[#FFF5E1]/90 leading-relaxed max-w-xl sm:mx-auto font-normal">
              {isHindi ? greeting.greetingSubtextHi : greeting.greetingSubtextEn}
            </p>

            {/* Daily Ritual Focus + Quick Action Row */}
            <div className="pt-2 border-t border-[#E5A93C]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
              <span className="text-[#FFE082] font-medium text-left">
                {isHindi ? greeting.ritualFocusHi : greeting.ritualFocusEn}
              </span>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={handleCopyTodayGreeting}
                  className="px-3 py-1.5 rounded-lg bg-black/50 hover:bg-black/80 border border-[#E5A93C]/45 text-[#FFE5B4] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {copiedGreeting ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">{isHindi ? 'कॉपी हुआ' : 'Copied'}</span>
                    </>
                  ) : (
                    <span>{isHindi ? 'संदेश कॉपी करें' : 'Copy Wish'}</span>
                  )}
                </button>

                {onShareGreeting && (
                  <button
                    type="button"
                    onClick={onShareGreeting}
                    className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#FFE082] text-[#180F08] font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'शुभकामना भेजें' : 'Share Greeting'}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===================================================================== */}
        {/* BOTTOM STATUS BAR: ACTIVE DAY & NEXT 00:00 AM IST TRANSITION TIMER    */}
        {/* ===================================================================== */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto pb-1">
          <div className="px-4 sm:px-6 py-2.5 rounded-2xl bg-[#180A04]/90 backdrop-blur-xl border border-[#E5A93C]/80 shadow-[0_8px_32px_rgba(0,0,0,0.85)] flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-[#FFD54F]">
              <Calendar className="w-4 h-4 text-[#FFD54F] shrink-0" />
              <span className="font-serif font-bold text-white tracking-wide whitespace-nowrap">
                {isHindi ? greeting.nextTransitionLabelHi : greeting.nextTransitionLabelEn}
              </span>
            </div>

            {greeting.phase !== 'concluded' && (
              <div className="flex items-center gap-2 sm:gap-2.5 font-mono font-bold tabular-nums text-xs sm:text-sm">
                {greeting.countdown.days > 0 && (
                  <>
                    <span className="flex items-baseline gap-1">
                      <strong className="text-[#FFD54F] text-sm sm:text-base">{greeting.countdown.days}</strong>
                      <span className="text-[10px] sm:text-xs font-semibold text-white/80">{isHindi ? 'दिन' : 'd'}</span>
                    </span>
                    <span className="text-[#E5A93C]/50" aria-hidden="true">·</span>
                  </>
                )}
                <span className="flex items-baseline gap-1">
                  <strong className="text-[#FFD54F] text-sm sm:text-base">
                    {String(greeting.countdown.hours).padStart(2, '0')}
                  </strong>
                  <span className="text-[10px] sm:text-xs font-semibold text-white/80">{isHindi ? 'घंटे' : 'h'}</span>
                </span>
                <span className="text-[#E5A93C]/50" aria-hidden="true">·</span>
                <span className="flex items-baseline gap-1">
                  <strong className="text-[#FFD54F] text-sm sm:text-base">
                    {String(greeting.countdown.minutes).padStart(2, '0')}
                  </strong>
                  <span className="text-[10px] sm:text-xs font-semibold text-white/80">{isHindi ? 'मिनट' : 'm'}</span>
                </span>
                <span className="text-[#E5A93C]/50" aria-hidden="true">·</span>
                <span className="flex items-baseline gap-1">
                  <strong className="text-[#FFE57F] text-sm sm:text-base">
                    {String(greeting.countdown.seconds).padStart(2, '0')}
                  </strong>
                  <span className="text-[10px] sm:text-xs font-semibold text-white/80">{isHindi ? 'सेकंड' : 's'}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SUB-HERO CONTENT (POPULAR SACRED CHHATH SONGS GRID) IN MAX-W-7XL       */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 pt-8 sm:pt-10 space-y-10 sm:space-y-12">
        {/* ========================================================================= */}
        {/* CURATED "लोकप्रिय छठ गीत" (POPULAR DEVOTIONAL CLASSICS GRID)              */}
        {/* ========================================================================= */}
        <section
          id="popular-chhath-songs"
          aria-label="Popular Devotional Classics"
          className="space-y-6 sm:space-y-8 p-5 sm:p-8 md:p-10 rounded-3xl bg-gradient-to-b from-[#361708] via-[#260E04] to-[#150702] border-2 border-[#F59E0B] shadow-[0_16px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.3)] relative overflow-hidden"
        >
          {/* Ambient Corner Sunburst Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,rgba(255,215,0,0.15),transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.1),transparent_70%)] pointer-events-none" />

          {/* Section Header */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-[#F59E0B]/40">
            <div className="space-y-3">
              {/* Vibrant Devotional Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FFD54F] via-[#FFCA28] to-[#FFA000] text-[#1A0A03] text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_4px_15px_rgba(255,193,7,0.4)] border-2 border-[#FFE57F]">
                <Sparkles className="w-4 h-4 text-[#1A0A03]" />
                <span>{isHindi ? 'लोकप्रिय छठ गीत संग्रह' : 'Popular Devotional Classics'}</span>
              </div>

              {/* Main Prominent Section Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] leading-tight">
                {isHindi ? (
                  <>
                    लोकप्रिय छठ गीत <span className="text-[#FFD54F] font-light">व अमर स्वर</span>
                  </>
                ) : (
                  <>
                    Popular Devotional Classics <span className="text-[#FFD54F] font-light">& Sharda Sinha Melodies</span>
                  </>
                )}
              </h2>

              {/* Sub-description with maximum readability */}
              <p className="text-sm sm:text-base md:text-lg text-[#FFE5B4] font-medium max-w-3xl leading-relaxed">
                {isHindi
                  ? 'पद्म भूषण शारदा सिन्हा, अनुराधा पौडवाल, पवन सिंह एवं पारंपरिक लोकगायकों के अमर भक्तिमय स्वर'
                  : 'Iconic hymns by Padma Bhushan Sharda Sinha, Anuradha Paudwal, and legendary devotional artists'}
              </p>
            </div>

            {/* "View All Songs" Action Button */}
            <a
              href="/songs"
              onClick={(e) => {
                e.preventDefault();
                onNavigateTo('/songs');
              }}
              className="relative z-10 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#FFD54F] via-[#FFC107] to-[#FF9800] hover:from-[#FFE57F] hover:to-[#FFA000] text-[#1A0A03] text-sm sm:text-base font-black flex items-center justify-center gap-2.5 border-2 border-[#FFE57F] shadow-[0_8px_25px_rgba(255,179,0,0.7)] hover:shadow-[0_10px_35px_rgba(255,215,0,0.9)] hover:scale-105 transition-all cursor-pointer w-full md:w-fit whitespace-nowrap shrink-0"
            >
              <span>{isHindi ? `सम्पूर्ण ${songs.length} गीत देखें →` : `View all ${songs.length} songs →`}</span>
            </a>
          </div>

          {/* 8-Card Popular Songs Grid with High Contrast & Vivid Glow */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {popularSongs.map((song, idx) => {
              const isThisPlaying = currentSong?.id === song.id && isPlaying;
              const itemSlug = getSongSlug(song);
              const thumbUrl = song.youtubeId
                ? `https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`
                : '/favicon.svg';

              return (
                <div
                  key={song.id || idx}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between gap-4 group relative overflow-hidden ${
                    isThisPlaying
                      ? 'bg-gradient-to-br from-[#542612] to-[#381608] border-[#FFE57F] shadow-[0_0_30px_rgba(255,215,0,0.7)] scale-[1.02]'
                      : 'bg-gradient-to-br from-[#3D1A0A] via-[#2A1105] to-[#1A0902] hover:from-[#4E2412] hover:to-[#2F1306] border-[#E5A93C]/80 hover:border-[#FFD700] shadow-[0_8px_20px_rgba(0,0,0,0.7)] hover:shadow-[0_12px_28px_rgba(255,215,0,0.5)] hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      onClick={() => onPlaySong(song)}
                      className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#180F08] border-2 border-[#E5A93C] group-hover:border-[#FFE57F] shrink-0 cursor-pointer shadow-md"
                    >
                      <img
                        src={thumbUrl}
                        alt={song.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                        {isThisPlaying ? (
                          <div className="w-8 h-8 rounded-full bg-[#FFD54F] flex items-center justify-center shadow-lg">
                            <Pause className="w-4 h-4 text-[#1A0A03] fill-current" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#FFD54F] group-hover:bg-[#FFE57F] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 text-[#1A0A03] fill-current ml-0.5" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#FFD54F] font-mono font-black">#{idx + 1}</div>
                      <h3
                        onClick={() => onPlaySong(song)}
                        className="font-serif font-black text-sm sm:text-base text-white group-hover:text-[#FFE57F] cursor-pointer transition-colors line-clamp-1 leading-snug drop-shadow-sm"
                        title={song.title}
                      >
                        {song.title}
                      </h3>
                      <p className="text-xs text-[#FFE082] font-semibold truncate mt-1">
                        {song.singer || song.artist || 'पारंपरिक लोकगायक'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-3 border-t-2 border-[#E5A93C]/40">
                    <button
                      onClick={() => onPlaySong(song)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFD54F] to-[#FFA000] hover:from-[#FFE57F] hover:to-[#FFB300] text-[#1A0A03] font-black flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105 transition-all border border-[#FFE57F]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isThisPlaying ? (isHindi ? 'बज रहा है' : 'Playing') : (isHindi ? 'गीत सुनें' : 'Play Song')}</span>
                    </button>

                    <a
                      href={`/songs/${itemSlug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateTo(`/songs/${itemSlug}`);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#140601] hover:bg-[#FFD54F] text-[#FFD54F] hover:text-[#1A0A03] border-2 border-[#E5A93C] hover:border-[#FFD54F] font-black hover:shadow-md transition-all"
                    >
                      {isHindi ? 'बोल व अर्थ →' : 'Lyrics →'}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
