import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Flame,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Share2,
  Info,
  Radio,
  Compass,
  Award,
  Music,
  Mail,
  Shield,
  BookOpen,
  Menu,
  X,
  QrCode,
  Globe,
  Calendar,
  Layers,
  HelpCircle,
  Home,
  ArrowRight,
  Disc3
} from 'lucide-react';
import { InteractiveArghya } from './components/InteractiveArghya';
import { QuotesTicker } from './components/QuotesTicker';
import { FourDaysTimeline } from './components/FourDaysTimeline';
import { CulturalArtifactsGrid } from './components/CulturalArtifactsGrid';
import { NostalgicMemoriesBoard } from './components/NostalgicMemoriesBoard';
import { NostalgicMusicPlayer } from './components/NostalgicMusicPlayer';
import { ChhathCountdown2026 } from './components/ChhathCountdown2026';
import { ChhathHeroSection } from './components/ChhathHeroSection';
import { SongDirectory } from './components/SongDirectory';
import { FeaturedSongsBanner } from './components/FeaturedSongsBanner';
import { SongDetailModal } from './components/SongDetailModal';
import { ChhathGuide2026 } from './components/ChhathGuide2026';
import { SongPage } from './components/SongPage';
import { SongNotFoundPage } from './components/SongNotFoundPage';
import { ActiveModal } from './components/InfoModals';
import { LiveDevoteesCounter } from './components/LiveDevoteesCounter';
import { UpiSupportModal } from './components/UpiSupportModal';
import { soundSynth } from './utils/soundSynthesizer';
import { useLanguage } from './context/LanguageContext';
import { CHHATH_SONGS } from './data/chhathData';
import { ChhathSong } from './types';
import { getSongSlug, getSongPath, findSongBySlug } from './utils/songSlug';
import { Analytics } from '@vercel/analytics/react';
import { updateCanonicalUrl, trackEvent } from './utils/analytics';

export type AppRoute =
  | { type: 'home' }
  | { type: 'songs' }
  | { type: 'song'; slug: string }
  | { type: 'song_404'; slug: string };

function parseCurrentRoute(songs: ChhathSong[]): AppRoute {
  if (typeof window === 'undefined') return { type: 'home' };

  let rawPath = window.location.pathname || '/';
  rawPath = rawPath.replace(/\/+$/, '') || '/';

  // 1. Direct song path: /songs/<slug>
  if (rawPath.startsWith('/songs/')) {
    const rawSlug = rawPath.substring(7); // Remove '/songs/'
    try {
      const decodedSlug = decodeURIComponent(rawSlug).trim();
      if (decodedSlug) {
        const song = findSongBySlug(decodedSlug, songs);
        if (song) {
          return { type: 'song', slug: getSongSlug(song) };
        }
        return { type: 'song_404', slug: decodedSlug };
      }
    } catch {
      const song = findSongBySlug(rawSlug, songs);
      if (song) {
        return { type: 'song', slug: getSongSlug(song) };
      }
      return { type: 'song_404', slug: rawSlug };
    }
  }

  // 2. Songs directory: /songs
  if (rawPath === '/songs') {
    return { type: 'songs' };
  }

  // 3. Root URL or legacy hash / query (?song=...)
  if (rawPath === '/' || rawPath === '') {
    try {
      const params = new URLSearchParams(window.location.search);
      const songParam = params.get('song');
      if (songParam) {
        const song = songs.find((s) => s.id === songParam || s.youtubeId === songParam);
        if (song) {
          return { type: 'song', slug: getSongSlug(song) };
        }
      }
    } catch {}

    if (window.location.hash === '#songs' || window.location.hash === '#geet') {
      return { type: 'songs' };
    }
    return { type: 'home' };
  }

  return { type: 'home' };
}

// Lazy load InfoModals to keep initial bundle size lean and fast
const InfoModals = lazy(() => import('./components/InfoModals').then(m => ({ default: m.InfoModals })));

