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
    <section id="chhath-songs-directory" className="w-full relative rounded-3xl bg-[#180F08]/90 border border-[#D4AF37]/30 p-5 sm:p-6 md:p-8 shadow-2xl space-y-6 font-sans">
      {/* Back to Home Navigation Bar if rendered as a dedicated page */}
      {onBackToHome && (
        <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/15">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs sm:text-sm font-semibold text-[#D4AF37] hover:text-[#FFF5E1] transition-all cursor-pointer group shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-[#D4AF37]" />
            <span>{isHindi ? '← मुख्य पृष्ठ पर वापस जाएँ' : '← Back to Home Overview'}</span>
          </button>

          <span className="text-xs text-[#FFF5E1]/60 font-mono hidden sm:inline-block">
            {isHindi ? 'अमर छठ संगीत धरोहर' : 'Sacred Folk Music Heritage'}
          </span>
        </div>
      )}

      {/* Header & Dynamic Song Counter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-1.5">
            <Music2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>
              {isHindi
                ? `पावन छठ गीत संग्रह • कुल ${songs.length} गीत`
                : `Sacred Chhath Folk Collection • ${songs.length} Songs`}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#FFF5E1]">
            {isHindi ? 'पारंपरिक छठ गीत, भजन व संपूर्ण भावार्थ' : 'Traditional Chhath Geet, Lyrics & Devotional Archive'}
          </h2>
        </div>

        <p className="text-xs md:text-sm text-[#FFF5E1]/70 max-w-md">
          {isHindi
            ? 'पद्म भूषण शारदा सिन्हा, अनुराधा पौडवाल एवं लोक गायकों के अमर स्वर में रचे-बसे छठ गीतों का संग्रह, बोल और अर्थ।'
            : 'Explore timeless devotional hymns by Sharda Sinha, Anuradha Paudwal, and folk masters with original lyrics and spiritual meanings.'}
        </p>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="space-y-4">
        {/* Search Input Box */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#D4AF37]/70">
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
            className="w-full pl-11 pr-10 py-3.5 bg-black/60 border border-[#D4AF37]/30 rounded-2xl text-sm md:text-base text-[#FFF5E1] placeholder-[#FFF5E1]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#FFF5E1]/50 hover:text-[#FFF5E1] transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills with Dynamic Counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1 shrink-0 pl-1">
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#D4AF37] text-[#180F08] shadow-md shadow-[#D4AF37]/20 font-bold'
                    : 'bg-black/40 text-[#FFF5E1]/75 border border-[#D4AF37]/20 hover:border-[#D4AF37]/45 hover:text-white'
                }`}
              >
                <span>{isHindi ? cat.labelHi : cat.labelEn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-black/20 text-[#180F08]' : 'bg-black/50 text-[#D4AF37]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Stats Info */}
      <div className="flex items-center justify-between text-xs text-[#FFF5E1]/60 px-1">
        <span>
          {isHindi
            ? `प्रदर्शित गीत: ${filteredSongs.length} / कुल ${songs.length}`
            : `Showing ${filteredSongs.length} of ${songs.length} Sacred Songs`}
        </span>
        {searchQuery && (
          <span className="text-[#D4AF37]">
            {isHindi ? `"${searchQuery}" के परिणाम` : `Filtered by "${searchQuery}"`}
          </span>
        )}
      </div>

      {/* Songs Grid */}
      {filteredSongs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSongs.map((song) => {
            const isCurrent = currentSong.id === song.id;
            const isCurrentPlaying = isCurrent && isPlaying;

            return (
              <article
                key={song.id}
                id={`song-card-${song.id}`}
                className={`rounded-2xl p-5 transition-all duration-300 border flex flex-col justify-between relative overflow-hidden group ${
                  isCurrent
                    ? 'bg-black/75 border-[#D4AF37] shadow-xl shadow-black/60 ring-1 ring-[#D4AF37]/40'
                    : 'bg-black/40 border-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:bg-black/60 shadow-md'
                }`}
              >
                {/* Top Row: Category tag and Action buttons */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 border border-[#D4AF37]/30 text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                      <Tag className="w-3 h-3 text-[#D4AF37]" />
                      <span>{song.singer || song.artist}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleShareSong(song, e)}
                        className="p-1.5 rounded-lg bg-black/40 hover:bg-black/70 text-[#FFF5E1]/60 hover:text-[#D4AF37] border border-white/5 transition-colors"
                        title={isHindi ? 'गीत लिंक कॉपी करें' : 'Share / Copy Song Link'}
                      >
                        {copiedId === song.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {song.whenSung && (
                        <span className="text-[10px] text-[#FFF5E1]/60 bg-black/30 px-2 py-0.5 rounded-md border border-white/5 truncate max-w-[120px]">
                          {song.whenSung}
                        </span>
                      )}
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
                    className="block text-base font-serif font-bold text-[#FFF5E1] group-hover:text-[#FFE5B4] transition-colors leading-snug line-clamp-2"
                  >
                    {song.title}
                  </a>

                  {/* Lyrics Highlight Quote */}
                  <div className="my-3 p-3 rounded-xl bg-black/35 border border-[#D4AF37]/15 relative">
                    <p className="text-xs font-serif italic text-[#FFE5B4]/90 line-clamp-2 leading-relaxed">
                      "{song.lyricsHighlight}"
                    </p>
                  </div>

                  {/* Meaning Preview */}
                  <p className="text-xs text-[#FFF5E1]/70 line-clamp-2 mb-4 leading-relaxed">
                    {song.meaning}
                  </p>
                </div>

                {/* Bottom Action Buttons: Play Song, Dedicated Page Link, Quick Modal */}
                <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between gap-2 mt-auto">
                  <button
                    onClick={() => handlePlay(song)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isCurrentPlaying
                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                        : isCurrent
                        ? 'bg-[#D4AF37] text-[#180F08] shadow-md shadow-[#D4AF37]/20'
                        : 'bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#180F08] border border-[#D4AF37]/40'
                    }`}
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
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-semibold bg-black/50 text-[#FFF5E1]/85 hover:text-white hover:bg-black/80 border border-[#D4AF37]/25 transition-all"
                    title={isHindi ? 'समर्पित गीत पृष्ठ खोलें' : 'Open permanent song page with lyrics & meaning'}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{isHindi ? 'पेज खोलें' : 'View Page'}</span>
                  </a>

                  <button
                    onClick={() => onOpenSongDetail(song)}
                    className="p-2 rounded-xl text-xs font-semibold bg-black/40 text-[#FFF5E1]/60 hover:text-[#D4AF37] hover:bg-black/70 border border-white/5 transition-all cursor-pointer shrink-0"
                    title={isHindi ? 'त्वरित विवरण पॉपअप' : 'Quick Preview Modal'}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty Search State */
        <div className="p-8 rounded-2xl bg-black/40 border border-[#D4AF37]/20 text-center space-y-3">
          <Music2 className="w-10 h-10 text-[#D4AF37]/40 mx-auto" />
          <h4 className="text-lg font-serif font-bold text-[#FFF5E1]">
            {isHindi ? 'कोई गीत नहीं मिला' : 'No Sacred Songs Found'}
          </h4>
          <p className="text-xs md:text-sm text-[#FFF5E1]/60 max-w-md mx-auto">
            {isHindi
              ? `"${searchQuery}" के लिए कोई परिणाम नहीं मिला। कृपया अन्य शब्द या श्रेणी चुनकर खोजें।`
              : `No songs matched "${searchQuery}". Try searching by singer name like "Sharda Sinha", or reset the filter.`}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#180F08] text-xs font-bold uppercase tracking-wider hover:bg-[#FFE5B4] transition-colors cursor-pointer"
          >
            {isHindi ? 'सभी गीत देखें' : 'View All Sacred Songs'}
          </button>
        </div>
      )}
    </section>
  );
};
