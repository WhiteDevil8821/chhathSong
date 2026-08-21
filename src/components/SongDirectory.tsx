import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Music2, Play, BookOpen, Mic2, Tag, Calendar, Sparkles, Filter, X, Volume2, Share2, Check, ArrowLeft, Home, ArrowRight, ExternalLink } from 'lucide-react';
import { ChhathSong, SongCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getSongSlug, getSongPath, getSongCanonicalUrl } from '../utils/songSlug';
import { trackEvent } from '../utils/analytics';

interface SongDirectoryProps {
  songs: ChhathSong[];
  currentSong: ChhathSong;
  isPlaying: boolean;
  onPlaySong: (song: ChhathSong) => void;
  onOpenSongDetail: (song: ChhathSong) => void;
  onNavigateToSong?: (song: ChhathSong) => void;
  onBackToHome?: () => void;
}

export const SongDirectory: React.FC<SongDirectoryProps> = ({
  songs,
  currentSong,
  isPlaying,
  onPlaySong,
  onOpenSongDetail,
  onNavigateToSong,
  onBackToHome
}) => {
  const { isHindi } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<SongCategory>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Category options with dynamic counts
  const categories: { id: SongCategory; labelHi: string; labelEn: string }[] = [
    { id: 'all', labelHi: 'सभी गीत', labelEn: 'All Sacred Songs' },
    { id: 'sharda_sinha', labelHi: 'शारदा सिन्हा विशेष', labelEn: 'Sharda Sinha Classics' },
    { id: 'morning_arghya', labelHi: 'उषा अर्घ्य (भोर के गीत)', labelEn: 'Morning Arghya Hymns' },
    { id: 'evening_arghya', labelHi: 'संध्या अर्घ्य (सांझ के गीत)', labelEn: 'Evening Arghya Hymns' },
    { id: 'traditional', labelHi: 'पारंपरिक लोक धुनें', labelEn: 'Traditional Folk Classics' },
    { id: 'bhojpuri_folk', labelHi: 'भोजपुरी भक्ति भाव', labelEn: 'Bhojpuri Devotional' }
  ];

  // Dynamically calculate count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: songs.length };
    songs.forEach(song => {
      if (song.category) {
        counts[song.category] = (counts[song.category] || 0) + 1;
      }
    });
    return counts;
  }, [songs]);

  // Filter songs based on search query and selected category
  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchesCategory = selectedCategory === 'all' || song.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchTitle = song.title.toLowerCase().includes(q);
      const matchSinger = (song.singer || song.artist || '').toLowerCase().includes(q);
      const matchLyrics = (song.lyricsHighlight || '').toLowerCase().includes(q) ||
        (song.lyricsSnippetHindi || '').toLowerCase().includes(q) ||
        (song.lyricsSnippetEnglish || '').toLowerCase().includes(q);
      const matchMeaning = (song.meaning || '').toLowerCase().includes(q);
      const matchContext = (song.culturalContext || '').toLowerCase().includes(q);
      const matchWhen = (song.whenSung || '').toLowerCase().includes(q);

      return matchTitle || matchSinger || matchLyrics || matchMeaning || matchContext || matchWhen;
    });
  }, [songs, selectedCategory, searchQuery]);

  const handleShareSong = (song: ChhathSong, e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent('song_share', {
      song_id: song.id,
      title: song.title
    });
    const canonicalUrl = getSongCanonicalUrl(song);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${song.title} - Chhath Geet: ${canonicalUrl}`);
      setCopiedId(song.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handlePlay = (song: ChhathSong) => {
    trackEvent('song_play', {
      song_id: song.id,
      title: song.title,
      singer: song.singer || song.artist || 'Unknown'
    });
    onPlaySong(song);
  };


  return (
    <section id="chhath-songs-directory" className="w-full relative rounded-3xl bg-[#261208] border-2 border-[#E5A93C] p-5 sm:p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_20px_rgba(229,169,60,0.3)] space-y-6 font-sans">
      {/* Back to Home Navigation Bar if rendered as a dedicated page */}
      {onBackToHome && (
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#E5A93C]/30">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A0A03] hover:bg-[#FFD54F] border-2 border-[#E5A93C] hover:border-[#FFD54F] text-xs sm:text-sm font-extrabold text-[#FFD54F] hover:text-[#1A0A03] transition-all cursor-pointer group shadow-md"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>{isHindi ? 'मुख्य पृष्ठ पर वापस जाएँ' : 'Back to Home Overview'}</span>
          </button>

          <span className="text-xs text-[#FFE082] font-mono font-bold hidden sm:inline-block">
            {isHindi ? 'अमर छठ संगीत धरोहर' : 'Sacred Folk Music Heritage'}
          </span>
        </div>
      )}

      {/* Header & Dynamic Song Counter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b-2 border-[#E5A93C]/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFD54F] text-[#1A0A03] text-xs font-black uppercase tracking-wider mb-2 shadow-md">
            <Music2 className="w-4 h-4 text-[#1A0A03]" />
            <span>
              {isHindi
                ? `पावन छठ गीत संग्रह • कुल ${songs.length} गीत`
                : `Sacred Chhath Folk Collection • ${songs.length} Songs`}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black text-white drop-shadow-md">
            {isHindi ? 'पारंपरिक छठ गीत, भजन व संपूर्ण भावार्थ' : 'Traditional Chhath Geet, Lyrics & Devotional Archive'}
          </h1>
        </div>

        <p className="text-xs md:text-sm text-[#FFE082] font-semibold max-w-md">
          {isHindi
            ? 'पद्म भूषण शारदा सिन्हा, अनुराधा पौडवाल एवं लोक गायकों के अमर स्वर में रचे-बसे छठ गीतों का संग्रह, बोल और अर्थ।'
            : 'Explore timeless devotional hymns by Sharda Sinha, Anuradha Paudwal, and folk masters with original lyrics and spiritual meanings.'}
        </p>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="space-y-4">
        {/* Search Input Box */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#FFD54F]">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            id="song-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isHindi
                ? 'गीत, गायक (शारदा सिन्हा, अनुराधा पौडवाल, पवन सिंह), या बोल के शब्द खोजें...'
                : 'Search by song title, singer (Sharda Sinha, Anuradha Paudwal), lyrics snippet, or festival ritual...'
            }
            className="w-full pl-11 pr-10 py-3.5 bg-[#1A0A03] border-2 border-[#E5A93C] rounded-2xl text-sm md:text-base text-white placeholder-[#FFE082]/50 focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700] transition-all shadow-inner font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#FFE082] hover:text-white transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills with Dynamic Counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-black text-[#FFD54F] uppercase tracking-wider flex items-center gap-1 shrink-0 pl-1">
            <Filter className="w-3.5 h-3.5" />
            <span>{isHindi ? 'श्रेणी:' : 'Category:'}</span>
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm ${
                  isSelected
                    ? 'bg-[#FFD54F] text-[#1A0A03] border-2 border-[#FFE57F] shadow-md font-black scale-105'
                    : 'bg-[#1A0A03] text-[#FFE082] border-2 border-[#E5A93C]/70 hover:border-[#FFD54F] hover:text-white'
                }`}
              >
                <span>{isHindi ? cat.labelHi : cat.labelEn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-extrabold ${
                  isSelected ? 'bg-[#1A0A03] text-[#FFD54F]' : 'bg-[#2D1408] text-[#FFD54F]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Stats Info */}
      <div className="flex items-center justify-between text-xs text-[#FFE082] font-semibold px-1">
        <span>
          {isHindi
            ? `प्रदर्शित गीत: ${filteredSongs.length} / कुल ${songs.length}`
            : `Showing ${filteredSongs.length} of ${songs.length} Sacred Songs`}
        </span>
        {searchQuery && (
          <span className="text-[#FFD54F] font-bold">
            {isHindi ? `"${searchQuery}" के परिणाम` : `Filtered by "${searchQuery}"`}
          </span>
        )}
      </div>

      {/* Songs Grid */}
      {filteredSongs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredSongs.map((song, idx) => {
            const isCurrent = currentSong.id === song.id;
            const isCurrentPlaying = isCurrent && isPlaying;
            const thumbUrl = song.youtubeId
              ? `https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`
              : '/favicon.svg';

            return (
              <article
                key={song.id || idx}
                id={`song-card-${song.id}`}
                className={`rounded-2xl p-5 transition-all duration-300 border-2 flex flex-col justify-between relative overflow-hidden group ${
                  isCurrentPlaying
                    ? 'bg-gradient-to-br from-[#542612] to-[#381608] border-[#FFE57F] shadow-[0_0_30px_rgba(255,215,0,0.6)] scale-[1.02]'
                    : isCurrent
                    ? 'bg-gradient-to-br from-[#4E2412] to-[#2F1306] border-[#FFD54F] shadow-lg ring-2 ring-[#FFD54F]/50'
                    : 'bg-gradient-to-br from-[#38180A] to-[#220D05] hover:from-[#4E2412] hover:to-[#2F1306] border-[#F59E0B] hover:border-[#FFE57F] shadow-[0_8px_20px_rgba(0,0,0,0.7)] hover:shadow-[0_12px_28px_rgba(255,215,0,0.5)] hover:-translate-y-1'
                }`}
              >
                {/* Top Row: Thumbnail + Category tag and Action buttons */}
                <div>
                  <div className="flex items-start gap-3.5 mb-3">
                    {/* Thumbnail with Play Overlay */}
                    <div
                      onClick={() => handlePlay(song)}
                      className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#180F08] border-2 border-[#F59E0B] group-hover:border-[#FFE57F] shrink-0 cursor-pointer shadow-md"
                    >
                      <img
                        src={thumbUrl}
                        alt={song.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                        {isCurrentPlaying ? (
                          <div className="w-8 h-8 rounded-full bg-[#FFD54F] flex items-center justify-center shadow-lg">
                            <Volume2 className="w-4 h-4 text-[#1A0A03] animate-pulse" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#FFD54F] group-hover:bg-[#FFE57F] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 text-[#1A0A03] fill-current ml-0.5" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFD54F] text-[10px] font-black text-[#1A0A03] uppercase tracking-wider truncate max-w-[130px] shadow-sm">
                          <Tag className="w-3 h-3 text-[#1A0A03] shrink-0" />
                          <span className="truncate">{song.singer || song.artist}</span>
                        </span>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleShareSong(song, e)}
                            className="p-1.5 rounded-lg bg-[#1A0A03] hover:bg-[#FFD54F] text-[#FFE082] hover:text-[#1A0A03] border border-[#F59E0B]/60 transition-colors cursor-pointer"
                            title={isHindi ? 'गीत लिंक कॉपी करें' : 'Share / Copy Song Link'}
                          >
                            {copiedId === song.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Share2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Song Title (Crawlable Link to Dedicated Page) */}
                      <a
                        href={getSongPath(song)}
                        onClick={(e) => {
                          if (onNavigateToSong) {
                            e.preventDefault();
                            onNavigateToSong(song);
                          }
                        }}
                        className="block text-base font-serif font-black text-white group-hover:text-[#FFE57F] transition-colors leading-snug line-clamp-1 cursor-pointer drop-shadow-sm"
                      >
                        {song.title}
                      </a>
                    </div>
                  </div>

                  {/* Lyrics Highlight Quote */}
                  <div className="my-3 p-3 rounded-xl bg-[#1A0A03] border border-[#F59E0B]/40 relative">
                    <p className="text-xs font-serif italic text-[#FFE5B4] line-clamp-2 leading-relaxed">
                      "{song.lyricsHighlight}"
                    </p>
                  </div>

                  {/* Meaning Preview */}
                  <p className="text-xs text-[#FFF5E1] line-clamp-2 mb-4 leading-relaxed font-normal">
                    {song.meaning}
                  </p>
                </div>

                {/* Bottom Action Buttons: Play Song, Dedicated Page Link, Quick Modal */}
                <div className="pt-3 border-t-2 border-[#F59E0B]/40 flex items-center justify-between gap-2 mt-auto">
                  <button
                    onClick={() => handlePlay(song)}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#FFD54F] to-[#FFB300] hover:from-[#FFE57F] hover:to-[#FFA000] text-[#1A0A03] text-xs font-black flex items-center justify-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer border border-[#FFE57F]"
                  >
                    {isCurrentPlaying ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                        <span>{isHindi ? 'बज रहा है' : 'Playing'}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isHindi ? 'गीत सुनें' : 'Play'}</span>
                      </>
                    )}
                  </button>

                  <a
                    href={getSongPath(song)}
                    onClick={(e) => {
                      if (onNavigateToSong) {
                        e.preventDefault();
                        onNavigateToSong(song);
                      }
                    }}
                    className="py-2 px-3 rounded-xl bg-[#1A0A03] hover:bg-[#FFD54F] text-[#FFD54F] hover:text-[#1A0A03] border-2 border-[#F59E0B] hover:border-[#FFD54F] text-xs font-black flex items-center justify-center gap-1 transition-all"
                    title={isHindi ? 'समर्पित गीत पृष्ठ खोलें' : 'Open permanent song page with lyrics & meaning'}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>
                      {song.lyrics
                        ? isHindi
                          ? 'बोल'
                          : 'Lyrics'
                        : isHindi
                        ? 'पेज'
                        : 'Page'}
                    </span>
                  </a>

                  <button
                    onClick={() => onOpenSongDetail(song)}
                    className="p-2 rounded-xl bg-[#1A0A03] hover:bg-[#FFD54F] text-[#FFD54F] hover:text-[#1A0A03] border border-[#F59E0B] text-xs font-black transition-all cursor-pointer shrink-0"
                    title={isHindi ? 'त्वरित विवरण पॉपअप' : 'Quick Preview Modal'}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty Search State */
        <div className="p-8 rounded-2xl bg-[#1A0A03] border-2 border-[#E5A93C] text-center space-y-3">
          <Music2 className="w-10 h-10 text-[#FFD54F] mx-auto" />
          <h4 className="text-lg font-serif font-black text-white">
            {isHindi ? 'कोई गीत नहीं मिला' : 'No Sacred Songs Found'}
          </h4>
          <p className="text-xs md:text-sm text-[#FFE082] max-w-md mx-auto font-medium">
            {isHindi
              ? `"${searchQuery}" के लिए कोई परिणाम नहीं मिला। कृपया अन्य शब्द या श्रेणी चुनकर खोजें।`
              : `No songs matched "${searchQuery}". Try searching by singer name like "Sharda Sinha", or reset the filter.`}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#FFD54F] hover:bg-[#FFE57F] text-[#1A0A03] text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            {isHindi ? 'सभी गीत देखें' : 'View All Sacred Songs'}
          </button>
        </div>
      )}
    </section>
  );
};