export default function App() {
  const { lang, setLang, toggleLang, isHindi } = useLanguage();
  const [allSongs, setAllSongs] = useState<ChhathSong[]>(CHHATH_SONGS);
  const [route, setRoute] = useState<AppRoute>(() => parseCurrentRoute(CHHATH_SONGS));
  const [arghyaCount, setArghyaCount] = useState<number>(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [selectedSongDetail, setSelectedSongDetail] = useState<ChhathSong | null>(null);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Sync browser location with app route
  useEffect(() => {
    const handleLocationChange = () => {
      const nextRoute = parseCurrentRoute(allSongs);
      setRoute(nextRoute);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [allSongs]);

  // Manage top-level document title and canonical tag for root and /songs
  useEffect(() => {
    if (route.type === 'home') {
      document.title = isHindi
        ? `छठ पूजा 2026: अमर छठ गीत व सम्पूर्ण विधि | ChhathSong.in`
        : `Chhath Puja 2026: 107+ Sacred Songs & Rituals | ChhathSong.in`;
      updateCanonicalUrl('https://www.chhathsong.in/');
    } else if (route.type === 'songs') {
      document.title = isHindi
        ? `107+ अमर छठ गीत संग्रह, बोल व भावार्थ | ChhathSong.in`
        : `107+ Sacred Chhath Songs, Lyrics & Sharda Sinha Classics | ChhathSong.in`;
      updateCanonicalUrl('https://www.chhathsong.in/songs');
    }
  }, [route.type, isHindi, allSongs.length]);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      const nextRoute = parseCurrentRoute(allSongs);
      setRoute(nextRoute);
      window.scrollTo(0, 0);
      setIsMobileMenuOpen(false);
    }
  };

  const navigateToTab = (tab: 'home' | 'songs') => {
    navigateTo(tab === 'songs' ? '/songs' : '/');
  };

  const contactEmail = 'ankit.kumar221099@gmail.com';
  const currentSong = allSongs[currentTrackIndex] || allSongs[0] || CHHATH_SONGS[0];
  const songCount = allSongs.length;

  const handleOfferArghya = () => {
    setArghyaCount(prev => prev + 1);
  };

  const handleToggleMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    soundSynth.setMuted(nextMuted);
  };

  const handleShare = () => {
    setActiveModal('share');
  };

  const handleSongsLoaded = (loadedSongs: any[]) => {
    if (!Array.isArray(loadedSongs) || loadedSongs.length === 0) return;

    const curatedMap = new Map<string, ChhathSong>();
    CHHATH_SONGS.forEach(s => {
      curatedMap.set(s.id, s);
      if (s.youtubeId) curatedMap.set(s.youtubeId, s);
    });

    const merged: ChhathSong[] = loadedSongs.map((rawSong, idx) => {
      const vid = rawSong.videoId || rawSong.id || `track_${idx}`;
      if (curatedMap.has(vid)) {
        return curatedMap.get(vid)!;
      }

      const title = rawSong.title || 'छठ महापर्व लोकगीत';
      const artist = rawSong.artist || 'छठ महापर्व लोकगायक';
      const combined = (title + ' ' + artist).toLowerCase();

      // Intelligent category assignment based on title and artist keywords
      let category: ChhathSong['category'] = 'bhojpuri_folk';
      if (combined.includes('sharda') || combined.includes('शारदा') || combined.includes('sinha') || combined.includes('सिन्हा')) {
        category = 'sharda_sinha';
      } else if (combined.includes('उषा') || combined.includes('भोर') || combined.includes('सुरुज') || combined.includes('suruj') || combined.includes('bhor') || combined.includes('morning')) {
        category = 'morning_arghya';
      } else if (combined.includes('संध्या') || combined.includes('सांझ') || combined.includes('साँझ') || combined.includes('sanjh') || combined.includes('evening') || combined.includes('dusk')) {
        category = 'evening_arghya';
      } else if (combined.includes('पारंपरिक') || combined.includes('traditional') || combined.includes('anuradha') || combined.includes('anup') || combined.includes('pawan') || combined.includes('khesari')) {
        category = 'traditional';
      }

      return {
        id: vid,
        title,
        singer: artist,
        artist,
        category,
        tag: 'लाइव प्लेलिस्ट गीत',
        duration: rawSong.duration || 'Chhath Folk',
        youtubeId: vid,
        whenSung: 'छठ पूजा के पावन अनुष्ठान, अर्घ्य व घाट यात्रा के समय',
        lyricsHighlight: title,
        meaning: 'छठ महापर्व की महिमा, सूर्यदेव व छठी मइया के प्रति अगाध श्रद्धा और लोक आस्था का पावन लोकगीत।'
      };
    });

    setAllSongs(merged);
  };

  const handlePlayPauseToggle = (forceState?: boolean) => {
    setIsPlaying(prev => (typeof forceState === 'boolean' ? forceState : !prev));
  };

  const handleNextTrack = () => {
    const total = allSongs.length || 1;
    setCurrentTrackIndex(prev => (prev + 1) % total);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    const total = allSongs.length || 1;
    setCurrentTrackIndex(prev => (prev - 1 + total) % total);
    setIsPlaying(true);
  };

  const handlePlaySongFromDirectory = (song: ChhathSong) => {
    const idx = allSongs.findIndex(s => s.id === song.id || s.youtubeId === song.youtubeId);
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
      setIsPlaying(true);
    }
  };

  const handleOpenSongDetail = (song: ChhathSong) => {
    setSelectedSongDetail(song);
  };

  return (
    <div className="min-h-screen bg-[#180F08] text-[#FFF5E1] relative selection:bg-[#D4AF37] selection:text-[#180F08] pb-36 font-sans">
      {/* Ambient Background & Subtle Warm Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(#D4AF37 0.75px, transparent 0.75px)',
            backgroundSize: '16px 16px'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#20130A] via-[#180F08]/90 to-[#120B06]" />
        <div className="absolute top-0 inset-x-0 h-[500px] opacity-30 blur-[120px] bg-gradient-to-b from-[#C87D32]/30 via-[#8A3B14]/20 to-transparent" />
      </div>

      {/* Top Floating Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#180F08]/95 border-b border-[#D4AF37]/20 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-3 md:gap-4 lg:gap-6">
          {/* Logo & Regional Identity */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/');
            }}
            className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 min-w-0 shrink-0 cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-[#9B3D12] via-[#C87D32] to-[#D4AF37] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)] border border-[#D4AF37]/40 text-sm sm:text-base md:text-lg shrink-0 group-hover:scale-105 transition-transform">
              🪔
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="hidden lg:block text-[10px] xl:text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold truncate leading-none mb-0.5">
                {isHindi ? 'मिथिला • मगध • अंग • भोजपुरी माटी' : 'Mithila • Magadh • Anga • Bhojpuri Soul'}
              </span>
              <div className="font-serif font-bold text-[#FFF5E1] text-[13px] sm:text-sm md:text-base tracking-wide leading-tight whitespace-nowrap group-hover:text-[#D4AF37] transition-colors">
                {isHindi ? 'महापर्व छठ' : 'Chhath Mahaparv'}
              </div>
              <div className="text-[9px] sm:text-[10px] md:text-xs font-sans font-semibold text-[#D4AF37] tracking-wider uppercase whitespace-nowrap leading-tight opacity-90">
                {isHindi ? 'द प्राइड ऑफ बिहार' : 'The Pride of Bihar'}
              </div>
            </div>
          </a>

          {/* Desktop Navigation Controls (Extra Large Screens: xl+) */}
          <div className="hidden xl:flex items-center gap-2.5 lg:gap-3 shrink-0 whitespace-nowrap">
            {/* Primary Page Navigation Tabs */}
            <nav className="flex items-center p-0.5 rounded-full bg-black/60 border border-[#D4AF37]/35 shadow-inner shrink-0">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/');
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  route.type === 'home'
                    ? 'bg-[#D4AF37] text-[#180F08] shadow-sm'
                    : 'text-[#FFF5E1]/80 hover:text-[#FFF5E1] hover:bg-[#D4AF37]/15'
                }`}
                title="Go to Home"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{isHindi ? 'मुख्य पृष्ठ' : 'Home'}</span>
              </a>
              <a
                href="/songs"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/songs');
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  route.type === 'songs' || route.type === 'song' || route.type === 'song_404'
                    ? 'bg-[#D4AF37] text-[#180F08] shadow-sm'
                    : 'text-[#FFF5E1]/80 hover:text-[#FFF5E1] hover:bg-[#D4AF37]/15'
                }`}
                title={isHindi ? `खोलें ${songCount} छठ गीत संग्रह` : `Open ${songCount} Chhath Geet Archive`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>{isHindi ? `${songCount} छठ गीत संग्रह` : `${songCount} Songs`}</span>
              </a>
            </nav>

            {/* Real-time Online Devotees Counter (Exact) */}
            <LiveDevoteesCounter variant="navbar" />

            {/* Language Switch Toggle Button */}
            <div className="flex items-center p-0.5 rounded-full bg-black/50 border border-[#D4AF37]/35 shadow-inner shrink-0">
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isHindi
                    ? 'bg-[#D4AF37] text-[#180F08] shadow-sm'
                    : 'text-[#FFF5E1]/70 hover:text-[#FFF5E1]'
                }`}
                title="Switch to Hindi"
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  !isHindi
                    ? 'bg-[#D4AF37] text-[#180F08] shadow-sm'
                    : 'text-[#FFF5E1]/70 hover:text-[#FFF5E1]'
                }`}
                title="Switch to English"
              >
                English
              </button>
            </div>

            {/* UPI QR Support / Seva Button */}
            <button
              onClick={() => setIsUpiModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02] shrink-0 whitespace-nowrap"
              title="Support with UPI QR"
            >
              <Heart className="w-3.5 h-3.5 fill-[#D4AF37]/30 text-[#D4AF37]" />
              <span>{isHindi ? 'सहयोग (Support)' : 'Support'}</span>
            </button>

            {/* About Modal Button */}
            <button
              onClick={() => setActiveModal('about')}
              className="px-3 py-1.5 rounded-full bg-black/30 hover:bg-[#D4AF37]/15 text-xs font-medium text-[#FFF5E1]/90 hover:text-[#FFF5E1] border border-[#D4AF37]/20 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap"
              title="About Chhath Mahaparv"
            >
              <Info className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isHindi ? 'परिचय (About)' : 'About'}</span>
            </button>

            {/* Contact Modal Button */}
            <button
              onClick={() => setActiveModal('contact')}
              className="px-3 py-1.5 rounded-full bg-black/30 hover:bg-[#D4AF37]/15 text-xs font-medium text-[#FFF5E1]/90 hover:text-[#FFF5E1] border border-[#D4AF37]/20 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap"
              title="Contact & Feedback"
            >
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isHindi ? 'संपर्क (Contact)' : 'Contact'}</span>
            </button>

            {/* Share / Blessings Button */}
            <button
              id="header-share-btn"
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F28C28] to-[#C87D32] hover:opacity-95 text-xs font-bold text-[#180F08] flex items-center gap-1.5 transition-all cursor-pointer shadow-md shrink-0 whitespace-nowrap"
            >
              <Share2 className="w-3.5 h-3.5 text-[#180F08]" />
              <span>{isHindi ? 'शुभकामनाएँ' : 'Share'}</span>
            </button>
          </div>

          {/* Medium to Large Screens (Tablets / Laptops: md to xl) */}
          <div className="hidden md:flex xl:hidden items-center gap-2 lg:gap-2.5 shrink-0 whitespace-nowrap">
            {/* Tablet Page Navigation Tabs */}
            <div className="flex items-center p-0.5 rounded-full bg-black/60 border border-[#D4AF37]/35 shrink-0">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/');
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  route.type === 'home' ? 'bg-[#D4AF37] text-[#180F08]' : 'text-[#FFF5E1]/80 hover:text-[#FFF5E1]'
                }`}
              >
                {isHindi ? 'होम' : 'Home'}
              </a>
              <a
                href="/songs"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/songs');
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  route.type === 'songs' || route.type === 'song' || route.type === 'song_404'
                    ? 'bg-[#D4AF37] text-[#180F08]'
                    : 'text-[#FFF5E1]/80 hover:text-[#FFF5E1]'
                }`}
              >
                {isHindi ? `${songCount} गीत` : `${songCount} Songs`}
              </a>
            </div>

            <LiveDevoteesCounter variant="navbar" />

            <div className="flex items-center p-0.5 rounded-full bg-black/50 border border-[#D4AF37]/35 shrink-0">
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                  isHindi ? 'bg-[#D4AF37] text-[#180F08]' : 'text-[#FFF5E1]/70'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                  !isHindi ? 'bg-[#D4AF37] text-[#180F08]' : 'text-[#FFF5E1]/70'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setIsUpiModalOpen(true)}
              className="px-2.5 py-1.5 rounded-full bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/40 flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
              title="Support with UPI QR"
            >
              <Heart className="w-3.5 h-3.5 fill-[#D4AF37]/30 text-[#D4AF37]" />
              <span>{isHindi ? 'सहयोग' : 'Support'}</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F28C28] to-[#C87D32] hover:opacity-95 text-xs font-bold text-[#180F08] flex items-center gap-1 transition-all cursor-pointer shadow-md shrink-0 whitespace-nowrap"
            >
              <Share2 className="w-3.5 h-3.5 text-[#180F08]" />
              <span>{isHindi ? 'शेयर' : 'Share'}</span>
            </button>

            <button
              id="header-hamburger-tablet-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-xl bg-black/40 border border-[#D4AF37]/30 text-[#FFF5E1] hover:bg-[#D4AF37]/15 transition-all cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#D4AF37]" /> : <Menu className="w-5 h-5 text-[#FFF5E1]" />}
            </button>
          </div>

          {/* Mobile Right Controls (< md) */}
          <div className="flex md:hidden items-center gap-2 shrink-0 whitespace-nowrap">
            {/* Live Devotees Counter */}
            <LiveDevoteesCounter variant="navbar" />

            {/* Mobile Language Switcher */}
            <button
              type="button"
              onClick={toggleLang}
              className="px-2.5 py-1.5 rounded-full bg-black/60 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37] flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap transition-all shadow-sm"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isHindi ? 'EN' : 'हिन्दी'}</span>
            </button>

            {/* Prominent High-Contrast Hamburger Button */}
            <button
              id="header-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-gradient-to-tr from-[#2A1B0E] to-[#1C120B] border border-[#D4AF37]/60 text-[#FFF5E1] hover:bg-[#D4AF37]/25 hover:border-[#D4AF37] transition-all cursor-pointer shrink-0 shadow-md flex items-center justify-center"
              aria-label="Toggle navigation menu"
              title={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#D4AF37]" />
              ) : (
                <Menu className="w-5 h-5 text-[#FFF5E1]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="xl:hidden overflow-hidden border-t border-[#D4AF37]/25 mt-3 pt-3 space-y-3"
            >
              {/* Primary Mobile Navigation Links (Home & Sacred Songs Archive) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/');
                  }}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                    route.type === 'home'
                      ? 'bg-gradient-to-r from-[#D4AF37] via-[#F28C28] to-[#C87D32] text-[#180F08] border-[#D4AF37] font-bold shadow-lg'
                      : 'bg-black/60 border-[#D4AF37]/35 text-[#FFF5E1] hover:bg-[#D4AF37]/15 hover:text-[#D4AF37]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${route.type === 'home' ? 'bg-[#180F08]/20' : 'bg-[#D4AF37]/20'}`}>
                      <Home className={`w-4 h-4 ${route.type === 'home' ? 'text-[#180F08]' : 'text-[#D4AF37]'}`} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-xs sm:text-sm">{isHindi ? 'मुख्य पृष्ठ' : 'Home Overview'}</div>
                      <div className={`text-[10px] ${route.type === 'home' ? 'text-[#180F08]/80' : 'text-[#FFF5E1]/60'}`}>
                        {isHindi ? 'पंचांग, मुहूर्त व दर्शन' : 'Rituals, Timings & Arghya'}
                      </div>
                    </div>
                  </div>
                  {route.type === 'home' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#180F08] text-[#D4AF37] font-bold">
                      {isHindi ? 'सक्रिय' : 'Active'}
                    </span>
                  )}
                </a>

                <a
                  href="/songs"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/songs');
                  }}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                    route.type === 'songs' || route.type === 'song' || route.type === 'song_404'
                      ? 'bg-gradient-to-r from-[#D4AF37] via-[#F28C28] to-[#C87D32] text-[#180F08] border-[#D4AF37] font-bold shadow-lg'
                      : 'bg-black/60 border-[#D4AF37]/35 text-[#FFF5E1] hover:bg-[#D4AF37]/15 hover:text-[#D4AF37]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${route.type === 'songs' || route.type === 'song' || route.type === 'song_404' ? 'bg-[#180F08]/20' : 'bg-[#D4AF37]/20'}`}>
                      <Music className={`w-4 h-4 ${route.type === 'songs' || route.type === 'song' || route.type === 'song_404' ? 'text-[#180F08]' : 'text-[#D4AF37]'}`} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-xs sm:text-sm">{isHindi ? `${songCount} छठ गीत संग्रह` : `${songCount} Chhath Geet Archive`}</div>
                      <div className={`text-[10px] ${route.type === 'songs' || route.type === 'song' || route.type === 'song_404' ? 'text-[#180F08]/80' : 'text-[#FFF5E1]/60'}`}>
                        {isHindi ? 'शारदा सिन्हा व पारंपरिक गीत' : 'Sharda Sinha, Lyrics & Audio'}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    route.type === 'songs' || route.type === 'song' || route.type === 'song_404' ? 'bg-[#180F08] text-[#D4AF37]' : 'bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40'
                  }`}>
                    {songCount} Songs
                  </span>
                </a>
              </div>

              {/* Mobile UPI Support Button */}
              <button
                onClick={() => {
                  setIsUpiModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full p-2.5 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-left flex items-center justify-between text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{isHindi ? 'सहयोग एवं सेवा (Support via UPI QR)' : 'Support the Platform (UPI QR)'}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#180F08] font-bold">UPI</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActiveModal('about');
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-black/40 border border-[#D4AF37]/25 text-left flex items-center gap-2 text-xs font-semibold text-[#FFF5E1] hover:bg-[#D4AF37]/15 transition-all cursor-pointer"
                >
                  <Info className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{isHindi ? 'परिचय (About)' : 'About'}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveModal('contact');
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-black/40 border border-[#D4AF37]/25 text-left flex items-center gap-2 text-xs font-semibold text-[#FFF5E1] hover:bg-[#D4AF37]/15 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{isHindi ? 'संपर्क (Contact)' : 'Contact'}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => {
                    setActiveModal('privacy');
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-xl bg-black/40 border border-[#D4AF37]/25 text-center text-[#FFF5E1] hover:bg-[#D4AF37]/15 transition-all cursor-pointer"
                >
                  <span className="block text-[11px] truncate">{isHindi ? 'गोपनीयता' : 'Privacy'}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveModal('terms');
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-xl bg-black/40 border border-[#D4AF37]/25 text-center text-[#FFF5E1] hover:bg-[#D4AF37]/15 transition-all cursor-pointer"
                >
                  <span className="block text-[11px] truncate">{isHindi ? 'नियम' : 'Terms'}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveModal('disclaimer');
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-xl bg-black/40 border border-[#D4AF37]/25 text-center text-[#FFF5E1] hover:bg-[#D4AF37]/15 transition-all cursor-pointer"
                >
                  <span className="block text-[11px] truncate">{isHindi ? 'कॉपीराइट' : 'Disclaimer'}</span>
                </button>
              </div>

              {/* Share Blessings Full Button */}
              <button
                onClick={() => {
                  handleShare();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F28C28] to-[#C87D32] text-[#180F08] font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#180F08]" />
                <span>{isHindi ? 'शुभकामनाएँ भेजें (Share Blessings)' : 'Share Greetings & Blessings'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Body */}
      {route.type === 'home' && (
        /* Full-Width Panoramic Hero Section spanning edge-to-edge across desktop */
        <div className="w-full">
          <ChhathHeroSection
            songs={allSongs}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlaySong={handlePlaySongFromDirectory}
            onNavigateTo={navigateTo}
            onOpenSongDetail={handleOpenSongDetail}
          />
        </div>
      )}

      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-8 pt-3 sm:pt-4 md:pt-6 space-y-8 sm:space-y-10 md:space-y-14">
        {route.type === 'home' ? (
          <>
            {/* 2. Rotating Nostalgic Quotes & Sacred Verses */}
            <section aria-label="Nostalgic Quotes and Memories">
              <QuotesTicker />
            </section>

            {/* 3. Interactive Sacred Arghya Ritual */}
            <section id="interactive-arghya-section" aria-label="Interactive Arghya Ritual">
              <InteractiveArghya onArghyaOffered={handleOfferArghya} count={arghyaCount} />
            </section>

            {/* 4. The 4 Sacred Days of Chhath Puja Timeline */}
            <section id="four-days-timeline-section" aria-label="Four Sacred Days of Chhath">
              <FourDaysTimeline />
            </section>

            {/* 5. Authentic Artifacts: Daura, Soop, Thekua, Ganna Mandap, Sindoor */}
            <section aria-label="Sacred Cultural Artifacts">
              <CulturalArtifactsGrid />
            </section>

            {/* 6. Comprehensive Chhath 2026 Guide & Vidhi Hub */}
            <div id="chhath-guide-section">
              <ChhathGuide2026
                onExploreSongs={() => navigateTo('/songs')}
              />
            </div>

            {/* 8. Emotional Nostalgia, Train Journey & Community Unity */}
            <section aria-label="Bihari Diaspora Memories">
              <NostalgicMemoriesBoard />
            </section>
          </>
        ) : route.type === 'songs' ? (
          /* Dedicated Separate Page: Sacred Chhath Geet, Lyrics & Devotional Archive */
          <div className="space-y-6">
            <SongDirectory
              songs={allSongs}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlaySong={handlePlaySongFromDirectory}
              onOpenSongDetail={handleOpenSongDetail}
              onNavigateToSong={(s) => navigateTo(getSongPath(s))}
              onBackToHome={() => navigateTo('/')}
            />
          </div>
        ) : route.type === 'song' ? (
          (() => {
            const targetSong = findSongBySlug(route.slug, allSongs);
            if (!targetSong) {
              return <SongNotFoundPage onNavigate={navigateTo} />;
            }
            return (
              <SongPage
                song={targetSong}
                allSongs={allSongs}
                isPlaying={isPlaying}
                currentPlayingId={currentSong.id}
                onPlaySong={handlePlaySongFromDirectory}
                onNavigate={navigateTo}
              />
            );
          })()
        ) : (
          <SongNotFoundPage onNavigate={navigateTo} />
        )}

        {/* Production Footer */}
        <footer className="pt-12 pb-16 border-t border-[#D4AF37]/20 text-center space-y-6 font-sans">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🪔</span>
            <span className="text-lg md:text-xl font-serif font-bold text-[#FFF5E1]">
              {isHindi ? 'जय छठी मईया • सूर्य देवाय नमः' : 'Jai Chhathi Maiya • Om Suryaya Namaha'}
            </span>
            <span className="text-xl">🪔</span>
          </div>

          <p className="text-xs md:text-sm text-[#FFF5E1]/70 max-w-xl mx-auto leading-relaxed">
            {isHindi ? (
              <>स्वर कोकिला <strong>पद्म भूषण शारदा सिन्हा</strong> जी के अमर स्वरों को भावभीनी श्रद्धांजलि, जिनके गीतों के बिना छठ का महापर्व अधूरा है।</>
            ) : (
              <>A soulful homage to the Nightingale of Bihar, <strong>Padma Bhushan Sharda Sinha</strong>, whose immortal folk voice is the very breath of Chhath Mahaparv.</>
            )}
          </p>

          {/* Quick Footer Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium text-[#D4AF37]">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/');
              }}
              className={`hover:underline transition-all cursor-pointer font-bold ${route.type === 'home' ? 'text-[#FFF5E1] underline' : 'text-[#D4AF37]'}`}
            >
              {isHindi ? 'होम (Home)' : 'Home'}
            </a>
            <span>•</span>
            <a
              href="/songs"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/songs');
              }}
              className={`hover:underline transition-all cursor-pointer font-bold ${route.type === 'songs' ? 'text-[#FFF5E1] underline' : 'text-[#D4AF37]'}`}
            >
              {isHindi ? `${songCount} छठ गीत संग्रह (All Songs)` : `${songCount} Songs Archive`}
            </a>
            <span>•</span>
            <button
              onClick={() => setActiveModal('about')}
              className="hover:underline hover:text-[#FFF5E1] transition-all cursor-pointer"
            >
              {isHindi ? 'परिचय (About Chhath)' : 'About Chhath'}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsUpiModalOpen(true)}
              className="hover:underline hover:text-[#FFF5E1] transition-all cursor-pointer font-bold text-[#D4AF37]"
            >
              {isHindi ? 'सहयोग व दान (UPI Support)' : 'UPI Support'}
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('contact')}
              className="hover:underline hover:text-[#FFF5E1] transition-all cursor-pointer"
            >
              {isHindi ? 'संपर्क (Contact Us)' : 'Contact Us'}
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('privacy')}
              className="hover:underline hover:text-[#FFF5E1] transition-all cursor-pointer"
            >
              {isHindi ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:underline hover:text-[#FFF5E1] transition-all cursor-pointer"
            >
              {isHindi ? 'उपयोग की शर्तें (Terms of Service)' : 'Terms of Service'}
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('disclaimer')}
              className="hover:underline hover:text-[#FFF5E1] transition-all cursor-pointer"
            >
              {isHindi ? 'कॉपीराइट एवं डिस्क्लेमर (Disclaimer)' : 'Disclaimer & DMCA'}
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('share')}
              className="hover:underline hover:text-[#FFF5E1] transition-all cursor-pointer"
            >
              {isHindi ? 'शुभकामनाएँ साझा करें (Share)' : 'Share Blessings'}
            </button>
          </div>

          {/* Creator Social Media Handles */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-xs text-[#FFF5E1]/70">
              {isHindi ? 'संयोजक व निर्माता (Creator):' : 'Creator & Developer:'}
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/_ek__bihari__/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#E1306C]/15 hover:bg-[#E1306C]/30 text-[#FFF5E1] border border-[#E1306C]/40 text-xs font-semibold flex items-center gap-1.5 transition-all group"
                title="Instagram @_ek__bihari__"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#E1306C] group-hover:scale-110 transition-transform">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </a>

              <a
                href="https://www.facebook.com/DarkPheonix8831/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#1877F2]/15 hover:bg-[#1877F2]/30 text-[#FFF5E1] border border-[#1877F2]/40 text-xs font-semibold flex items-center gap-1.5 transition-all group"
                title="Facebook Ankit Singh"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#1877F2] group-hover:scale-110 transition-transform">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>

              <a
                href="https://www.linkedin.com/in/ankitsingh2210/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#0A66C2]/15 hover:bg-[#0A66C2]/30 text-[#FFF5E1] border border-[#0A66C2]/40 text-xs font-semibold flex items-center gap-1.5 transition-all group"
                title="LinkedIn Ankit Singh"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#0A66C2] group-hover:scale-110 transition-transform">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Contact Email & Copyright */}
          <div className="pt-1 space-y-1.5 text-xs text-[#FFF5E1]/60 font-mono">
            <div>
              {isHindi ? 'संपर्क ईमेल:' : 'Contact:'} <a href={`mailto:${contactEmail}`} className="text-[#D4AF37] hover:underline font-semibold">{contactEmail}</a>
            </div>
            <div className="text-[#FFF5E1]/40 text-[11px]">
              © {new Date().getFullYear()} ChhathSong.in • All rights reserved. • A cultural tribute to Bihar, Purvanchal & Global Maithil/Bhojpuri Community.
            </div>
          </div>
        </footer>
      </main>

      {/* Fixed Music Player with Live Sync */}
      <NostalgicMusicPlayer
        currentTrackIndex={currentTrackIndex}
        onTrackChange={setCurrentTrackIndex}
        isPlaying={isPlaying}
        onPlayPauseToggle={() => setIsPlaying(prev => !prev)}
        onSongsLoaded={handleSongsLoaded}
      />

      {/* Song Detail & Lyrics Modal */}
      <AnimatePresence>
        {selectedSongDetail && (
          <SongDetailModal
            song={selectedSongDetail}
            allSongs={allSongs}
            isPlaying={isPlaying}
            currentPlayingId={currentSong.id}
            onClose={() => setSelectedSongDetail(null)}
            onPlaySong={(song) => {
              handlePlaySongFromDirectory(song);
            }}
            onSelectRelatedSong={(song) => {
              setSelectedSongDetail(song);
              handlePlaySongFromDirectory(song);
            }}
            onNavigateToSongPage={(song) => {
              setSelectedSongDetail(null);
              navigateTo(getSongPath(song));
            }}
          />
        )}
      </AnimatePresence>

      {/* UPI QR Support Modal */}
      <UpiSupportModal
        isOpen={isUpiModalOpen}
        onClose={() => setIsUpiModalOpen(false)}
      />

      {/* Info Modals */}
      <Suspense fallback={null}>
        {activeModal && (
          <InfoModals
            activeModal={activeModal}
            onClose={() => setActiveModal(null)}
            contactEmail={contactEmail}
          />
        )}
      </Suspense>

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}

