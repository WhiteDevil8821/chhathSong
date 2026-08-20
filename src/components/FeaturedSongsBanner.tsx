import React from 'react';
import { motion } from 'motion/react';
import { Music, Play, ArrowRight, Sparkles, Disc3, Mic2, Heart, Volume2, ExternalLink } from 'lucide-react';
import { ChhathSong } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getSongPath } from '../utils/songSlug';

interface FeaturedSongsBannerProps {
  songs: ChhathSong[];
  currentSong: ChhathSong;
  isPlaying: boolean;
  onPlaySong: (song: ChhathSong) => void;
  onOpenSongsArchive: () => void;
  onOpenSongDetail: (song: ChhathSong) => void;
  onNavigateToSong?: (song: ChhathSong) => void;
}

export const FeaturedSongsBanner: React.FC<FeaturedSongsBannerProps> = ({
  songs,
  currentSong,
  isPlaying,
  onPlaySong,
  onOpenSongsArchive,
  onOpenSongDetail,
  onNavigateToSong
}) => {
  const { isHindi } = useLanguage();

  // Top iconic featured songs to display as quick picks on home screen
  const topPicks = songs.slice(0, 4);

  return (
    <div className="w-full relative rounded-3xl bg-gradient-to-br from-[#24130A] via-[#1B0F08] to-[#120B06] border border-[#D4AF37]/35 p-5 sm:p-6 md:p-8 shadow-2xl overflow-hidden font-sans">
      {/* Background Decorative Glow */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#C87D32]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#D4AF37]/20">
        {/* Title & Cultural Heritage Info */}
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            <Music className="w-3.5 h-3.5" />
            <span>{isHindi ? `पावन संगीत धरोहर • कुल ${songs.length} छठ गीत` : `Sacred Music Heritage • ${songs.length} Chhath Geet`}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#FFF5E1] tracking-wide">
            {isHindi ? 'पारंपरिक छठ गीत एवं बोल संग्रह' : 'Sacred Chhath Geet & Devotional Archive'}
          </h2>
          <p className="text-xs sm:text-sm text-[#FFF5E1]/75 leading-relaxed">
            {isHindi
              ? `पद्म भूषण शारदा सिन्हा, अनुराधा पौडवाल, पवन सिंह व लोक गायकों के अमर स्वर में रचे-बसे ${songs.length} पारंपरिक छठ गीतों का संपूर्ण संग्रह, बोल व आध्यात्मिक भावार्थ।`
              : `Explore the complete archive of ${songs.length} timeless Chhath hymns by Padma Bhushan Sharda Sinha, Anuradha Paudwal, and regional folk legends with complete lyrics and meanings.`}
          </p>
        </div>

        {/* Primary CTA Button to open dedicated page */}
        <a
          href="/songs"
          onClick={(e) => {
            e.preventDefault();
            onOpenSongsArchive();
          }}
          className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F28C28] to-[#C87D32] hover:opacity-95 text-[#180F08] font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02] cursor-pointer shrink-0 group w-full sm:w-auto justify-center"
        >
          <Disc3 className="w-5 h-5 text-[#180F08] animate-spin-slow" />
          <span>{isHindi ? `सम्पूर्ण ${songs.length} छठ गीत देखें` : `Explore All ${songs.length} Songs`}</span>
          <ArrowRight className="w-4 h-4 text-[#180F08] group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Quick Play Highlight Grid (4 Iconic Tracks Preview) */}
      <div className="pt-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {isHindi ? 'शीर्ष लोकप्रिय छठ गीत (Quick Play):' : 'Popular Devotional Classics:'}
          </span>
          <a
            href="/songs"
            onClick={(e) => {
              e.preventDefault();
              onOpenSongsArchive();
            }}
            className="hover:underline text-[#FFF5E1]/70 hover:text-[#D4AF37] transition-colors cursor-pointer hidden sm:inline"
          >
            {isHindi ? `सभी ${songs.length} गीत खोजें →` : `Search all ${songs.length} songs →`}
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topPicks.map((song, idx) => {
            const isThisPlaying = currentSong?.id === song.id && isPlaying;
            return (
              <motion.div
                key={song.id || idx}
                whileHover={{ y: -2 }}
                onClick={() => onPlaySong(song)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 group relative overflow-hidden ${
                  isThisPlaying
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                    : 'bg-black/40 hover:bg-black/60 border-[#D4AF37]/20 hover:border-[#D4AF37]/45'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9B3D12] to-[#D4AF37] flex items-center justify-center text-xs font-bold text-[#FFF5E1] shrink-0 group-hover:scale-105 transition-transform shadow-md">
                    {isThisPlaying ? (
                      <Volume2 className="w-4 h-4 text-[#180F08] animate-pulse" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-[#180F08] fill-current ml-0.5" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-[#D4AF37]/80 px-2 py-0.5 rounded-full bg-[#180F08]/80 border border-[#D4AF37]/20">
                    {song.duration || 'Chhath Geet'}
                  </span>
                </div>

                <div>
                  <a
                    href={getSongPath(song)}
                    onClick={(e) => {
                      if (onNavigateToSong) {
                        e.preventDefault();
                        e.stopPropagation();
                        onNavigateToSong(song);
                      }
                    }}
                    className="text-xs sm:text-sm font-serif font-bold text-[#FFF5E1] line-clamp-1 group-hover:text-[#D4AF37] transition-colors hover:underline block"
                  >
                    {song.title}
                  </a>
                  <p className="text-[11px] text-[#FFF5E1]/60 line-clamp-1 mt-0.5">
                    {song.singer || song.artist}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#D4AF37]/10 text-[10px] text-[#D4AF37]">
                  <span className="line-clamp-1 italic text-[#FFF5E1]/50">{song.whenSung || 'छठ पूजा अर्घ्य'}</span>
                  <div className="flex items-center gap-2">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenSongDetail(song);
                      }}
                      className="hover:underline font-semibold text-[#D4AF37] cursor-pointer"
                    >
                      {isHindi ? 'बोल' : 'Lyrics'}
                    </span>
                    <a
                      href={getSongPath(song)}
                      onClick={(e) => {
                        if (onNavigateToSong) {
                          e.preventDefault();
                          e.stopPropagation();
                          onNavigateToSong(song);
                        }
                      }}
                      className="text-[#D4AF37]/80 hover:text-[#D4AF37] hover:underline flex items-center gap-0.5 font-semibold"
                      title="Open dedicated page"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      <span>{isHindi ? 'पेज' : 'Page'}</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
